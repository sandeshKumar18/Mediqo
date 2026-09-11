import crypto from "crypto";
import Razorpay from "razorpay";
import generalRequestModel from "../models/generalRequestModel.js";
import userModel from "../models/userModel.js";


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const GENERAL_REQUEST_BOOKING_FEE = Number(
  process.env.GENERAL_REQUEST_BOOKING_FEE || 50,
);

const CURRENCY = process.env.CURRENCY || "INR";
const AVERAGE_CONSULTATION_MINUTES = Number(
  process.env.GENERAL_REQUEST_AVERAGE_TIME || 15,
);

const getTodayRange = () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return {
    startOfDay,
    endOfDay,
  };
};


const validGenders = ["Male", "Female", "Other"];

const createGeneralRequest = async (req, res) => {
  try {
    const {
      userId,
      patientName,
      age,
      gender,
      phone,
      department,
      reason,
    } = req.body;

    
    if (
      !userId ||
      !patientName ||
      age === undefined ||
      age === null ||
      !gender ||
      !phone ||
      !department ||
      !reason
    ) {
      return res.json({
        success: false,
        message: "All required details must be provided",
      });
    }

    const numericAge = Number(age);

    if (
      !Number.isInteger(numericAge) ||
      numericAge < 0 ||
      numericAge > 120
    ) {
      return res.json({
        success: false,
        message: "Please enter a valid age",
      });
    }

    if (!validGenders.includes(gender)) {
      return res.json({
        success: false,
        message: "Invalid gender",
      });
    }

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    
    const { startOfDay, endOfDay } = getTodayRange();

    
    const existingRequest = await generalRequestModel.findOne({
      user: userId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: {
        $in: ["waiting", "accepted", "in_progress"],
      },
      paymentStatus: {
        $in: ["pending", "paid"],
      },
    });

    if (existingRequest) {
      
      if (existingRequest.paymentStatus === "paid") {
        return res.json({
          success: false,
          message: "You already have an active General Request for today",
          request: existingRequest,
        });
      }

     
      try {
        const options = {
          amount: Math.round(existingRequest.bookingFee * 100),
          currency: CURRENCY,
          receipt: `gr_${existingRequest._id.toString()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        return res.json({
          success: true,
          message: "Existing payment pending. Continue payment.",
          requestId: existingRequest._id,
          order,
          key: process.env.RAZORPAY_KEY_ID,
          amount: existingRequest.bookingFee,
          currency: CURRENCY,
        });
      } catch (paymentError) {
        console.log(
          "Razorpay order creation failed:",
          paymentError,
        );

        return res.json({
          success: false,
          message: "Unable to create payment order",
        });
      }
    }

    
    const requestData = {
      user: userId,

      patientName: patientName.trim(),

      age: numericAge,

      gender,

      phone: phone.trim(),

      department: department.trim(),

      reason: reason.trim(),

      queueNumber: 0,

      bookingFee: GENERAL_REQUEST_BOOKING_FEE,

      paymentStatus: "pending",

      status: "waiting",

      assignedDoctor: null,
    };

    const newRequest = new generalRequestModel(requestData);

    await newRequest.save();

    try {
      const options = {
        amount: Math.round(GENERAL_REQUEST_BOOKING_FEE * 100),
        currency: CURRENCY,
        receipt: `gr_${newRequest._id.toString()}`,
      };

      const order = await razorpayInstance.orders.create(options);

      return res.json({
        success: true,
        message: "General Request created. Complete payment.",
        requestId: newRequest._id,
        order,
        key: process.env.RAZORPAY_KEY_ID,
        amount: GENERAL_REQUEST_BOOKING_FEE,
        currency: CURRENCY,
      });
    } catch (paymentError) {
      console.log(
        "Razorpay order creation failed:",
        paymentError,
      );

      await generalRequestModel.findByIdAndDelete(
        newRequest._id,
      );

      return res.json({
        success: false,
        message: "Unable to create payment order",
      });
    }
  } catch (error) {
    console.log("Create General Request Error:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const verifyGeneralRequestPayment = async (req, res) => {
  try {
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !userId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.json({
        success: false,
        message: "Payment verification details are missing",
      });
    }

    
    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET,
      )
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: "Invalid payment signature",
      });
    }

   
    const order = await razorpayInstance.orders.fetch(
      razorpay_order_id,
    );

    if (!order) {
      return res.json({
        success: false,
        message: "Payment order not found",
      });
    }

   
    if (order.status !== "paid") {
      return res.json({
        success: false,
        message: "Payment has not been completed",
      });
    }

    
    const receipt = order.receipt;

    if (!receipt || !receipt.startsWith("gr_")) {
      return res.json({
        success: false,
        message: "Invalid General Request payment",
      });
    }

    const requestId = receipt.replace("gr_", "");

   
    const requestData =
      await generalRequestModel.findById(requestId);

    if (!requestData) {
      return res.json({
        success: false,
        message: "General Request not found",
      });
    }

    
    if (requestData.user.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized payment verification",
      });
    }

    if (requestData.paymentStatus === "paid") {
      return res.json({
        success: true,
        message: "Payment already verified",
        request: requestData,
      });
    }

    
    const expectedAmountPaise = Math.round(
      requestData.bookingFee * 100,
    );

    if (Number(order.amount) !== expectedAmountPaise) {
      return res.json({
        success: false,
        message: "Payment amount mismatch",
      });
    }

    
    const { startOfDay, endOfDay } = getTodayRange();

    const lastRequest =
      await generalRequestModel
        .findOne({
          department: requestData.department,

          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },

          paymentStatus: "paid",

          queueNumber: {
            $gt: 0,
          },
        })
        .sort({
          queueNumber: -1,
        })
        .select("queueNumber");

    const nextQueueNumber = lastRequest
      ? lastRequest.queueNumber + 1
      : 1;

    requestData.paymentStatus = "paid";

    requestData.queueNumber = nextQueueNumber;

    requestData.status = "waiting";

    await requestData.save();

    return res.json({
      success: true,
      message: "Payment successful. General Request confirmed.",
      request: {
        _id: requestData._id,
        patientName: requestData.patientName,
        department: requestData.department,
        queueNumber: requestData.queueNumber,
        bookingFee: requestData.bookingFee,
        paymentStatus: requestData.paymentStatus,
        status: requestData.status,
      },
    });
  } catch (error) {
    console.log(
      "Verify General Request Payment Error:",
      error,
    );

    return res.json({
      success: false,
      message: error.message,
    });
  }
};


const getMyGeneralRequest = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { startOfDay, endOfDay } = getTodayRange();
    const requestData = await generalRequestModel
      .findOne({
        user: userId,

        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },

        paymentStatus: "paid",

        status: {
          $in: [
            "waiting",
            "accepted",
            "in_progress",
          ],
        },
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    if (!requestData) {
      return res.json({
        success: true,
        hasRequest: false,
        request: null,
      });
    }

    const peopleAhead =
      await generalRequestModel.countDocuments({
        department: requestData.department,

        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },

        paymentStatus: "paid",

        queueNumber: {
          $gt: 0,
          $lt: requestData.queueNumber,
        },

        status: {
          $in: [
            "waiting",
            "accepted",
            "in_progress",
          ],
        },
      });


    const currentRequest =
      await generalRequestModel
        .findOne({
          department: requestData.department,

          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },

          paymentStatus: "paid",

          status: "in_progress",

          queueNumber: {
            $gt: 0,
          },
        })
        .sort({
          queueNumber: 1,
        })
        .select(
          "queueNumber assignedDoctor status",
        )
        .lean();

    const nextRequest =
      await generalRequestModel
        .findOne({
          department: requestData.department,

          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },

          paymentStatus: "paid",

          status: {
            $in: [
              "waiting",
              "accepted",
            ],
          },

          queueNumber: {
            $gt: 0,
            ...(currentRequest
              ? {
                  $gt:
                    currentRequest.queueNumber,
                }
              : {}),
          },
        })
        .sort({
          queueNumber: 1,
        })
        .select(
          "queueNumber status assignedDoctor",
        )
        .lean();


    let estimatedWaitMinutes =
      peopleAhead *
      AVERAGE_CONSULTATION_MINUTES;

    if (requestData.status === "in_progress") {
      estimatedWaitMinutes = 0;
    }

    return res.json({
      success: true,

      hasRequest: true,

      request: {
        _id: requestData._id,

        patientName:
          requestData.patientName,

        age:
          requestData.age,

        gender:
          requestData.gender,

        phone:
          requestData.phone,

        department:
          requestData.department,

        reason:
          requestData.reason,

        queueNumber:
          requestData.queueNumber,

        bookingFee:
          requestData.bookingFee,

        paymentStatus:
          requestData.paymentStatus,

        status:
          requestData.status,

        assignedDoctor:
          requestData.assignedDoctor,

        acceptedAt:
          requestData.acceptedAt,

        startedAt:
          requestData.startedAt,

        peopleAhead,

        estimatedWaitMinutes,

        currentServing:
          currentRequest
            ? currentRequest.queueNumber
            : null,

        currentDoctor:
          currentRequest
            ? currentRequest.assignedDoctor
            : null,

        nextPatient:
          nextRequest
            ? nextRequest.queueNumber
            : null,

        nextPatientStatus:
          nextRequest
            ? nextRequest.status
            : null,
      },
    });
  } catch (error) {
    console.log(
      "Get My General Request Error:",
      error,
    );

    return res.json({
      success: false,
      message: error.message,
    });
  }
};



const getLiveGeneralQueue = async (req, res) => {
  try {
    const { department } = req.query;

    if (!department) {
      return res.json({
        success: false,
        message: "Department is required",
      });
    }

    const cleanDepartment = department.trim();

    const { startOfDay, endOfDay } =
      getTodayRange();

    const currentRequest =
      await generalRequestModel
        .findOne({
          department: cleanDepartment,

          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },

          paymentStatus: "paid",

          status: "in_progress",

          queueNumber: {
            $gt: 0,
          },
        })
        .sort({
          queueNumber: 1,
        })
        .select(
          "queueNumber assignedDoctor status",
        )
        .lean();

    
    const nextRequestFilter = {
      department: cleanDepartment,

      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },

      paymentStatus: "paid",

      status: {
        $in: [
          "waiting",
          "accepted",
        ],
      },

      queueNumber: {
        $gt: currentRequest
          ? currentRequest.queueNumber
          : 0,
      },
    };

    const nextRequest =
      await generalRequestModel
        .findOne(nextRequestFilter)
        .sort({
          queueNumber: 1,
        })
        .select(
          "queueNumber status assignedDoctor",
        )
        .lean();

    
    const queue =
      await generalRequestModel
        .find({
          department: cleanDepartment,

          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },

          paymentStatus: "paid",

          status: {
            $in: [
              "waiting",
              "accepted",
              "in_progress",
            ],
          },

          queueNumber: {
            $gt: 0,
          },
        })
        .sort({
          queueNumber: 1,
        })
        .select(
          "queueNumber status assignedDoctor",
        )
        .lean();

    
    const waitingCount =
      await generalRequestModel.countDocuments({
        department: cleanDepartment,

        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },

        paymentStatus: "paid",

        status: {
          $in: [
            "waiting",
            "accepted",
          ],
        },

        queueNumber: {
          $gt: 0,
        },
      });

   
    const estimatedWaitMinutes =
      waitingCount *
      AVERAGE_CONSULTATION_MINUTES;

    return res.json({
      success: true,

      department: cleanDepartment,

      currentlyServing:
        currentRequest
          ? currentRequest.queueNumber
          : null,

      currentDoctor:
        currentRequest
          ? currentRequest.assignedDoctor
          : null,

      nextPatient:
        nextRequest
          ? nextRequest.queueNumber
          : null,

      nextPatientStatus:
        nextRequest
          ? nextRequest.status
          : null,

      nextPatientDoctor:
        nextRequest
          ? nextRequest.assignedDoctor
          : null,

      waitingCount,

      estimatedWaitMinutes,

      queue: queue.map(
        (request) => ({
          queueNumber:
            request.queueNumber,

          status:
            request.status,

          assignedDoctor:
            request.assignedDoctor,
        }),
      ),
    });
  } catch (error) {
    console.log(
      "Get Live General Queue Error:",
      error,
    );

    return res.json({
      success: false,
      message: error.message,
    });
  }
};


const getGeneralRequestHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const requests =
      await generalRequestModel
        .find({
          user: userId,
          paymentStatus: "paid",
          status: {
            $in: [
              "completed",
              "cancelled",
              "rejected",
              "no_show",
            ],
          },
        })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.log(
      "Get General Request History Error:",
      error,
    );

    return res.json({
      success: false,
      message: error.message,
    });
  }
};



export {
  createGeneralRequest,
  verifyGeneralRequestPayment,
  getMyGeneralRequest,
  getLiveGeneralQueue,
  getGeneralRequestHistory,
};

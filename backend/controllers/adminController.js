import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import generalRequestModel from "../models/generalRequestModel.js";



const emitGeneralRequestUpdate = (
  req,
  requestData,
  notification = null,
) => {
  const io = req.app.get("io");

  if (!io || !requestData) return;

  const updateData = {
    requestId: requestData._id,
    department: requestData.department,
    queueNumber: requestData.queueNumber,
    status: requestData.status,
    assignedDoctor: requestData.assignedDoctor,
  };

  io.emit(
    "generalRequestUpdated",
    updateData,
  );

  if (
    notification &&
    requestData.user
  ) {
    io.to(
      `user:${requestData.user.toString()}`,
    ).emit(
      "generalRequestNotification",
      notification,
    );
  }
};



const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;
    //console.log("File : ", imageFile);
    // console.log("This is body");
    // console.log(req.body);

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    //console.log("Work in progress");
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    //console.log("Work in progress, print Hoja yarr");
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    //console.log("Work in progress after imageupload");
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({
      success: true,
      message: "Doctor Added",
    });
  } catch (error) {
    console.log("Not added doctor");

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);

      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get all doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// all appointments list

const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const getDashData = async (req, res) => {
  try {
    const doctors = await doctorModel.countDocuments();
    const appointments = await appointmentModel.countDocuments();
    const patients = await userModel.countDocuments();

    const latestAppointments = await appointmentModel
      .find({})
      .sort({ date: -1 })
      .limit(5);

    res.json({
      success: true,
      dashData: {
        doctors,
        appointments,
        patients,
        latestAppointments,
      },
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const removeDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    await doctorModel.findByIdAndDelete(docId);

    return res.json({
      success: true,
      message: "Doctor removed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointmentData = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        cancelled: true,
      },
      {
        returnDocument: "after",
      },
    );

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.name = req.body.name ?? doctor.name;
    doctor.degree = req.body.degree ?? doctor.degree;
    doctor.speciality = req.body.speciality ?? doctor.speciality;
    doctor.about = req.body.about ?? doctor.about;
    doctor.experience = req.body.experience ?? doctor.experience;
    doctor.fees = req.body.fees ?? doctor.fees;

    if (req.body.available !== undefined) {
      doctor.available =
        req.body.available === true || req.body.available === "true";
    }

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "doctors",
          resource_type: "image",
        });

        doctor.image = result.secure_url;
      } catch (uploadError) {
        console.log("Cloudinary upload error:", uploadError);

        return res.json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    await doctor.save();

    return res.json({
      success: true,
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const adminRevenue = async (req, res) => {
  try {
    const { from, to } = req.query;

    let startTimestamp = 0;
    let endTimestamp = Date.now();

    if (from) {
      const start = new Date(`${from}T00:00:00`);
      startTimestamp = start.getTime();

      if (Number.isNaN(startTimestamp)) {
        return res.status(400).json({
          success: false,
          message: "Invalid from date",
        });
      }
    }

    if (to) {
      const end = new Date(`${to}T23:59:59.999`);
      endTimestamp = end.getTime();

      if (Number.isNaN(endTimestamp)) {
        return res.status(400).json({
          success: false,
          message: "Invalid to date",
        });
      }
    }

    if (startTimestamp > endTimestamp) {
      return res.status(400).json({
        success: false,
        message: "From date cannot be greater than to date",
      });
    }

    const appointments = await appointmentModel
      .find({
        date: {
          $gte: startTimestamp,
          $lte: endTimestamp,
        },
      })
      .lean();

    

    const totalAppointments = appointments.length;

    const patientIds = new Set();
    const doctorIds = new Set();

    appointments.forEach((appointment) => {
      if (appointment.userId) {
        patientIds.add(String(appointment.userId));
      }

      if (appointment.docId) {
        doctorIds.add(String(appointment.docId));
      }
    });

    const totalPatients = patientIds.size;
    const totalDoctors = doctorIds.size;

    
    let totalRevenue = 0;
    let onlineRevenue = 0;
    let cashRevenue = 0;
    let pendingAmount = 0;

    appointments.forEach((appointment) => {
      const amount = Number(appointment.amount) || 0;

      if (appointment.payment === true) {
        onlineRevenue += amount;
        totalRevenue += amount;

        return;
      }


      if (
        appointment.payment === false &&
        appointment.isCompleted === true &&
        appointment.cancelled === false
      ) {
        cashRevenue += amount;
        totalRevenue += amount;

        return;
      }

      if (
        appointment.payment === false &&
        appointment.isCompleted === false &&
        appointment.cancelled === false
      ) {
        pendingAmount += amount;
      }
    });

    
    const doctorMap = new Map();

    appointments.forEach((appointment) => {
      const doctorId = appointment.docId
        ? String(appointment.docId)
        : null;

      if (!doctorId) return;

      if (!doctorMap.has(doctorId)) {
        const doctorName =
          appointment.docData?.name ||
          appointment.docData?.doctorName ||
          "Unknown Doctor";

        const speciality =
          appointment.docData?.speciality ||
          appointment.docData?.specialty ||
          "";

        doctorMap.set(doctorId, {
          id: doctorId,
          name: doctorName,
          speciality,
          appointments: 0,
          patients: new Set(),
          revenue: 0,
        });
      }

      const doctor = doctorMap.get(doctorId);

      doctor.appointments += 1;

      if (appointment.userId) {
        doctor.patients.add(
          String(appointment.userId)
        );
      }

      const amount = Number(appointment.amount) || 0;

      if (appointment.payment === true) {
        doctor.revenue += amount;
      } else if (
        appointment.payment === false &&
        appointment.isCompleted === true &&
        appointment.cancelled === false
      ) {
        doctor.revenue += amount;
      }
    });

    const doctors = Array.from(
      doctorMap.values()
    ).map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
      speciality: doctor.speciality,
      appointments: doctor.appointments,
      patients: doctor.patients.size,
      revenue: doctor.revenue,
    }));

    const chartMap = new Map();

    appointments.forEach((appointment) => {
      const timestamp = Number(appointment.date);

      if (!timestamp) return;

      const date = new Date(timestamp);

      if (Number.isNaN(date.getTime())) return;

      const year = date.getFullYear();

      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        date.getDate()
      ).padStart(2, "0");

      const key = `${year}-${month}-${day}`;

      const label = date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      );

      let revenue = 0;

      const amount =
        Number(appointment.amount) || 0;

      if (appointment.payment === true) {
        revenue = amount;
      }

      if (
        appointment.payment === false &&
        appointment.isCompleted === true &&
        appointment.cancelled === false
      ) {
        revenue = amount;
      }

      if (!chartMap.has(key)) {
        chartMap.set(key, {
          label,
          revenue: 0,
        });
      }

      chartMap.get(key).revenue += revenue;
    });

    const chart = Array.from(
      chartMap.entries()
    )
      .sort((a, b) =>
        a[0].localeCompare(b[0])
      )
      .map(([, value]) => value);

    return res.status(200).json({
      success: true,

      data: {
        totalRevenue,
        totalAppointments,
        totalPatients,
        totalDoctors,

        onlineRevenue,
        cashRevenue,

        pendingAmount,

        refundedAmount: 0,
        revenueGrowth: 0,

        chart,

        doctors,
      },
    });
  } catch (error) {
    console.error(
      "Admin Revenue Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to calculate revenue",
      error: error.message,
    });
  }
};


// to get today's General Requests for admin
const getGeneralRequests = async (req, res) => {
  try {
    const { department, status } = req.query;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const filter = {
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },

      paymentStatus: "paid",

      queueNumber: {
        $gt: 0,
      },
    };

    if (department) {
      filter.department = department.trim();
    }

    if (status) {
      filter.status = status;
    }

    const requests = await generalRequestModel
      .find(filter)
      .populate("user", "name email phone")
      .sort({
        queueNumber: 1,
      })
      .lean();

    return res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.log("Get General Requests Error:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};



// assign an offline doctor to a General Request
const assignGeneralRequestDoctor = async (req, res) => {
  try {
    const { requestId, doctorName } = req.body;

    
    if (!requestId || !doctorName) {
      return res.json({
        success: false,
        message: "Request ID and doctor name are required",
      });
    }

    const cleanDoctorName = doctorName.trim();

    if (!cleanDoctorName) {
      return res.json({
        success: false,
        message: "Doctor name cannot be empty",
      });
    }

    
    const requestData =
      await generalRequestModel.findById(requestId);

    if (!requestData) {
      return res.json({
        success: false,
        message: "General Request not found",
      });
    }

    
    if (requestData.paymentStatus !== "paid") {
      return res.json({
        success: false,
        message: "This request has not been paid",
      });
    }

    if (requestData.status !== "waiting") {
      return res.json({
        success: false,
        message: `Request cannot be assigned because its current status is "${requestData.status}"`,
      });
    }

    
    requestData.assignedDoctor = cleanDoctorName;

    requestData.status = "accepted";

    requestData.acceptedAt = new Date();

    await requestData.save();
    emitGeneralRequestUpdate(req,requestData,{
        type: "success",
        title: "Request Accepted",
        message: `${cleanDoctorName} has been assigned to your consultation.`,
      },
    );

    
    return res.json({
      success: true,
      message: "General Request accepted and doctor assigned",
      request: {
        _id: requestData._id,
        patientName: requestData.patientName,
        department: requestData.department,
        queueNumber: requestData.queueNumber,
        assignedDoctor: requestData.assignedDoctor,
        paymentStatus: requestData.paymentStatus,
        status: requestData.status,
        acceptedAt: requestData.acceptedAt,
      },
    });
  } catch (error) {
    console.log(
      "Assign General Request Doctor Error:",
      error,
    );

    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// start consultation for a General Request
const startGeneralRequestConsultation = async (req, res) => {
  try {
    const { requestId } = req.body;

    
    if (!requestId) {
      return res.json({
        success: false,
        message: "Request ID is required",
      });
    }

    const requestData =
      await generalRequestModel.findById(requestId);

    if (!requestData) {
      return res.json({
        success: false,
        message: "General Request not found",
      });
    }

    if (requestData.paymentStatus !== "paid") {
      return res.json({
        success: false,
        message: "This request has not been paid",
      });
    }

    
    if (!requestData.assignedDoctor) {
      return res.json({
        success: false,
        message: "Please assign a doctor before starting consultation",
      });
    }

    
    if (requestData.status !== "accepted") {
      return res.json({
        success: false,
        message: `Consultation cannot be started because request status is "${requestData.status}"`,
      });
    }

    
    const currentRequest =
      await generalRequestModel.findOne({
        department: requestData.department,

        status: "in_progress",

        paymentStatus: "paid",

        queueNumber: {
          $gt: 0,
        },
      });

    if (currentRequest) {
      return res.json({
        success: false,
        message:
          `Another consultation is already in progress for ` +
          `${requestData.department} (Queue #${currentRequest.queueNumber})`,
      });
    }

    
    requestData.status = "in_progress";

    requestData.startedAt = new Date();

    await requestData.save();
    emitGeneralRequestUpdate(req,requestData,{
      type: "success",
      title: "Consultation Started",
      message: `${requestData.assignedDoctor} is now ready for your consultation.`,
    },
    );

    
    return res.json({
      success: true,
      message: "Consultation started successfully",
      request: {
        _id: requestData._id,
        patientName: requestData.patientName,
        department: requestData.department,
        queueNumber: requestData.queueNumber,
        assignedDoctor: requestData.assignedDoctor,
        paymentStatus: requestData.paymentStatus,
        status: requestData.status,
        startedAt: requestData.startedAt,
      },
    });
  } catch (error) {
    console.log(
      "Start General Request Consultation Error:",
      error
    );

    return res.json({
      success: false,
      message: error.message,
    });
  }
};



// complete a General Request consultation
const completeGeneralRequestConsultation = async (req, res) => {
  try {
    const { requestId } = req.body;

    
    if (!requestId) {
      return res.json({
        success: false,
        message: "Request ID is required",
      });
    }

    const requestData =
      await generalRequestModel.findById(requestId);

    if (!requestData) {
      return res.json({
        success: false,
        message: "General Request not found",
      });
    }

    
    if (requestData.status !== "in_progress") {
      return res.json({
        success: false,
        message:
          `Consultation cannot be completed because request status is "${requestData.status}"`,
      });
    }

    
    requestData.status = "completed";

    requestData.completedAt = new Date();

    await requestData.save();
    emitGeneralRequestUpdate(req,requestData,{
      type: "info",
      title: "Consultation Completed",
      message: "Your consultation has been completed.",
    },);

    
    return res.json({
      success: true,
      message: "Consultation completed successfully",
      request: {
        _id: requestData._id,
        patientName: requestData.patientName,
        department: requestData.department,
        queueNumber: requestData.queueNumber,
        assignedDoctor: requestData.assignedDoctor,
        paymentStatus: requestData.paymentStatus,
        status: requestData.status,
        startedAt: requestData.startedAt,
        completedAt: requestData.completedAt,
      },
    });
  } catch (error) {
    console.log(
      "Complete General Request Consultation Error:",
      error
    );

    return res.json({
      success: false,
      message: error.message,
    });
  }
};







export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  getDashData,
  removeDoctor,
  cancelAppointment,
  updateDoctor,
  adminRevenue,
  getGeneralRequests,
  assignGeneralRequestDoctor,
  startGeneralRequestConsultation,
  completeGeneralRequestConsultation,
};

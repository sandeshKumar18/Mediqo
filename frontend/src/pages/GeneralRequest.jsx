import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  History,
  Loader2,
  LogIn,
  RefreshCw,
  Stethoscope,
  Users,
  XCircle,
} from "lucide-react";

import { AppContext } from "../context/AppContext";

const getUserIdFromToken = (token) => {
  try {
    if (!token) return null;

    const payload = token.split(".")[1];

    const decodedPayload = JSON.parse(
      atob(
        payload
          .replace(/-/g, "+")
          .replace(/_/g, "/"),
      ),
    );

    return decodedPayload.id;
  } catch (error) {
    console.log(
      "Unable to decode user token:",
      error,
    );

    return null;
  }
};


const GeneralRequest = () => {
  const {
    backendUrl,
    token,
    userData,
    currencySymbol,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    phone: "",
    department: "General Medicine",
    reason: "",
  });

  const [selectedDepartment, setSelectedDepartment] = useState("General Medicine");
  const [request, setRequest] = useState(null);
  const [hasRequest, setHasRequest] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);


  const [liveQueue, setLiveQueue] = useState({
    currentlyServing: null,
    currentDoctor: null,

    nextPatient: null,
    nextPatientStatus: null,
    nextPatientDoctor: null,

    waitingCount: 0,
    estimatedWaitMinutes: 0,

    queue: [],
  });


  const [loadingRequest, setLoadingRequest] = useState(true);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [socket, setSocket] = useState(null);

  const departments = [
    "General Medicine",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "ENT",
    "Pediatrics",
    "Gynecology",
    "Neurology",
  ];

  
  const bookingFee = 500;

  const getGeneralRequestHistory =
    async () => {
      if (!token) {
        setHistory([]);
        return;
      }

      try {
        setLoadingHistory(true);

        const { data } =
          await axios.get(
            backendUrl +
              "/api/general-request/history",
            {
              headers: {
                token,
              },
            },
          );

        if (data.success) {
          setHistory(
            data.requests || [],
          );
        } else {
          toast.error(
            data.message,
          );
        }
      } catch (error) {
        console.log(
          "Get General Request History Error:",
          error,
        );

        toast.error(
          error.response?.data
            ?.message ||
            error.message ||
            "Unable to load request history",
        );
      } finally {
        setLoadingHistory(false);
      }
    };

  const getMyRequest = async () => {
    if (!token) return;

    try {
      setLoadingRequest(true);

      const { data } =
        await axios.get(
          backendUrl +
            "/api/general-request/my-request",
          {
            headers: {
              token,
            },
          },
        );

      if (data.success) {
        setHasRequest(
          data.hasRequest,
        );

        setRequest(
          data.request || null,
        );

        if (
          data.hasRequest &&
          data.request?.department
        ) {
          setSelectedDepartment(
            data.request.department,
          );
        }
      } else {
        toast.error(
          data.message,
        );
      }
    } catch (error) {
      console.log(
        "Get General Request Error:",
        error,
      );

      toast.error(
        error.response?.data
          ?.message ||
          error.message ||
          "Unable to get request",
      );
    } finally {
      setLoadingRequest(false);
    }
  };


  const getLiveQueue = async (
    department = selectedDepartment,
  ) => {
    if (!department) return;

    try {
      setLoadingQueue(true);

      const { data } =
        await axios.get(
          backendUrl +
            "/api/general-request/live-queue",
          {
            params: {
              department,
            },
          },
        );

      if (data.success) {
        setLiveQueue({
          currentlyServing:
            data.currentlyServing ??
            null,

          currentDoctor:
            data.currentDoctor ??
            null,

          nextPatient:
            data.nextPatient ??
            null,

          nextPatientStatus:
            data.nextPatientStatus ??
            null,

          nextPatientDoctor:
            data.nextPatientDoctor ??
            null,

          waitingCount:
            data.waitingCount ?? 0,

          estimatedWaitMinutes:
            data.estimatedWaitMinutes ??
            0,

          queue:
            data.queue || [],
        });
      } else {
        toast.error(
          data.message,
        );
      }
    } catch (error) {
      console.log(
        "Live Queue Error:",
        error,
      );

      toast.error(
        error.response?.data
          ?.message ||
          error.message ||
          "Unable to load live queue",
      );
    } finally {
      setLoadingQueue(false);
    }
  };

  useEffect(() => {
    if (!userData) return;

    setFormData((prev) => ({
      ...prev,

      patientName:
        userData.name ||
        prev.patientName,

      phone:
        userData.phone ||
        prev.phone,

      gender:
        userData.gender ||
        prev.gender,
    }));
  }, [userData]);

  useEffect(() => {
    if (!token) {
      setLoadingRequest(false);
      setHasRequest(false);
      setRequest(null);
      setHistory([]);
      return;
    }

    getMyRequest();
    getGeneralRequestHistory();
  }, [token]);

  useEffect(() => {
    getLiveQueue(
      selectedDepartment,
    );
  }, [selectedDepartment]);

  useEffect(() => {
    if (!backendUrl || !token) {
      return;
    }

    const socketConnection = io(
      backendUrl,
      {
        transports: ["websocket"],
      },
    );

    setSocket(
      socketConnection,
    );

    socketConnection.on(
      "connect",
      () => {
        console.log(
          "Socket connected:",
          socketConnection.id,
        );

        const userId =
          getUserIdFromToken(token);

        if (userId) {
          socketConnection.emit(
            "joinUserRoom",
            userId,
          );

          console.log(
            "Joined user socket room:",
            `user:${userId}`,
          );
        }
      },
    );

    socketConnection.on(
      "connect_error",
      (error) => {
        console.log(
          "Socket connection error:",
          error.message,
        );
      },
    );

    return () => {
      console.log(
        "Socket disconnected",
      );

      socketConnection.disconnect();

      setSocket(null);
    };
  }, [
    backendUrl,
    token,
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleGeneralRequestUpdate =
      (update) => {
        console.log(
          "General Request Socket Update:",
          update,
        );

        if (
          update.department ===
          selectedDepartment
        ) {
          getLiveQueue(
            selectedDepartment,
          );
        }
        getMyRequest();
        getGeneralRequestHistory();
      };

    const handleGeneralRequestNotification =
      (notification) => {
        if (!notification) return;

        console.log(
          "General Request Notification:",
          notification,
        );

        const {
          type,
          title,
          message,
        } = notification;

        const notificationMessage =
          title
            ? `${title}: ${message}`
            : message;

        if (type === "success") {
          toast.success(
            notificationMessage,
          );
        } else if (
          type === "error"
        ) {
          toast.error(
            notificationMessage,
          );
        } else {
          toast(
            notificationMessage,
          );
        }
      };

    socket.on(
      "generalRequestUpdated",
      handleGeneralRequestUpdate,
    );

    socket.on(
      "generalRequestNotification",
      handleGeneralRequestNotification,
    );

    return () => {
      socket.off(
        "generalRequestUpdated",
        handleGeneralRequestUpdate,
      );

      socket.off(
        "generalRequestNotification",
        handleGeneralRequestNotification,
      );
    };
  }, [
    socket,
    selectedDepartment,
    token,
  ]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const queuePromise =
        getLiveQueue(
          selectedDepartment,
        );

      if (token) {
        await Promise.all([
          queuePromise,
          getMyRequest(),
          getGeneralRequestHistory(),
        ]);
      } else {
        await queuePromise;
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQueueDepartmentChange = (
    e,
  ) => {
    setSelectedDepartment(
      e.target.value,
    );
  };

  const createRequest = async () => {
    try {
      setSubmitting(true);

      const { data } =
        await axios.post(
          backendUrl +
            "/api/general-request/create",
          {
            patientName:
              formData.patientName.trim(),

            age:
              Number(formData.age),

            gender:
              formData.gender,

            phone:
              formData.phone.trim(),

            department:
              formData.department,

            reason:
              formData.reason.trim(),
          },
          {
            headers: {
              token,
            },
          },
        );

      if (!data.success) {
        toast.error(
          data.message,
        );
        return;
      }
      if (!window.Razorpay) {
        toast.error(
          "Payment gateway failed to load. Please refresh and try again.",
        );
        return;
      }

      const options = {
        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          data.order.amount,

        currency:
          data.order.currency,

        name: "Mediqo",

        description:
          "General Consultation Booking Fee",

        order_id:
          data.order.id,

        receipt:
          data.order.receipt,

        prefill: {
          name:
            formData.patientName,

          contact:
            formData.phone,

          email:
            userData?.email || "",
        },

        theme: {
          color:
            "#4f46e5",
        },

        handler: async (
          response,
        ) => {
          try {
            const {
              data: verifyData,
            } = await axios.post(
              backendUrl +
                "/api/general-request/verify-payment",
              response,
              {
                headers: {
                  token,
                },
              },
            );

            if (
              verifyData.success
            ) {
              toast.success(
                "Payment successful. You are now in the queue.",
              );

              setHasRequest(
                true,
              );

              setRequest(
                verifyData.request,
              );

              setSelectedDepartment(
                formData.department,
              );

              await Promise.all([
                getLiveQueue(
                  formData.department,
                ),
                getGeneralRequestHistory(),
              ]);
            } else {
              toast.error(
                verifyData.message,
              );
            }
          } catch (error) {
            console.log(
              "General Request Payment Verification Error:",
              error,
            );

            toast.error(
              error.response?.data
                ?.message ||
                error.message ||
                "Payment verification failed",
            );
          }
        },

        modal: {
          ondismiss: () => {
            toast(
              "Payment window closed",
            );
          },
        },
      };

      const razorpay =
        new window.Razorpay(
          options,
        );

      razorpay.open();
    } catch (error) {
      console.log(
        "Create General Request Error:",
        error,
      );

      toast.error(
        error.response?.data
          ?.message ||
          error.message ||
          "Unable to create General Request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (
    e,
  ) => {
    e.preventDefault();
    if (!token) {
      toast.error(
        "Please login to continue",
      );

      navigate("/login");
      return;
    }

    if (
      !formData.patientName.trim()
    ) {
      toast.error(
        "Please enter patient name",
      );
      return;
    }

    if (
      !formData.age ||
      Number(formData.age) < 0 ||
      Number(formData.age) > 120
    ) {
      toast.error(
        "Please enter a valid age",
      );
      return;
    }

    if (!formData.gender) {
      toast.error(
        "Please select gender",
      );
      return;
    }

    if (!formData.phone.trim()) {
      toast.error(
        "Please enter phone number",
      );
      return;
    }

    if (!formData.department) {
      toast.error(
        "Please select department",
      );
      return;
    }

    if (!formData.reason.trim()) {
      toast.error(
        "Please enter reason for consultation",
      );
      return;
    }

    await createRequest();
  };

  if (loadingRequest) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10">

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium mb-3">
          <Stethoscope size={13} />
          General Consultation
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-800">
          Need a doctor without choosing
          a specific one?
        </h1>

        <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
          Check the hospital's live queue,
          join from home, and let the hospital
          admin assign an available offline doctor.
        </p>
      </div>

      {/* Live Queuw */}

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden mb-8">

        <div className="p-5 sm:p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">

              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />

              <h2 className="font-semibold text-neutral-800">
                Live Queue
              </h2>
            </div>

            <p className="text-xs text-zinc-400 mt-1">
              View the current queue before joining.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <select
              value={selectedDepartment}
              onChange={
                handleQueueDepartmentChange
              }
              className="border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-700 bg-white outline-none focus:border-indigo-400"
            >
              {departments.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                ),
              )}
            </select>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition-all"
              title="Refresh"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4">

          <div className="p-5 sm:p-6 border-b sm:border-b-0 sm:border-r border-zinc-100">

            <p className="text-xs text-zinc-400 mb-2">
              Currently Serving
            </p>

            <p className="text-2xl font-semibold text-indigo-600">
              {loadingQueue
                ? "--"
                : liveQueue.currentlyServing
                  ? `#${liveQueue.currentlyServing}`
                  : "None"}
            </p>

            {liveQueue.currentDoctor && (
              <p className="text-xs text-zinc-500 mt-1">
                {liveQueue.currentDoctor}
              </p>
            )}
          </div>

          <div className="p-5 sm:p-6 border-b sm:border-b-0 sm:border-r border-zinc-100">

            <p className="text-xs text-zinc-400 mb-2">
              Next Patient
            </p>

            <p className="text-2xl font-semibold text-indigo-600">
              {loadingQueue
                ? "--"
                : liveQueue.nextPatient
                  ? `#${liveQueue.nextPatient}`
                  : "None"}
            </p>

            {liveQueue.nextPatientDoctor && (
              <p className="text-xs text-zinc-500 mt-1">
                {liveQueue.nextPatientDoctor}
              </p>
            )}
          </div>

          <div className="p-5 sm:p-6 border-b sm:border-b-0 sm:border-r border-zinc-100">

            <div className="flex items-center gap-2 mb-2">

              <Users
                size={14}
                className="text-zinc-400"
              />

              <p className="text-xs text-zinc-400">
                People Waiting
              </p>
            </div>

            <p className="text-2xl font-semibold text-neutral-800">
              {loadingQueue
                ? "--"
                : liveQueue.waitingCount}
            </p>
          </div>

          <div className="p-5 sm:p-6">

            <div className="flex items-center gap-2 mb-2">

              <Clock3
                size={14}
                className="text-zinc-400"
              />

              <p className="text-xs text-zinc-400">
                Estimated Wait
              </p>
            </div>

            <p className="text-2xl font-semibold text-neutral-800">
              {loadingQueue
                ? "--"
                : `${liveQueue.estimatedWaitMinutes} min`}
            </p>
          </div>
        </div>
      </div>

  

      {hasRequest && request ? (
        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">

          <div className="h-1 bg-indigo-500" />

          <div className="p-5 sm:p-7">

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">

              <div>

                <div className="flex items-center gap-2 mb-2">

                  {request.status ===
                  "completed" ? (
                    <CheckCircle2
                      size={20}
                      className="text-emerald-500"
                    />
                  ) : request.status ===
                    "cancelled" ? (
                    <XCircle
                      size={20}
                      className="text-red-500"
                    />
                  ) : (
                    <CalendarClock
                      size={20}
                      className="text-indigo-500"
                    />
                  )}

                  <h2 className="text-lg font-semibold text-neutral-800">
                    Your General Request
                  </h2>
                </div>

                <p className="text-xs text-zinc-400">
                  Request ID:{" "}
                  {request._id}
                </p>
              </div>

              <span
                className={`inline-flex self-start items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                  request.status ===
                  "waiting"
                    ? "bg-amber-50 text-amber-600 border border-amber-100"
                    : request.status ===
                        "accepted"
                      ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                      : request.status ===
                          "in_progress"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : request.status ===
                            "completed"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-red-50 text-red-500 border border-red-100"
                }`}
              >
                {request.status ===
                  "waiting" &&
                  "Waiting"}

                {request.status ===
                  "accepted" &&
                  "Accepted"}

                {request.status ===
                  "in_progress" &&
                  "In Consultation"}

                {request.status ===
                  "completed" &&
                  "Completed"}

                {[
                  "cancelled",
                  "rejected",
                  "no_show",
                ].includes(
                  request.status,
                ) &&
                  request.status
                    .replace("_", " ")
                    .replace(
                      /^\w/,
                      (c) =>
                        c.toUpperCase(),
                    )}
              </span>
            </div>

            {/* Request statistics */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">

              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">

                <p className="text-[11px] text-zinc-400 mb-1">
                  Queue Number
                </p>

                <p className="text-2xl font-semibold text-indigo-600">
                  #{request.queueNumber}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">

                <p className="text-[11px] text-zinc-400 mb-1">
                  People Ahead
                </p>

                <p className="text-2xl font-semibold text-neutral-800">
                  {request.peopleAhead}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">

                <p className="text-[11px] text-zinc-400 mb-1">
                  Estimated Wait
                </p>

                <p className="text-2xl font-semibold text-neutral-800">
                  {request.estimatedWaitMinutes} min
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">

                <p className="text-[11px] text-zinc-400 mb-1">
                  Department
                </p>

                <p className="text-sm font-semibold text-neutral-800 mt-2">
                  {request.department}
                </p>
              </div>
            </div>

            {/* Doctor + Payment */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="border border-zinc-200 rounded-2xl p-4">

                <p className="text-xs text-zinc-400 mb-2">
                  Assigned Doctor
                </p>

                <div className="flex items-center gap-2">

                  <Stethoscope
                    size={15}
                    className="text-indigo-500"
                  />

                  <p className="text-sm font-semibold text-neutral-800">
                    {request.assignedDoctor ||
                      "Not assigned yet"}
                  </p>
                </div>
              </div>

              <div className="border border-zinc-200 rounded-2xl p-4">

                <p className="text-xs text-zinc-400 mb-2">
                  Booking Payment
                </p>

                <p className="text-sm font-semibold text-emerald-600">
                  {currencySymbol}
                  {request.bookingFee} Paid
                </p>
              </div>
            </div>

            {/* Status  */}

            <div className="mt-6 rounded-2xl bg-indigo-50 border border-indigo-100 p-4">

              <p className="text-sm text-indigo-700 leading-relaxed">

                {request.status ===
                  "waiting" &&
                  `You are in the queue. Please remain available. The hospital admin will assign an offline doctor to your request.`}

                {request.status ===
                  "accepted" &&
                  `Your request has been accepted and a doctor has been assigned. Please wait for your consultation.`}

                {request.status ===
                  "in_progress" &&
                  `Your consultation is currently in progress.`}

                {request.status ===
                  "completed" &&
                  `Your consultation has been completed.`}
              </p>
            </div>
          </div>
        </div>

      ) : !token ? (


        <div className="bg-white border border-zinc-200 rounded-3xl p-8 sm:p-10 text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">

            <Stethoscope
              size={27}
              className="text-indigo-600"
            />
          </div>

          <h2 className="text-xl font-semibold text-neutral-800">
            Ready to Join the Queue?
          </h2>

          <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
            You can explore the live queue without
            signing in. Login to submit your request
            and pay the ₹500 booking fee.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all"
          >
            <LogIn size={16} />

            Login to Join Queue

            <ArrowRight size={16} />
          </button>
        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-6">

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-zinc-200 rounded-3xl overflow-hidden"
          >

            <div className="p-5 sm:p-7 border-b border-zinc-100">

              <h2 className="text-lg font-semibold text-neutral-800">
                General Consultation Request
              </h2>

              <p className="text-xs text-zinc-400 mt-1">
                No specific doctor or appointment
                time is required.
              </p>
            </div>

            <div className="p-5 sm:p-7">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Patient Name */}

                <div>

                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                    Patient Name
                  </label>

                  <input
                    type="text"
                    name="patientName"
                    value={
                      formData.patientName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter patient name"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                {/* Age */}

                <div>

                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    min="0"
                    max="120"
                    value={
                      formData.age
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Age"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                {/* Gender */}

                <div>

                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={
                      formData.gender
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-indigo-400 bg-white"
                  >

                    <option value="">
                      Select gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>
                </div>

                {/* Phone */}

                <div>

                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                {/* Department */}

                <div className="sm:col-span-2">

                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                    Department
                  </label>

                  <select
                    name="department"
                    value={
                      formData.department
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-indigo-400 bg-white"
                  >

                    {departments.map(
                      (department) => (
                        <option
                          key={
                            department
                          }
                          value={
                            department
                          }
                        >
                          {
                            department
                          }
                        </option>
                      ),
                    )}

                  </select>
                </div>

                {/* Reason */}

                <div className="sm:col-span-2">

                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                    Reason for Visit
                  </label>

                  <textarea
                    name="reason"
                    rows="4"
                    value={
                      formData.reason
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Briefly describe why you need consultation..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-indigo-400 resize-none"
                  />
                </div>

              </div>

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {submitting ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Preparing Payment...
                  </>
                ) : (
                  <>
                    Pay{" "}
                    {currencySymbol}
                    {bookingFee}
                    {" "}
                    & Join Queue

                    <ArrowRight
                      size={16}
                    />
                  </>
                )}

              </button>
            </div>
          </form>

          {/* Information card */}

          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-3xl p-5 sm:p-6 h-fit">

            <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">

              <Clock3
                size={21}
                className="text-indigo-600"
              />
            </div>

            <h3 className="font-semibold text-neutral-800">
              How it works
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex gap-3">

                <div className="w-7 h-7 shrink-0 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                  1
                </div>

                <div>

                  <p className="text-sm font-medium text-neutral-700">
                    Submit your request
                  </p>

                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Choose the department and
                    tell us why you need
                    consultation.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">

                <div className="w-7 h-7 shrink-0 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                  2
                </div>

                <div>

                  <p className="text-sm font-medium text-neutral-700">
                    Pay the booking fee
                  </p>

                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    A fixed booking fee of{" "}
                    {currencySymbol}
                    {bookingFee} is paid
                    online.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">

                <div className="w-7 h-7 shrink-0 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                  3
                </div>

                <div>

                  <p className="text-sm font-medium text-neutral-700">
                    Join the live queue
                  </p>

                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    You receive a queue number
                    and can track your position.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">

                <div className="w-7 h-7 shrink-0 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                  4
                </div>

                <div>

                  <p className="text-sm font-medium text-neutral-700">
                    Doctor assigned by hospital
                  </p>

                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    The admin assigns an available
                    offline doctor to your request.
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-5 border-t border-indigo-100">

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                The booking fee covers only the
                MediQo queue request. Any doctor
                or service charges are handled
                separately at the hospital.
              </p>

            </div>
          </div>
        </div>
      )}

     {/* Previous requests */}

      {token && (
        <div className="mt-8">

          <div className="mb-4">

            <div className="flex items-center gap-2">

              <History
                size={18}
                className="text-indigo-500"
              />

              <h2 className="text-lg font-semibold text-neutral-800">
                Previous General Requests
              </h2>
            </div>

            <p className="text-xs text-zinc-400 mt-1">
              View your completed and previous
              General Request bookings.
            </p>
          </div>

          {loadingHistory ? (

            <div className="bg-white border border-zinc-200 rounded-2xl p-8 flex justify-center">

              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />

            </div>

          ) : history.length === 0 ? (

            <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">

              <p className="text-sm font-medium text-zinc-500">
                No previous General Requests
              </p>

              <p className="text-xs text-zinc-400 mt-1">
                Your completed consultation requests
                will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {history.map(
                (item) => (
                  <div
                    key={item._id}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="text-lg font-semibold text-indigo-600">
                            #{item.queueNumber}
                          </span>

                          <span className="text-sm font-semibold text-neutral-800">
                            {
                              item.department
                            }
                          </span>

                        </div>

                        <p className="text-xs text-zinc-400 mt-1">
                          Patient:{" "}
                          {
                            item.patientName
                          }
                        </p>

                        <p className="text-xs text-zinc-400 mt-1">

                          Doctor:{" "}

                          <span className="text-zinc-600">
                            {
                              item.assignedDoctor ||
                              "Not assigned"
                            }
                          </span>

                        </p>
                      </div>

                      <div className="sm:text-right">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status ===
                            "completed"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : item.status ===
                                  "cancelled"
                                ? "bg-red-50 text-red-500 border border-red-100"
                                : "bg-zinc-50 text-zinc-500 border border-zinc-200"
                          }`}
                        >
                          {item.status
                            ?.replace(
                              "_",
                              " ",
                            )
                            .replace(
                              /^\w/,
                              (c) =>
                                c.toUpperCase(),
                            )}
                        </span>

                        <p className="text-xs text-emerald-600 font-medium mt-2">
                          ₹
                          {
                            item.bookingFee
                          }{" "}
                          Paid
                        </p>

                        <p className="text-[11px] text-zinc-400 mt-1">
                          {new Date(
                            item.createdAt,
                          ).toLocaleDateString(
                            "en-IN",
                          )}
                        </p>

                      </div>
                    </div>
                  </div>
                ),
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeneralRequest;
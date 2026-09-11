import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  Play,
  Stethoscope,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { AdminContext } from "../../context/AdminContext";

const GeneralRequests = () => {
  const {
    generalRequests,
    getGeneralRequests,
    assignGeneralRequestDoctor,
    startGeneralRequest,
    completeGeneralRequest,
  } = useContext(AdminContext);

 
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

 
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");


  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [doctorName, setDoctorName] =
    useState("");

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

  //------------------------------------------------------

  const loadRequests = async () => {
    setLoading(true);

    await getGeneralRequests({
      department,
      status,
    });

    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

 
  const filteredRequests = useMemo(() => {
    return generalRequests || [];
  }, [generalRequests]);

 
  const handleAssignDoctor = async () => {
    if (!selectedRequest) return;

    if (!doctorName.trim()) {
      toast.error("Please enter doctor name");
      return;
    }

    setActionLoading(
      `assign-${selectedRequest._id}`,
    );

    const success =
      await assignGeneralRequestDoctor(
        selectedRequest._id,
        doctorName.trim(),
      );

    setActionLoading("");

    if (success) {
      setSelectedRequest(null);
      setDoctorName("");
    }
  };

 
  const handleStart = async (requestId) => {
    setActionLoading(`start-${requestId}`);

    await startGeneralRequest(requestId);

    setActionLoading("");

  };

  const handleComplete = async (requestId) => {
    setActionLoading(`complete-${requestId}`);

    await completeGeneralRequest(requestId);

    setActionLoading("");

  };

 
  const getStatusStyle = (requestStatus) => {
    switch (requestStatus) {
      case "waiting":
        return "bg-amber-50 text-amber-600 border-amber-100";

      case "accepted":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";

      case "in_progress":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";

      case "completed":
        return "bg-green-50 text-green-600 border-green-100";

      case "cancelled":
      case "rejected":
      case "no_show":
        return "bg-red-50 text-red-500 border-red-100";

      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const getStatusLabel = (requestStatus) => {
    switch (requestStatus) {
      case "waiting":
        return "Waiting";

      case "accepted":
        return "Accepted";

      case "in_progress":
        return "In Consultation";

      case "completed":
        return "Completed";

      case "cancelled":
        return "Cancelled";

      case "rejected":
        return "Rejected";

      case "no_show":
        return "No Show";

      default:
        return requestStatus;
    }
  };


  const totalRequests =
    filteredRequests.length;

  const waitingRequests =
    filteredRequests.filter(
      (item) =>
        item.status === "waiting",
    ).length;

  const acceptedRequests =
    filteredRequests.filter(
      (item) =>
        item.status === "accepted",
    ).length;

  const inProgressRequests =
    filteredRequests.filter(
      (item) =>
        item.status === "in_progress",
    ).length;


  const paidRequests =
    filteredRequests.filter(
      (item) =>
        item.paymentStatus === "paid",
    );

  const bookingRevenue =
    paidRequests.reduce(
      (total, item) =>
        total +
        (Number(item.bookingFee) || 0),
      0,
    );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope
              size={20}
              className="text-[#5f6FFF]"
            />

            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              General Requests
            </h1>
          </div>

          <p className="text-sm text-gray-500">
            Manage today's first-come-first-served
            consultation requests.
          </p>
        </div>

        <div className="text-xs text-gray-400">
          Booking fee is paid online.
          Offline consultation charges are not
          tracked here.
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">
            Total Requests
          </p>

          <p className="text-2xl font-semibold text-gray-800 mt-1">
            {totalRequests}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">
            Waiting
          </p>

          <p className="text-2xl font-semibold text-amber-600 mt-1">
            {waitingRequests}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">
            Accepted
          </p>

          <p className="text-2xl font-semibold text-[#5f6FFF] mt-1">
            {acceptedRequests}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">
            In Consultation
          </p>

          <p className="text-2xl font-semibold text-emerald-600 mt-1">
            {inProgressRequests}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 col-span-2 xl:col-span-1">
          <p className="text-xs text-gray-400">
            Booking Revenue
          </p>

          <p className="text-2xl font-semibold text-gray-800 mt-1">
            ₹{bookingRevenue}
          </p>
        </div>
      </div>

     {/* filters */}

      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none focus:border-[#5f6FFF]"
            >
              <option value="">
                All Departments
              </option>

              {departments.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            />
          </div>

          <div className="relative flex-1">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none focus:border-[#5f6FFF]"
            >
              <option value="">
                All Statuses
              </option>

              <option value="waiting">
                Waiting
              </option>

              <option value="accepted">
                Accepted
              </option>

              <option value="in_progress">
                In Consultation
              </option>

              <option value="completed">
                Completed
              </option>
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            />
          </div>

          <button
            type="button"
            onClick={loadRequests}
            className="px-5 py-2.5 rounded-xl bg-[#5f6FFF] hover:bg-[#5261e8] text-white text-sm font-medium transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Request list */}

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">
              Today's Queue
            </h2>

            <p className="text-xs text-gray-400 mt-0.5">
              {filteredRequests.length} request
              {filteredRequests.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <Users
            size={18}
            className="text-gray-300"
          />
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2
              size={28}
              className="text-[#5f6FFF] animate-spin"
            />
          </div>
        ) : filteredRequests.length ===
          0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <Users
                size={20}
                className="text-gray-300"
              />
            </div>

            <p className="text-sm font-medium text-gray-500">
              No General Requests found
            </p>

            <p className="text-xs text-gray-400 mt-1">
              There are no matching requests for
              today.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRequests.map(
              (item) => (
                <div
                  key={item._id}
                  className="p-4 sm:p-5"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                    <div className="shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-[#F2F3FF] flex flex-col items-center justify-center">
                        <span className="text-[10px] text-gray-400">
                          TOKEN
                        </span>

                        <span className="text-lg font-bold text-[#5f6FFF]">
                          #{item.queueNumber}
                        </span>
                      </div>
                    </div>


                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-800">
                          {item.patientName}
                        </h3>

                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold border ${getStatusStyle(
                            item.status,
                          )}`}
                        >
                          {getStatusLabel(
                            item.status,
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                        <span>
                          Age:{" "}
                          <strong className="text-gray-700">
                            {item.age}
                          </strong>
                        </span>

                        <span>
                          Gender:{" "}
                          <strong className="text-gray-700">
                            {item.gender}
                          </strong>
                        </span>

                        <span>
                          Phone:{" "}
                          <strong className="text-gray-700">
                            {item.phone}
                          </strong>
                        </span>

                        <span>
                          Department:{" "}
                          <strong className="text-gray-700">
                            {item.department}
                          </strong>
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                        Reason: {item.reason}
                      </p>
                    </div>

                    {/* Doctor */}

                    <div className="xl:w-48">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                        Assigned Doctor
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                          <Stethoscope
                            size={14}
                            className="text-[#5f6FFF]"
                          />
                        </div>

                        <span className="text-sm font-medium text-gray-700">
                          {item.assignedDoctor ||
                            "Not assigned"}
                        </span>
                      </div>
                    </div>

                    {/* Payment */}

                    <div className="xl:w-28">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                        Booking
                      </p>

                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          size={13}
                          className={
                            item.paymentStatus ===
                            "paid"
                              ? "text-emerald-500"
                              : "text-gray-300"
                          }
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {item.paymentStatus ===
                          "paid"
                            ? `₹${item.bookingFee}`
                            : "Unpaid"}
                        </span>
                      </div>
                    </div>

                    {/* Action */}

                    <div className="xl:w-44">
                      {item.status ===
                        "waiting" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRequest(
                              item,
                            );
                            setDoctorName("");
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#5f6FFF] text-[#5f6FFF] hover:bg-[#5f6FFF] hover:text-white text-sm font-medium transition-all"
                        >
                          <Stethoscope
                            size={14}
                          />
                          Assign Doctor
                        </button>
                      )}

                      {item.status ===
                        "accepted" && (
                        <button
                          type="button"
                          disabled={
                            actionLoading ===
                            `start-${item._id}`
                          }
                          onClick={() =>
                            handleStart(
                              item._id,
                            )
                          }
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all disabled:opacity-60"
                        >
                          {actionLoading ===
                          `start-${item._id}` ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Play
                              size={14}
                              fill="currentColor"
                            />
                          )}

                          Start Consultation
                        </button>
                      )}

                      {item.status ===
                        "in_progress" && (
                        <button
                          type="button"
                          disabled={
                            actionLoading ===
                            `complete-${item._id}`
                          }
                          onClick={() =>
                            handleComplete(
                              item._id,
                            )
                          }
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5f6FFF] hover:bg-[#5261e8] text-white text-sm font-medium transition-all disabled:opacity-60"
                        >
                          {actionLoading ===
                          `complete-${item._id}` ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle2
                              size={14}
                            />
                          )}

                          Complete
                        </button>
                      )}

                      {item.status ===
                        "completed" && (
                        <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-medium">
                          <CheckCircle2
                            size={14}
                          />
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Assign doctor */}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => {
              setSelectedRequest(null);
              setDoctorName("");
            }}
          />

          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="h-1 bg-[#5f6FFF]" />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Assign Offline Doctor
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Queue #{selectedRequest.queueNumber}
                    {" • "}
                    {selectedRequest.patientName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRequest(
                      null,
                    );
                    setDoctorName("");
                  }}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700"
                >
                  <XCircle size={17} />
                </button>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Offline Doctor Name
                </label>

                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) =>
                    setDoctorName(
                      e.target.value,
                    )
                  }
                  placeholder="e.g. Dr. Amit Sharma"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#5f6FFF]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRequest(
                      null,
                    );
                    setDoctorName("");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    actionLoading ===
                    `assign-${selectedRequest._id}`
                  }
                  onClick={
                    handleAssignDoctor
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5f6FFF] hover:bg-[#5261e8] text-white text-sm font-medium disabled:opacity-60"
                >
                  {actionLoading ===
                  `assign-${selectedRequest._id}` ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Stethoscope
                      size={14}
                    />
                  )}

                  Assign Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralRequests;

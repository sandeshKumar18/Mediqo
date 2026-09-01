import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const formatSlotDate = (slotDate) => {
  const [day, month, year] = slotDate.split("_");
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 min-h-screen bg-gray-50">
      {/* ── Page header ── */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          All Appointments
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {appointments.length} total appointment
          {appointments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_60px_1fr_1fr_80px_80px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
        </div>

        <div className="divide-y divide-gray-50">
          {appointments.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[40px_1fr_60px_1fr_1fr_80px_80px] gap-3 px-5 py-3.5 items-center text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <p className="text-gray-400 text-xs font-medium">{index + 1}</p>

              {/* Patient */}
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  className="w-8 h-8 rounded-full object-cover shrink-0 bg-indigo-50"
                  src={item.userData.image}
                  alt={item.userData.name}
                />
                <p className="truncate font-medium text-gray-700">
                  {item.userData.name}
                </p>
              </div>

              {/* Age */}
              <p className="text-gray-500">{calculateAge(item.userData.dob)}</p>

              {/* Date & Time */}
              <div className="min-w-0">
                <p className="text-gray-700 font-medium text-xs">
                  {formatSlotDate(item.slotDate)}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{item.slotTime}</p>
              </div>

              {/* Doctor */}
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  className="w-8 h-8 rounded-full object-cover shrink-0 bg-gray-100"
                  src={item.docData.image}
                  alt={item.docData.name}
                />
                <p className="truncate text-gray-700">{item.docData.name}</p>
              </div>

              {/* Fees */}
              <p className="font-semibold text-gray-700">₹{item.amount}
              </p>

              {/* Status */}
              <div>
                {item.cancelled ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)
                    }
                    className="group flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-red-500 transition-colors"
                    title="Cancel appointment"
                  >
                    <img
                      className="w-7 h-7 opacity-60 group-hover:opacity-100 transition-opacity"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-medium text-gray-500">No appointments yet</p>
            <p className="text-xs mt-1">
              Appointments will appear here once booked
            </p>
          </div>
        )}
      </div>

      {/* ── Mobile cards ── */}
      <div className="sm:hidden flex flex-col gap-3">
        {appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-medium text-gray-500">No appointments yet</p>
          </div>
        )}

        {appointments.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
          >
            {/* Patient + status */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  className="w-10 h-10 rounded-full object-cover shrink-0 bg-indigo-50"
                  src={item.userData.image}
                  alt={item.userData.name}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {item.userData.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Age {calculateAge(item.userData.dob)}
                  </p>
                </div>
              </div>

              {item.cancelled ? (
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Cancelled
                </span>
              ) : item.payment ? (
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Paid
                </span>
              ) : (
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Pending
                </span>
              )}
            </div>

            <div className="h-px bg-gray-100 mb-3" />

            {/* Doctor */}
            <div className="flex items-center gap-2 mb-3">
              <img
                className="w-7 h-7 rounded-full object-cover bg-gray-100 shrink-0"
                src={item.docData.image}
                alt={item.docData.name}
              />
              <div className="min-w-0">
                <p className="text-xs text-gray-400">Doctor</p>
                <p className="text-sm font-medium text-gray-700 truncate">
                  {item.docData.name}
                </p>
              </div>
            </div>

            {/* Date + Fees */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Date & Time</p>
                <p className="text-sm font-medium text-gray-700">
                  {formatSlotDate(item.slotDate)}
                </p>
                <p className="text-xs text-gray-400">{item.slotTime}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Fees</p>
                <p className="text-sm font-semibold text-gray-700">
                  ₹{item.amount}
                </p>
              </div>
            </div>

            {!item.cancelled && !item.payment && (
              <>
                <div className="h-px bg-gray-100 mt-3 mb-3" />
                <button
                  onClick={() =>
                    cancelAppointment && cancelAppointment(item._id)
                  }
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl py-2 transition-all duration-200"
                >
                  <img
                    className="w-5 h-5 opacity-60"
                    src={assets.cancel_icon}
                    alt=""
                  />
                  Cancel Appointment
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;

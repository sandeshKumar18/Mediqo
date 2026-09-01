import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast, { Toaster } from "react-hot-toast";
import {
  Wallet,
  CalendarCheck,
  Users,
  ListChecks,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Calendar,
  AlertTriangle,
} from "lucide-react";

const StatCard = ({ icon: Icon, iconBg, iconColor, value, label }) => (
  <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1 min-w-[150px] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
    <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800 leading-tight">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide">
        {label}
      </p>
    </div>
  </div>
);

/*  Status badge  */
const StatusBadge = ({ cancelled, completed, missed }) => {
  if (cancelled)
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full shrink-0">
        <XCircle className="w-3 h-3" /> Cancelled
      </span>
    );
  if (completed)
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full shrink-0">
        <CheckCircle2 className="w-3 h-3" /> Completed
      </span>
    );
  if (missed)
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full shrink-0">
        <AlertTriangle className="w-3 h-3" /> Missed
      </span>
    );
  return null;
};

/* ── Confirmation Modal ── */
const ConfirmModal = ({ open, onClose, onConfirm, type, patientName }) => {
  if (!open) return null;

  const isCancel = type === "cancel";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div
        className="relative w-full sm:max-w-sm bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`h-1 w-full ${isCancel ? "bg-red-400" : "bg-emerald-400"}`}
        />

        <div className="px-6 pt-5 pb-6">
          <div className="flex flex-col items-center text-center mb-5">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                isCancel ? "bg-red-50" : "bg-emerald-50"
              }`}
            >
              {isCancel ? (
                <XCircle className="w-7 h-7 text-red-500" />
              ) : (
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              )}
            </div>
            <h3 className="text-base font-bold text-gray-800">
              {isCancel ? "Cancel Appointment?" : "Mark as Completed?"}
            </h3>
            <p className="text-sm text-gray-400 mt-1.5 leading-snug">
              {isCancel
                ? `This will cancel the appointment for `
                : `This will mark the appointment for `}
              <span className="font-semibold text-gray-600">{patientName}</span>
              {isCancel ? `. This action cannot be undone.` : ` as completed.`}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white active:scale-95 transition-all ${
                isCancel
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {isCancel ? "Yes, Cancel" : "Yes, Complete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const { slotDateFormat, currency } = useContext(AppContext);

  // ── Confirmation modal state ──
  const [confirm, setConfirm] = useState({
    open: false,
    type: null, // "cancel" | "complete"
    id: null,
    patientName: "",
  });

  useEffect(() => {
    if (dToken) getDashData();
  }, [dToken]);

  /* ── Determine if a given slotDate + slotTime is already in the past ──
     slotDate format: "DD_MM_YYYY"
     slotTime format: "hh:mm am/pm" (e.g. "11:00 am") */
  const isPastSlot = (slotDate, slotTime) => {
    try {
      const [day, month, year] = slotDate.split("_").map(Number);

      const timeMatch = slotTime?.trim().match(/(\d+):(\d+)\s*(am|pm)/i);
      if (!timeMatch) return false;

      let [, hours, minutes, meridiem] = timeMatch;
      hours = Number(hours);
      minutes = Number(minutes);

      if (meridiem.toLowerCase() === "pm" && hours !== 12) hours += 12;
      if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;

      const slotDateTime = new Date(year, month - 1, day, hours, minutes);
      return slotDateTime.getTime() < Date.now();
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const isMissed = (item) =>
    !item.cancelled &&
    !item.isCompleted &&
    isPastSlot(item.slotDate, item.slotTime);

  const requestCancel = (id, patientName) =>
    setConfirm({ open: true, type: "cancel", id, patientName });

  const requestComplete = (id, patientName) =>
    setConfirm({ open: true, type: "complete", id, patientName });

  const closeConfirm = () =>
    setConfirm({ open: false, type: null, id: null, patientName: "" });

  const handleConfirm = async () => {
    closeConfirm();
    if (confirm.type === "cancel") {
      await cancelAppointment(confirm.id);
      toast.error("Appointment cancelled", {
        style: { borderRadius: "10px", fontSize: "14px" },
      });
    } else {
      await completeAppointment(confirm.id);
      toast.success("Marked as completed", {
        style: { borderRadius: "10px", fontSize: "14px" },
      });
    }
  };

  if (!dashData) return null;

  return (
    <>
      <Toaster position="top-right" />

      {/* Confirmation Modal */}
      <ConfirmModal
        open={confirm.open}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        type={confirm.type}
        patientName={confirm.patientName}
      />

      <div className="m-5 max-w-5xl">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={Wallet}
            iconBg="bg-green-50"
            iconColor="text-green-500"
            value={`${currency}${dashData.earnings}`}
            label="Earnings"
          />
          <StatCard
            icon={CalendarCheck}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
            value={dashData.appointments}
            label="Appointments"
          />
          <StatCard
            icon={Users}
            iconBg="bg-purple-50"
            iconColor="text-purple-500"
            value={dashData.patients}
            label="Patients"
          />
        </div>

        {/* ── Latest Bookings ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <ListChecks className="w-4 h-4 text-primary" />
            </div>
            <p className="font-semibold text-gray-800 text-sm">
              Latest Bookings
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            {dashData.latestAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                <Calendar className="w-10 h-10 mb-3 text-gray-200" />
                <p className="text-sm font-medium">No bookings yet</p>
              </div>
            ) : (
              dashData.latestAppointments.map((item, index) => {
                const missed = isMissed(item);

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <img
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
                      src={item.userData.image}
                      alt={item.userData.name}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.userData.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                        <p className="text-xs text-gray-400">
                          {slotDateFormat(item.slotDate)}
                        </p>
                      </div>
                    </div>

                    {item.cancelled || item.isCompleted || missed ? (
                      <StatusBadge
                        cancelled={item.cancelled}
                        completed={item.isCompleted}
                        missed={missed}
                      />
                    ) : (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() =>
                            requestCancel(item._id, item.userData.name)
                          }
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 active:scale-95 transition-all"
                        >
                          <X className="w-3 h-3" />
                          <span className="hidden sm:inline">Cancel</span>
                        </button>
                        <button
                          onClick={() =>
                            requestComplete(item._id, item.userData.name)
                          }
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 active:scale-95 transition-all"
                        >
                          <Check className="w-3 h-3" />
                          <span className="hidden sm:inline">Done</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;

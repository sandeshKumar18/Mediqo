import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MapPin,
  CalendarDays,
  Clock,
  CreditCard,
  X,
  Stethoscope,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

/* ── Confirmation Modal  */
const ConfirmModal = ({ open, onClose, onConfirm, type, doctorName }) => {
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
        {/* Top accent bar */}
        <div
          className={`h-1 w-full ${isCancel ? "bg-red-400" : "bg-indigo-400"}`}
        />

        <div className="px-6 pt-5 pb-6">
          <div className="flex flex-col items-center text-center mb-5">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                isCancel ? "bg-red-50" : "bg-indigo-50"
              }`}
            >
              {isCancel ? (
                <XCircle className="w-7 h-7 text-red-500" />
              ) : (
                <CreditCard className="w-7 h-7 text-indigo-500" />
              )}
            </div>

            <h3 className="text-base font-bold text-gray-800">
              {isCancel ? "Cancel Appointment?" : "Confirm Payment?"}
            </h3>
            <p className="text-sm text-gray-400 mt-1.5 leading-snug">
              {isCancel ? (
                <>
                  This will cancel your appointment with{" "}
                  <span className="font-semibold text-gray-600">
                    {doctorName}
                  </span>
                  . This action cannot be undone.
                </>
              ) : (
                <>
                  You're about to pay online for your appointment with{" "}
                  <span className="font-semibold text-gray-600">
                    {doctorName}
                  </span>
                  . You'll be redirected to the payment gateway.
                </>
              )}
            </p>
          </div>

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
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {isCancel ? "Yes, Cancel" : "Yes, Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [confirm, setConfirm] = useState({
    open: false,
    type: null, // "cancel" | "pay"
    appointmentId: null,
    doctorName: "",
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
    );
  };

  /* ── Determine if a given slotDate + slotTime is already in the past ──
     slotDate format: "DD_MM_YYYY"
     slotTime format: "hh:mm am/pm" (e.g. "11:00 am") */
  const isPastSlot = (slotDate, slotTime) => {
    try {
      const [day, month, year] = slotDate.split("_").map(Number);

      const timeMatch = slotTime.trim().match(/(\d+):(\d+)\s*(am|pm)/i);
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

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) setAppointments(data.appointments.reverse());
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    if (!window.Razorpay) {
      toast.error(
        "Payment gateway failed to load. Please refresh and try again.",
      );
      return;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            response,
            { headers: { token } },
          );
          if (data.success) {
            toast.success("Payment successful!");
            getUserAppointments();
            navigate("/my-appointments");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) initPay(data.order);
      else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const closeConfirm = () =>
    setConfirm({
      open: false,
      type: null,
      appointmentId: null,
      doctorName: "",
    });

  const handleConfirm = async () => {
    const { type, appointmentId } = confirm;
    closeConfirm();
    if (type === "cancel") {
      await cancelAppointment(appointmentId);
    } else {
      await appointmentRazorpay(appointmentId);
    }
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-10">
      <ConfirmModal
        open={confirm.open}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        type={confirm.type}
        doctorName={confirm.doctorName}
      />

      {/* ── Section heading ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-800">
            My Appointments
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {appointments.length} appointment
            {appointments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span className="text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-full px-3 py-1">
          All Appointments
        </span>
      </div>

      {/* ── Empty state ── */}
      {appointments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <div className="text-5xl mb-4">📅</div>
          <p className="font-medium text-gray-500">No appointments yet</p>
          <p className="text-sm mt-1">Book a doctor to get started</p>
        </div>
      )}

      {/* ── Appointment cards ── */}
      <div className="flex flex-col gap-4">
        {appointments.map((item, index) => {
          const expired =
            !item.cancelled &&
            !item.isCompleted &&
            isPastSlot(item.slotDate, item.slotTime);

          return (
            <div
              key={index}
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden"
            >
              <div
                className={`h-[3px] w-full ${
                  item.cancelled
                    ? "bg-red-400"
                    : item.isCompleted
                      ? "bg-emerald-400"
                      : expired
                        ? "bg-amber-400"
                        : "bg-indigo-400"
                }`}
              />

              {/* Card body */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                <div className="shrink-0 flex justify-center sm:justify-start">
                  <img
                    onClick={() => navigate(`/appointment/${item.docId}`)}
                    className="w-24 h-24 sm:w-[88px] sm:h-[88px] rounded-xl object-cover bg-indigo-50 cursor-pointer hover:scale-105 transition-transform duration-200"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                  <div>
                    <p className="font-semibold text-neutral-800 text-base leading-tight">
                      {item.docData.name}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5 mt-1.5 font-medium">
                      <Stethoscope size={10} />
                      {item.docData.speciality}
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <MapPin
                      size={12}
                      className="text-zinc-400 mt-[3px] shrink-0"
                    />
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {item.docData.address.line1}, {item.docData.address.line2}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays
                        size={12}
                        className="text-zinc-400 shrink-0"
                      />
                      <span className="text-xs text-zinc-600 font-medium">
                        {slotDateFormat(item.slotDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-zinc-400 shrink-0" />
                      <span className="text-xs text-zinc-600 font-medium">
                        {item.slotTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-zinc-100 mx-4 sm:mx-5" />

              <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-5">
                {/* 1. COMPLETED */}
                {item.isCompleted && (
                  <div className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-xl py-2.5">
                    <CheckCircle2 size={14} />
                    Appointment Completed
                  </div>
                )}

                {/* 2. CANCELLED */}
                {item.cancelled && (
                  <div className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-red-400 border border-red-100 bg-red-50 rounded-xl py-2.5">
                    <X size={14} />
                    Appointment Cancelled
                  </div>
                )}

                {/* 3. EXPIRED / MISSED — date has passed, never paid/cancelled/completed */}
                {expired && (
                  <div className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-amber-600 border border-amber-200 bg-amber-50 rounded-xl py-2.5">
                    <AlertTriangle size={14} />
                    {item.payment
                      ? "Paid • Awaiting Update"
                      : "Missed Appointment"}
                  </div>
                )}

                {/* 4. ACTIVE (upcoming, unresolved) */}
                {!item.cancelled && !item.isCompleted && !expired && (
                  <>
                    {/* Already paid */}
                    {item.payment && (
                      <div className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-xl py-2.5">
                        <CheckCircle size={14} />
                        Paid
                      </div>
                    )}

                    {/* Pay Online → opens modal */}
                    {!item.payment && (
                      <button
                        onClick={() =>
                          setConfirm({
                            open: true,
                            type: "pay",
                            appointmentId: item._id,
                            doctorName: item.docData.name,
                          })
                        }
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl py-2.5 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200"
                      >
                        <CreditCard size={14} />
                        Pay Online
                      </button>
                    )}

                    {/* Cancel , opens modal */}
                    <button
                      onClick={() =>
                        setConfirm({
                          open: true,
                          type: "cancel",
                          appointmentId: item._id,
                          doctorName: item.docData.name,
                        })
                      }
                      className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 border border-zinc-200 rounded-xl py-2.5 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;

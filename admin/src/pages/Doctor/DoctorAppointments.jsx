import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  CreditCard,
  Banknote,
  User,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Stethoscope,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

/* ── Avatar ── */
const Avatar = ({ src, alt, size = "w-10 h-10" }) => (
  <img
    src={src}
    alt={alt}
    className={`${size} rounded-full object-cover`}
    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
  />
);

/* ── Base payment badge (Cash / Online) ── */
const PaymentBadge = ({ online }) => (
  <div
    className={`inline-flex items-center gap-1.5 text-sm font-medium ${
      online ? "text-blue-600" : "text-gray-600"
    }`}
  >
    {online ? (
      <CreditCard className="w-4 h-4" />
    ) : (
      <Banknote className="w-4 h-4" />
    )}
    <span>{online ? "Online" : "Cash"}</span>
  </div>
);

/* ── Payment status (context-aware) ──
   - Completed / pending: show badge as normal (Cash or Online)
   - Cancelled / Missed:
       - Online → still show "Paid Online" (money wasn't refunded)
       - Cash   → nothing to show, cash was never collected */

const PaymentStatus = ({ item, missed }) => {
  const isVoid = item.cancelled || missed;

  if (isVoid) {
    if (!item.payment) {
      return (
        <div className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400">
          <Ban className="w-4 h-4" />
          <span>Not Paid</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600">
        <CreditCard className="w-4 h-4" />
        <span>Paid Online</span>
      </div>
    );
  }

  return <PaymentBadge online={item.payment} />;
};

/* ── Status badge ── */
const StatusBadge = ({ cancelled, completed, missed }) => {
  if (cancelled)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
        <XCircle className="w-3.5 h-3.5" /> Cancelled
      </span>
    );
  if (completed)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
      </span>
    );
  if (missed)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
        <AlertTriangle className="w-3.5 h-3.5" /> Missed
      </span>
    );
  return null;
};

/* ── Empty state ── */
const EmptyState = ({ message = "No appointments found" }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <Calendar className="w-12 h-12 mb-3 text-gray-200" />
    <p className="text-sm font-medium">{message}</p>
    <p className="text-xs mt-1 text-gray-300">
      Try adjusting your search or filters
    </p>
  </div>
);


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
        {/* Top accent bar */}
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

/* ════════════════ Main Component ════════════════ */
const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { getAllAppointments } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortDir, setSortDir] = useState(null);

  const [confirm, setConfirm] = useState({
    open: false,
    type: null, // "cancel" | "complete"
    id: null,
    patientName: "",
  });

  useEffect(() => {
    if (dToken) getAppointments();
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

  // Called when user hits confirm inside modal
  const handleConfirm = async () => {
    closeConfirm();
    if (confirm.type === "cancel") {
      await cancelAppointment(confirm.id);
      toast.error("Appointment cancelled", {
        style: { borderRadius: "10px", fontSize: "14px" },
      });
    } else {
      await completeAppointment(confirm.id);
      await 
      toast.success("Marked as completed", {
        style: { borderRadius: "10px", fontSize: "14px" },
      });
    }
  };

  const toggleSort = () => {
    setSortDir((prev) =>
      prev === null ? "asc" : prev === "asc" ? "desc" : null,
    );
  };

  const filtered = appointments
    .filter((item) => {
      const nameMatch = item.userData.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const dateStr = item.slotDate?.replace(/_/g, "-") ?? "";
      const dateMatch = dateFilter ? dateStr === dateFilter : true;
      return nameMatch && dateMatch;
    })
    .sort((a, b) => {
      if (!sortDir) return 0;
      const da = new Date(a.slotDate?.replace(/_/g, "-"));
      const db = new Date(b.slotDate?.replace(/_/g, "-"));
      return sortDir === "asc" ? da - db : db - da;
    });

  const SortIcon =
    sortDir === "asc" ? ArrowUp : sortDir === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <>
      {/* Confirmation Model */}
      <ConfirmModal
        open={confirm.open}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        type={confirm.type}
        patientName={confirm.patientName}
      />

      <div className="w-full max-w-6xl mx-auto px-3 sm:px-5 py-5">
        {/* ── Page Header ── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-xl shrink-0">
            <Stethoscope className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">
              All Appointments
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {appointments.length} total records
            </p>
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-gray-400"
            />
          </div>
          <div className="relative sm:w-52">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-gray-700"
            />
          </div>
          {(search || dateFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setDateFilter("");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* ═══════════ DESKTOP TABLE ═══════════ */}
        <div className="hidden sm:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-[40px_1.8fr_110px_70px_140px_140px_90px_120px] gap-x-3 py-3 px-5 bg-gray-50 border-b border-gray-100">
            {[
              { label: "#" },
              { label: "Patient" },
              { label: "Payment" },
              { label: "Age" },
              { label: "Date", sortable: true },
              { label: "Time" },
              { label: "Fees" },
              { label: "Action" },
            ].map((col) => (
              <div key={col.label} className="flex items-center gap-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {col.label}
                </p>
                {col.sortable && (
                  <button
                    onClick={toggleSort}
                    className={`p-0.5 rounded hover:bg-gray-200 transition-colors ${sortDir ? "text-primary" : "text-gray-400"}`}
                  >
                    <SortIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map((item, index) => {
                const missed = isMissed(item);

                return (
                  <div
                    key={index}
                    className="grid grid-cols-[40px_1.8fr_110px_70px_140px_140px_90px_120px] gap-x-3 items-center py-3.5 px-5 hover:bg-slate-50/80 transition-colors duration-150"
                  >
                    <p className="text-sm text-gray-400 font-medium">
                      {index + 1}
                    </p>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar
                        src={item.userData.image}
                        alt={item.userData.name}
                        size="w-8 h-8"
                      />
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.userData.name}
                      </p>
                    </div>

                    <PaymentStatus item={item} missed={missed} />

                    <p className="text-sm text-gray-600">
                      {calculateAge(item.userData.dob) !== "-"
                        ? `${calculateAge(item.userData.dob)}y`
                        : "—"}
                    </p>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700">
                        {slotDateFormat(item.slotDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700">
                        {item.slotTime}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-gray-800">
                      {currency}
                      {item.amount}
                    </p>

                    {item.cancelled || item.isCompleted || missed ? (
                      <StatusBadge
                        cancelled={item.cancelled}
                        completed={item.isCompleted}
                        missed={missed}
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            requestCancel(item._id, item.userData.name)
                          }
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Cancel"
                        >
                          <img
                            className="w-7 h-7"
                            src={assets.cancel_icon}
                            alt="Cancel"
                          />
                        </button>
                        <button
                          onClick={() =>
                            requestComplete(item._id, item.userData.name)
                          }
                          className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                          title="Complete"
                        >
                          <img
                            className="w-7 h-7"
                            src={assets.tick_icon}
                            alt="Complete"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/*  MOBILE CARDS  */}
        <div className="sm:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
              <EmptyState />
            </div>
          ) : (
            filtered.map((item, index) => {
              const missed = isMissed(item);

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid #e8edf3",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    className={`h-[3px] w-full ${
                      item.cancelled
                        ? "bg-red-400"
                        : item.isCompleted
                          ? "bg-emerald-400"
                          : missed
                            ? "bg-amber-400"
                            : "bg-primary"
                    }`}
                  />

                  <div className="flex items-center justify-between px-4 pt-3.5 pb-3 gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={item.userData.image}
                        alt={item.userData.name}
                        size="w-11 h-11"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {item.userData.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="text-xs text-gray-400">
                            {calculateAge(item.userData.dob) !== "-"
                              ? `${calculateAge(item.userData.dob)} yrs`
                              : "Age N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {(item.cancelled || item.isCompleted || missed) && (
                      <StatusBadge
                        cancelled={item.cancelled}
                        completed={item.isCompleted}
                        missed={missed}
                      />
                    )}
                  </div>

                  <div className="mx-3 mb-3 rounded-xl bg-gray-50/80 border border-gray-100 px-4 py-3 grid grid-cols-3 divide-x divide-gray-100">
                    <div className="flex flex-col gap-1 pr-3">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                          Date
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-700 leading-tight">
                        {slotDateFormat(item.slotDate)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 px-3">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                          Time
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-700">
                        {item.slotTime}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 pl-3">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Banknote className="w-3 h-3 shrink-0" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                          Fee
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-700">
                        {currency}
                        {item.amount}
                      </p>
                    </div>
                  </div>

                  {!item.cancelled && !item.isCompleted && !missed && (
                    <div className="flex items-center justify-between px-4 pb-3.5 gap-2">
                      <PaymentStatus item={item} missed={missed} />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            requestCancel(item._id, item.userData.name)
                          }
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 active:scale-95 transition-all"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                          onClick={() =>
                            requestComplete(item._id, item.userData.name)
                          }
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 active:scale-95 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" /> Done
                        </button>
                      </div>
                    </div>
                  )}

                  {(missed || item.cancelled || item.isCompleted) && (
                    <div className="flex items-center justify-between px-4 pb-3.5 gap-2">
                      <PaymentStatus item={item} missed={missed} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorAppointments;

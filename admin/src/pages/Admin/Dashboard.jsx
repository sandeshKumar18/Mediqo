import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import {
  Stethoscope,
  CalendarCheck,
  Users,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]);

  const stats = dashData
    ? [
        {
          label: "Total Doctors",
          value: dashData.doctors,
          icon: Stethoscope,
          iconColor: "text-blue-500",
          bg: "bg-blue-50",
          border: "border-blue-100",
        },
        {
          label: "Appointments",
          value: dashData.appointments,
          icon: CalendarCheck,
          iconColor: "text-emerald-500",
          bg: "bg-emerald-50",
          border: "border-emerald-100",
        },
        {
          label: "Total Patients",
          value: dashData.patients,
          icon: Users,
          iconColor: "text-violet-500",
          bg: "bg-violet-50",
          border: "border-violet-100",
        },
      ]
    : [];

  if (!dashData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#5f6FFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Overview of clinic activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, iconColor, bg, border }) => (
          <div
            key={label}
            className={`flex items-center gap-4 bg-white border ${border} rounded-2xl px-5 py-4`}
          >
            <div
              className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 tabular-nums">
                {value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Bookings */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="font-medium text-gray-700 text-sm">Latest Bookings</p>
          <span className="text-xs text-gray-400">
            {dashData.latestAppointments.length} recent
          </span>
        </div>

        {/* Column labels */}
        <div className="hidden sm:grid grid-cols-[2.5rem_1fr_auto_auto] gap-4 px-6 py-2 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          <span />
          <span>Doctor</span>
          <span>Date</span>
          <span className="text-center w-24">Status</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {dashData.latestAppointments.length === 0 ? (
            <div className="flex items-center justify-center py-14">
              <p className="text-gray-400 text-sm">No recent bookings</p>
            </div>
          ) : (
            dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[2.5rem_1fr_auto_auto] gap-4 items-center px-6 py-3.5 hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <img
                  className="w-9 h-9 rounded-full object-cover"
                  src={item.docData.image}
                  alt={item.docData.name}
                />

                {/* Name + Date */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.docData.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>

                {/* Date col (desktop) */}
                <span className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">
                  {slotDateFormat(item.slotDate)}
                </span>

                {/* Status */}
                <div className="w-24 flex justify-center">
                  {item.cancelled ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                      <X className="w-3 h-3" />
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

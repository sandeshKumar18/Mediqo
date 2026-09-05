import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiX,
} from "react-icons/fi";



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
  if (!slotDate) return "N/A";

  const [day, month, year] = String(slotDate).split("_");

  if (!day || !month || !year) {
    return slotDate;
  }

  return `${day} ${months[Number(month) - 1] || ""} ${year}`;
};

const parseSlotDate = (slotDate) => {
  if (!slotDate) return null;

  const [day, month, year] = String(slotDate)
    .split("_")
    .map(Number);

  if (!day || !month || !year) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const parseSlotDateTime = (slotDate, slotTime) => {
  const date = parseSlotDate(slotDate);

  if (!date) return null;

  if (!slotTime) {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  const time = String(slotTime).trim().toUpperCase();

  const match = time.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/
  );

  if (!match) {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || 0);
  const meridiem = match[4];

  if (meridiem === "PM" && hours !== 12) {
    hours += 12;
  }

  if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }

  date.setHours(hours, minutes, seconds, 0);

  return date;
};

const isSameDate = (date1, date2) => {
  if (!date1 || !date2) return false;

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};




const getAppointmentStatus = (item) => {
  const isPaidOnline = Boolean(item?.payment);
  const isCompleted = Boolean(item?.isCompleted);
  const isCancelled = Boolean(item?.cancelled);

  if (isPaidOnline) {
    return "online";
  }

  if (isCompleted) {
    return "cash";
  }
  if (isCancelled) {
    return "not-paid";
  }

  return "pending";
};


const getPaymentLabel = (item) => {
  const status = getAppointmentStatus(item);

  switch (status) {
    case "online":
      return "Online";

    case "cash":
      return "Cash";

    case "not-paid":
      return "Not Paid";

    case "pending":
    default:
      return "Pending";
  }
};



const StatusBadge = ({ item }) => {
  const status = getAppointmentStatus(item);

  const config = {
    online: {
      label: "Online",
      icon: FiCheckCircle,
      className:
        "text-blue-600 bg-blue-50 border-blue-100",
    },

    cash: {
      label: "Cash",
      icon: FiCheckCircle,
      className:
        "text-emerald-600 bg-emerald-50 border-emerald-100",
    },

    pending: {
      label: "Pending",
      icon: FiClock,
      className:
        "text-amber-600 bg-amber-50 border-amber-100",
    },

    "not-paid": {
      label: "Not Paid",
      icon: FiXCircle,
      className:
        "text-red-600 bg-red-50 border-red-100",
    },
  };

  const current = config[status] || config.pending;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold whitespace-nowrap ${current.className}`}
    >
      <Icon size={12} />
      {current.label}
    </span>
  );
};


const AppointmentSection = ({
  title,
  subtitle,
  count,
  icon: Icon,
  children,
}) => {
  return (
    <section className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary">
            <Icon size={18} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                {title}
              </h2>

              <span className="min-w-[24px] h-6 px-1.5 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold">
                {count}
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
};



const EmptySection = ({ message }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-5 py-9 text-center">
      <div className="w-11 h-11 mx-auto rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-3">
        <FiCalendar size={19} />
      </div>

      <p className="text-sm font-medium text-gray-500">
        {message}
      </p>
    </div>
  );
};


const AllAppointments = () => {
  const {
    aToken,
    appointments = [],
    getAllAppointments,
  } = useContext(AdminContext);

  const { calculateAge } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedAppointment, setExpandedAppointment] =
    useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);


  useEffect(() => {
    if (aToken && getAllAppointments) {
      getAllAppointments();
    }
  }, [aToken, getAllAppointments]);


  const handleRefresh = async () => {
    if (!aToken || !getAllAppointments) return;

    try {
      setIsRefreshing(true);

      await getAllAppointments();
    } catch (error) {
      console.error(
        "Failed to refresh appointments:",
        error
      );
    } finally {
      setIsRefreshing(false);
    }
  };




  const processedAppointments = useMemo(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const searchValue = search
      .toLowerCase()
      .trim();

    const filtered = appointments.filter((item) => {
      const patientName =
        item?.userData?.name?.toLowerCase() || "";

      const doctorName =
        item?.docData?.name?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        patientName.includes(searchValue) ||
        doctorName.includes(searchValue);

      const status = getAppointmentStatus(item);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    const result = {
      today: [],
      upcoming: [],
      past: [],
    };

    filtered.forEach((item) => {
      const appointmentDate = parseSlotDateTime(
        item?.slotDate,
        item?.slotTime
      );

      if (!appointmentDate) {
        result.past.push(item);
        return;
      }

      const appointmentDay = new Date(
        appointmentDate
      );

      appointmentDay.setHours(0, 0, 0, 0);

      if (isSameDate(appointmentDay, today)) {
        result.today.push(item);
      } else if (appointmentDay > today) {
        result.upcoming.push(item);
      } else {
        result.past.push(item);
      }
    });


    // Today's appointments
    result.today.sort((a, b) => {
      const dateA =
        parseSlotDateTime(
          a?.slotDate,
          a?.slotTime
        )?.getTime() || 0;

      const dateB =
        parseSlotDateTime(
          b?.slotDate,
          b?.slotTime
        )?.getTime() || 0;

      return dateA - dateB;
    });


    // Upcoming
    result.upcoming.sort((a, b) => {
      const dateA =
        parseSlotDateTime(
          a?.slotDate,
          a?.slotTime
        )?.getTime() || 0;

      const dateB =
        parseSlotDateTime(
          b?.slotDate,
          b?.slotTime
        )?.getTime() || 0;

      return dateA - dateB;
    });


    // Past
    result.past.sort((a, b) => {
      const dateA =
        parseSlotDateTime(
          a?.slotDate,
          a?.slotTime
        )?.getTime() || 0;

      const dateB =
        parseSlotDateTime(
          b?.slotDate,
          b?.slotTime
        )?.getTime() || 0;

      return dateB - dateA;
    });

    return result;
  }, [
    appointments,
    search,
    statusFilter,
  ]);

  const todayStatistics = useMemo(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let todayAppointments = 0;
    let todayCompleted = 0;
    let todayPending = 0;
    let todayPaid = 0;
    let todayCancelled = 0;

    appointments.forEach((item) => {
      const appointmentDate = parseSlotDate(
        item?.slotDate
      );

      if (!appointmentDate) return;

      appointmentDate.setHours(0, 0, 0, 0);

      if (!isSameDate(appointmentDate, today)) {
        return;
      }

      todayAppointments++;

      if (item?.isCompleted) {
        todayCompleted++;
      }

      if (item?.cancelled) {
        todayCancelled++;
      }

      if (
        !item?.cancelled &&
        !item?.isCompleted
      ) {
        todayPending++;
      }
     if (item?.payment) {
        todayPaid++;
      }
    });

    const todayRemaining =
      todayAppointments -
      todayCompleted -
      todayCancelled;

    return {
      todayAppointments,
      todayCompleted,
      todayPending,
      todayPaid,
      todayCancelled,
      todayRemaining:
        todayRemaining < 0
          ? 0
          : todayRemaining,
    };
  }, [appointments]);


  const AppointmentCard = ({
    item,
    index,
  }) => {
    const isExpanded =
      expandedAppointment === item?._id;

    const appointmentDateTime =
      parseSlotDateTime(
        item?.slotDate,
        item?.slotTime
      );

    const isPast =
      appointmentDateTime &&
      appointmentDateTime.getTime() <
        Date.now();

    const canCancel =
      !item?.cancelled &&
      !item?.isCompleted &&
      !isPast;

    const paymentLabel =
      getPaymentLabel(item);

    return (
      <div
        className={`bg-white border rounded-2xl shadow-sm transition-all duration-200 ${
          isExpanded
            ? "border-gray-200 shadow-md"
            : "border-gray-100 hover:border-gray-200 hover:shadow-md"
        }`}
      >

        <div className="hidden lg:grid grid-cols-[44px_minmax(180px,1.3fr)_70px_minmax(150px,1fr)_minmax(160px,1fr)_90px_110px_45px] gap-3 items-center px-5 py-4">

          <div className="text-xs text-gray-400 font-medium">
            {index + 1}
          </div>


          <div className="flex items-center gap-3 min-w-0">
            <img
              src={item?.userData?.image}
              alt={
                item?.userData?.name ||
                "Patient"
              }
              className="w-10 h-10 rounded-full object-cover bg-indigo-50 border border-gray-100 shrink-0"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {item?.userData?.name ||
                  "Unknown Patient"}
              </p>

              <p className="text-[11px] text-gray-400 truncate">
                Patient
              </p>
            </div>
          </div>


          <div className="text-sm text-gray-600">
            {item?.userData?.dob
              ? calculateAge(
                  item.userData.dob
                )
              : "—"}
          </div>


          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
              <FiCalendar
                size={13}
                className="text-gray-400 shrink-0"
              />

              <span className="truncate">
                {formatSlotDate(
                  item?.slotDate
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
              <FiClock size={12} />

              {item?.slotTime ||
                "Time not available"}
            </div>
          </div>
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={item?.docData?.image}
              alt={
                item?.docData?.name ||
                "Doctor"
              }
              className="w-9 h-9 rounded-full object-cover bg-gray-100 border border-gray-100 shrink-0"
            />

            <div className="min-w-0">
              <p className="text-sm text-gray-700 font-medium truncate">
                {item?.docData?.name ||
                  "Unknown Doctor"}
              </p>

              <p className="text-[11px] text-gray-400">
                Doctor
              </p>
            </div>
          </div>


          <div>
            <p className="text-sm font-semibold text-gray-800">
              ₹{item?.amount ?? 0}
            </p>

            <p className="text-[11px] text-gray-400">
              Consultation
            </p>
          </div>


          <div>
            <StatusBadge item={item} />
          </div>

        </div>


        <div className="lg:hidden p-4">

          <div className="flex items-start justify-between gap-3">

            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item?.userData?.image}
                alt={
                  item?.userData?.name ||
                  "Patient"
                }
                className="w-11 h-11 rounded-full object-cover bg-indigo-50 border border-gray-100 shrink-0"
              />

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item?.userData?.name ||
                    "Unknown Patient"}
                </p>

                <p className="text-xs text-gray-400 mt-0.5">
                  Age{" "}
                  {item?.userData?.dob
                    ? calculateAge(
                        item.userData.dob
                      )
                    : "—"}
                </p>
              </div>
            </div>

            <StatusBadge item={item} />
          </div>


          <div className="h-px bg-gray-100 my-4" />


          {/* Doctor */}
          <div className="flex items-center gap-3">
            <img
              src={item?.docData?.image}
              alt={
                item?.docData?.name ||
                "Doctor"
              }
              className="w-8 h-8 rounded-full object-cover bg-gray-100 border border-gray-100"
            />

            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">
                Doctor
              </p>

              <p className="text-sm font-medium text-gray-700 truncate">
                {item?.docData?.name ||
                  "Unknown Doctor"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">

            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
                <FiCalendar size={12} />
                Date
              </div>

              <p className="text-xs sm:text-sm font-semibold text-gray-700">
                {formatSlotDate(
                  item?.slotDate
                )}
              </p>

              <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400">
                <FiClock size={11} />

                {item?.slotTime ||
                  "N/A"}
              </div>
            </div>


            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[11px] text-gray-400 mb-1">
                Consultation Fee
              </p>

              <p className="text-sm sm:text-base font-bold text-gray-800">
                ₹{item?.amount ?? 0}
              </p>

              <p className="text-[11px] text-gray-400 mt-1">
                {paymentLabel}
              </p>
            </div>

          </div>

        </div>

      </div>
    );
  };


  const renderAppointmentList = (
    items,
    emptyMessage
  ) => {
    if (!items.length) {
      return (
        <EmptySection
          message={emptyMessage}
        />
      );
    }

    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <AppointmentCard
            key={
              item?._id ||
              `${item?.slotDate}-${item?.slotTime}-${index}`
            }
            item={item}
            index={index}
          />
        ))}
      </div>
    );
  };


  return (
    <div className="flex-1 min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-5 sm:py-7">

      <div className="max-w-[1600px] mx-auto">

        

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-7">

          <div>
            <div className="flex items-center gap-2">

              <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary">
                <FiCalendar size={18} />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Explore Appointments
              </h1>

            </div>

            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Manage today's appointments and view
              upcoming and previous appointments.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="self-start xl:self-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition text-xs sm:text-sm font-semibold disabled:opacity-60"
          >
            <FiRefreshCw
              size={15}
              className={
                isRefreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {isRefreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Today Statistics</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-7">
            
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
            <div className="flex items-center justify-between">

              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiCalendar size={17} />
              </div>

              <span className="text-xl font-bold text-gray-800">
                {
                  todayStatistics.todayAppointments
                }
              </span>

            </div>

            <p className="text-xs font-semibold text-gray-700 mt-3">
              Total appointments
            </p>
          </div>



          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-4">
            <div className="flex items-center justify-between">

              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiCheckCircle size={17} />
              </div>

              <span className="text-xl font-bold text-gray-800">
                {
                  todayStatistics.todayCompleted
                }
              </span>

            </div>

            <p className="text-xs font-semibold text-gray-700 mt-3">
              Completed
            </p>

          </div>



          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4">
            <div className="flex items-center justify-between">

              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FiClock size={17} />
              </div>

              <span className="text-xl font-bold text-gray-800">
                {
                  todayStatistics.todayPending
                }
              </span>

            </div>

            <p className="text-xs font-semibold text-gray-700 mt-3">
              Pending
            </p>
          </div>



          <div className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-4">
            <div className="flex items-center justify-between">

              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <FiCheckCircle size={17} />
              </div>

              <span className="text-xl font-bold text-gray-800">
                {todayStatistics.todayPaid}
              </span>

            </div>

            <p className="text-xs font-semibold text-gray-700 mt-3">
              Online Paid
            </p>

            
          </div>



          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-4">
            <div className="flex items-center justify-between">

              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <FiXCircle size={17} />
              </div>

              <span className="text-xl font-bold text-gray-800">
                {
                  todayStatistics.todayCancelled
                }
              </span>

            </div>

            <p className="text-xs font-semibold text-gray-700 mt-3">
              Cancelled
            </p>

          </div>



          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4">
            <div className="flex items-center justify-between">

              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FiAlertCircle size={17} />
              </div>

              <span className="text-xl font-bold text-gray-800">
                {
                  todayStatistics.todayRemaining
                }
              </span>

            </div>

            <p className="text-xs font-semibold text-gray-700 mt-3">
              Remaining
            </p>
          </div>

        </div>


        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 mb-7">

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">

              <FiSearch
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search patient or doctor..."
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:bg-white focus:border-gray-300 transition"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  title="Clear search"
                >
                  <FiX size={16} />
                </button>
              )}

            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  !showFilters
                )
              }
              className={`h-11 px-4 rounded-xl border inline-flex items-center justify-center gap-2 text-sm font-medium transition ${
                showFilters ||
                statusFilter !== "all"
                  ? "bg-gray-900 border-gray-900 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FiFilter size={15} />

              Filter

              {statusFilter !== "all" && (
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  1
                </span>
              )}
            </button>

          </div>


          {/* FILTER OPTIONS */}

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">

              <div className="flex flex-wrap gap-2">

                {[
                  ["all", "All"],
                  ["pending", "Pending"],
                  ["online", "Online"],
                  ["cash", "Cash"],
                  ["not-paid", "Not Paid"],
                ].map(
                  ([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() =>
                        setStatusFilter(
                          value
                        )
                      }
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                        statusFilter ===
                        value
                          ? "bg-gray-900 text-white"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}

              </div>
            </div>
          )}


          {/* FILTER SUMMARY */}

          {(search ||
            statusFilter !==
              "all") && (
            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">

              <span>
                Showing{" "}
                {processedAppointments
                  .today.length +
                  processedAppointments
                    .upcoming.length +
                  processedAppointments
                    .past.length}{" "}
                matching appointment
                {(
                  processedAppointments
                    .today.length +
                  processedAppointments
                    .upcoming.length +
                  processedAppointments
                    .past.length
                ) !== 1
                  ? "s"
                  : ""}
              </span>


              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter(
                    "all"
                  );
                }}
                className="text-gray-600 hover:text-gray-900 font-semibold"
              >
                Clear filters
              </button>

            </div>
          )}

        </div>


        <div className="hidden lg:grid grid-cols-[50px_minmax(180px,1.3fr)_70px_minmax(150px,1fr)_minmax(160px,1fr)_90px_110px_45px] gap-3 px-5 mb-2 text-[10px] uppercase tracking-wider font-bold text-gray-400">

          <span>Slot No.</span>
          <span>Patient</span>
          <span>Age</span>
          <span>Date & Time</span>
          <span>Doctor</span>
          <span>Fee</span>
          <span>Payment</span>
          

        </div>


        
        <AppointmentSection
          title="Today's Appointments"
          //subtitle="Today's scheduled appointments"
          count={
            processedAppointments
              .today.length
          }
          icon={FiClock}
        >
          {renderAppointmentList(
            processedAppointments.today,
            "No appointments scheduled for today."
          )}
        </AppointmentSection>


      
        <AppointmentSection
          title="Upcoming Appointments"
          count={
            processedAppointments
              .upcoming.length
          }
          icon={FiCalendar}
        >
          {renderAppointmentList(
            processedAppointments.upcoming,
            "No upcoming appointments found."
          )}
        </AppointmentSection>

       
        <AppointmentSection
          title="Past Appointments"
          count={
            processedAppointments
              .past.length
          }
          icon={FiCheckCircle}
        >
          {renderAppointmentList(
            processedAppointments.past,
            "No past appointments found."
          )}
        </AppointmentSection>


       
        {appointments.length ===
          0 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-16 px-5 text-center">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
              <FiCalendar
                size={24}
              />
            </div>

            <h3 className="text-base font-semibold text-gray-700">
              No appointments yet
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Appointments will appear
              here once patients start
              booking.
            </p>

          </div>
        )}


        
        {appointments.length >
          0 &&
          processedAppointments
            .today.length ===
            0 &&
          processedAppointments
            .upcoming.length ===
            0 &&
          processedAppointments
            .past.length ===
            0 && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-16 px-5 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
                <FiSearch
                  size={24}
                />
              </div>

              <h3 className="text-base font-semibold text-gray-700">
                No matching appointments
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Try changing the
                search text or payment
                filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter(
                    "all"
                  );
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition"
              >
                Clear Search
              </button>

            </div>
          )}

      </div>
    </div>
  );
};

export default AllAppointments;
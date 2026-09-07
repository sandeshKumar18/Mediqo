import React, { useEffect, useMemo, useState } from "react";
import {
  IndianRupee,
  CalendarDays,
  Users,
  Stethoscope,
  CreditCard,
  Banknote,
  RefreshCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_ENDPOINT = import.meta.env.VITE_BACKEND_URL+"/api/admin/revenue";
const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};

const formatNumber = (value = 0) => {
  return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
};

const getDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStartOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getToday = () => new Date();

const DEFAULT_DATA = {
  totalRevenue: 0,
  totalAppointments: 0,
  totalPatients: 0,
  totalDoctors: 0,
  onlineRevenue: 0,
  cashRevenue: 0,
  refundedAmount: 0,
  pendingAmount: 0,
  revenueGrowth: 0,
  chart: [],
  doctors: [],
};

const Revenue = () => {
  const [dateFrom, setDateFrom] = useState(
    getDateString(getStartOfMonth())
  );

  const [dateTo, setDateTo] = useState(
    getDateString(getToday())
  );

  const [data, setData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const doctorsPerPage = 8;

 

  const fetchRevenue = async (showRefresh = false) => {
  try {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    const query = new URLSearchParams({
      from: dateFrom,
      to: dateTo,
    });

    const token = localStorage.getItem("aToken");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.atoken = token;
    }

    // console.log("Revenue aToken:", token);

    const response = await fetch(
      `${API_ENDPOINT}?${query.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message || "Failed to fetch revenue data"
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.message || "Unable to load revenue data"
      );
    }

    setData({
      ...DEFAULT_DATA,
      ...(result.data || {}),
      chart: Array.isArray(result?.data?.chart)
        ? result.data.chart
        : [],
      doctors: Array.isArray(result?.data?.doctors)
        ? result.data.doctors
        : [],
    });
  } catch (err) {
    console.error("Revenue fetch error:", err);

    setError(
      err?.message ||
        "Something went wrong while loading revenue data."
    );

    setData(DEFAULT_DATA);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};



  useEffect(() => {
    fetchRevenue();
  }, [dateFrom, dateTo]);


  const filteredDoctors = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return data.doctors;
    }

    return data.doctors.filter((doctor) =>
      String(doctor.name || "")
        .toLowerCase()
        .includes(term)
    );
  }, [data.doctors, search]);

 

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDoctors.length / doctorsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedDoctors = useMemo(() => {
    const start =
      (safeCurrentPage - 1) * doctorsPerPage;

    return filteredDoctors.slice(
      start,
      start + doctorsPerPage
    );
  }, [
    filteredDoctors,
    safeCurrentPage,
    doctorsPerPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

 

  const dateRangeLabel = useMemo(() => {
    try {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);

      return `${from.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} - ${to.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    } catch {
      return "";
    }
  }, [dateFrom, dateTo]);

  

  const resetDateFilter = () => {
    setDateFrom(getDateString(getStartOfMonth()));
    setDateTo(getDateString(getToday()));
  };

 

  const summaryCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      subtitle: dateRangeLabel,
      icon: IndianRupee,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Appointments",
      value: formatNumber(data.totalAppointments),
      subtitle: "Appointments in selected period",
      icon: CalendarDays,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Patients",
      value: formatNumber(data.totalPatients),
      subtitle: "Patients served",
      icon: Users,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Total Doctors",
      value: formatNumber(data.totalDoctors),
      subtitle: "Doctors generating activity",
      icon: Stethoscope,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="w-full bg-white min-h-screen p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Revenue
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Monitor platform revenue and appointment performance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* FROM DATE */}
          <div className="relative">
            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="date"
              value={dateFrom}
              max={dateTo}
              onChange={(e) =>
                setDateFrom(e.target.value)
              }
              className="h-10 pl-9 pr-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* TO DATE */}
          <div className="relative">
            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              max={getDateString(getToday())}
              onChange={(e) =>
                setDateTo(e.target.value)
              }
              className="h-10 pl-9 pr-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={resetDateFilter}
            className="h-10 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Reset
          </button>

              {/* // refresh button */}
          <button
            type="button"
            onClick={() => fetchRevenue(true)}
            disabled={refreshing}
            className="h-10 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
          >
            {refreshing ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <RefreshCcw size={16} />
            )}

            Refresh
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-xl flex items-start gap-3">
          <AlertCircle
            size={20}
            className="text-red-600 mt-0.5 shrink-0"
          />

          <div>
            <p className="font-medium text-red-800">
              Unable to load revenue
            </p>
            
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={32}
              className="animate-spin text-blue-600"
            />

            <p className="text-sm text-gray-500">
              Loading revenue data...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        {card.title}
                      </p>

                      <h2 className="text-2xl font-bold text-gray-900 mt-2">
                        {card.value}
                      </h2>
                    </div>

                    <div
                      className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-4">
                    {card.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {/* ONLINE */}
            <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CreditCard size={19} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Online Revenue
                  </p>

                  <p className="font-bold text-lg text-gray-900">
                    {formatCurrency(data.onlineRevenue)}
                  </p>
                </div>
              </div>
            </div>

            {/* CASH */}
            <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Banknote size={19} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Cash Revenue
                  </p>

                  <p className="font-bold text-lg text-gray-900">
                    {formatCurrency(data.cashRevenue)}
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900">
                Revenue Breakdown
              </h2>

              <p className="text-xs text-gray-500 mt-1 mb-6">
                How the platform generated revenue
              </p>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Online
                    </span>

                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(data.onlineRevenue)}
                    </span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${
                          data.totalRevenue > 0
                            ? Math.min(
                                100,
                                (data.onlineRevenue /
                                  data.totalRevenue) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Cash
                    </span>

                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(data.cashRevenue)}
                    </span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${
                          data.totalRevenue > 0
                            ? Math.min(
                                100,
                                (data.cashRevenue /
                                  data.totalRevenue) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Total Collected
                    </span>

                    <span className="font-bold text-gray-900">
                      {formatCurrency(data.totalRevenue)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">
                      Pending
                    </span>

                    <span className="font-semibold text-amber-600">
                      {formatCurrency(data.pendingAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">
                      Refunded
                    </span>

                    <span className="font-semibold text-red-600">
                      {formatCurrency(data.refundedAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="font-bold text-gray-900">
                    Revenue by Doctor
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Compare doctor activity and revenue generation
                  </p>
                </div>

                <div className="relative w-full lg:w-72">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search doctor..."
                    className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {paginatedDoctors.length === 0 ? (
              <div className="py-16 text-center">
                <Stethoscope
                  size={30}
                  className="mx-auto text-gray-300 mb-3"
                />

                <p className="text-sm text-gray-500">
                  No doctor revenue data found.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Doctor
                        </th>

                        <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Appointments
                        </th>

                        <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Patients
                        </th>

                        <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Revenue
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {paginatedDoctors.map(
                        (doctor, index) => (
                          <tr
                            key={
                              doctor.id ||
                              doctor._id ||
                              index
                            }
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                                  {String(
                                    doctor.name ||
                                      "Doctor"
                                  )
                                    .replace("Dr.", "")
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {doctor.name ||
                                      "Unknown Doctor"}
                                  </p>

                                  {doctor.speciality && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {doctor.speciality}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-center text-sm text-gray-700 font-medium">
                              {formatNumber(
                                doctor.appointments
                              )}
                            </td>

                            <td className="px-5 py-4 text-center text-sm text-gray-700 font-medium">
                              {formatNumber(
                                doctor.patients
                              )}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <span className="font-bold text-gray-900">
                                {formatCurrency(
                                  doctor.revenue
                                )}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    {filteredDoctors.length === 0
                      ? 0
                      : (safeCurrentPage - 1) *
                          doctorsPerPage +
                        1}{" "}
                    -{" "}
                    {Math.min(
                      safeCurrentPage *
                        doctorsPerPage,
                      filteredDoctors.length
                    )}{" "}
                    of {filteredDoctors.length} doctors
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safeCurrentPage <= 1}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.max(1, page - 1)
                        )
                      }
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    <span className="text-sm text-gray-600 min-w-[70px] text-center">
                      Page {safeCurrentPage} of{" "}
                      {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={
                        safeCurrentPage >= totalPages
                      }
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(
                            totalPages,
                            page + 1
                          )
                        )
                      }
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Revenue;
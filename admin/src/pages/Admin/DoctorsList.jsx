import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AdminContext } from "../../context/AdminContext";

import {
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiTrash2,
  FiMoreVertical,
  FiX,
  FiSave,
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiBookOpen,
  FiPhone,
} from "react-icons/fi";

const DoctorsList = () => {
  const {
    doctors = [],
    aToken,
    getAllDoctors,
    changeAvailability,
    removeDoctor,
  } = useContext(AdminContext);

  
  const [search, setSearch] = useState("");

  const [availabilityFilter, setAvailabilityFilter] =
    useState("all");

  const [sortBy, setSortBy] = useState("name");

  const [showFilters, setShowFilters] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);

  
  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    speciality: "",
    degree: "",
    experience: "",
    fees: "",
    address: "",
    phone: "",
    about: "",
    image: "",
  });

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    if (openMenu !== null) {
      document.addEventListener(
        "click",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, [openMenu]);


  const handleRefresh = async () => {
    if (!aToken || !getAllDoctors) return;

    try {
      setIsRefreshing(true);
      await getAllDoctors();
    } catch (error) {
      console.error(
        "Failed to refresh doctors:",
        error
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAvailability = async (doctorId) => {
    if (!doctorId || !changeAvailability) return;

    try {
      setOpenMenu(null);
      await changeAvailability(doctorId);
    } catch (error) {
      console.error(
        "Failed to change availability:",
        error
      );
    }
  };

  
  const handleRemoveDoctor = async (doctor) => {
    if (!doctor?._id || !removeDoctor) return;

    setOpenMenu(null);

    const doctorName =
      doctor?.name || "this doctor";

    const confirmed = window.confirm(
      `Are you sure you want to remove Dr. ${doctorName}?\n\nThis action cannot be easily undone.`
    );

    if (!confirmed) return;

    try {
      await removeDoctor(doctor._id);
    } catch (error) {
      console.error(
        "Failed to remove doctor:",
        error
      );
    }
  };

  
  const openEditModal = (doctor) => {
    setOpenMenu(null);
    setSelectedDoctor(doctor);

    let doctorAddress = "";

    if (typeof doctor?.address === "string") {
      doctorAddress = doctor.address;
    } else if (doctor?.address) {
      doctorAddress =
        doctor?.address?.line1 ||
        doctor?.address?.line2 ||
        "";
    }

    setEditForm({
      name: doctor?.name || "",
      speciality: doctor?.speciality || "",
      degree: doctor?.degree || "",
      experience: doctor?.experience || "",
      fees:
        doctor?.fees ??
        doctor?.feesPerConsultation ??
        doctor?.amount ??
        "",
      address: doctorAddress,
      phone: doctor?.phone || "",
      about: doctor?.about || "",
      image: doctor?.image || "",
    });

    setShowEditModal(true);
  };

 
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedDoctor(null);

    setEditForm({
      name: "",
      speciality: "",
      degree: "",
      experience: "",
      fees: "",
      address: "",
      phone: "",
      about: "",
      image: "",
    });
  };

  
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     SAVE EDIT FORM
     
     NOTE:
     Your current AdminContext does not expose an
     updateDoctor function, so this UI is prepared
     for the API connection.
  ===================================================== */

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();

    if (!selectedDoctor) return;

    console.log("Doctor update data:", {
      doctorId: selectedDoctor._id,
      ...editForm,
    });

    alert(
      "Edit form is ready. Connect your updateDoctor API in AdminContext to save these changes."
    );

    closeEditModal();
  };

 
  const filteredDoctors = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    const result = doctors.filter((doctor) => {
      const name =
        doctor?.name?.toLowerCase() || "";

      const speciality =
        doctor?.speciality?.toLowerCase() || "";

      const degree =
        doctor?.degree?.toLowerCase() || "";

      const experience =
        String(
          doctor?.experience || ""
        ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        speciality.includes(searchValue) ||
        degree.includes(searchValue) ||
        experience.includes(searchValue);

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" &&
          doctor?.available) ||
        (availabilityFilter === "unavailable" &&
          !doctor?.available);

      return (
        matchesSearch &&
        matchesAvailability
      );
    });


    result.sort((a, b) => {
      if (sortBy === "name") {
        return (
          (a?.name || "").localeCompare(
            b?.name || ""
          )
        );
      }

      if (sortBy === "name-desc") {
        return (
          (b?.name || "").localeCompare(
            a?.name || ""
          )
        );
      }

      if (sortBy === "available") {
        return (
          Number(b?.available) -
          Number(a?.available)
        );
      }

      if (sortBy === "unavailable") {
        return (
          Number(a?.available) -
          Number(b?.available)
        );
      }

      return 0;
    });

    return result;
  }, [
    doctors,
    search,
    availabilityFilter,
    sortBy,
  ]);

  
  const statistics = useMemo(() => {
    const total = doctors.length;

    const available = doctors.filter(
      (doctor) => doctor?.available
    ).length;

    return {
      total,
      available,
      unavailable:
        total - available,
    };
  }, [doctors]);

 
  const clearFilters = () => {
    setSearch("");
    setAvailabilityFilter("all");
    setSortBy("name");
  };

  const hasActiveFilters = Boolean(search) || availabilityFilter !== "all" || sortBy !== "name";


  const DoctorRow = ({ doctor }) => {
    const doctorName =
      doctor?.name || "Unknown Doctor";

    const specialty =
      doctor?.speciality ||
      "Speciality not available";

    const fee =
      doctor?.fees ??
      doctor?.feesPerConsultation ??
      doctor?.amount;

    return (
      <div className="group bg-white border border-gray-100 rounded-2xl px-3 sm:px-4 lg:px-5 py-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200">

        <div className="hidden lg:grid grid-cols-[minmax(230px,1.5fr)_minmax(150px,1fr)_130px_120px_130px_170px] gap-4 items-center">

          <div className="flex items-center gap-3 min-w-0">

            {doctor?.image ? (
              <img
                src={doctor.image}
                alt={doctorName}
                className="w-11 h-11 rounded-full object-cover border border-gray-100 bg-gray-50 shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                <FiUser size={19} />
              </div>
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {doctorName}
              </p>

              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {specialty}
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-600 truncate">
              {doctor?.degree || "—"}
            </p>
          </div>


          <div>
            <p className="text-xs font-medium text-gray-600">
              {doctor?.experience || "—"}
            </p>
          </div>


          <div>
            
            <p className="text-xs font-semibold text-gray-700">
              {fee !== undefined &&
              fee !== null &&
              fee !== ""
                ? `₹${fee}`
                : "—"}
            </p>
          </div>


          <div>
            <button
              type="button"
              onClick={() =>
                handleAvailability(
                  doctor?._id
                )
              }
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition ${
                doctor?.available
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                  : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  doctor?.available
                    ? "bg-emerald-500"
                    : "bg-gray-400"
                }`}
              />

              {doctor?.available
                ? "Available"
                : "Unavailable"}
            </button>
          </div>


          <div className="flex items-center justify-end gap-2">

            <button
              type="button"
              onClick={() =>
                openEditModal(doctor)
              }
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 text-xs font-semibold transition"
            >
              <FiEdit3 size={13} />
              Edit
            </button>


            <button
              type="button"
              onClick={() =>
                handleRemoveDoctor(
                  doctor
                )
              }
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition"
            >
              <FiTrash2 size={13} />
              Remove
            </button>
          </div>
        </div>

       

        <div className="lg:hidden">

          <div className="flex items-start gap-3">


            {doctor?.image ? (
              <img
                src={doctor.image}
                alt={doctorName}
                className="w-12 h-12 rounded-full object-cover border border-gray-100 bg-gray-50 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                <FiUser size={20} />
              </div>
            )}


            <div className="flex-1 min-w-0">

              <div className="flex items-start justify-between gap-2">

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {doctorName}
                  </p>

                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {specialty}
                  </p>
                </div>


                <div
                  className="relative shrink-0"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu ===
                          doctor?._id
                          ? null
                          : doctor?._id
                      )
                    }
                    className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  >
                    <FiMoreVertical
                      size={16}
                    />
                  </button>

                  {openMenu ===
                    doctor?._id && (
                    <div className="absolute right-0 top-10 z-20 w-44 bg-white border border-gray-100 rounded-xl shadow-xl p-1">

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            doctor
                          )
                        }
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
                      >
                        <FiEdit3
                          size={14}
                        />
                        Edit Doctor
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleAvailability(
                            doctor?._id
                          )
                        }
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
                      >
                        <FiCheckCircle
                          size={14}
                        />

                        {doctor?.available
                          ? "Set Unavailable"
                          : "Set Available"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveDoctor(
                            doctor
                          )
                        }
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-red-600 hover:bg-red-50"
                      >
                        <FiTrash2
                          size={14}
                        />
                        Remove Doctor
                      </button>
                    </div>
                  )}
                </div>
              </div>


              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">

                <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                  <FiBookOpen size={12} />
                  {doctor?.degree ||
                    "Degree —"}
                </span>

                <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                  <FiBriefcase
                    size={12}
                  />
                  {doctor?.experience ||
                    "Experience —"}
                </span>

                <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                  <FiDollarSign
                    size={12}
                  />

                  {fee !== undefined &&
                  fee !== null &&
                  fee !== ""
                    ? `₹${fee}`
                    : "Fee —"}
                </span>
              </div>


              <div className="mt-3">

                <button
                  type="button"
                  onClick={() =>
                    handleAvailability(
                      doctor?._id
                    )
                  }
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition ${
                    doctor?.available
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-gray-50 text-gray-500 border-gray-100"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      doctor?.available
                        ? "bg-emerald-500"
                        : "bg-gray-400"
                    }`}
                  />

                  {doctor?.available
                    ? "Available"
                    : "Unavailable"}
                </button>
              </div>
            </div>
          </div>
        </div>

     

        <div className="hidden md:flex lg:hidden items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100">

          <button
            type="button"
            onClick={() =>
              openEditModal(doctor)
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
          >
            <FiEdit3 size={13} />
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              handleAvailability(
                doctor?._id
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
          >
            <FiCheckCircle
              size={13}
            />

            {doctor?.available
              ? "Disable"
              : "Enable"}
          </button>

          <button
            type="button"
            onClick={() =>
              handleRemoveDoctor(
                doctor
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
          >
            <FiTrash2 size={13} />
            Remove
          </button>
        </div>
      </div>
    );
  };

 
  const EmptyState = () => {
    const noResults =
      doctors.length > 0 &&
      filteredDoctors.length === 0;

    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-16 px-5 text-center">

        <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4">

          {noResults ? (
            <FiSearch size={24} />
          ) : (
            <FiUsers size={24} />
          )}
        </div>

        <h3 className="text-base font-semibold text-gray-700">
          {noResults
            ? "No doctors found"
            : "No doctors yet"}
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          {noResults
            ? "Try changing your search or filters."
            : "Doctors you add will appear here."}
        </p>

        {noResults && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  };

  
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-5 sm:py-7">

      <div className="max-w-[1500px] mx-auto">

       

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary">
                <FiUsers size={19} />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Doctors
                </h1>

                <p className="text-xs text-gray-400 mt-0.5">
                  Manage your doctors and their availability.
                </p>
              </div>
            </div>
          </div>


          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="self-start sm:self-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 text-xs sm:text-sm font-semibold transition disabled:opacity-60"
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


        <div className="grid grid-cols-3 gap-3 mb-7">


          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">

            <div className="flex items-center justify-between">

              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FiUsers size={17} />
              </div>

              <span className="text-xl font-bold text-gray-800">
                {statistics.total}
              </span>
            </div>

            <p className="text-xs font-semibold text-gray-700 mt-3">
              Total Doctors
            </p>

            <p className="hidden sm:block text-[10px] text-gray-400 mt-0.5">
              Registered doctors
            </p>
          </div>


          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-4">

            <div className="flex items-center justify-between">

              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiCheckCircle size={17} />
              </div>

              <span className="text-xl font-bold text-gray-800">
                {statistics.available}
              </span>
            </div>

            <p className="text-xs font-semibold text-gray-700 mt-3">
              Available
            </p>

            <p className="hidden sm:block text-[10px] text-gray-400 mt-0.5">
              Currently available
            </p>
          </div>


          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">

            <div className="flex items-center justify-between">

              <div className="w-9 h-9 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center">
                <FiXCircle size={17} />
              </div>

              <span className="text-xl font-bold text-gray-800">
                {statistics.unavailable}
              </span>
            </div>

            <p className="text-xs font-semibold text-gray-700 mt-3">
              Unavailable
            </p>

            <p className="hidden sm:block text-[10px] text-gray-400 mt-0.5">
              Currently unavailable
            </p>
          </div>

        </div>

      
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 mb-5">

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
                placeholder="Search by doctor, speciality or degree..."
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:bg-white focus:border-gray-300 transition"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
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
                availabilityFilter !==
                  "all"
                  ? "bg-gray-900 border-gray-900 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FiFilter size={15} />
              Filter

              {availabilityFilter !==
                "all" && (
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  1
                </span>
              )}
            </button>

            {/* SORT */}

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none focus:border-gray-300 cursor-pointer"
            >
              <option value="name">
                Name A-Z
              </option>

              <option value="name-desc">
                Name Z-A
              </option>

              <option value="available">
                Available First
              </option>

              <option value="unavailable">
                Unavailable First
              </option>
            </select>
          </div>


          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">

              <div className="flex flex-wrap gap-2">

                {[
                  ["all", "All Doctors"],
                  [
                    "available",
                    "Available",
                  ],
                  [
                    "unavailable",
                    "Unavailable",
                  ],
                ].map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setAvailabilityFilter(
                          value
                        )
                      }
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                        availabilityFilter ===
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


          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">

              <p className="text-[11px] text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600">
                  {filteredDoctors.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600">
                  {doctors.length}
                </span>{" "}
                doctors
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                <FiX size={12} />
                Clear
              </button>
            </div>
          )}
        </div>

       
        <div className="flex items-center justify-between mb-3">

          <div>
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
              Doctor List
            </h2>

            <p className="text-[11px] text-gray-400 mt-0.5">
              {filteredDoctors.length} doctors
              displayed
            </p>
          </div>

        </div>

      
        {filteredDoctors.length > 0 && (
          <div className="hidden lg:grid grid-cols-[minmax(230px,1.5fr)_minmax(150px,1fr)_130px_120px_130px_170px] gap-4 px-5 py-2.5 mb-2 text-[10px] uppercase tracking-wider font-bold text-gray-400">

            <span>Doctor</span>
            <span>Degree</span>
            <span>Experience</span>
            <span>Fee</span>
            <span>Status</span>
            <span className="text-right">
              Actions
            </span>
          </div>
        )}

      
        <div className="space-y-2.5">

          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(
              (doctor) => (
                <DoctorRow
                  key={doctor?._id}
                  doctor={doctor}
                />
              )
            )
          ) : (
            <EmptyState />
          )}

        </div>

      </div>

      
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeEditModal();
            }
          }}
        >

          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 sm:px-6 py-4 flex items-center justify-between">

              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-800">
                  Edit Doctor
                </h2>

                <p className="text-xs text-gray-400 mt-0.5">
                  Update doctor profile details
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                className="w-9 h-9 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800 flex items-center justify-center transition"
              >
                <FiX size={18} />
              </button>
            </div>


            <form
              onSubmit={
                handleUpdateDoctor
              }
              className="p-5 sm:p-6"
            >

              <div className="flex flex-col sm:flex-row gap-5 mb-6">

                <div className="w-28 h-28 shrink-0 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">

                  {editForm.image ? (
                    <img
                      src={
                        editForm.image
                      }
                      alt="Doctor"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FiUser
                      size={35}
                      className="text-gray-300"
                    />
                  )}

                </div>

                <div className="flex-1">

                  <p className="text-sm font-semibold text-gray-700">
                    Profile Image
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Image URL
                  </p>

                  <input
                    type="text"
                    name="image"
                    value={
                      editForm.image
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Enter image URL"
                    className="w-full h-10 mt-3 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-gray-400"
                  />

                </div>
              </div>


              <div className="mb-6">

                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Doctor Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={
                        editForm.name
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="Doctor name"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Speciality
                    </label>

                    <input
                      type="text"
                      name="speciality"
                      value={
                        editForm.speciality
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="e.g. Cardiologist"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Degree
                    </label>

                    <input
                      type="text"
                      name="degree"
                      value={
                        editForm.degree
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="e.g. MBBS, MD"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Experience
                    </label>

                    <input
                      type="text"
                      name="experience"
                      value={
                        editForm.experience
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="e.g. 8 Years"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Consultation Fee
                    </label>

                    <input
                      type="number"
                      name="fees"
                      value={
                        editForm.fees
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="500"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-gray-400"
                    />
                  </div>


                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Phone
                    </label>

                    <div className="relative">
                      <FiPhone
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="phone"
                        value={
                          editForm.phone
                        }
                        onChange={
                          handleFormChange
                        }
                        placeholder="Phone number"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>


                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Address
                    </label>

                    <div className="relative">
                      <FiMapPin
                        size={14}
                        className="absolute left-3 top-3 text-gray-400"
                      />

                      <input
                        type="text"
                        name="address"
                        value={
                          editForm.address
                        }
                        onChange={
                          handleFormChange
                        }
                        placeholder="Clinic / hospital address"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>

                </div>
              </div>


              <div className="mb-6">

                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                  About Doctor
                </h3>

                <textarea
                  name="about"
                  value={
                    editForm.about
                  }
                  onChange={
                    handleFormChange
                  }
                  rows={5}
                  placeholder="Write information about the doctor..."
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-gray-400 resize-none"
                />
              </div>


              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-gray-100">

                <button
                  type="button"
                  onClick={
                    closeEditModal
                  }
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 text-sm font-semibold inline-flex items-center justify-center gap-2 transition"
                >
                  <FiSave size={15} />
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
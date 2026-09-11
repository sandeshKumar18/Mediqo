import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Stethoscope,
  X,
  SlidersHorizontal,
} from "lucide-react";

const specialties = [
  "All Specialties",
  "General Physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Gastroenterologist",
  "Cardiologist",
  "Orthopedic",
  "Psychologist",
  "Dentist",
  "Neurosurgeon",
  "General Surgeon",
  "Plastic Surgeon",
  "Heart & Chest Surgeon",
  "Radiologist",
  "Pathologist",
  "Allergist",
  "Infectious Disease Specialist",
  "Physiotherapist",
  "Nutritionist",
  "Ayurvedic Doctor",
  "Homeopathic Doctor",
  "Psychiatrist",
];

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] =
    useState("All Specialties");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  
  useEffect(() => {
    if (speciality) {
      const matchingSpecialty = specialties.find(
        (item) => item.toLowerCase() === speciality.toLowerCase()
      );

      if (matchingSpecialty) {
        setSelectedSpecialty(matchingSpecialty);
      }
    } else {
      setSelectedSpecialty("All Specialties");
    }
  }, [speciality]);

  const displayedDoctors = useMemo(() => {
    let result = Array.isArray(doctors) ? [...doctors] : [];

    const searchText = search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((doc) => {
        const name = doc.name?.toLowerCase() || "";
        const doctorSpecialty = doc.speciality?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          doctorSpecialty.includes(searchText)
        );
      });
    }

    if (selectedSpecialty !== "All Specialties") {
      result = result.filter(
        (doc) =>
          doc.speciality?.toLowerCase() ===
          selectedSpecialty.toLowerCase()
      );
    }

    if (showAvailableOnly) {
      result = result.filter((doc) => doc.available);
    }

    return result;
  }, [doctors, search, selectedSpecialty, showAvailableOnly]);

  const clearFilters = () => {
    setSearch("");
    setSelectedSpecialty("All Specialties");
    setShowAvailableOnly(false);

    if (speciality) {
      navigate("/doctors");
    }
  };

  const hasActiveFilters =
    search.trim() ||
    selectedSpecialty !== "All Specialties" ||
    showAvailableOnly ||
    speciality;

  return (
    <div className="min-h-screen bg-gray-50/60 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">

        
        <div className="mb-7 sm:mb-9">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

            <div>
              <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                <Stethoscope className="w-4 h-4" />
                Healthcare professionals
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Find the Right Doctor
              </h1>

              <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-2xl">
                Search doctors by name or specialty and find the right
                healthcare professional for your needs.
              </p>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-3 min-w-[145px]">
              <p className="text-xs text-gray-400">
                Doctors found
              </p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {displayedDoctors.length}
              </p>
            </div>
          </div>
        </div>

        
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3 sm:p-4 mb-6">

          <div className="flex flex-col xl:flex-row gap-3">

            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor name or specialty..."
                className="w-full h-12 pl-12 pr-11 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative w-full xl:w-60">
              <SlidersHorizontal
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              />

              <select
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);

                  if (speciality) {
                    navigate("/doctors");
                  }
                }}
                className={`appearance-none w-full h-12 pl-11 pr-10 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition cursor-pointer ${
                  selectedSpecialty !== "All Specialties"
                    ? "bg-primary/5 border-primary/20 text-primary"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
                aria-label="Filter by specialty"
              >
                {specialties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowAvailableOnly((prev) => !prev)
              }
              className={`h-12 px-5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                showAvailableOnly
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />

              {showAvailableOnly
                ? "Available only"
                : "Available doctors"}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-12 px-4 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">

              <span className="text-xs text-gray-400 mr-1">
                Active filters:
              </span>

              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                  Search: "{search}"
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="hover:text-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSpecialty !== "All Specialties" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {selectedSpecialty}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSpecialty("All Specialties")
                    }
                    className="hover:text-primary/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {showAvailableOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                  Available only

                  <button
                    type="button"
                    onClick={() =>
                      setShowAvailableOnly(false)
                    }
                    className="hover:text-emerald-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

          <div>
            <p className="text-sm font-semibold text-gray-800">
              {displayedDoctors.length} doctor
              {displayedDoctors.length !== 1 ? "s" : ""}
            </p>

            <p className="text-xs text-gray-400 mt-0.5">
              {selectedSpecialty !== "All Specialties"
                ? `Showing ${selectedSpecialty.toLowerCase()} specialists`
                : "Available healthcare professionals"}
            </p>
          </div>

          {showAvailableOnly && (
            <div className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Available for booking
            </div>
          )}
        </div>

        {/* No doctor */}
        {displayedDoctors.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl py-20 px-6 text-center shadow-sm">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <Search className="w-7 h-7 text-primary" />
            </div>

            <h3 className="font-semibold text-gray-800">
              No doctors found
            </h3>

            <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
              We couldn't find a doctor matching your current
              search or filters. Try changing your search or
              specialty.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition"
            >
              Clear all filters
            </button>
          </div>
        ) : (

          // Doctor gird
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {displayedDoctors.map((item) => (
              <div
                key={item._id}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                <div className="relative bg-primary/5 overflow-hidden">

                  <img
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3">
                    {item.available ? (
                      <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-emerald-600 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-500 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">

                  <div className="flex items-start justify-between gap-2">

                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.name}
                      </h3>

                      <p className="text-xs text-primary mt-1 truncate">
                        {item.speciality}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">

                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock3 className="w-3.5 h-3.5 text-gray-400" />
                      Flexible timing
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">

                    {item.available ? (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/appointment/${item._id}`)
                        }
                        className="w-full flex items-center justify-between text-sm font-medium text-primary group-hover:text-primary"
                      >
                        <span>Book appointment</span>

                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Not accepting bookings</span>

                        <span className="px-2 py-1 rounded-lg bg-gray-50">
                          Unavailable
                        </span>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;


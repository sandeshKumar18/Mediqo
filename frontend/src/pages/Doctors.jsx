import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  Search,
  MapPin,
  Star,
  Heart,
  SlidersHorizontal,
  X,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Stethoscope,
} from "lucide-react";

const specialties = [
  { label: "General physician", icon: "🩺" },
  { label: "Gynecologist", icon: "🌸" },
  { label: "Dermatologist", icon: "✨" },
  { label: "Pediatrician", icon: "👶" },
  { label: "Neurologist", icon: "🧠" },
  { label: "Gastroenterologist", icon: "⚕️" },
  { label: "Cardiologist", icon: "❤️" },
  { label: "Orthopedic", icon: "🦴" },
  { label: "Psychologist", icon: "🧠" },
  { label: "Dentist", icon: "🦷" },
  { label: "Neurosurgeon", icon: "🧠" },
  { label: "General Surgeon", icon: "🔪" },
  { label: "Plastic Surgeon", icon: "✨" },
  { label: "Heart & Chest Surgeon", icon: "❤️" },
  { label: "Radiologist", icon: "🩻" },
  { label: "Pathologist", icon: "🔬" },
  { label: "Allergist", icon: "🌿" },
  { label: "Infectious Disease Specialist", icon: "🦠" },
  { label: "Physiotherapist", icon: "🏃" },
  { label: "Nutritionist", icon: "🥗" },
  { label: "Ayurvedic Doctor", icon: "🌿" },
  { label: "Homeopathic Doctor", icon: "🌱" },
  { label: "Psychiatrist", icon: "🧘" },
];

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);
  const [search, setSearch] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
 

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter((doc) => doc.speciality === speciality)
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  
  const displayedDoctors = useMemo(() => {
    let result = [...filterDoc];

    const searchText = search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((doc) => {
        const name = doc.name?.toLowerCase() || "";
        const docSpeciality = doc.speciality?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          docSpeciality.includes(searchText)
        );
      });
    }

    if (showAvailableOnly) {
      result = result.filter((doc) => doc.available);
    }

    return result;
  }, [filterDoc, search, showAvailableOnly]);

 

  return (
    <div className="min-h-screen bg-gray-50/60 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">

       
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

            <div>
              <div className="inline-flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-2">
                <Stethoscope className="w-4 h-4" />
                Healthcare professionals
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {speciality
                  ? `${speciality} Doctors`
                  : "Find the Right Doctor"}
              </h1>

              <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-2xl">
                Browse trusted doctors, compare specialties and find
                the right healthcare professional for your needs.
              </p>
            </div>

            {/* Doctor count */}
            <div className="flex items-center gap-3">
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400">
                  Available Doctors
                </p>

                <p className="text-xl font-bold ml-21 text-gray-900">
                  {displayedDoctors.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*  Search Option */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3 sm:p-4 mb-6">

          <div className="flex flex-col lg:flex-row gap-3">

           
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor or specialty..."
                className="w-full h-12 pl-12 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          
            <button
              onClick={() => setShowAvailableOnly((prev) => !prev)}
              className={`h-12 px-5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition ${
                showAvailableOnly
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />

              {showAvailableOnly
                ? "Available doctors"
                : "Show available only"}
            </button>

           
            {(search || showAvailableOnly || speciality) && (
              <button
                onClick={() => {
                  setSearch("");
                  setShowAvailableOnly(false);
                  navigate("/doctors");
                }}
                className="h-12 px-5 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="md:hidden mb-6">

          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800">
              Specialties
            </p>

            {speciality && (
              <button
                onClick={() => navigate("/doctors")}
                className="text-xs text-indigo-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {specialties.map(({ label, icon }) => {
              const isActive = speciality === label;

              return (
                <button
                  key={label}
                  onClick={() =>
                    isActive
                      ? navigate("/doctors")
                      : navigate(`/doctors/${label}`)
                  }
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50"
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

       
        <div className="flex flex-col md:flex-row items-start gap-6">

         
          <aside className="hidden md:flex flex-col gap-2 w-60 shrink-0 sticky top-6">

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3">

              <div className="px-2 pb-3 border-b border-gray-100">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Find by specialty
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Select a specialty to explore doctors
                </p>
              </div>

              <div className="pt-3 max-h-[650px] overflow-y-auto pr-1">

                {specialties.map(({ label, icon }) => {
                  const isActive = speciality === label;

                  return (
                    <button
                      key={label}
                      onClick={() =>
                        isActive
                          ? navigate("/doctors")
                          : navigate(`/doctors/${label}`)
                      }
                      className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="text-base shrink-0">
                        {icon}
                      </span>

                      <span className="truncate">
                        {label}
                      </span>

                      {isActive && (
                        <CheckCircle2 className="ml-auto w-4 h-4 text-indigo-500 shrink-0" />
                      )}
                    </button>
                  );
                })}

              </div>

              {speciality && (
                <button
                  onClick={() => navigate("/doctors")}
                  className="w-full mt-3 pt-3 border-t border-gray-100 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-2 px-2"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear specialty filter
                </button>
              )}
            </div>
          </aside>

          {/* Doctors  */}
          <main className="flex-1 w-full min-w-0">

            <div className="flex items-center justify-between mb-4">

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {displayedDoctors.length} doctor
                  {displayedDoctors.length !== 1 ? "s" : ""}
                </p>

                <p className="text-xs text-gray-400 mt-0.5">
                  {speciality
                    ? `Specialists in ${speciality}`
                    : "Available healthcare professionals"}
                </p>
              </div>

              {showAvailableOnly && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Available only
                </div>
              )}
            </div>

            
            {displayedDoctors.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl py-20 px-6 text-center shadow-sm">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
                  <Search className="w-7 h-7 text-indigo-500" />
                </div>

                <h3 className="font-semibold text-gray-800">
                  No doctors found
                </h3>

                <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
                  We couldn't find a doctor matching your current
                  search or filters. Try another specialty or search.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setShowAvailableOnly(false);
                    navigate("/doctors");
                  }}
                  className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
                >
                  View all doctors
                </button>
              </div>
            ) : (

              

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {displayedDoctors.map((item) => {


                  return (
                    <div
                      key={item._id}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >

                      <div className="relative bg-indigo-50 overflow-hidden">

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

                      {/* Doctor Info */}
                      <div className="p-4">

                        <div className="flex items-start justify-between gap-2">

                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {item.name}
                            </h3>

                            <p className="text-xs text-gray-400 mt-1 truncate">
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
                              onClick={() =>
                                navigate(`/appointment/${item._id}`)
                              }
                              className="w-full flex items-center justify-between text-sm font-medium text-indigo-600 group-hover:text-indigo-700"
                            >
                              <span>Book appointment</span>

                              <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
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
                  );
                })}

              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
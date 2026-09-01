import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const specialties = [
  { label: "General physician", icon: "🩺" },
  { label: "Gynecologist", icon: "🌸" },
  { label: "Dermatologist", icon: "✨" },
  { label: "Pediatrician", icon: "👶" },
  { label: "Neurologist", icon: "🧠" },
  { label: "Gastroenterologist", icon: "⚕️" },
];

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Find a Doctor
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse specialists and book an appointment instantly.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="md:hidden w-full -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2 pb-1 w-max">
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
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              );
            })}
            {speciality && (
              <button
                onClick={() => navigate("/doctors")}
                className="whitespace-nowrap px-3.5 py-2 rounded-full text-sm font-medium text-indigo-500 hover:bg-indigo-50 transition-all"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/*vertical sidebar */}
        <div className="hidden md:flex flex-col gap-2 w-56 shrink-0 sticky top-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 mb-1">
            Speciality
          </p>

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
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border
                  ${
                    isActive
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                  }`}
              >
                <span className="text-base shrink-0">{icon}</span>
                <span className="truncate">{label}</span>
                {isActive && (
                  <span className="ml-auto text-indigo-400 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-5.121-5.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}

          {speciality && (
            <button
              onClick={() => navigate("/doctors")}
              className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all text-left"
            >
              ✕ Clear filter
            </button>
          )}
        </div>

        {/* Doctors Grid */}
        <div className="flex-1 w-full min-w-0">
          <p className="text-xs text-gray-400 mb-4">
            {filterDoc.length} doctor{filterDoc.length !== 1 ? "s" : ""}{" "}
            {speciality ? `in ${speciality}` : "available"}
          </p>

          {filterDoc.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-medium text-gray-500">No doctors found</p>
              <p className="text-sm mt-1">
                Try selecting a different specialty
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 sm:gap-4">
              {filterDoc.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Doctor image */}
                  <div className="relative bg-indigo-50 overflow-hidden">
                    <img
                      className="w-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    {/* Availability badge — driven by item.available from backend */}
                    {item.available ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full mb-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full mb-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        Unavailable
                      </span>
                    )}

                    <p className="text-gray-900 font-semibold text-sm leading-snug truncate">
                      {item.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">
                      {item.speciality}
                    </p>

                    {/* Book button */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span
                        className={`text-xs font-medium transition-colors ${
                          item.available
                            ? "text-indigo-600 group-hover:text-indigo-800"
                            : "text-gray-400"
                        }`}
                      >
                        {item.available
                          ? "Book appointment →"
                          : "Not accepting bookings"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;

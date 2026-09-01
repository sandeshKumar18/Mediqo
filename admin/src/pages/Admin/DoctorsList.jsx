import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability , removeDoctor } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <p className="text-xl font-semibold text-gray-800">All Doctors</p>
        <p className="text-sm text-gray-400 mt-0.5">
          {doctors.length} {doctors.length === 1 ? "doctor" : "doctors"}{" "}
          registered
        </p>
      </div>

      {doctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-sm font-medium text-gray-600">No doctors yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Doctors you add will show up here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {doctors.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden group hover:shadow-md hover:border-gray-200 transition-all duration-200"
            >
              
              <div className="w-full bg-gray-50">
                <img
                  className="w-50 h-50 object-contain group-hover:scale-[1.02] transition-transform duration-300"
                  src={item.image}
                  alt={item.name}
                />
              </div>

              {/* Info */}
              <div className="px-3 pb-4 pt-3">
                <p className="text-gray-800 font-medium text-sm truncate">
                  {item.name}
                </p>
                <p className="text-gray-400 text-xs truncate mt-0.5">
                  {item.speciality}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeAvailability(item._id);
                  }}
                  className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                    item.available
                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${item.available ? "bg-emerald-500" : "bg-gray-400"}`}
                  />
                  {item.available ? "Available" : "Unavailable"}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDoctor(item._id);
                  }}
                  className={`mt-3 inline-flex items-center
                       gap-1.5 text-xs font-medium px-2.5 py-1 
                       rounded-full bg-red-50 text-red-600 hover:bg-red-100` 
                  }
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full bg-red-400`}
                  />
                  {<p>Remove Doctor</p>}
                </button>


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsList;

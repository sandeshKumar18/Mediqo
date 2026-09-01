import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ speciality, docId }) => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDocs] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId,
      );
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="my-16 px-4 sm:px-6 md:px-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Top Doctors to Book
        </h2>
        <p className="text-sm text-gray-500 max-w-xs sm:max-w-sm leading-relaxed">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="bg-indigo-50 overflow-hidden">
              <img
                className="w-full aspect-square object-cover object-top group-hover:scale-105 transition-transform duration-500"
                src={item.image}
                alt={item.name}
              />
            </div>

            <div className="p-3 sm:p-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Available
              </span>
              <p className="text-gray-900 text-sm sm:text-base font-semibold leading-snug">
                {item.name}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">{item.speciality}</p>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors">
                  Book now →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 active:scale-95 transition-all duration-200"
        >
          View all doctors
        </button>
      </div>
    </div>
  );
};

export default RelatedDoctors;

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <section className="flex flex-col items-center my-16 px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 mb-10">
        <span className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
          Meet our experts
        </span>
        <h2 className="text-2xl sm:text-3xl font-medium text-gray-800">
          Top Doctors to Book
        </h2>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
          Simply browse through our extensive list of trusted doctors.
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-7 h-0.5 rounded-full bg-blue-500" />
          <div className="w-2 h-0.5 rounded-full bg-blue-300" />
          <div className="w-1 h-0.5 rounded-full bg-blue-200" />
        </div>
      </div>

      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="group border border-blue-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(30,64,175,0.10)]"
          >
            <div className="w-full aspect-square bg-blue-50 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.available ? "bg-green-400" : "bg-gray-300"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    item.available ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {item.speciality}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="mt-10 px-10 py-3 rounded-full bg-blue-50 text-gray-600 text-sm font-medium hover:bg-blue-600 hover:text-white transition-all duration-300"
      >
        View all doctors →
      </button>
    </section>
  );
};

export default TopDoctors;

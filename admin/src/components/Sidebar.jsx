import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { assets } from "../assets/assets";

const ADMIN_NAV_ITEMS = [
  { to: "/admin-dashboard", icon: assets.home_icon, label: "Dashboard" },
  {
    to: "/all-appointments",
    icon: assets.appointment_icon,
    label: "Appointments",
  },
  { to: "/add-doctor", icon: assets.add_icon, label: "Add Doctor" },
  { to: "/doctor-list", icon: assets.people_icon, label: "Doctors List" },
];

const DOCTOR_NAV_ITEMS = [
  { to: "/doctor-dashboard", icon: assets.home_icon, label: "Dashboard" },
  {
    to: "/doctor-appointments",
    icon: assets.appointment_icon,
    label: "Appointments",
  },
  { to: "/doctor-profile", icon: assets.people_icon, label: "Profile" },
];

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  if (!aToken && !dToken) return null;

  const NAV_ITEMS = aToken ? ADMIN_NAV_ITEMS : DOCTOR_NAV_ITEMS;

  return (
    <>
      {/* Desktop Sidebar - fixed */}
      <aside className="hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-100 shadow-sm z-40">
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#F2F3FF] text-[#5f6FFF] border border-[#e0e3ff]"
                    : "text-[#515151] hover:bg-gray-50 hover:text-[#5f6FFF]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "bg-[#5f6FFF]/10"
                        : "bg-gray-100 group-hover:bg-[#5f6FFF]/10"
                    }`}
                  >
                    <img src={icon} alt="" className="w-4 h-4" />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <ul className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 py-1 rounded-xl mx-0.5 transition-all duration-150 ${
                    isActive
                      ? "text-[#5f6FFF]"
                      : "text-gray-400 hover:text-[#5f6FFF]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex items-center justify-center w-9 h-6 rounded-full transition-colors duration-150 ${
                        isActive ? "bg-[#F2F3FF]" : ""
                      }`}
                    >
                      <img
                        src={icon}
                        alt=""
                        className={`w-4 h-4 transition-transform duration-150 ${
                          isActive ? "scale-110" : ""
                        }`}
                      />
                    </span>
                    <span className="text-[10px] font-medium leading-none">
                      {label.split(" ")[0]}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;

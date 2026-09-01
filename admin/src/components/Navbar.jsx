import { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, Stethoscope } from "lucide-react";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const isAdmin = Boolean(aToken);
  const isDoctor = Boolean(dToken);

  const logout = () => {
    if (isAdmin) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
    if (isDoctor) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-8 h-16 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <img
          className="w-28 sm:w-36 cursor-pointer"
          src={isDoctor ? assets.doctor_logo : assets.admin_logo}
          alt="Care Connect"
          onClick={() => isAdmin ? navigate("/admin-dashboard") : navigate("/doctor-dashboard")}
        />

        {/* Role + Logout */}
        {(isAdmin || isDoctor) && (
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                isAdmin
                  ? "bg-violet-50 text-violet-700 border border-violet-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {isAdmin ? <ShieldCheck size={13} /> : <Stethoscope size={13} />}
              {isAdmin ? "Admin" : "Doctor"}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

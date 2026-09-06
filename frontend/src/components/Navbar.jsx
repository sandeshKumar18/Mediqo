import React, { useState, useEffect, useRef, useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { User, ChevronDown, Calendar, LogOut, Menu, X } from "lucide-react";



const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/doctors", label: "Doctors" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];





const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const drawerRef = useRef(null);
  const profileRef = useRef(null);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setShowProfileMenu((v) => !v);
  };

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target))
        setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  useEffect(() => {
    if (!showProfileMenu) return;
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showProfileMenu]);

  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMenu]);

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="bg-white w-full border-b border-gray-200 relative z-30">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 md:py-4">
          
          <img
            className="w-32 sm:w-36 md:w-44 cursor-pointer select-none shrink-0"
            src={assets.logo}
            alt="Brand logo"
            onClick={() => navigate("/")}
          />

          <ul className="hidden md:flex items-center gap-7 font-medium text-sm text-gray-600">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="group flex flex-col items-center gap-0.5"
              >
                {({ isActive }) => (
                  <>
                    <li
                      className={`list-none py-0.5 tracking-wide transition-colors duration-150 ${
                        isActive
                          ? "text-gray-900"
                          : "text-gray-600 group-hover:text-gray-900"
                      }`}
                    >
                      {label.toUpperCase()}
                    </li>
                    <hr
                      className={`border-none h-0.5 bg-primary rounded-full transition-all duration-200 ${
                        isActive
                          ? "opacity-100 w-[60%]"
                          : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-[60%]"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </ul>

          
          <div className="flex items-center gap-2 sm:gap-3">
            <div ref={profileRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={handleProfileClick}
                className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full hover:bg-gray-50 transition-colors"
                aria-label={token ? "Account menu" : "Log in"}
              >
                {token && userData?.image ? (
                  <img
                    src={userData.image}
                    alt={userData.name || "Profile"}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200"
                  />
                ) : (
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center text-gray-600">
                    <User
                      className="w-[18px] h-[18px] sm:w-5 sm:h-5"
                      strokeWidth={1.8}
                    />
                  </span>
                )}

                {token && (
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Dropdown — only when logged in */}
              {token && (
                <div
                  className={`absolute top-full right-0 mt-3 min-w-[190px] bg-white rounded-xl shadow-lg ring-1 ring-gray-100 z-30 overflow-hidden transition-all duration-200 ${
                    showProfileMenu
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-1.5"
                  }`}
                >
                  <div className="flex flex-col py-2">
                    <button
                      onClick={() => {
                        navigate("/my-profile");
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <User className="w-4 h-4" strokeWidth={1.8} />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/my-appointments");
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <Calendar className="w-4 h-4" strokeWidth={1.8} />
                      My Appointments
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={1.8} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger — MOBILE ONLY */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setShowMenu((v) => !v)}
              aria-label={showMenu ? "Close menu" : "Open menu"}
            >
              {showMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Backdrop ── */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${
          showMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowMenu(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ── */}
      <aside
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-[80vw] max-w-72 bg-white z-50 shadow-2xl md:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <img className="w-28 sm:w-32" src={assets.logo} alt="Brand logo" />
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setShowMenu(false)}
            aria-label="Close menu"
          >
            <X className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setShowMenu(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/8 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Drawer footer: profile or login */}
        <div className="px-5 py-5 border-t border-gray-100">
          {token ? (
            <div className="flex flex-col gap-1">
              
              <div className="flex items-center gap-3 px-2 py-3 mb-1">
                {userData?.image ? (
                  <img
                    src={userData.image}
                    alt={userData.name || "Profile"}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 shrink-0"
                  />
                ) : (
                  <span className="w-9 h-9 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                    <User className="w-5 h-5" strokeWidth={1.8} />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {userData?.name || "My Account"}
                  </p>
                  {userData?.email && (
                    <p className="text-xs text-gray-400 truncate">
                      {userData.email}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  navigate("/my-profile");
                  setShowMenu(false);
                }}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <User className="w-4 h-4" strokeWidth={1.8} />
                My Profile
              </button>
              <button
                onClick={() => {
                  navigate("/my-appointments");
                  setShowMenu(false);
                }}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Calendar className="w-4 h-4" strokeWidth={1.8} />
                My Appointments
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.8} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setShowMenu(false);
              }}
              className="w-full bg-primary text-white text-sm py-3 rounded-full font-medium hover:opacity-90 active:scale-95 transition-all"
            >
              Log in
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;

import React , {useContext} from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Banner = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  return (
    <div
      className="relative flex flex-row rounded-2xl overflow-hidden
             px-6 md:px-10 lg:px-20 min-h-[180px] sm:min-h-[240px] md:min-h-[360px]
             mx-4 sm:mx-6 lg:mx-10 mt-4"
      style={{
        background:
          "linear-gradient(135deg, #00A6A6 0%, #BBDEF0 55%, #F08700 100%)",
      }}
    >
      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 65% 90% at 15% 50%, rgba(255,255,255,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Left Side ── */}
      <div className="relative w-1/2 flex flex-col items-start justify-center gap-3 md:gap-4 py-6 md:py-10 z-10">
        <h1 className="text-base sm:text-xl md:text-3xl lg:text-4xl text-white font-bold leading-snug">
          Book Appointment <br />
          With 100+ Trusted Doctors
        </h1>

        
        {token ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigate("/doctors");
                scrollTo(0, 0);
              }}
              className="inline-flex items-center bg-white text-blue-700 text-[10px] sm:text-xs md:text-sm font-semibold px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              Book Your Slot
            </button>
            <button
              onClick={() => {
                navigate("/my-appointments");
                scrollTo(0, 0);
              }}
              className="inline-flex items-center bg-transparent text-white border border-white/50 text-[10px] sm:text-xs md:text-sm font-semibold px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full hover:bg-white/10 hover:border-white active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              Explore your Appointments
            </button>
          </div>
        
            ) : (
              <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigate("/login");
                scrollTo(0, 0);
              }}
              className="inline-flex items-center bg-white text-blue-700 text-[10px] sm:text-xs md:text-sm font-semibold px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              Create Account
            </button>
            <button
              onClick={() => {
                navigate("/login");
                scrollTo(0, 0);
              }}
              className="inline-flex items-center bg-transparent text-white border border-white/50 text-[10px] sm:text-xs md:text-sm font-semibold px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full hover:bg-white/10 hover:border-white active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              Login
            </button>
          </div>
            )}
      </div>

      <div className="w-1/2 relative flex items-end justify-end">
        <img
          className="absolute bottom-0 right-0 h-[105%] sm:h-[110%] md:h-[95%] w-auto object-contain object-bottom"
          src={assets.appointment_img}
          alt="Doctor ready to help"
        />
      </div>
    </div>
  );
};

export default Banner;

import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <section className="mx-4 sm:mx-6 lg:mx-10 mt-4">
      <div className="bg-gradient-to-r from-red-600 to-pink-500 rounded-3xl overflow-hidden flex flex-col-reverse md:flex-row items-center min-h-[520px] md:min-h-[480px]">
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-14 py-10 md:py-0 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Book Appointment <br className="hidden sm:block" />
            With Trusted Doctors
          </h1>

          <div className="flex flex-col sm:flex-row items-center md:items-center gap-4 mt-6">
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-sm">
              Browse through our extensive list of trusted doctors and book your
              appointment easily with just a few clicks.
            </p>
          </div>

          <div className="mt-8 flex justify-center md:justify-start">
            <a
              href="#speciality"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-7 py-3 rounded-full font-semibold text-sm shadow-lg hover:bg-blue-50 transition-all duration-300"
            >
              Book Appointment
              <img src={assets.arrow_icon} alt="Arrow" className="w-3" />
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center items-end self-end">
          <img
            src={assets.header_img}
            alt="Medical Team"
            className="
              w-[340px]
              sm:w-[430px]
              md:w-[500px]
              lg:w-[580px]
              xl:w-[640px]
              object-contain
              self-end
              block
            "
          />
        </div>
      </div>
    </section>
  );
};

export default Header;

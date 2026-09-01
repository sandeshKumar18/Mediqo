import React, { useRef, useState, useEffect } from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SpecialityMenu = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const nudge = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <section id="speciality" className="py-16 px-4 sm:px-6 lg:px-10 bg-white">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 mb-12 text-center">
        <span className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
          Our Services
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Find by Speciality
        </h2>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          Browse our extensive list of trusted doctors and schedule your
          appointment hassle-free.
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-7 h-0.5 rounded-full bg-blue-500" />
          <div className="w-2 h-0.5 rounded-full bg-blue-300" />
          <div className="w-1 h-0.5 rounded-full bg-blue-200" />
        </div>
      </div>

      <div className="relative">
        <div
          className={`absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Left button */}
        <button
          onClick={() => nudge(-1)}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 transition-all duration-200 hover:bg-blue-700 hover:text-white hover:border-blue-700 ${
            canScrollLeft
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft size={15} strokeWidth={2} />
        </button>

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-5 overflow-x-auto pb-2 px-1 sm:justify-center
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {specialityData.map((item, index) => (
            <Link
              key={index}
              to={`/doctors/${item.speciality}`}
              onClick={() => scrollTo(0, 0)}
              className="group flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer
                no-underline text-inherit px-2 py-3 rounded-xl w-[76px] sm:w-[90px]
                transition-transform duration-200 hover:-translate-y-1"
            >
              <div
                className="w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-full
                  bg-blue-50 flex items-center justify-center
                  transition-colors duration-200 group-hover:bg-blue-100"
              >
                <img
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                  src={item.image}
                  alt={item.speciality}
                />
              </div>
              <p className="text-xs sm:text-[13px] font-medium text-gray-600 text-center leading-tight">
                {item.speciality}
              </p>
            </Link>
          ))}
        </div>

        <div
          className={`absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right button */}
        <button
          onClick={() => nudge(1)}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 transition-all duration-200 hover:bg-blue-700 hover:text-white hover:border-blue-700 ${
            canScrollRight
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight size={15} strokeWidth={2} />
        </button>
      </div>
    </section>
  );
};

export default SpecialityMenu;

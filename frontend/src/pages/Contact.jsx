import React from "react";
import { assets } from "../assets/assets";
import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Clock,
  Smartphone,
  Map,
} from "lucide-react";

const Contact = () => {
  // Check real IST time for online status
  const now = new Date();
  const istTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  const istHour = istTime.getHours();
  const istDay = istTime.getDay(); // 0 = Sun, 6 = Sat
  const isOnline = istDay >= 1 && istDay <= 6 && istHour >= 9 && istHour < 18;

  return (
    <div className="px-4 sm:px-6 md:px-10 py-10">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-xs font-medium tracking-widest uppercase text-indigo-400 mb-2">
          Get in touch
        </p>
        <h1 className="text-2xl sm:text-3xl font-medium text-gray-900">
          Contact <span className="text-indigo-600">Us</span>
        </h1>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-14 mb-10 items-start">
        <img
          className="w-full md:max-w-[360px] rounded-2xl object-cover"
          src={assets.contact_image}
          alt="Contact Care Connect"
        />

        <div className="flex flex-col gap-3 w-full">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Office card */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
                <MapPin size={14} className="text-indigo-500" />
                <span className="text-[10px] font-medium tracking-widest uppercase text-gray-400">
                  Our Office
                </span>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  <MapPin
                    size={14}
                    className="text-indigo-400 mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Mediqo Health Hub,
                    <br />
                    Plot 12, Road No. 2, Akbarpur,
                    <br />
                    Mathura, UttarPradesh — 281406
                  </p>
                </div>

                <a
                  href="tel:+919528480643"
                  className="flex items-center gap-3 hover:text-indigo-600 transition-colors group"
                >
                  <Phone
                    size={14}
                    className="text-indigo-400 shrink-0 group-hover:text-indigo-600"
                  />
                  <span className="text-sm text-gray-500 group-hover:text-indigo-600">
                    (+91) 95 2848 0643
                  </span>
                </a>

                <a
                  href="tel:+919528480643"
                  className="flex items-center gap-3 hover:text-indigo-600 transition-colors group"
                >
                  <Smartphone
                    size={14}
                    className="text-indigo-400 shrink-0 group-hover:text-indigo-600"
                  />
                  <span className="text-sm text-gray-500 group-hover:text-indigo-600">
                    (+91) 95284 80643
                  </span>
                </a>

                <a
                  href="mailto:hello@mediqo.in"
                  className="flex items-center gap-3 hover:text-indigo-600 transition-colors group"
                >
                  <Mail
                    size={14}
                    className="text-indigo-400 shrink-0 group-hover:text-indigo-600"
                  />
                  <span className="text-sm text-gray-500 group-hover:text-indigo-600">
                    hello@mediqo.in
                  </span>
                </a>
              </div>
            </div>

            {/* Careers card */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
                <Briefcase size={14} className="text-indigo-500" />
                <span className="text-[10px] font-medium tracking-widest uppercase text-gray-400">
                  Careers at Mediqo
                </span>
              </div>
              <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
                <p className="text-sm text-gray-500 leading-relaxed">
                  We're building the future of healthcare access in rural areas of India. If
                  you care about meaningful work in engineering, design, or
                  operations — we'd love to hear from you.
                </p>
                <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95 transition-all duration-200">
                  <Briefcase size={14} />
                  Explore open roles
                </button>
              </div>
            </div>
          </div>

          {/* Hours strip — fixed mobile layout */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                <Clock size={15} className="text-indigo-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  Support hours
                </p>
                <p className="text-xs text-gray-400">
                  Mon – Sat, 9:00 AM – 6:00 PM IST
                </p>
              </div>
            </div>

            {/* Dynamic online/offline pill */}
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 shrink-0 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                Online now
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100 shrink-0 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                Offline
              </span>
            )}
          </div>

          {/* Map link */}
          <a
            href="https://maps.google.com/?q=KD+Hospital+Mathura"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 border border-gray-100 rounded-2xl bg-gray-50 h-28 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 group"
          >
            <Map
              size={22}
              className="text-indigo-400 group-hover:text-indigo-600 transition-colors"
            />
            <p className="text-sm text-gray-500 group-hover:text-indigo-600 transition-colors font-medium">
              Akbarpur, Mathura
            </p>
            <span className="text-xs text-gray-400 group-hover:text-indigo-400 transition-colors">
              Open in Google Maps ↗
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;

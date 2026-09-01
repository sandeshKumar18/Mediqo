import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-10 py-12">
          {/* Brand column */}
          <div>
            <img className="w-36 mb-5" src={assets.logo} alt="Care Connect" />
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Mediqo makes it easy to find trusted, verified doctors and
              book appointments in minutes — so you can focus on your health,
              not the hassle.
            </p>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-800 uppercase mb-4">
              Company
            </p>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-500">
              {[
                { label: "Home", to: "/" },
                { label: "About us", to: "/about" },
                { label: "All doctors", to: "/doctors" },
                { label: "Contact us", to: "/contact" },
                { label: "Privacy policy", to: "/privacy" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="hover:text-gray-900 transition-colors duration-150"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-800 uppercase mb-4">
              Get in Touch
            </p>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-500">
              <li>+91 95284 80643</li>
              <li>
                <a
                  href="mailto:careconnect@care.in"
                  className="hover:text-gray-900 transition-colors duration-150"
                >
                  mediqo@health.in
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@mediqo.in"
                  className="hover:text-gray-900 transition-colors duration-150"
                >
                  support@mediqo.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 py-5 text-center text-xs text-gray-400">
        Copyright {new Date().getFullYear()} &copy; Mediqo — All Rights
        Reserved.
      </div>
    </footer>
  );
};

export default Footer;

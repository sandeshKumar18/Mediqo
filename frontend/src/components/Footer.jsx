
import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Clock3,
  HeartPulse,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "All Doctors", to: "/doctors" },
    { label: "Contact Us", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy" },
  ];

  const serviceLinks = [
    { label: "Find a Doctor", to: "/doctors" },
    { label: "Book Appointment", to: "/doctors" },
    { label: "Medical Specialists", to: "/doctors" },
    { label: "Healthcare Services", to: "/about" },
    { label: "Help & Support", to: "/contact" },
  ];

  const socialLinks = [
    {
      icon: FaLinkedinIn,
      label: "LinkedIn",
      href: "https://linkedin.com",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      href: "https://instagram.com",
    },
    {
      icon: FaFacebookF,
      label: "Facebook",
      href: "https://facebook.com",
    },
    {
      icon: FaXTwitter,
      label: "X",
      href: "https://x.com",
    },
  ];

  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">

        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.4fr]">

          <div>
            <NavLink to="/" className="inline-block">
              <img
                src={assets.logo}
                alt="Mediqo"
                className="w-36 object-contain"
              />
            </NavLink>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-500">
              Mediqo makes healthcare simpler by helping patients discover
              trusted doctors, explore medical specialties, and book
              appointments quickly and conveniently.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-medium text-gray-600 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                Trusted Platform
              </div>

              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-medium text-gray-600 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                <Clock3 className="h-4 w-4 text-blue-500" />
                Easy Appointment
              </div>

            </div>

            <div className="mt-7 flex items-center gap-3">

              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-md"
                >
                  <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}

            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-gray-900">
              Company
            </h3>

            <ul className="space-y-3">

              {companyLinks.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition-all duration-200 hover:translate-x-1 hover:text-blue-600"
                  >
                    <span>{label}</span>

                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </NavLink>
                </li>
              ))}

            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-gray-900">
              Services
            </h3>

            <ul className="space-y-3">

              {serviceLinks.map(({ label, to }) => (
                <li key={label}>
                  <NavLink
                    to={to}
                    className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition-all duration-200 hover:translate-x-1 hover:text-blue-600"
                  >
                    <span>{label}</span>

                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </NavLink>
                </li>
              ))}

            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-gray-900">
              Get in Touch
            </h3>

            <div className="space-y-5">

              <a
                href="tel:+919528480643"
                className="group flex items-start gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-50">
                  <Phone className="h-4 w-4 text-blue-500" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Call us
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600">
                    +91 95284 80643
                  </p>
                </div>
              </a>

              <a
                href="mailto:support@mediqo.in"
                className="group flex items-start gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-50">
                  <Mail className="h-4 w-4 text-blue-500" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Email us
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600">
                    support@mediqo.in
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                  <MapPin className="h-4 w-4 text-blue-500" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-600">
                    India
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 py-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <HeartPulse className="h-4 w-4 text-blue-500" />

              <span>
                Making healthcare access simpler and more convenient.
              </span>
            </div>

            <div className="flex items-center gap-5 text-xs text-gray-400">

              <NavLink
                to="/privacy"
                className="transition-colors hover:text-blue-600"
              >
                Privacy
              </NavLink>

              <NavLink
                to="/contact"
                className="transition-colors hover:text-blue-600"
              >
                Support
              </NavLink>

            </div>

          </div>
        </div>

        <div className="border-t border-gray-100 py-5">

          <div className="flex flex-col gap-2 text-center text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">

            <p>
              © {currentYear}{" "}
              <span className="font-semibold text-gray-600">
                Mediqo
              </span>
              . All rights reserved.
            </p>

            <p>
              Designed for better healthcare experiences.
            </p>

          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React from "react";
import { assets } from "../assets/assets";
import { Zap, MapPin, Sparkles } from "lucide-react";

const cards = [
  {
    Icon: Zap,
    title: "Efficiency",
    desc: "Streamlined appointment scheduling that fits into your busy lifestyle.",
  },
  {
    Icon: MapPin,
    title: "Convenience",
    desc: "Access to a network of trusted healthcare professionals in your area.",
  },
  {
    Icon: Sparkles,
    title: "Personalization",
    desc: "Tailored recommendations and reminders to help you stay on top of your health.",
  },
];

const About = () => {
  return (
    <div className="px-4 sm:px-6 md:px-10 py-10">
      {/* ── Heading  */}
      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-2">
          Who we are
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          About <span className="text-indigo-600">Us</span>
        </h1>
      </div>

      {/* ── About Content  */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-14 mb-16 items-center">
        <img
          className="w-full md:max-w-[360px] rounded-2xl object-cover shadow-sm"
          src={assets.about_image}
          alt="About Care Connect"
        />

        <div className="flex flex-col gap-5 md:w-2/4 text-sm text-gray-500 leading-relaxed">
          <p>
            Welcome to{" "}
            <span className="font-medium text-gray-700"> Mediqo </span>
            your trusted partner in managing your healthcare needs conveniently
            and efficiently. At Mediqo, we understand the challenges
            individuals face when it comes to scheduling doctor appointments and
            managing their health records.
          </p>

          <p>
            Mediqo is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Mediqo is here to support you every step of the
            way.
          </p>

          <div className="border-l-2 border-indigo-400 pl-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">
              Our Vision
            </p>
            <p>
              Our vision at Mediqo is to create a seamless healthcare
              experience for every user. We aim to bridge the gap between
              patients and healthcare providers, making it easier for you to
              access the care you need, when you need it.
            </p>
          </div>
        </div>
      </div>

      {/* ── Why Choose Us ───────────────────────────────── */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-2">
          Our strengths
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Why <span className="text-indigo-600">Choose Us</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
        {cards.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="group border border-gray-100 bg-white rounded-2xl px-7 py-8 flex flex-col gap-3 text-sm text-gray-500 shadow-sm hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <span className="text-indigo-500 group-hover:text-white transition-colors duration-300">
              <Icon size={22} />
            </span>
            <p className="font-semibold text-gray-800 group-hover:text-white text-base transition-colors duration-300">
              {title}
            </p>
            <p className="group-hover:text-indigo-100 leading-relaxed transition-colors duration-300">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;

import React from "react";
import { assets } from "../assets/assets";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  UserRound,
  Zap,
} from "lucide-react";

const features = [
  {
    Icon: CalendarCheck,
    title: "Easy Appointment Booking",
    desc: "Find the right doctor and book an appointment in just a few simple steps.",
  },
  {
    Icon: Stethoscope,
    title: "Trusted Healthcare Professionals",
    desc: "Connect with qualified doctors across different medical specialties.",
  },
  {
    Icon: ShieldCheck,
    title: "Secure & Reliable",
    desc: "Your personal information and healthcare journey are handled with privacy and care.",
  },
  {
    Icon: Sparkles,
    title: "Personalized Experience",
    desc: "Get a healthcare experience designed around your needs and preferences.",
  },
];

const values = [
  {
    Icon: HeartPulse,
    title: "Patient First",
    desc: "Every decision we make starts with one question: how can we make healthcare better for patients?",
  },
  {
    Icon: ShieldCheck,
    title: "Trust & Privacy",
    desc: "We believe healthcare technology should be secure, transparent, and worthy of your trust.",
  },
  {
    Icon: Zap,
    title: "Simplicity",
    desc: "Healthcare can already be complicated. Our technology shouldn't be.",
  },
  {
    Icon: Users,
    title: "Accessibility",
    desc: "We work toward making quality healthcare easier to discover and access.",
  },
];

const steps = [
  {
    number: "01",
    title: "Find a Doctor",
    desc: "Search doctors by specialty, experience, and cost preferences.",
  },
  {
    number: "02",
    title: "Choose Your Appointment",
    desc: "Explore available dates and time slots that fit your schedule.",
  },
  {
    number: "03",
    title: "Book Securely",
    desc: "Confirm your appointment through a simple and secure booking experience.",
  },
  {
    number: "04",
    title: "Get the Care You Need",
    desc: "Visit - Connect with your doctor and take the next step toward better healthcare.",
  },
];

const team = [
  {
    name: "Healthcare Professionals",
    role: "Medical Experts",
    desc: "Experienced healthcare professionals dedicated to providing quality patient care.",
    Icon: Stethoscope,
  },
  {
    name: "Technology Team",
    role: "Product & Engineering",
    desc: "Building reliable technology that makes healthcare easier and more accessible.",
    Icon: UserRound,
  },
  {
    name: "Patient Support",
    role: "Care & Support",
    desc: "Helping patients navigate their healthcare journey with confidence.",
    Icon: HeartPulse,
  },
];

const About = () => {
  return (
    <div className="bg-white text-gray-800 overflow-hidden">

      {/* Hero section */}
      <section className="relative px-4 sm:px-6 md:px-10 lg:px-16 pt-10 md:pt-16 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Left */}
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500 mb-4">
                <span className="w-7 h-px bg-indigo-400"></span>
                About Mediqo
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.08]">
                Healthcare that
                <span className="block text-yellow-600">
                  puts people first.
                </span>
              </h1>

              <p className="mt-6 text-gray-500 text-base md:text-lg leading-8 max-w-xl">
                Mediqo is a modern healthcare platform designed to make
                discovering doctors, booking appointments, and managing your
                healthcare journey simpler, faster, and more convenient.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  href="/doctors"
                  className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-xl text-sm font-medium"
                >
                  Find a Doctor
                  <ArrowRight size={17} />
                </a>

                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-70"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-70"></div>

              <div className="relative">
                <img
                  src={assets.about_image}
                  alt="Mediqo healthcare"
                  className="w-full h-[380px] md:h-[470px] object-cover rounded-[2rem] shadow-lg"
                />

                
                <div className="absolute left-4 sm:left-6 bottom-4 sm:bottom-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <HeartPulse size={22} className="text-indigo-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Our commitment
                    </p>
                    <p className="font-semibold text-gray-800 text-sm">
                      Better healthcare, simplified
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Story Section */}
      <section className="bg-gray-50 px-4 sm:px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500 mb-3">
                Our Story
              </p>

              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                How Mediqo
                <span className="text-yellow-600"> started.</span>
              </h2>

              <div className="mt-6 space-y-5 text-gray-500 leading-7 text-sm md:text-base">
                <p>
                  Healthcare should be about people, not paperwork,
                  complicated processes, or spending hours searching for the
                  right doctor.
                </p>

                <p>
                  Mediqo was created with a simple idea: make the connection
                  between patients and healthcare professionals easier.
                </p>

                <p>
                  We envisioned a platform where patients could discover
                  doctors, understand their options, choose convenient
                  appointment slots, and take control of their healthcare
                  journey from one place.
                </p>

                <p>
                  What started as an idea to simplify doctor appointments is
                  growing into a broader healthcare technology platform focused
                  on accessibility, convenience, trust, and patient experience.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-[11px] md:left-[19px] top-2 bottom-2 w-px bg-indigo-200"></div>

              <div className="space-y-10">

                <div className="relative">
                  <div className="absolute -left-[25px] md:-left-[33px] top-1 w-6 h-6 rounded-full bg-yellow-600 border-4 border-indigo-100"></div>

                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                    The Beginning
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-1">
                    A simple healthcare idea
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 leading-6">
                    We identified how difficult it can be to discover and
                    schedule appointments with the right healthcare provider.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] md:-left-[33px] top-1 w-6 h-6 rounded-full bg-yellow-600 border-4 border-indigo-100"></div>

                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                    Building Mediqo
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-1">
                    Turning the idea into technology
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 leading-6">
                    We started building a platform focused on simplicity,
                    reliability, and a better patient experience.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] md:-left-[33px] top-1 w-6 h-6 rounded-full bg-yellow-600 border-4 border-indigo-100"></div>

                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                    Today
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-1">
                    Connecting people with care
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 leading-6">
                    Mediqo continues to evolve with the goal of creating a
                    seamless digital healthcare experience.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* what we do */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500 mb-3">
              What We Do
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Everything you need for a
              <span className="text-yellow-600"> simpler healthcare journey.</span>
            </h2>

            <p className="text-gray-500 mt-4 leading-7">
              Mediqo brings patients and healthcare professionals together
              through a simple digital experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="group border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                  <Icon
                    size={22}
                    className="text-red-600 group-hover:text-white transition-colors duration-300"
                  />
                </div>

                <h3 className="font-semibold text-gray-900 mt-5">
                  {title}
                </h3>

                <p className="text-sm text-gray-500 leading-6 mt-2">
                  {desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* Our Mission */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">

          <div className="grid md:grid-cols-2 gap-5">

            <div className="rounded-[2rem] bg-gray-50 border border-gray-100 p-8 md:p-12">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6">
                <HeartPulse size={24} />
              </div>

              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-200">
                Our Mission
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold mt-3">
                Making healthcare easier to access.
              </h2>

              <p className="text-gray-500 leading-7 text-sm md:text-base mt-5">
                Our mission is to simplify the healthcare journey by connecting
                patients with trusted healthcare professionals through
                technology that is intuitive, reliable, and accessible.
              </p>
            </div>

            <div className="rounded-[2rem] bg-gray-50 border border-gray-100 p-8 md:p-12">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6">
                <Sparkles size={24} className="text-indigo-600" />
              </div>

              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500">
                Our Vision
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-3">
                A more connected healthcare experience.
              </h2>

              <p className="text-gray-500 leading-7 text-sm md:text-base mt-5">
                We envision a future where accessing healthcare is as simple as
                using any modern digital service, while keeping human
                connection and quality care at the center.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* how Mediqo Works */}
      <section className="bg-gray-50 px-4 sm:px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500 mb-3">
              How Mediqo Works
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Healthcare in
              <span className="text-yellow-600"> four simple steps.</span>
            </h2>

            <p className="text-gray-500 mt-4 leading-7">
              From finding a doctor to getting the care you need, we keep the
              experience simple.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <p className="text-3xl font-semibold text-indigo-100">
                  {step.number}
                </p>

                <h3 className="font-semibold text-gray-900 mt-4">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-500 leading-6 mt-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* Our Values */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">

            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500 mb-3">
                Our Values
              </p>

              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                The principles behind
                <span className="text-yellow-600"> everything we do.</span>
              </h2>

              <p className="text-gray-500 mt-5 leading-7 text-sm md:text-base">
                Technology changes quickly, but our commitment to patients,
                healthcare professionals, and better experiences remains at
                the center of Mediqo.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {values.map(({ Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Icon size={20} className="text-indigo-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {title}
                    </h3>

                    <p className="text-sm text-gray-500 leading-6 mt-1">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>


      {/* Impacts */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">

          <div className="rounded-[2rem] bg-gray-900 text-white px-7 py-10 md:px-12 md:py-14">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

              <div>
                <p className="text-3xl md:text-4xl font-semibold">
                  100+
                </p>
                <p className="text-sm text-yellow-500 mt-2">
                  Healthcare Professionals
                </p>
              </div>

              <div>
                <p className="text-3xl md:text-4xl font-semibold">
                  1K+
                </p>
                <p className="text-sm text-yellow-500 mt-2">
                  Patients Connected
                </p>
              </div>

              <div>
                <p className="text-3xl md:text-4xl font-semibold">
                  20+
                </p>
                <p className="text-sm text-yellow-500 mt-2">
                  Medical Specialties
                </p>
              </div>

              <div>
                <p className="text-3xl md:text-4xl font-semibold">
                  24/7
                </p>
                <p className="text-sm text-yellow-500 mt-2">
                  Digital Accessibility
                </p>
              </div>

            </div>

          </div>

          <p className="text-xs text-gray-400 text-center mt-3">
            These stats makes us more confident to help the patients.
          </p>

        </div>
      </section>


      {/* Team */}
      <section className="bg-gray-50 px-4 sm:px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500 mb-3">
              Our Team
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              People building a
              <span className="text-yellow-600"> better healthcare future.</span>
            </h2>

            <p className="text-gray-500 mt-4 leading-7">
              Mediqo brings together healthcare thinking, technology, and
              patient-focused design to create a better digital healthcare
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map(({ Icon, name, role, desc }) => (
              <div
                key={name}
                className="bg-white rounded-2xl border border-gray-100 p-7 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <Icon size={28} className="text-indigo-600" />
                </div>

                <h3 className="font-semibold text-gray-900 mt-5">
                  {name}
                </h3>

                <p className="text-xs font-medium text-indigo-500 mt-1">
                  {role}
                </p>

                <p className="text-sm text-gray-500 leading-6 mt-3">
                  {desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* Why mediqo */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500 mb-3">
                Why Mediqo
              </p>

              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                Designed around what
                <span className="text-yellow-600"> matters to you.</span>
              </h2>

              <p className="text-gray-500 mt-5 leading-7">
                Whether you're looking for a doctor, managing an appointment,
                or planning your next step in healthcare, Mediqo is designed
                to reduce friction and give you more control.
              </p>

              <div className="mt-7 space-y-4">

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-indigo-600 shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-gray-600">
                    Simple and intuitive healthcare experience
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-indigo-600 shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-gray-600">
                    Convenient appointment scheduling
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-indigo-600 shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-gray-600">
                    Access to healthcare professionals
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-indigo-600 shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-gray-600">
                    Built with security and patient privacy in mind
                  </p>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-indigo-50 rounded-3xl p-6 md:p-8 min-h-[180px] flex flex-col justify-end">
                <MapPin size={26} className="text-indigo-600 mb-auto" />

                <h3 className="font-semibold text-gray-900">
                  Convenient
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Healthcare access from wherever you are.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-8 min-h-[180px] flex flex-col justify-end mt-8">
                <ShieldCheck size={26} className="text-indigo-600 mb-auto" />

                <h3 className="font-semibold text-gray-900">
                  Secure
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Your information deserves protection.
                </p>
              </div>

              <div className="bg-gray-300 text-white rounded-3xl p-6 md:p-8 min-h-[180px] flex flex-col justify-end">
                <Users size={26} className="text-indigo-300 mb-auto" />

                <h3 className="font-semibold text-gray-900">
                  Connected
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Patients and healthcare professionals together.
                </p>
              </div>

              <div className="bg-indigo-300 text-black rounded-3xl p-6 md:p-8 min-h-[180px] flex flex-col justify-end mt-8">
                <HeartPulse size={26} className="text-white mb-auto" />

                <h3 className="font-semibold-700">
                  Patient Focused
                </h3>

                <p className="text-sm text-black-100 mt-1">
                  Technology built around people.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">

          <div className="relative overflow-hidden rounded-[2rem] bg-indigo-600 px-7 py-12 md:px-14 md:py-16 text-center">

            <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-28 -right-20 w-72 h-72 rounded-full bg-white/10"></div>

            <div className="relative max-w-2xl mx-auto">

              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-200">
                Your healthcare journey starts here
              </p>

              <h2 className="text-3xl md:text-4xl font-semibold text-white mt-3">
                Find the right care,
                <br className="hidden sm:block" />
                when you need it.
              </h2>

              <p className="text-indigo-100 mt-4 leading-7 text-sm md:text-base">
                Discover healthcare professionals and take the next step
                toward a simpler, more connected healthcare experience.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mt-8">

                <a
                  href="/doctors"
                  className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Find a Doctor
                  <ArrowRight size={17} />
                </a>

                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition"
                >
                  Get in Touch
                </a>

              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  FlaskConical,
  ScanLine,
  HeartPulse,
  Ambulance,
  Pill,
  Syringe,
  Baby,
  ArrowRight,
  Clock3,
  X,
  CheckCircle2,
  Phone,
  Calendar,
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "Doctor Consultation",
    shortDescription:
      "Consult experienced doctors across multiple medical specialties.",
    description:
      "Book an appointment with a qualified doctor based on your medical needs. Explore specialties, check doctor availability, and choose a convenient appointment slot.",
    features: [
      "Multiple medical specialties",
      "Online appointment booking",
      "Doctor availability tracking",
      "Flexible appointment slots",
    ],
    action: "Find a Doctor",
    route: "/doctors",
  },
  {
    icon: FlaskConical,
    title: "Laboratory Services",
    shortDescription:
      "Reliable diagnostic and laboratory testing for accurate results.",
    description:
      "Access essential laboratory investigations and diagnostic tests designed to support doctors in making informed clinical decisions.",
    features: [
      "Routine blood tests",
      "Diagnostic investigations",
      "Sample-based testing",
      "Reliable laboratory support",
    ],
    action: "Contact Hospital",
    route: "/contact",
  },
  {
    icon: ScanLine,
    title: "Diagnostic Imaging",
    shortDescription:
      "Modern imaging services to support accurate diagnosis.",
    description:
      "Diagnostic imaging helps healthcare professionals evaluate and understand a wide range of medical conditions using appropriate imaging techniques.",
    features: [
      "Diagnostic imaging support",
      "Doctor-referred investigations",
      "Timely diagnostic assistance",
      "Integrated patient care",
    ],
    action: "Contact Hospital",
    route: "/contact",
  },
  {
    icon: HeartPulse,
    title: "Health Checkups",
    shortDescription:
      "Preventive health packages for monitoring your wellbeing.",
    description:
      "Regular health checkups can help monitor important health indicators and support early identification of potential concerns.",
    features: [
      "Routine health assessments",
      "Preventive screening",
      "Health monitoring",
      "Personalized consultation",
    ],
    action: "Book Consultation",
    route: "/doctors",
  },
  {
    icon: Ambulance,
    title: "Emergency Care",
    shortDescription:
      "Immediate medical attention for urgent situations.",
    description:
      "Emergency care is intended for serious or urgent health conditions that require prompt medical evaluation and treatment.",
    features: [
      "Urgent medical assessment",
      "Immediate clinical attention",
      "Emergency support",
      "Rapid patient care",
    ],
    action: "Contact Hospital",
    route: "/contact",
    emergency: true,
  },
  {
    icon: Pill,
    title: "Pharmacy",
    shortDescription:
      "Access prescribed medicines and essential healthcare products.",
    description:
      "Our pharmacy supports patients by providing prescribed medicines and commonly required healthcare products as part of their treatment journey.",
    features: [
      "Prescription medicines",
      "Essential healthcare products",
      "Medication support",
      "Hospital-connected care",
    ],
    action: "Contact Hospital",
    route: "/contact",
  },
  {
    icon: Syringe,
    title: "Vaccination",
    shortDescription:
      "Vaccination support for children and adults.",
    description:
      "Stay protected with vaccination services recommended for different age groups and healthcare needs.",
    features: [
      "Routine vaccinations",
      "Childhood immunization",
      "Adult vaccination",
      "Vaccination guidance",
    ],
    action: "Book Consultation",
    route: "/doctors",
  },
  {
    icon: Baby,
    title: "Maternity & Child Care",
    shortDescription:
      "Dedicated healthcare support for mothers and children.",
    description:
      "Specialized healthcare support for pregnancy, newborn care, child health, growth, development, and common pediatric concerns.",
    features: [
      "Pregnancy care",
      "Newborn support",
      "Pediatric consultation",
      "Child health monitoring",
    ],
    action: "Find a Doctor",
    route: "/doctors",
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceAction = (service) => {
    setSelectedService(null);
    navigate(service.route);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-red-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">

          <div className="max-w-3xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <HeartPulse className="w-4 h-4" />
              Healthcare Services
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Complete Care for Your
              <span className="text-primary"> Healthcare Needs</span>
            </h1>

            <p className="mt-4 text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Explore the healthcare services available at our
              hospital and find the right care for you and your
              family.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">

              <button
                type="button"
                onClick={() => navigate("/doctors")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Find a Doctor
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
              >
                <Phone className="w-4 h-4" />
                Contact Hospital
              </button>

            </div>
          </div>
        </div>
      </section>

          {/* SERVICES */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">

            <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              What We Offer
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Our Healthcare Services
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-500">
              Explore the care and support available throughout
              your healthcare journey.
            </p>

          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {services.map((service) => {
              const Icon = service.icon;

              return (
                <button
                  key={service.title}
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="group text-left bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon
                        className="w-6 h-6"
                        strokeWidth={1.8}
                      />
                    </div>

                    {service.emergency && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full bg-red-50 text-red-500">
                        Emergency
                      </span>
                    )}

                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mt-5">
                    {service.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed mt-2">
                    {service.shortDescription}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    View details
                    <ArrowRight
                      className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </button>
              );
            })}

          </div>
        </div>
      </section>

          {/* QUICK ACTION */}
      <section className="pb-14 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="border border-gray-100 rounded-3xl p-6 sm:p-8 bg-gray-50">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

              <div>
                <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                  <Calendar className="w-4 h-4" />
                  Need an appointment?
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Get the care you need without unnecessary waiting.
                </h2>

                <p className="mt-2 text-sm text-gray-500 max-w-2xl">
                  Find a doctor, check availability, and choose a
                  convenient appointment slot.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/doctors")}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Book an Appointment
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      </section>

      
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedService.title} details`}
        >

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSelectedService(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            <div className="p-6 sm:p-7 border-b border-gray-100">

              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-13 h-13 w-[52px] rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <selectedService.icon
                  className="w-6 h-6"
                  strokeWidth={1.8}
                />
              </div>

              <div className="flex items-center gap-2 mt-5">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedService.title}
                </h3>

                {selectedService.emergency && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full bg-red-50 text-red-500">
                    Emergency
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                {selectedService.description}
              </p>
            </div>

            <div className="px-6 sm:px-7 py-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                What you can expect
              </p>

              <div className="space-y-3">
                {selectedService.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />

                    <span className="text-sm text-gray-600">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 sm:px-7 py-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={() => handleServiceAction(selectedService)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                {selectedService.action}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Services;


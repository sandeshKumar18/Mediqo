import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [currentTime, setCurrentTime] = useState("");


  const getISTInfo = () => {
    const now = new Date();

    const timeFormatter =
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

    const dayFormatter =
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
      });

    const hourFormatter =
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        hour12: false,
      });

    const time = timeFormatter.format(now);
    const day = dayFormatter.format(now);
    const hour = Number(
      hourFormatter.format(now),
    );

    const workingDay = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ].includes(day);

    const online =
      workingDay &&
      hour >= 9 &&
      hour < 18;

    return {
      time,
      online,
    };
  };

  useEffect(() => {
    const updateTime = () => {
      const info = getISTInfo();
      setCurrentTime(info.time);
    };

    updateTime();

    const interval = setInterval(
      updateTime,
      1000,
    );

    return () =>
      clearInterval(interval);
  }, []);

  const { online: isOnline } = getISTInfo();
  const contactMethods = [
    {
      icon: Phone,
      title: "Call us",
      description:
        "Speak directly with the Mediqo team.",
      value: "+91 95284 80643",
      href: "tel:+919528480643",
    },
    {
      icon: Mail,
      title: "Email us",
      description:
        "Send your query and we'll get back to you.",
      value: "hello@mediqo.in",
      href: "mailto:hello@mediqo.in",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description:
        "Get quick assistance through WhatsApp.",
      value: "Chat with Mediqo",
      href: "https://wa.me/919528480643",
    },
  ];

  const subjects = [
    "General enquiry",
    "Patient support",
    "Doctor support",
    "Appointment issue",
    "Payment issue",
    "Partnership",
    "Careers",
    "Technical support",
    "Other",
  ];

 
  const faqs = [
    {
      question:
        "How can I contact Mediqo support?",
      answer:
        "You can contact our team by phone, email, WhatsApp, or through the contact form on this page.",
    },
    {
      question:
        "What are your support hours?",
      answer:
        "Our regular support hours are Monday to Saturday, from 9:00 AM to 6:00 PM IST. Messages sent outside these hours will be handled during the next support window.",
    },
    {
      question:
        "Can doctors contact Mediqo?",
      answer:
        "Yes. Doctors and healthcare organizations can contact us regarding partnerships, onboarding, collaboration, and other healthcare initiatives.",
    },
    {
      question:
        "How long does it take to receive a response?",
      answer:
        "Response time depends on the nature of your enquiry, but our team aims to respond as quickly as possible during support hours.",
    },
    {
      question:
        "Can I report a technical issue?",
      answer:
        "Yes. Select Technical support in the form and provide the issue details. Screenshots and error messages can help us investigate faster.",
    },
  ];

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setSubmitted(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Please enter your name.";
    } else if (
      formData.name.trim().length < 2
    ) {
      newErrors.name =
        "Name must contain at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Please enter your email.";
    } else if (
      !/^\S+@\S+\.\S+$/.test(
        formData.email,
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (formData.phone.trim()) {
      const phoneRegex =
        /^[0-9+\-\s()]{10,15}$/;

      if (
        !phoneRegex.test(
          formData.phone.trim(),
        )
      ) {
        newErrors.phone =
          "Please enter a valid phone number.";
      }
    }

    if (!formData.subject) {
      newErrors.subject =
        "Please select a subject.";
    }

    if (!formData.message.trim()) {
      newErrors.message =
        "Please enter your message.";
    } else if (
      formData.message.trim().length < 10
    ) {
      newErrors.message =
        "Message must contain at least 10 characters.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const subject =
        encodeURIComponent(
          `Mediqo Contact: ${formData.subject}`,
        );

      const body =
        encodeURIComponent(
          `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${
              formData.phone ||
              "Not provided"
            }\n` +
            `Subject: ${formData.subject}\n\n` +
            `Message:\n${formData.message}`,
        );

      window.location.href =
        `mailto:hello@mediqo.in?subject=${subject}&body=${body}`;

      setIsSubmitting(false);
      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 700);
  };

  const messageLength = formData.message.length;

  const supportInfo = useMemo(
    () => [
      {
        icon: Clock3,
        title: "Support hours",
        value: "Mon – Sat",
        detail: "9:00 AM – 6:00 PM IST",
      },
      {
        icon: Headphones,
        title: "Support",
        value: "Human assistance",
        detail:
          "For patients & doctors",
      },
      {
        icon: ShieldCheck,
        title: "Privacy",
        value: "Security focused",
        detail:
          "Your information matters",
      },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}

      <section className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
        <div className="max-w-6xl mx-auto">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-400"
                }`}
              />

              {isOnline
                ? "Support available now"
                : "Support currently offline"}
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.25em] font-bold text-black-400">
              Get in touch
            </p>

            <h1 className=" mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-black-300 tracking-tight leading-[1.05]">
              We're here to help You.
            </h1>

            <p className="mt-5 text-sm sm:text-base text-gray-500 leading-7">
              Whether you need help with an appointment want to contact our team or are interested in working with Mediqo, we're here to assist.
            </p>

          </div>
        </div>
      </section>

      {/* Address */}

      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-6xl mx-auto">

          <div className="border-y border-gray-200 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                <MapPin
                  size={17}
                  className="text-gray-700"
                />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
                  Hospital address
                </p>

                <h2 className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                  Mediqo Health Hub
                </h2>

                <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-5">
                  Plot 12, Nagla Dalchand,
                  Etah Chungi, Aligarh
                  <br className="sm:hidden" />
                  {" "}
                  Aligarh, Uttar Pradesh —
                  202002
                </p>
              </div>

            </div>

            <a
              href="https://maps.google.com/?q=Seema+SS+Library+Aligarh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 self-start md:self-center px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <MapPin size={14} />
              Open in Google Maps
              <ExternalLink size={12} />
            </a>

          </div>

          <p className="mt-4 text-xs sm:text-sm leading-6 text-gray-500">
            Visit us for in-person consultations and hospital services. For appointments, you can use MediQo to check doctor availability and book before arriving.
          </p>

        </div>
      </section>

     {/* Contact */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 sm:grid-cols-3 border border-gray-200 rounded-2xl overflow-hidden">

            {contactMethods.map(
              (item, index) => {
                const Icon = item.icon;

                return (
                  <a
                    key={index}
                    href={item.href}
                    target={
                      item.href.startsWith(
                        "https",
                      )
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      item.href.startsWith(
                        "https",
                      )
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`group p-5 sm:p-6 hover:bg-gray-50 transition-colors ${
                      index !==
                      contactMethods.length - 1
                        ? "border-b sm:border-b-0 sm:border-r border-gray-200"
                        : ""
                    }`}
                  >

                    <div className="flex items-start justify-between">

                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                        <Icon
                          size={17}
                          className="text-gray-700 group-hover:text-white transition-colors"
                        />
                      </div>

                      <ArrowUpRight
                        size={16}
                        className="text-gray-300 group-hover:text-gray-700 transition-colors"
                      />

                    </div>

                    <h3 className="mt-5 text-sm font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 leading-5">
                      {item.description}
                    </p>

                    <p className="mt-3 text-sm font-medium text-gray-900 break-words">
                      {item.value}
                    </p>

                  </a>
                );
              },
            )}

          </div>
        </div>
      </section>

      {/* //  main area */}

      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">

          <div className="lg:col-span-4 space-y-5">
            <div className="border border-gray-200 rounded-2xl p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                    Support status
                  </p>

                  <div className="flex items-center gap-2 mt-2">

                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOnline
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    />

                    <h3 className="text-sm font-semibold">
                      {isOnline
                        ? "Our team is online"
                        : "Our team is offline"}
                    </h3>

                  </div>

                </div>

                <Clock3
                  size={18}
                  className="text-gray-300"
                />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Current IST time:{" "}
                {currentTime}
              </p>

              <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2">

                {supportInfo.map(
                  (item, index) => {
                    const Icon =
                      item.icon;

                    return (
                      <div
                        key={index}
                        className="rounded-xl bg-gray-50 border border-gray-100 p-3"
                      >

                        <Icon
                          size={15}
                          className="text-gray-600"
                        />

                        <p className="mt-3 text-[10px] font-semibold text-gray-800">
                          {item.title}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400 leading-4">
                          {item.detail}
                        </p>

                      </div>
                    );
                  },
                )}

              </div>
            </div>

            {/* Quick help */}

            <div className="border border-gray-200 rounded-2xl p-6">

              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                Before contacting us
              </p>

              <h3 className="mt-2 text-lg font-semibold">
                Need appointment help?
              </h3>

              <p className="mt-2 text-sm text-gray-500 leading-6">
                Check your appointment status,
                doctor availability, or live
                General Consultation queue
                directly from MediQo.
              </p>

              <div className="mt-5 space-y-3">

                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <CheckCircle2
                    size={15}
                    className="text-gray-500"
                  />
                  Doctor appointment support
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <CheckCircle2
                    size={15}
                    className="text-gray-500"
                  />
                  General queue assistance
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <CheckCircle2
                    size={15}
                    className="text-gray-500"
                  />
                  Payment and technical support
                </div>

              </div>
            </div>

          </div>
          <div className="lg:col-span-8">

            <div className="border border-gray-200 rounded-2xl overflow-hidden">

              <div className="p-6 sm:p-8 border-b border-gray-200">

                <div className="flex items-start justify-between gap-5">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                      Contact form
                    </p>

                    <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">
                      Tell us how we can help
                    </h2>

                    <p className="mt-2 text-sm text-gray-500 leading-6 max-w-xl">
                      Share your query and we'll
                      prepare an email for the
                      Mediqo team.
                    </p>

                  </div>

                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gray-100 items-center justify-center">
                    <Send
                      size={17}
                      className="text-gray-700"
                    />
                  </div>

                </div>

              </div>

              <div className="p-6 sm:p-8">

                {submitted && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">

                    <CheckCircle2
                      size={18}
                      className="text-green-600 mt-0.5 shrink-0"
                    />

                    <div>

                      <p className="text-sm font-semibold text-gray-800">
                        Your message is ready.
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Your email application
                        should now be open with
                        the details pre-filled.
                      </p>

                    </div>

                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* Name + email */}

                  <div className="grid sm:grid-cols-2 gap-5">

                    <div>

                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Full name *
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={
                          formData.name
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter your name"
                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                          errors.name
                            ? "border-red-300"
                            : "border-gray-200 focus:border-gray-500"
                        }`}
                      />

                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1.5">
                          {errors.name}
                        </p>
                      )}

                    </div>

                    <div>

                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Email address *
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={
                          formData.email
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                          errors.email
                            ? "border-red-300"
                            : "border-gray-200 focus:border-gray-500"
                        }`}
                      />

                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1.5">
                          {errors.email}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* Phone + subject */}

                  <div className="grid sm:grid-cols-2 gap-5">

                    <div>

                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Phone number
                      </label>

                      <div className="relative">

                        <Phone
                          size={15}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="tel"
                          name="phone"
                          value={
                            formData.phone
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="+91 95284 80643"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                            errors.phone
                              ? "border-red-300"
                              : "border-gray-200 focus:border-gray-500"
                          }`}
                        />

                      </div>

                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1.5">
                          {errors.phone}
                        </p>
                      )}

                    </div>

                    <div>

                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        What can we help with? *
                      </label>

                      <select
                        name="subject"
                        value={
                          formData.subject
                        }
                        onChange={
                          handleChange
                        }
                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm bg-white transition-all ${
                          errors.subject
                            ? "border-red-300"
                            : "border-gray-200 focus:border-gray-500"
                        }`}
                      >

                        <option value="">
                          Select a topic
                        </option>

                        {subjects.map(
                          (subject) => (
                            <option
                              key={subject}
                              value={subject}
                            >
                              {subject}
                            </option>
                          ),
                        )}

                      </select>

                      {errors.subject && (
                        <p className="text-xs text-red-500 mt-1.5">
                          {errors.subject}
                        </p>
                      )}

                    </div>

                  </div>

                  <div>

                    <div className="flex items-center justify-between mb-2">

                      <label className="text-xs font-medium text-gray-700">
                        Message *
                      </label>

                      <span className="text-[10px] text-gray-400">
                        {messageLength}/1000
                      </span>

                    </div>

                    <textarea
                      name="message"
                      value={
                        formData.message
                      }
                      onChange={(e) => {
                        if (
                          e.target.value
                            .length <=
                          1000
                        ) {
                          handleChange(e);
                        }
                      }}
                      rows={7}
                      placeholder="Tell us about your query, issue, partnership idea, or anything else you'd like to discuss..."
                      className={`w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none transition-all ${
                        errors.message
                          ? "border-red-300"
                          : "border-gray-200 focus:border-gray-500"
                      }`}
                    />

                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1.5">
                        {errors.message}
                      </p>
                    )}

                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">

                    <ShieldCheck
                      size={17}
                      className="text-gray-600 shrink-0 mt-0.5"
                    />

                    <p className="text-xs text-gray-500 leading-5">
                      Please avoid sharing
                      highly sensitive medical
                      or personal information
                      through this general contact
                      form.
                    </p>

                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={
                      isSubmitting
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >

                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Preparing message...
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowRight
                          size={16}
                        />
                      </>
                    )}

                  </button>

                  <p className="text-center text-[11px] text-gray-400">
                    By contacting us, you agree
                    to communicate with the
                    Mediqo team regarding your
                    enquiry.
                  </p>

                </form>

              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-6xl mx-auto">

          <div className="border border-gray-200 rounded-2xl p-5 sm:p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Phone
                    size={17}
                    className="text-gray-700"
                  />
                </div>

                <div>

                  <h3 className="text-sm font-semibold">
                    Need emergency medical assistance?
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-5">
                    This page is not intended for
                    medical emergencies. Please
                    contact local emergency services
                    or visit the nearest emergency
                    department.
                  </p>

                </div>

              </div>

              <a
                href="tel:112"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
              >
                <Phone size={14} />
                Emergency — 112
              </a>

            </div>

          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-5">

          <div className="border border-gray-200 rounded-2xl p-6 sm:p-7 hover:border-gray-300 hover:shadow-sm transition-all">

            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Briefcase
                size={17}
                className="text-gray-700"
              />
            </div>

            <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
              Careers
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Build the future of healthcare with us.
            </h2>

            <p className="mt-3 text-sm text-gray-500 leading-6">
              We're interested in people who care
              about engineering, design, product,
              healthcare, and better digital experiences.
            </p>

            <a
              href="mailto:hello@mediqo.in?subject=Career%20Opportunity%20at%20Mediqo"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-gray-900 hover:text-gray-600"
            >
              Explore careers
              <ArrowRight size={15} />
            </a>

          </div>

          <div className="border border-gray-200 rounded-2xl p-6 sm:p-7 bg-gray-50">

            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
              <Users
                size={17}
                className="text-gray-700"
              />
            </div>

            <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
              Partnerships
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Have an idea that can improve healthcare?
            </h2>

            <p className="mt-3 text-sm text-gray-500 leading-6">
              We're open to collaboration with doctors,
              hospitals, clinics, healthcare organizations,
              institutions, and technology partners.
            </p>

            <a
              href="mailto:hello@mediqo.in?subject=Mediqo%20Partnership%20Proposal"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-gray-900 hover:text-gray-600"
            >
              Discuss a partnership
              <ArrowRight size={15} />
            </a>

          </div>

        </div>
      </section>

      {/* FAQ */}

      <section className="px-4 sm:px-6 lg:px-8 pb-14">
        <div className="max-w-4xl mx-auto">

          <div className="mb-8">

            <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold">
              FAQ
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              Frequently asked questions
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Common questions before reaching out to our team.
            </p>

          </div>

          <div className="space-y-2">

            {faqs.map(
              (faq, index) => {
                const isOpen =
                  openFaq === index;

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl overflow-hidden"
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          isOpen
                            ? -1
                            : index,
                        )
                      }
                      className="w-full flex items-center justify-between gap-5 text-left px-5 py-5 hover:bg-gray-50 transition-colors"
                    >

                      <span className="text-sm font-medium text-gray-800">
                        {faq.question}
                      </span>

                      <ChevronDown
                        size={17}
                        className={`shrink-0 text-gray-400 transition-transform duration-300 ${
                          isOpen
                            ? "rotate-180 text-gray-700"
                            : ""
                        }`}
                      />

                    </button>

                    <div
                      className={`grid transition-all duration-300 ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >

                      <div className="overflow-hidden">

                        <div className="px-5 pb-5 pt-1 text-sm text-gray-500 leading-6">
                          {faq.answer}
                        </div>

                      </div>

                    </div>

                  </div>
                );
              },
            )}

          </div>
        </div>
      </section>


      <section className="px-4 sm:px-6 lg:px-8 pb-16">

        <div className="max-w-6xl mx-auto">

          <div className="rounded-2xl bg-gray-900 px-6 sm:px-8 lg:px-10 py-8 sm:py-10">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div className="max-w-xl">

                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
                  Need assistance?
                </p>

                <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-white">
                  Let's make healthcare access simpler.
                </h2>

                <p className="mt-3 text-sm text-gray-400 leading-6">
                  Talk to the Mediqo team about
                  appointments, support, partnerships,
                  or technical questions.
                </p>

              </div>

              <div className="flex flex-col sm:flex-row gap-3">

                <a
                  href="tel:+919528480643"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Phone size={15} />
                  Call us
                </a>

                <a
                  href="mailto:hello@mediqo.in"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-700 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  <Mail size={15} />
                  Email us
                </a>

              </div>

            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default Contact;


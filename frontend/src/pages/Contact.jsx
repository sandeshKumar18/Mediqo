import React, { useEffect, useMemo, useState } from "react";
import { assets } from "../assets/assets";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CalendarDays,
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
  Smartphone,
  Users,
  X,
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

    const timeFormatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const dayFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
    });

    const hourFormatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      hour12: false,
    });

    const time = timeFormatter.format(now);
    const day = dayFormatter.format(now);
    const hour = Number(hourFormatter.format(now));

    const workingDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].includes(
      day
    );

    const online = workingDay && hour >= 9 && hour < 18;

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

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const { online: isOnline } = getISTInfo();

  // Contacts
  const contactMethods = [
    {
      icon: Phone,
      title: "Call our team",
      description: "Speak directly with our support team.",
      value: "+91 95284 80643",
      href: "tel:+919528480643",
    },
    {
      icon: Mail,
      title: "Send an email",
      description: "We'll respond to your message as soon as possible.",
      value: "hello@mediqo.in",
      href: "mailto:hello@mediqo.in",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp support",
      description: "Get quick assistance through WhatsApp.",
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
      question: "How can I contact Mediqo support?",
      answer:
        "You can contact our team by phone, email, or WhatsApp. You can also use the contact form on this page to send your query directly to the Mediqo team.",
    },
    {
      question: "What are your support hours?",
      answer:
        "Our regular support hours are Monday to Saturday, from 9:00 AM to 6:00 PM IST. Outside these hours, you can still send us an email and our team will respond during the next support window.",
    },
    {
      question: "Can doctors contact Mediqo for partnerships?",
      answer:
        "Yes. Doctors, clinics, hospitals, healthcare professionals, and organizations can contact us regarding partnerships, onboarding, collaboration, and healthcare initiatives.",
    },
    {
      question: "How long does it take to receive a response?",
      answer:
        "For general enquiries, we aim to respond as quickly as possible during support hours. Response time can vary depending on the nature and complexity of your request.",
    },
    {
      question: "Can I report a technical problem?",
      answer:
        "Absolutely. Select 'Technical support' in the contact form and describe the problem with as much detail as possible. Screenshots or error messages can also help our team investigate the issue faster.",
    },
  ];

 
  const handleChange = (e) => {
    const { name, value } = e.target;

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
      newErrors.name = "Please enter your name.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.phone.trim()) {
      const phoneRegex = /^[0-9+\-\s()]{10,15}$/;

      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = "Please enter a valid phone number.";
      }
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must contain at least 10 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate request
    setTimeout(() => {
      const subject = encodeURIComponent(
        `Mediqo Contact: ${formData.subject}`
      );

      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          `Phone: ${formData.phone || "Not provided"}\n` +
          `Subject: ${formData.subject}\n\n` +
          `Message:\n${formData.message}`
      );

      // Opens user's email application
      window.location.href = `mailto:hello@mediqo.in?subject=${subject}&body=${body}`;

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
        title: "Customer support",
        value: "Human assistance",
        detail: "For patients & doctors",
      },
      {
        icon: ShieldCheck,
        title: "Data & privacy",
        value: "Security focused",
        detail: "Your information matters",
      },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50/70 to-white overflow-hidden">
      {/* Hero */}

      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-12">
        
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
           
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-indigo-100 bg-yellow-50 text-indigo-600 text-xs font-semibold">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              />

              {isOnline ? "Open - You can book your slot" : "Office Closed - Book your slot for tomorrow"}
            </div>

            <p className="uppercase tracking-[0.3em] text-[11px] font-semibold text-indigo-500 mb-4">
              Get in touch
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.08]">
              We're here to help you
              <span className="block text-yellow-600 mt-1">
                connect with better healthcare.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base leading-7 text-gray-500">
              Whether you are a patient looking for assistance, a doctor
              interested in joining Mediqo, or an organization interested in
              collaboration, our team is ready to hear from you.
            </p>
          </div>

          {/* Quick Actions */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-5xl mx-auto">
            {contactMethods.map((item, index) => {
              const Icon = item.icon;

              return (
                <a
                  key={index}
                  href={item.href}
                  target={item.href.startsWith("https") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("https")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                      <Icon
                        size={18}
                        className="text-indigo-600 group-hover:text-white transition-colors duration-300"
                      />
                    </div>

                    <ArrowUpRight
                      size={17}
                      className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400 leading-5">
                    {item.description}
                  </p>

                  <p className="mt-4 text-sm font-medium text-indigo-600 break-words">
                    {item.value}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact area */}

      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            
            <div className="relative rounded-3xl overflow-hidden min-h-[380px] group">
              <img
                src={assets.contact_image}
                alt="Mediqo healthcare support"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/20 to-transparent" />

              <div className="absolute left-0 right-0 bottom-0 p-6 sm:p-8 text-white">
                <div className="flex items-center gap-2 mb-4 text-xs font-medium text-white/80">
                  <CheckCircle2 size={15} />
                  Healthcare support from the Mediqo team
                </div>

                <h2 className="text-2xl sm:text-3xl font-semibold leading-tight">
                  Let's solve your problem together.
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/75">
                  Our goal is to make healthcare access simpler, faster, and
                  more connected for patients and healthcare professionals.
                </p>
              </div>
            </div>

            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <MapPin size={17} className="text-indigo-600" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Visit us
                    </p>

                    <h3 className="font-semibold text-gray-900">
                      Mediqo Health Hub
                    </h3>
                  </div>
                </div>

                <MapPin size={16} className="text-indigo-300" />
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 leading-6">
                  Plot 12, Nagla Dalchand, Etah Chungi, Aligarh
                  <br />
                  Aligarh, Uttar Pradesh — 202002
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="https://maps.google.com/?q=Seema+SS+Library+Aligarh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 active:scale-95 transition-all"
                  >
                    <MapPin size={14} />
                    Open Google Maps
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

           
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Live support status
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isOnline
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-400"
                      }`}
                    />

                    <h3 className="font-semibold text-gray-900">
                      {isOnline ? "Our team is online" : "Our team is offline"}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    Current IST time: {currentTime}
                  </p>
                </div>

                <div
                  className={`px-4 py-2 rounded-full text-xs font-medium self-start ${
                    isOnline
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-red-50 text-red-500 border border-red-100"
                  }`}
                >
                  {isOnline ? "Available now" : "Next support window soon"}
                </div>
              </div>

              <div className="mt-6 h-px bg-gray-100" />

              <div className="mt-5 grid grid-cols-3 gap-3">
                {supportInfo.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="rounded-xl bg-gray-50 p-3 border border-gray-100"
                    >
                      <Icon size={16} className="text-indigo-500" />

                      <p className="text-[11px] font-medium text-gray-800 mt-3">
                        {item.title}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-1 leading-4">
                        {item.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form  */}

          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm h-full">
              <div className="p-6 sm:p-8 lg:p-10">
                
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-indigo-500 font-semibold">
                      Contact form
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                      Tell us how we can help
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 leading-6">
                      Share your details and message. Your email application
                      will open with the information ready to send.
                    </p>
                  </div>

                  <div className="hidden sm:flex w-12 h-12 rounded-xl bg-indigo-50 items-center justify-center shrink-0">
                    <Send size={19} className="text-indigo-600" />
                  </div>
                </div>

                
                {submitted && (
                  <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-green-50 border border-green-100">
                    <CheckCircle2
                      size={19}
                      className="text-green-600 mt-0.5 shrink-0"
                    />

                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        Your message is ready to send.
                      </p>

                      <p className="text-xs text-green-600 mt-1 leading-5">
                        Your default email application should now be open with
                        the contact details pre-filled.
                      </p>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Full name *
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-gray-800 placeholder:text-gray-400 transition-all ${
                          errors.name
                            ? "border-red-300 focus:ring-4 focus:ring-red-50"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
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
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-gray-800 placeholder:text-gray-400 transition-all ${
                          errors.email
                            ? "border-red-300 focus:ring-4 focus:ring-red-50"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                        }`}
                      />

                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1.5">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

             
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
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 95284 80643"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm text-gray-800 placeholder:text-gray-400 transition-all ${
                            errors.phone
                              ? "border-red-300 focus:ring-4 focus:ring-red-50"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
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
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-gray-800 bg-white transition-all ${
                          errors.subject
                            ? "border-red-300 focus:ring-4 focus:ring-red-50"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                        }`}
                      >
                        <option value="">Select a topic</option>

                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
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
                      <label className="block text-xs font-medium text-gray-700">
                        Message *
                      </label>

                      <span className="text-[10px] text-gray-400">
                        {messageLength}/1000
                      </span>
                    </div>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={(e) => {
                        if (e.target.value.length <= 1000) {
                          handleChange(e);
                        }
                      }}
                      rows={7}
                      placeholder="Tell us about your query, issue, partnership idea, or anything else you'd like to discuss..."
                      className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-gray-800 placeholder:text-gray-400 resize-none transition-all ${
                        errors.message
                          ? "border-red-300 focus:ring-4 focus:ring-red-50"
                          : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      }`}
                    />

                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1.5">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-gray-100">
                    <ShieldCheck
                      size={17}
                      className="text-indigo-500 shrink-0 mt-0.5"
                    />

                    <p className="text-xs text-gray-500 leading-5">
                      Please avoid sharing highly sensitive medical or personal
                      information through this general contact form. For
                      account-specific support, use the appropriate secure
                      channel inside the Mediqo platform.
                    </p>
                  </div>

                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Preparing your message...
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-gray-400">
                    By contacting us, you agree to communicate with the Mediqo
                    team regarding your enquiry.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Notice */}

      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl border border-red-100 bg-red-50/70 p-6 sm:p-7">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <Phone size={18} className="text-red-500" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-red-700">
                    Need emergency medical assistance?
                  </h3>

                  <p className="text-xs sm:text-sm text-red-600/80 leading-5 mt-1">
                    This contact page is not intended for medical emergencies.
                    Please contact your local emergency services or visit the
                    nearest emergency department.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <a
                  href="tel:112"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all"
                >
                  <Phone size={15} />
                  Emergency — 112
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers */}

      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Careers */}
            <div className="group bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Briefcase size={19} className="text-indigo-600" />
                </div>

                <ArrowUpRight
                  size={19}
                  className="text-gray-300 group-hover:text-indigo-600 transition-colors"
                />
              </div>

              <p className="text-xs uppercase tracking-wider text-indigo-500 font-semibold mt-6">
                Careers
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-2">
                Build the future of healthcare with us.
              </h2>

              <p className="text-sm text-gray-500 leading-6 mt-3">
                We're looking for people passionate about engineering, design,
                product, healthcare technology, and creating better digital
                experiences.
              </p>

              <a
                href="mailto:hello@mediqo.in?subject=Career%20Opportunity%20at%20Mediqo"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Explore career opportunities
                <ArrowRight size={15} />
              </a>
            </div>

            {/* Partnership */}
            <div className="group bg-gray-950 rounded-3xl p-6 sm:p-8 text-white hover:shadow-xl hover:shadow-gray-300/30 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Users size={19} className="text-indigo-300" />
                </div>

                <ArrowUpRight
                  size={19}
                  className="text-white/30 group-hover:text-white transition-colors"
                />
              </div>

              <p className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mt-6">
                Partnerships
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold mt-2">
                Have an idea that can improve healthcare?
              </h2>

              <p className="text-sm text-white/60 leading-6 mt-3">
                We're open to collaborating with doctors, hospitals, clinics,
                healthcare organizations, educational institutions, and
                technology partners.
              </p>

              <a
                href="mailto:hello@mediqo.in?subject=Mediqo%20Partnership%20Proposal"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
              >
                Discuss a partnership
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}

      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-indigo-500 font-semibold">
              FAQ
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mt-3">
              Frequently asked questions
            </h2>

            <p className="text-sm text-gray-500 mt-3">
              Everything you may need to know before reaching out to our team.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "border-indigo-200 shadow-md shadow-indigo-100/30"
                      : "border-gray-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between gap-5 text-left px-5 sm:px-6 py-5"
                  >
                    <span className="text-sm sm:text-base font-medium text-gray-800">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-gray-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-indigo-500" : ""
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
                      <div className="px-5 sm:px-6 pb-5 text-sm text-gray-500 leading-6 border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}

      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 sm:px-10 lg:px-14 py-10 sm:py-12">
            
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -left-10 -bottom-20 w-52 h-52 rounded-full bg-white/5" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-7">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.25em] text-indigo-200 font-semibold">
                  Need assistance?
                </p>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mt-2">
                  Let's make healthcare access simpler.
                </h2>

                <p className="text-sm text-indigo-100 leading-6 mt-3 max-w-xl">
                  Talk to the Mediqo team about support, appointments,
                  partnerships, careers, or technical questions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="tel:+919528480643"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-600 text-sm font-semibold hover:bg-indigo-50 active:scale-95 transition-all"
                >
                  <Phone size={15} />
                  Call us
                </a>

                <a
                  href="mailto:hello@mediqo.in"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 border border-indigo-400 text-white text-sm font-semibold hover:bg-indigo-400 active:scale-95 transition-all"
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


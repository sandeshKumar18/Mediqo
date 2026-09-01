import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Cake,
  Pencil,
  Check,
  X,
  BadgeCheck,
  ShieldCheck,
  Clock,
  CalendarDays,
  Camera,
} from "lucide-react";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewingImage, setViewingImage] = useState(false); // lightbox state

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  const updateUserProfileData = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setImage(false);
  };

  if (!userData) return null;

  const currentImageSrc = image
    ? URL.createObjectURL(image)
    : userData.image || null;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:px-10">
      {/*  Image lightbox overlay */}
      {viewingImage && currentImageSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setViewingImage(false)}
        >
          <div
            className="relative w-52 h-52 sm:w-64 sm:h-64"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImageSrc}
              alt={userData.name}
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-2xl"
            />
            <button
              onClick={() => setViewingImage(false)}
              className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-zinc-100 transition"
            >
              <X size={14} className="text-zinc-600" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">
            My Profile
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage your personal information
          </p>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl overflow-hidden text-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 px-6 py-6 border-b border-zinc-100">
              <div className="relative shrink-0 self-center sm:self-auto">
                {isEdit ? (
                  <label htmlFor="image" className="cursor-pointer group block">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                      {currentImageSrc ? (
                        <img
                          src={currentImageSrc}
                          alt={userData.name}
                          className="w-full h-full rounded-full object-cover border-2 border-zinc-200 opacity-80 group-hover:opacity-60 transition"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-medium border-2 border-zinc-200 opacity-80 group-hover:opacity-60 transition">
                          {initials}
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                        <Camera size={20} className="text-white drop-shadow" />
                      </div>
                    </div>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </label>
                ) : currentImageSrc ? (
                  <button
                    onClick={() => setViewingImage(true)}
                    className="group relative block w-20 h-20 sm:w-24 sm:h-24 rounded-full focus:outline-none"
                    title="View photo"
                  >
                    <img
                      src={currentImageSrc}
                      alt={userData.name}
                      className="w-full h-full rounded-full object-cover border-2 border-zinc-200 group-hover:border-indigo-300 transition"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition text-white text-[10px] font-medium">
                        View
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-medium border-2 border-zinc-200">
                    {initials}
                  </div>
                )}

                {!isEdit && (
                  <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Name + badges — centered on mobile */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                {isEdit ? (
                  <input
                    className="text-2xl font-semibold text-neutral-800 w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
                    type="text"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-2xl font-semibold text-neutral-800 truncate leading-snug">
                    {userData.name}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-100 rounded-full px-2.5 py-0.5 font-medium">
                    <BadgeCheck size={12} /> Verified account
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                    <CalendarDays size={12} /> Member since 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Contact section */}
            <div className="px-6 py-5 border-b border-zinc-100">
              <p className="text-[10.5px] font-semibold tracking-widest text-zinc-400 uppercase mb-4">
                Contact Information
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InfoRow icon={<Mail size={15} className="text-zinc-500" />}>
                    <span className="text-[11px] text-zinc-400">Email</span>
                    <span className="text-indigo-500 break-all">
                      {userData.email}
                    </span>
                  </InfoRow>
                </div>

                <InfoRow icon={<Phone size={15} className="text-zinc-500" />}>
                  <span className="text-[11px] text-zinc-400">Phone</span>
                  {isEdit ? (
                    <input
                      className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-neutral-700 w-full transition"
                      type="text"
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <span className="text-indigo-500">{userData.phone}</span>
                  )}
                </InfoRow>

                <InfoRow icon={<MapPin size={15} className="text-zinc-500" />}>
                  <span className="text-[11px] text-zinc-400">Address</span>
                  {isEdit ? (
                    <div className="space-y-2 w-full">
                      <input
                        className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-neutral-700 w-full transition"
                        type="text"
                        placeholder="Address line 1"
                        value={userData.address?.line1 || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line1: e.target.value },
                          }))
                        }
                      />
                      <input
                        className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-neutral-700 w-full transition"
                        type="text"
                        placeholder="Address line 2"
                        value={userData.address?.line2 || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line2: e.target.value },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-zinc-500 leading-relaxed">
                      {userData.address?.line1}
                      {userData.address?.line2 && (
                        <>
                          <br />
                          {userData.address.line2}
                        </>
                      )}
                    </span>
                  )}
                </InfoRow>
              </div>
            </div>

            {/* Basic info section */}
            <div className="px-6 py-5 border-b border-zinc-100">
              <p className="text-[10.5px] font-semibold tracking-widest text-zinc-400 uppercase mb-4">
                Basic Information
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={<User size={15} className="text-zinc-500" />}>
                  <span className="text-[11px] text-zinc-400">Gender</span>
                  {isEdit ? (
                    <select
                      className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-neutral-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 cursor-pointer w-full transition"
                      value={userData.gender}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <span className="text-neutral-700">
                      {userData.gender || "—"}
                    </span>
                  )}
                </InfoRow>

                <InfoRow icon={<Cake size={15} className="text-zinc-500" />}>
                  <span className="text-[11px] text-zinc-400">Birthday</span>
                  {isEdit ? (
                    <input
                      className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-neutral-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 w-full transition"
                      type="date"
                      value={userData.dob}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          dob: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <span className="text-neutral-700">
                      {userData.dob || "—"}
                    </span>
                  )}
                </InfoRow>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 bg-zinc-50 flex items-center justify-end gap-3">
              {isEdit && (
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-zinc-300 bg-white text-zinc-600 text-sm font-medium hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={14} /> Cancel
                </button>
              )}
              {isEdit ? (
                <button
                  onClick={updateUserProfileData}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={14} />
                  {saving ? "Saving…" : "Save changes"}
                </button>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-indigo-600 text-indigo-600 bg-white text-sm font-medium hover:bg-indigo-50 active:scale-95 transition-all"
                >
                  <Pencil size={14} /> Edit profile
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 text-sm">
              <p className="text-[10.5px] font-semibold tracking-widest text-zinc-400 uppercase mb-4">
                Account Status
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <ShieldCheck size={15} className="text-green-500" /> Profile
                    verified
                  </span>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <Mail size={15} className="text-indigo-400" /> Email
                    confirmed
                  </span>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    Yes
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <Clock size={15} className="text-zinc-400" /> Last updated
                  </span>
                  <span className="text-xs text-zinc-400">Today</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl p-5 text-sm">
              <p className="text-[10.5px] font-semibold tracking-widest text-zinc-400 uppercase mb-4">
                Quick Info
              </p>
              <div className="space-y-3">
                <QuickInfoRow
                  icon={<User size={14} className="text-zinc-500" />}
                  label="Full name"
                  value={userData.name}
                />
                <QuickInfoRow
                  icon={<Cake size={14} className="text-zinc-500" />}
                  label="Date of birth"
                  value={userData.dob || "—"}
                />
                <QuickInfoRow
                  icon={<MapPin size={14} className="text-zinc-500" />}
                  label="Location"
                  value={userData.address?.line2 || "—"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, children }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex flex-col gap-0.5 flex-1 min-w-0">{children}</div>
  </div>
);

const QuickInfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[11px] text-zinc-400">{label}</p>
      <p className="text-neutral-700 font-medium">{value}</p>
    </div>
  </div>
);

export default MyProfile;

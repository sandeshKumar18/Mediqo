import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  MapPin,
  FileText ,
  Clock,
  Edit3,
  Save,
  X,
  CheckCircle,
  XCircle,
  Stethoscope,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);
  const { currency, backendUrl } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  const updateProfile = async () => {
    setLoading(true);
    const toastId = toast.loading("Saving changes…");
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } },
      );

      if (data.success) {
        toast.success(data.message, { id: toastId });
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    getProfileData();
  };

  /* ── Loading state  */
  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-indigo-500" />
          <h1 className="text-xl font-bold text-slate-800">Doctor Profile</h1>
        </div>

        {/* ── Header card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative">
                <img
                  src={profileData.image}
                  alt={profileData.name}
                  className="w-28 h-28 rounded-2xl object-cover ring-4 ring-indigo-50"
                />
                <span
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap
                    ${
                      profileData.available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                >
                  {profileData.available ? (
                    <>
                      <CheckCircle className="w-3 h-3" /> Available
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" /> Unavailable
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2 mt-2 sm:mt-0">
              <h2 className="text-2xl fontrelaxed-bold text-slate-900 leading-tight">
                {profileData.name}
              </h2>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  {profileData.degree}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-indigo-400" />
                  {profileData.speciality}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                {profileData.experience} experience
              </span>
            </div>
          </div>
        </div>

        {/* ── Body grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* About */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                About
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {profileData.about}
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <FileText  className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Appointment Details
              </h3>
            </div>

            {/* Consultation Fee */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Consultation Fee
              </label>
              {isEdit ? (
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-400 transition-all">
                  <span className="px-3 py-2.5 text-sm font-semibold text-slate-500 bg-slate-50 border-r border-slate-200 select-none">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={profileData.fees}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-2.5 text-sm text-slate-800 outline-none bg-white min-w-0"
                  />
                </div>
              ) : (
                <p className="text-base font-semibold text-slate-800">
                  {currency} {profileData.fees}
                </p>
              )}
            </div>

            <div className="h-px bg-slate-100" />

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Address
              </label>
              {isEdit ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Address line 1"
                    value={profileData.address.line1}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Address line 2"
                    value={profileData.address.line2}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white transition-all"
                  />
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {profileData.address.line1}
                  {profileData.address.line2 && (
                    <>
                      <br />
                      {profileData.address.line2}
                    </>
                  )}
                </p>
              )}
            </div>

            <div className="h-px bg-slate-100" />

            {/* Availability toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Availability
              </label>
              <button
                type="button"
                disabled={!isEdit}
                onClick={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 border transition-all
                  ${
                    profileData.available
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-slate-50 border-slate-200"
                  }
                  ${isEdit ? "cursor-pointer hover:opacity-80" : "cursor-default"}
                `}
              >
                {/* Toggle pill */}
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
                    ${profileData.available ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                      ${profileData.available ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </div>
                <span
                  className={`text-sm font-semibold
                    ${profileData.available ? "text-emerald-700" : "text-slate-500"}`}
                >
                  {profileData.available
                    ? "Open for appointments"
                    : "Not accepting appointments"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex justify-end gap-3 pb-4">
          {isEdit ? (
            <>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={updateProfile}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-60 shadow-sm shadow-indigo-200"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;

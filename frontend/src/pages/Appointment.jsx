import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import toast from "react-hot-toast";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    if (!docInfo.available) return;

    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10,
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;

        const slotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(formattedTime)
            ? false
            : true;

        if (slotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      if (timeSlots.length > 0) {
        setDocSlots((prev) => [...prev, timeSlots]);
      }
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast("Login to book appointment");
      return navigate("/login");
    }

    if (!docInfo.available) {
      toast.error("Doctor is not available for appointments");
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  return (
    docInfo && (
      <>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {/* Doctor Card */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="w-full sm:w-64 lg:w-72 shrink-0">
              <img
                className="w-full object-contain object-top rounded-2xl bg-indigo-50"
                src={docInfo.image}
                alt={docInfo.name}
              />
            </div>

            <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">
                    {docInfo.name}
                  </h1>
                  <img
                    className="w-5 h-5 shrink-0"
                    src={assets.verified_icon}
                    alt="Verified"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-1.5">
                  <span className="text-sm text-gray-500">
                    {docInfo.degree} · {docInfo.speciality}
                  </span>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                    {docInfo.experience}
                  </span>
                </div>

                <div className="mt-2">
                  {docInfo.available ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-red-500 font-medium bg-red-50 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      Not Available
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100" />

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <img
                    src={assets.info_icon}
                    alt=""
                    className="w-4 h-4 opacity-60"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    About
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {docInfo.about}
                </p>
              </div>

              <div className="border-t border-gray-100" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Consultation fee</span>
                <span className="text-base font-semibold text-gray-800">
                  {currencySymbol}
                  {docInfo.fees}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Select a date &amp; time
            </h2>

            {!docInfo.available ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <div className="text-4xl">🚫</div>
                <p className="text-base font-semibold text-gray-700">
                  Doctor is currently unavailable
                </p>
                <p className="text-sm text-gray-400">
                  This doctor is not accepting appointments at the moment.
                  Please check back later or choose another doctor.
                </p>
                <button
                  onClick={() => navigate("/doctors")}
                  className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
                >
                  Find Another Doctor
                </button>
              </div>
            ) : docSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <div className="text-4xl">📅</div>
                <p className="text-base font-semibold text-gray-700">
                  No slots available
                </p>
                <p className="text-sm text-gray-400">
                  There are no available time slots for the next 7 days. Please
                  check back later.
                </p>
              </div>
            ) : (
              <>
                {/* Date picker —  only days with slots are shown */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                  {docSlots.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSlotIndex(index);
                        setSlotTime("");
                      }}
                      className={`flex flex-col items-center justify-center min-w-[58px] h-[70px] rounded-2xl shrink-0 transition-all duration-200 border
                        ${
                          slotIndex === index
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                            : "bg-gray-50 text-gray-500 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50"
                        }`}
                    >
                      <span className="text-[10px] font-semibold tracking-wider uppercase opacity-70">
                        {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                      </span>
                      <span className="text-lg font-bold leading-none mt-0.5">
                        {item[0] && item[0].datetime.getDate()}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Time slots —  3 per row on all screen sizes */}
                <div className="mt-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                    Available times
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {docSlots[slotIndex].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setSlotTime(item.time)}
                        className={`py-2 rounded-xl text-sm font-medium transition-all duration-150 border text-center
                          ${
                            item.time === slotTime
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100"
                              : "text-gray-500 border-gray-200 bg-white hover:border-indigo-300 hover:text-indigo-600"
                          }`}
                      >
                        {item.time.toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm row */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {slotTime && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-800">
                        {(() => {
                          const selected = docSlots[slotIndex]?.find(
                            (s) => s.time === slotTime,
                          )?.datetime;
                          return selected
                            ? `Appointment on ${selected.toLocaleDateString("en-US", { weekday: "long" })}, ${selected.toLocaleDateString("en-US", { month: "long", day: "numeric" })} at ${slotTime}`
                            : "";
                        })()}
                      </span>
                    </p>
                  )}
                  <button
                    onClick={bookAppointment}
                    disabled={!slotTime}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                      ${
                        slotTime
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-100"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {slotTime ? "Confirm Appointment" : "Select a time slot"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </>
    )
  );
};

export default Appointment;

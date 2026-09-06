import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : "",
  );

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Get All Doctors
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Change Doctor Availability
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeDoctor = async (docId) => {
  try {
    const { data } = await axios.delete(
      backendUrl + "/api/admin/remove-doctor",
      {
        data: { docId },
        headers: { aToken },
      },
    );

    if (data.success) {
      toast.success(data.message);
      getAllDoctors();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  // Get All Appointments
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Cancel Appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get Dashboard Data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  
const updateDoctor = async (docId, formData) => {
  try {
    const { data } = await axios.put(
      backendUrl + `/api/admin/update-doctor/${docId}`,
      formData,
      {
        headers: {
          aToken,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      getAllDoctors();
      return true;
    } else {
      toast.error(data.message);
      return false;
    }
  } catch (error) {
    console.log("Update doctor error:", error);
    toast.error(error.response?.data?.message || error.message);
    return false;
  }
};

  const value = {
    aToken,
    setAToken,

    backendUrl,

    doctors,
    setDoctors,
    getAllDoctors,
    changeAvailability,
    removeDoctor,
    updateDoctor,

    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,

    dashData,
    getDashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};





export default AdminContextProvider;

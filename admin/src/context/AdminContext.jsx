import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken")
      ? localStorage.getItem("aToken")
      : "",
  );

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  // General Request state
  const [generalRequests, setGeneralRequests] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


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



  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/appointments",
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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


  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/dashboard",
        {
          headers: { aToken },
        },
      );

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
        },
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
      toast.error(
        error.response?.data?.message ||
          error.message,
      );
      return false;
    }
  };

 

  const getGeneralRequests = async (filters = {}) => {
    try {
      const params = {};

      if (filters.department) {
        params.department = filters.department;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      const { data } = await axios.get(
        backendUrl + "/api/admin/general-requests",
        {
          headers: { aToken },
          params,
        },
      );

      if (data.success) {
        setGeneralRequests(data.requests);
        return data.requests;
      } else {
        toast.error(data.message);
        return [];
      }
    } catch (error) {
      console.log(
        "Get General Requests Error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load General Requests",
      );

      return [];
    }
  };



  const assignGeneralRequestDoctor = async (
    requestId,
    doctorName,
  ) => {
    try {
      const { data } = await axios.patch(
        backendUrl +
          "/api/admin/general-requests/assign",
        {
          requestId,
          doctorName,
        },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);

        await getGeneralRequests();

        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.log(
        "Assign General Request Doctor Error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to assign doctor",
      );

      return false;
    }
  };


  const startGeneralRequest = async (
    requestId,
  ) => {
    try {
      const { data } = await axios.patch(
        backendUrl +
          "/api/admin/general-requests/start",
        {
          requestId,
        },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);

        await getGeneralRequests();

        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.log(
        "Start General Request Error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to start consultation",
      );

      return false;
    }
  };



  const completeGeneralRequest = async (
    requestId,
  ) => {
    try {
      const { data } = await axios.patch(
        backendUrl +
          "/api/admin/general-requests/complete",
        {
          requestId,
        },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);

        await getGeneralRequests();

        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.log(
        "Complete General Request Error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to complete consultation",
      );

      return false;
    }
  };



  const value = {
    aToken,
    setAToken,

    backendUrl,

    // Doctors
    doctors,
    setDoctors,
    getAllDoctors,
    changeAvailability,
    removeDoctor,
    updateDoctor,

    // Appointments
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,

    // Dashboard
    dashData,
    getDashData,

    // General Requests
    generalRequests,
    setGeneralRequests,
    getGeneralRequests,
    assignGeneralRequestDoctor,
    startGeneralRequest,
    completeGeneralRequest,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;

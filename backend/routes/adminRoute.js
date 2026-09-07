import express from "express";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
  appointmentsAdmin,
  getDashData,
  removeDoctor,
  cancelAppointment,
  updateDoctor,
  adminRevenue,
} from "../controllers/adminController.js";

import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";


const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.post("/cancel-appointment",authAdmin,cancelAppointment);
adminRouter.delete("/remove-doctor",authAdmin,removeDoctor);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.get("/dashboard", authAdmin, getDashData);
adminRouter.put("/update-doctor/:id",authAdmin,upload.single("image"),updateDoctor);
adminRouter.get("/revenue", authAdmin, adminRevenue);

export default adminRouter;

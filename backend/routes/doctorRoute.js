import express from "express";

import {
  loginDoctor,
  doctorList,
  changeAvailability,appointmentsDoctor,appointmentComplete,appointmentCancel,getDoctorProfile,updateDoctorProfile,doctorDashboard
} from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";


const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor);

doctorRouter.get("/list", doctorList);

doctorRouter.get("/appointments", authDoctor,appointmentsDoctor);
doctorRouter.get("/profile",authDoctor, getDoctorProfile);

doctorRouter.post(
  "/complete-appointment",
  authDoctor,
  appointmentComplete
);

doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

doctorRouter.post(
  "/cancel-appointment",
  authDoctor,
  appointmentCancel
);


doctorRouter.post(
  "/change-availability",
  changeAvailability
);

// Protected Dashboard Route
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);



export default doctorRouter;
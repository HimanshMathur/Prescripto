import express from "express";
import { allDoctors,addDoctor, loginAdmin,appointmentsAdmin,AppointmentCancel,adminDashboard,deleteDoctor } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import {changeAvailability} from "../controllers/doctorController.js"
const adminRouter = express.Router();

adminRouter.post(
  "/login",
  loginAdmin
)


adminRouter.post('/add-doctor', upload.single('image'), authAdmin, addDoctor)
adminRouter.post("/all-doctors",authAdmin,allDoctors)
adminRouter.post("/change-availability",authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,AppointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
adminRouter.post("/delete-doctor", authAdmin, deleteDoctor);
export default adminRouter;
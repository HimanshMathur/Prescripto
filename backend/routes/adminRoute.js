import express from "express";
import { addDoctor, loginAdmin } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post(
  "/login",
  loginAdmin
);



adminRouter.post(
  "/add-doctor",
  authAdmin,
  upload.single("docImg"),
  addDoctor
);

export default adminRouter;
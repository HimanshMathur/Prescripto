import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";



import { v2 as cloudinary } from "cloudinary";
dotenv.config();

console.log("URI =", process.env.MONGODB_URI); // <-- Test

const app = express();
const port = process.env.PORT || 4000;

connectdb();
connectCloudinary();

(async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
})();

app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("URL:", req.url);
  next();
});
//middleware
app.use(express.json());
app.use(cors());


//api endpoints
app.use("/api/admin", adminRouter);  
// app.use("/api/user", userRouter);
// app.use("/api/doctor", doctorRouter);



app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
dotenv.config();

console.log("URI =", process.env.MONGODB_URI); // <-- Test

const app = express();
const port = process.env.PORT || 4000;

connectdb();
connectCloudinary();

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
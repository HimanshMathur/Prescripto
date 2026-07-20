import express from "express";
import cors from "cors";
import 'dotenv/config'; // Yeh command .env files ko load karne ke liye zaroori hai
import connectdb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'


// App Config
const app = express();
const port = process.env.PORT || 4000;

// Database and Cloudinary Connection
connectdb();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());
// uploads folder ko public access dene ke liye
app.use('/uploads', express.static('uploads'))


// Debugging: Log if environment variables are loaded
console.log("URI =", process.env.MONGODB_URI);
console.log("Cloud Name check:", process.env.CLOUDINARY_NAME ? "Loaded" : "FAILED TO LOAD");

// Server.js mein ye check lagao
console.log("Loading ENV from path:", process.cwd()); 
console.log("Current Cloud Name in memory:", process.env.CLOUDINARY_NAME);
// API Endpoints
app.use("/api/admin", adminRouter);
app.use('/api/doctor',doctorRouter)
app.use("/api/user",userRouter)


app.get("/", (req, res) => {
  res.send("API Working");
});

// Server Listener
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
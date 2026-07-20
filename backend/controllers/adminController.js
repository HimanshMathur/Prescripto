import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'  // <-- Admin token generate karne ke liye
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check karna ki admin email aur password sahi se `.env` se match ho rahe hain ya nahi
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            // 2. Token generate karna (Email + secret key mix karke)
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

    } catch (error) {
        console.log("Admin Login Error:", error);
        return res.json({ success: false, message: error.message });
    }
}

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experiance, about, fees, address } = req.body;
        const imageFile = req.file;

        console.log("Incoming Body:", req.body);
        console.log("Incoming File:", imageFile);

        // 1. Validation Check
        if (!name || !email || !password || !speciality || !degree || !experiance || !about || !fees || !address || !imageFile) {
            return res.json({ success: false, message: "Please complete all fields including image." });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter a valid Email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please Enter a strong password" });
        }
          
        // 2. Hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. NO CLOUDINARY DEPENDENCY: Local path save
        const localImageUrl = `/uploads/${imageFile.filename}`;

        // 4. Address JSON Parsing
        let parsedAddress;
        try {
            parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
        } catch (e) {
            parsedAddress = { line1: address, line2: "" };
        }

        const doctorData = {
            name,
            email,
            image: localImageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experiance,
            about,
            fees: Number(fees),
            address: parsedAddress,
            date: Date.now(),
            slots_booked: {} 
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        return res.json({ success: true, message: "Doctor Added Successfully!" });

    } catch (error) {
        console.log("Final Stack Error:", error);
        return res.json({ success: false, message: error.message });
    }
}


// Delete Doctor (Admin Only)
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    // Doctor ko Database se find karke delete karein
    const doctor = await doctorModel.findByIdAndDelete(docId);

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // Optional: Doctor ke pending appointments ko cancel/delete karna
    await appointmentModel.deleteMany({ docId });

    res.json({ success: true, message: "Doctor Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API TO GET ALL DOCTORS LIST FOR ADMIN

const allDoctors = async(req,res) =>{
    try{
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


// API TO GET ALL APPOINTMENT LIST FOR ADMIN
const appointmentsAdmin = async (req, res) => {
    try {
        // 🌟 Ensure deep reference fetching if models are linked, or fetch clear data strings
        const appointments = await appointmentModel.find({});
        
        console.log("Fetched Appointments Count for Admin:", appointments.length);
        res.json({ success: true, appointments });
    } catch (error) {
        console.log("Admin Appointments Fetch Error:", error);
        res.json({ success: false, message: error.message });
    }
}


//API for appointment cancelllation

const AppointmentCancel = async (req, res) => {
  try {
    const {appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



//Api to get admin data
// API to get admin dashboard data
const adminDashboard = async (req, res) => {
  try {

    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      patients: users.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    };

    res.json({
      success: true,
      dashData
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};
export { addDoctor, loginAdmin,allDoctors,appointmentsAdmin,AppointmentCancel,adminDashboard,deleteDoctor};
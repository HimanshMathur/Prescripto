import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.post('/get-profile', authUser, getProfile)

// 🛠️ FIX 1: Multer (upload) ko pehle rakho taaki body parse ho sake, fir authUser verify karega
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verify-razorpay', authUser, verifyRazorpay);

export default userRouter
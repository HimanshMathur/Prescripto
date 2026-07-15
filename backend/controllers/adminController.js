import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken"
//API for adding doctor 

const addDoctor = async (req,res) =>{
    
    try{
        const {name,email,password,speciality,degree,experiance,about,fees,address} = req.body;
        const image = req.file.path;
        if (!name || !email || !password || !image || !speciality || !degree || !experiance || !about || !fees || !address){
            return res.json({sucess:false,message:"Missing Details"})
        }

        //validating email format

        if(!validator.isEmail(email)){
            return res.json({sucess:false,message:"Invalid Email"})
        }

        //validating strong password
        if(password.length < 8){
            return res.json({sucess:false,message:"Enter Strong Password"})
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password,salt);

        //upload image to clouinary
        const imageUpload = await cloudinary.uploader.upload(image,{
            resource_type:"image",
        })
        const imageUrl = imageUpload.secure_url;
        

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experiance,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now(),
        }

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({sucess:true,message:"Doctor Added Successfully"})
    }
    catch(error){
        console.log(error);
        res.json({sucess:false,message:"Something Went Wrong"})
    }
}


// API FOR THE admin Login

const loginAdmin = async (req, resp) => {
    try {
        console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(
                {email} 
                + password,
                process.env.JWT_SECRET
            );

            resp.json({
                success: true,
                message: "Login Successful",
                token,
            });
        } else {
            resp.json({
                success: false,
                message: "Invalid Credentials",
            });
        }
    } catch (error) {
        console.log(error);
        resp.json({
            success: false,
            message: "Something Went Wrong",
        });
    }
};
export {addDoctor,loginAdmin}
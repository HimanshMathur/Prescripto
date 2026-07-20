import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext"; // Dono context import kiye
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
    const [state, setState] = useState("Admin"); // Default state Admin hai
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setAToken, backendUrl } = useContext(AdminContext);
    const { setDToken } = useContext(DoctorContext); // Doctor token setter

    const onsubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (state === "Admin") {
                // Admin Login Flow
                const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
                if (data.success) {
                    localStorage.setItem("aToken", data.token);
                    setAToken(data.token);
                    toast.success("Admin Login Successful!");
                } else {
                    toast.error(data.message);
                }
            } else {
                // Doctor Login Flow
                const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
                if (data.success) {
                    localStorage.setItem("dToken", data.token);
                    setDToken(data.token);
                    toast.success("Login Successfull!");
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <form onSubmit={onsubmitHandler} className="min-h-[80vh] flex items-center justify-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-[400px] border rounded-xl text-[#5F6368] text-sm shadow-lg bg-white">
                <p className="text-2xl font-semibold m-auto text-primary">
                    {state} Login
                </p>
                
                <div className="w-full">
                    <p className="font-medium">Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="border border-[#DADADA] rounded w-full p-2 mt-1 outline-none"
                        type="email"
                        required
                    />
                </div>

                <div className="w-full">
                    <p className="font-medium">Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="border border-[#DADADA] rounded w-full p-2 mt-1 outline-none"
                        type="password"
                        required
                    />
                </div>

                <button type="submit" className="bg-primary text-white w-full p-2 mt-2 rounded-md text-base font-light">
                    Login
                </button>

                {/* State Toggle Text */}
                {state === "Admin" ? (
                    <p>Doctor Login? <span className="text-primary underline cursor-pointer" onClick={() => setState("Doctor")}>Click here</span></p>
                ) : (
                    <p>Admin Login? <span className="text-primary underline cursor-pointer" onClick={() => setState("Admin")}>Click here</span></p>
                )}
            </div>
        </form>
    );
};

export default Login;
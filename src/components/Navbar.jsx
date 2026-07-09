import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Navbar = () => {
  const Navigation = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [Token, setToken] = useState(true);
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img onClick = {()=>{
        Navigation("/");
      }} className="w-44 cursor-pointer" src={assets.logo} alt="logo" />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto  hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1"> ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT US</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {Token ? (
          <div className="flex items-center gap-4 cursor-pointer group relative ">
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium  text-gray-600 z-20 hidden group-hover:block">
              <div className = "min-w-48 border border-gray-900 rounded-3xl px-2 py-2 md:block bg-black text-white">
                <p onClick = {()=>{
                    Navigation("/myprofile");
                }}
                className = "text-center rounded-full hover:bg-primary hover:text-white px-2 py-2">My Profile</p>
                <p onClick = {()=>{
                    Navigation("/myappointment");
                }}
                className = "text-center rounded-full hover:bg-primary hover:text-white px-2 py-2">My Appointments</p>
                <p 
                onClick = {()=>{
                    setToken(false);
                    Navigation("/");
                }}className = "text-center rounded-full hover:bg-primary hover:text-white px-2 py-2">Log out</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
            onClick={() => {
              Navigation("/login");
            }}
          >
            CREATE ACCOUNT
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

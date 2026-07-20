import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate();

  // backendUrl ko context se nikal kar rakha hai image rendering ke liye
  const { token, setToken, userData, backendUrl,dtoken,setdToken } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
        navigate('/');
        // Admin Token Clear
        if (aToken) {
            setAToken('');
            localStorage.removeItem('aToken');
        }
        // Doctor Token Clear
        if (dToken) {
            setDToken('');
            localStorage.removeItem('dToken');
        }
    };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      {/* Desktop Navbar */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
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

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="relative group flex items-center gap-4 cursor-pointer">
            {/* 🛠️ FIXED: Added base64 string check logic parallel to http logic */}
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                userData.image && (userData.image.startsWith("data:image") || userData.image.startsWith("http")) 
                  ? userData.image 
                  : `${backendUrl}${userData.image}`
              }
              alt="profile"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
              }}
            />
            <img
              className="w-2.5"
              src={assets.dropdown_icon}
              alt=""
            />

            {/* Dropdown */}
            <div className="absolute top-0 right-0 pt-14 hidden group-hover:block z-20">
              <div className="min-w-48 bg-black text-white rounded-2xl p-2">
                <p
                  onClick={() => navigate("/myprofile")}
                  className="px-4 py-2 rounded-full hover:bg-primary text-center cursor-pointer"
                >
                  My Profile
                </p>

                <p
                  onClick={() => navigate("/myappointment")}
                  className="px-4 py-2 rounded-full hover:bg-primary text-center cursor-pointer"
                >
                  My Appointments
                </p>

                <p
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="px-4 py-2 rounded-full hover:bg-primary text-center cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden md:block bg-primary text-white px-8 py-3 rounded-full"
          >
            CREATE ACCOUNT
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 cursor-pointer md:hidden"
          src={assets.menu_icon}
          alt=""
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          showMenu
            ? "fixed inset-0 w-screen h-screen"
            : "fixed top-0 right-0 w-0 h-0"
        } bg-white z-50 overflow-hidden transition-all duration-300 md:hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-6">
          <img className="w-36" src={assets.logo} alt="" />

          <img
            className="w-7 cursor-pointer"
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        {/* Mobile Links */}
        <ul className="flex flex-col items-center gap-5 text-lg font-medium mt-10">
          <NavLink to="/" onClick={() => setShowMenu(false)}>
            HOME
          </NavLink>

          <NavLink to="/doctors" onClick={() => setShowMenu(false)}>
            ALL DOCTORS
          </NavLink>

          <NavLink to="/about" onClick={() => setShowMenu(false)}>
            ABOUT
          </NavLink>

          <NavLink to="/contact" onClick={() => setShowMenu(false)}>
            CONTACT
          </NavLink>

          {!token && (
            <button
              onClick={() => {
                navigate("/login");
                setShowMenu(false);
              }}
              className="bg-primary text-white px-8 py-3 rounded-full mt-4"
            >
              CREATE ACCOUNT
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
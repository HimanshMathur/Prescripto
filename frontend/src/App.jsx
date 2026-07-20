import React from 'react'
import {Routes,Route} from "react-router-dom"
import Home from "./pages/Home.jsx"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Doctors from "./pages/Doctors" 
import MyProfile from "./pages/MyProfile"
import MyAppointment from "./pages/MyAppointment"
import Appointment from "./pages/Appointment"
import Error from "./pages/Error"
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <div className = 'mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/about" element = {<About/>}/>
        <Route path = "/contact" element = {<Contact/>}/>
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/doctors" element = {<Doctors/>}/>
        <Route path = "/myprofile" element = {<MyProfile/>}/>
        <Route path = "/myappointment" element = {<MyAppointment/>}/>
        <Route path = "/doctors/:speciality" element = {<Doctors/>}/>
        <Route path = "/appointment/:docId" element = {<Appointment/>}/>
        <Route path = "*" element = {<Error/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App;
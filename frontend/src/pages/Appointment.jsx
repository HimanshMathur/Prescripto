import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    let today = new Date();
    let allSlots = []; // Temporary array to avoid updating state incrementally in a loop

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(17, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        let day = currentDate.getDate()
        let month = currentDate.getMonth()+1
        let year = currentDate.getFullYear()

        const slotDate = day+"_"+month+"_"+year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if(isSlotAvailable){
           timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      if (timeSlots.length > 0) {
        allSlots.push(timeSlots);
      }
    }
    setDocSlots(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book Appointment");
      return navigate("/login");
    }

    // FIX: Guard clause to prevent booking without selecting a time slot
    if (!slotTime) {
      return toast.warn("Please select a time slot before booking");
    }

    try {
      // FIX: Guard clause for index safety
      if (!docSlots[slotIndex] || !docSlots[slotIndex][0]) {
        return toast.error("Invalid slot selection");
      }

      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/myappointment");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        {/* --------------Doctor Details----------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:max-w-72 bg-primary rounded-lg overflow-hidden flex items-end justify-center">
            <img
              src={
                docInfo.image?.startsWith("http")
                  ? docInfo.image
                  : `${backendUrl}${docInfo.image}`
              }
              alt={docInfo.name}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="flex-1 border border-gray-200 rounded-lg p-8 py-7 bg-white">
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p className="text-gray-600 text-md">
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs text-gray-500 rounded-full bg-white">
                {docInfo.experience}
              </button>
            </div>

            <div className="mt-3">
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1 leading-6">
                {docInfo.about}
              </p>
            </div>

            <p className="text-gray-900 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-900 font-semibold">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* -----Booking Slots------- */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-auto no-scrollbar mt-4">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime(""); // Reset selected time when day changes
                  }}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all duration-200 ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200 bg-white"
                  }`}
                >
                  <p className="text-xs">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p className="text-sm mt-1">{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex item-center gap-3 w-full overflow-x-auto no-scrollbar mt-4">
            {/* FIX: Safe Array mapping with optional chaining */}
            {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                    item.time === slotTime 
                      ? "bg-primary text-white" 
                      : "border border-gray-200 bg-white text-gray-600"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 hover:bg-opacity-90 transition-all duration-200">
            Book an Appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
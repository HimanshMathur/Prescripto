import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyAppointment = () => {
  const { token, backendUrl, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    // 🌟 PEHLE PRINT KARKE DEKHO KI BACKEND SE ORDER SAHI AA RAHA HAI YA NAHI
    console.log("Razorpay Order Object initialized:", order);

    if (!order || !order.id) {
      toast.error("Razorpay Order ID is missing from backend response!");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razorpay`,
            response,
            { headers: { token } },
          );
          if (data.success) {
            toast.success(data.message || "Payment Successful");
            getUserAppointments();
            getDoctorsData();
          } else {
            toast.error(data.message || "Verification Failed");
          }
        } catch (error) {
          console.log("Verification API Catch Error:", error);
          toast.error(error.message);
        }
      },
      prefill: {
        name: "Test User",
        email: "testuser@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#5f63b8",
      },
    };

    try {
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Razorpay Failure Details:", response.error);
        toast.error("Payment Step Cancelled or Failed");
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay SDK initialization failed:", err);
      toast.error("Failed to open Razorpay modal window.");
    }
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } },
      );

      // 🌟 YAHAN BACKEND RESPONSE KO BHI PRINT KARKE CHECK KARO
      console.log("Backend API Response Data:", data);

      if (data.success && data.order) {
        initPay(data.order);
      } else {
        toast.error(data.message || "Failed to create order from server.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 h-32 object-cover bg-indigo-50 rounded-lg"
                src={
                  item.image && item.image.startsWith("http")
                    ? item.docData.image
                    : `${backendUrl}${item.docData.image}`
                }
                alt={item.name}
                onError={(e) => {
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address</p>
              <p className="text-xs">{item.docData.address?.line1 || ""}</p>
              <p className="text-xs">{item.docData.address?.line2 || ""}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time :{" "}
                </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              {/* 🌟 FIXED: Using item.payment instead of item.isPaid */}
              {!item.cancelled && !item.payment && (
                <button
                  onClick={() => appointmentRazorpay(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}
              {item.cancelled &&(
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 bg-red-50 cursor-not-allowed">
                  Appointment cancelled
                </button>
              )}
              {item.payment && !item.cancelled && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-green-50 cursor-not-allowed">
                  Paid
                </button>
              )}
              {!item.cancelled && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;

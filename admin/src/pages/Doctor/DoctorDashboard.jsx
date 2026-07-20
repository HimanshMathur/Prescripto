import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, completeAppointment, cancelAppointment } =
    useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  // Loading state handling
  if (!dashData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Dashboard Loading...</p>
      </div>
    );
  }

  return (
    <div className="m-5">
      {/* Stats Cards */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 shadow-sm">
          <div>
            <p className="text-xl font-semibold text-gray-600">
              ₹{dashData.earnings || 0}
            </p>
            <p className="text-gray-400 text-sm">Earnings</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 shadow-sm">
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData.appointments || 0}
            </p>
            <p className="text-gray-400 text-sm">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 shadow-sm">
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData.patients || 0}
            </p>
            <p className="text-gray-400 text-sm">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings List */}
      <div className="bg-white mt-10 rounded border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
          <p className="font-semibold text-lg text-gray-700">Latest Bookings</p>
        </div>

        <div className="pt-4">
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center px-6 py-3 justify-between hover:bg-gray-50 border-b border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="rounded-full w-10 h-10 object-cover bg-gray-100"
                    src={
                      item.userData?.image ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                    }
                    alt="Patient"
                  />
                  <div>
                    <p className="text-gray-800 font-medium">
                      {item.userData?.name || "Patient"}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {item.slotDate} | {item.slotTime}
                    </p>
                  </div>
                </div>

                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">Completed</p>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="px-3 py-1 text-xs text-red-500 border border-red-200 rounded-full hover:bg-red-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => completeAppointment(item._id)}
                      className="px-3 py-1 text-xs text-green-600 border border-green-200 rounded-full hover:bg-green-50"
                    >
                      Complete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6 text-sm">No Bookings Yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
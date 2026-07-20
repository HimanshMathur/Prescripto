import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
    cancelAppointment,
    completeAppointment,
    backendUrl,
  } = useContext(AdminContext);
  const { slotDateFormat, currencySymbol } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b text-gray-600 bg-gray-50 font-medium">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* Table Body rows mapping */}
        {/* 🌟 FIXED: Added safe array verification (appointments && appointments.length > 0) */}
        {appointments && appointments.length > 0 ? (
          [...appointments].reverse().map((item, index) => (
            <div
              className="flex flex-wrap sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 transition-all duration-200"
              key={index}
            >
              <p className="max-sm:hidden">{index + 1}</p>

              {/* Patient Info */}
              <div className="flex items-center gap-3">
                <img
                  className="w-8 h-8 rounded-full object-cover bg-gray-200"
                  src={
                    item.userData?.image &&
                    (item.userData.image.startsWith("data:image") ||
                      item.userData.image.startsWith("http"))
                      ? item.userData.image
                      : `${backendUrl || "http://localhost:4000"}/${item.userData?.image?.replace(/^\//, "")}`
                  }
                  alt=""
                />
                <p className="text-gray-900 font-medium">
                  {item.userData?.name || "N/A"}
                </p>
              </div>

              {/* Patient Age */}
              <p className="max-sm:hidden">
                {item.userData?.dob
                  ? new Date().getFullYear() -
                    new Date(item.userData.dob).getFullYear()
                  : "N/A"}
              </p>

              {/* Slot Date & Time */}
              <p>
                {item.slotDate ? item.slotDate.replaceAll("_", " ") : ""} |{" "}
                {item.slotTime}
              </p>

              {/* Doctor Info */}
              <div className="flex items-center gap-3">
                <img
                  className="w-8 h-8 rounded-full object-cover bg-indigo-50"
                  src={
                    item.docData?.image &&
                    (item.docData.image.startsWith("data:image") ||
                      item.docData.image.startsWith("http"))
                      ? item.docData.image
                      : `${backendUrl || "http://localhost:4000"}/${item.docData?.image || ""}`.replace(
                          /([^:]\/)\/+/g,
                          "$1",
                        ) // 🌟 FIXED: Removes any accidental double slashes anywhere in the URL!
                  }
                  alt=""
                  onError={(e) => {
                    // Agar image server par delete ho chuki hai, toh default placeholder load ho jaye
                    e.target.src =
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA5uSURBUG==";
                  }}
                />
                <p className="text-gray-900 font-medium">
                  {item.docData?.name || "N/A"}
                </p>
              </div>

              {/* Fees */}
              <p>
                {currencySymbol || "₹"}
                {item.amount}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                      title="Cancel Appointment"
                    >
                      <span className="text-red-500 font-bold text-lg">
                        &times;
                      </span>
                    </button>

                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          /* Loading / Empty Fallback state */
          <div className="flex items-center justify-center py-10 text-gray-400">
            Loading appointments or no data found...
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;

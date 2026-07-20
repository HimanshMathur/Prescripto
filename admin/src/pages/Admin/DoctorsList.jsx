import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import verifiedIcon from "../../assets/verified_icon.svg";

const DoctorsList = () => {
  const {
    doctors,
    aToken,
    getAllDoctors,
    backendUrl,
    changeAvailability,
    deleteDoctor,
  } = useContext(AdminContext);

  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const confirmDelete = (docId, docName) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-800">
            Are you sure you want to delete{" "}
            <span className="font-bold">Dr. {docName}</span>?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                deleteDoctor(docId);
                closeToast();
              }}
              className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const formatAddress = (address) => {
    if (!address) return { line1: "", line2: "" };

    if (typeof address === "string") {
      try {
        return JSON.parse(address);
      } catch {
        return {
          line1: address,
          line2: "",
        };
      }
    }

    return address;
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-auto">
      <h1 className="text-xl font-semibold text-gray-800">All Doctors</h1>

      <div className="flex flex-wrap gap-6 pt-6">
        {doctors.map((item) => (
          <div
            key={item._id}
            onClick={() => setSelectedDoc(item)}
            className="w-60 bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-lg hover:-translate-y-2 duration-300 cursor-pointer group"
          >
            <img
              src={
                item.image.startsWith("http")
                  ? item.image
                  : `${backendUrl}${item.image}`
              }
              alt={item.name}
              className="w-full h-56 object-cover bg-indigo-50 group-hover:bg-primary transition-all"
            />

            <div className="p-4">

              {/* Name + Verified */}
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>

                <img
                  src={verifiedIcon}
                  alt="Verified"
                  title="Verified Doctor"
                  className="w-5 h-5"
                />
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {item.speciality}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={() => changeAvailability(item._id)}
                    className="cursor-pointer"
                  />

                  <span className="text-xs text-gray-600">
                    Available
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(item._id, item.name);
                  }}
                  className="px-3 py-1 text-xs rounded-md border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}

      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden">

            {/* Close */}
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-gray-100 text-xl cursor-pointer"
            >
              ✕
            </button>

            <div className="p-8">

              <div className="flex flex-col md:flex-row gap-8">

                {/* Image */}
                <div className="flex justify-center">
                  <img
                    src={
                      selectedDoc.image.startsWith("http")
                        ? selectedDoc.image
                        : `${backendUrl}${selectedDoc.image}`
                    }
                    alt={selectedDoc.name}
                    className="w-56 h-56 rounded-xl object-cover bg-indigo-50 border"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">

                  {/* Name */}
                  <div className="flex items-center gap-2">

                    <h2 className="text-3xl font-bold text-gray-800">
                      {selectedDoc.name}
                    </h2>

                    <img
                      src={verifiedIcon}
                      alt="Verified"
                      title="Verified Doctor"
                      className="w-7 h-7"
                    />

                  </div>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">

                    <p className="text-gray-600">
                      {selectedDoc.degree}
                    </p>

                    <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm">
                      {selectedDoc.speciality}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-600 text-sm">
                      {selectedDoc.experience}
                    </span>

                  </div>

                  {/* About */}
                  <div className="mt-6">

                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      About
                    </h3>

                    <p className="mt-2 text-gray-600 leading-7">
                      {selectedDoc.about ||
                        "No information available."}
                    </p>

                  </div>

                  {/* Fees */}
                  <div className="mt-6 flex items-center gap-3">

                    <span className="font-semibold text-gray-700">
                      Appointment Fee:
                    </span>

                    <span className="text-2xl font-bold text-primary">
                      ₹{selectedDoc.fees}
                    </span>

                  </div>

                  {/* Address */}
                  <div className="mt-6">

                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Clinic Address
                    </h3>

                    <p className="mt-2 text-gray-600 leading-6">
                      {formatAddress(selectedDoc.address).line1}
                      <br />
                      {formatAddress(selectedDoc.address).line2}
                    </p>

                  </div>

                  {/* Status */}
                  <div className="mt-6">

                    {selectedDoc.available ? (
                      <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        🟢 Available For Booking
                      </span>
                    ) : (
                      <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                        🔴 Not Available
                      </span>
                    )}

                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="border-t mt-8 pt-5 flex justify-end">

                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-6 py-2 rounded-lg bg-primary text-white hover:opacity-90 cursor-pointer"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default DoctorsList;
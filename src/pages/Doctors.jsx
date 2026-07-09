import React from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Doctors = () => {
  const { speciality } = useParams();
  const [FilterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);
  const Navigation = useNavigate();
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((item) => item.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };
  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);
  return (
    <div>
      <p className="text-gray-600 ">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex-col gap-4 text-sm text-gray-600">
          <p
            onClick={() => {
              speciality === "General physician"
                ? Navigation("/doctors")
                : Navigation("/doctors/General physician");
            }}
            className={`w-[94vw] mb-3 sm:w-auto  pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black": ""} `}
          >
            General physician
          </p>
          <p
            onClick={() => {
              speciality === "Gynecologist"
                ? Navigation("/doctors")
                : Navigation("/doctors/Gynecologist");
            }}
            className={`w-[94vw] mb-3 sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black": ""}`}
          >
            Gynecologist
          </p>
          <p
            onClick={() => {
              speciality === "Dermatologist"
                ? Navigation("/doctors")
                : Navigation("/doctors/Dermatologist");
            }}
            className={`w-[94vw] mb-3 sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black": ""}`}
          >
            Dermatologist
          </p>
          <p
            onClick={() => {
              speciality === "Pediatricians"
                ? Navigation("/doctors")
                : Navigation("/doctors/Pediatricians");
            }}
            className={`w-[94vw] mb-3 sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black": ""}`}
          >
            Pediatricians
          </p>
          <p
            onClick={() => {
              speciality === "Neurologist"
                ? Navigation("/doctors")
                : Navigation("/doctors/Neurologist");
            }}
            className={`w-[94vw] mb-3 sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black": ""}`}
          >
            Neurologist
          </p>
          <p
            onClick={() => {
              speciality === "Gastroenterologist"
                ? Navigation("/doctors")
                : Navigation("/doctors/Gastroenterologist");
            }}
            className={`w-[94vw] mb-3 sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black": ""}`}
          >
            Gastroenterologist
          </p>
        </div>

        <div className="w-full grid grid-cols-4 gap-4 gap-y-6">
          {FilterDoc.map((item, idex) => {
            return (
              <div
                key={idex}
                onClick={() => {
                  Navigation(`/appointment/${item._id}`);
                }}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition all duration-500"
              >
                <img className="bg-blue-50" src={item.image} alt="" />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-center text-green-500 font-semibold">
                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                    <p>Available</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p>{item.speciality}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Doctors;

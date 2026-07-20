import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  // 🛠️ FIX: Top par hi ek baar data aur backendUrl safely destructure kar liya
  const { doctors, backendUrl } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, speciality]);

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div>
      <p className="text-gray-600">
        Browse through the doctors specialist.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Left Side */}
        <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
          {/* Mobile Filter Button */}
          <button
            className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
              showFilter ? "bg-primary text-white" : ""
            }`}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            Filters
          </button>

          {/* Filter List */}
          <div
            className={`${
              showFilter ? "flex" : "hidden"
            } sm:flex flex-col gap-3 text-sm text-gray-600`}
          >
            {specialities.map((item, index) => (
              <p
                key={index}
                onClick={() =>
                  speciality === item
                    ? navigate("/doctors")
                    : navigate(`/doctors/${item}`)
                }
                className={`w-full sm:w-52 pl-3 py-2 border rounded cursor-pointer transition-all ${
                  speciality === item
                    ? "bg-indigo-100 text-black border-indigo-400"
                    : "border-gray-300"
                }`}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Doctors List */}
        <div
          className="
            w-full
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-5
          "
        >
          {filterDoc.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300"
            >
              {/* 🛠️ DYNAMIC IMAGE SRC FIX: Code comments removed from JSX flow */}
              <img 
                className="w-full h-48 object-cover bg-blue-50"
                src={item.image.startsWith('http') ? item.image : `${backendUrl}${item.image}`} 
                alt={item.name} 
              />

              <div className="p-4">
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p>Available</p>
                </div>

                <p className="font-semibold text-lg mt-2">
                  {item.name}
                </p>

                <p className="text-gray-600">
                  {item.speciality}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
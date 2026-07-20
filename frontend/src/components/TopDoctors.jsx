import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
const TopDoctors = () => {
  const Navigation = useNavigate();
  const { doctors, backendUrl } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-gray-800 md:mx-10 lg:mx-20">
      <h1 className="font-medium text-3xl">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 justify-center items-center sm:px-0">
        {doctors.slice(0, 10).map((item, idex) => {
          return (
            <div
              key={idex}
              onClick={() => {
                Navigation(`/appointment/${item._id}`);
              }}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition all duration-500"
            >
              <img
                src={
                  item.image.startsWith("http")
                    ? item.image
                    : `${backendUrl}${item.image}`
                }
                alt={item.name}
                className="w-full h-48 object-cover bg-blue-50"
              />
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
      <div className="px-4 flex justify-center gap-4 mt-14">
        <button
          onClick={() => {
            Navigation("/doctors");
            scroll(0, 0);
          }}
          className="w-56 bg bg-blue-200 px-4 py-2 rounded-full font-semibold"
        >
          more
        </button>
      </div>
    </div>
  );
};

export default TopDoctors;

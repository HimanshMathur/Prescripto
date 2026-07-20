import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  // Component load hone par ya token active hone par profile data fetch trigger karega
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  // Data ko backend database par update karne ka function
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);
      formData.append(
        "address",
        JSON.stringify(userData.address || { line1: "", line2: "" }),
      );

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);

        // 🛠️ FORCE REFRESH FIX: Context API trigger karne ke sath-sath local image preview reset karo
        setImage(false);
        setIsEdit(false);

        // Kuch cases mein context sync instant nahi hota, isliye trigger explicitly reset karega
        await loadUserProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Jab tak context se data safely initialize na ho, loading render hogi
  if (!userData) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl font-medium text-gray-600 animate-pulse">
          Loading Profile...
        </p>
      </div>
    );
  }

  return (
    userData && (
      <div className="max-w-4xl mx-auto p-8">
        {/* 📸 IMAGE SECTION: Preview, Upload Box & Hover Effects */}
        <div className="flex flex-col items-start gap-4 mb-6">
          {isEdit ? (
            <label
              htmlFor="image"
              className="cursor-pointer relative block w-36 h-36 group"
            >
              <div className="relative w-36 h-36 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-all duration-300">
                <img
                  className="w-full h-full object-cover group-hover:opacity-50 transition-all duration-300"
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : userData.image &&
                          (userData.image.startsWith("data:image") ||
                            userData.image.startsWith("http"))
                        ? userData.image
                        : `${backendUrl}${userData.image}`
                  }
                  alt="Upload Preview"
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                  }}
                />
                {/* Image badalne ke liye hover mask layout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white text-xs text-center p-2 font-medium">
                  <span className="text-lg">📸</span>
                  <span>Change Photo</span>
                </div>
              </div>
              <input
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setImage(e.target.files[0]);
                  }
                }}
                type="file"
                id="image"
                accept="image/*"
                hidden
              />
            </label>
          ) : (
            <div className="w-36 h-36 rounded-lg overflow-hidden border border-gray-200">
              <img
                className="w-full h-full object-cover"
                src={
                  userData.image && (userData.image.startsWith("data:image") || userData.image.startsWith("http"))
                    ? userData.image
                    : `${backendUrl}${userData.image}`
                }
                alt={userData.name}
                onError={(e) => {
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
              />
            </div>
          )}
        </div>

        {/* NAME SECTION */}
        <div className="mt-4">
          {isEdit ? (
            <input
              type="text"
              value={userData.name || ""}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className="border px-3 py-1.5 text-3xl font-semibold w-full max-w-sm rounded-md focus:outline-primary"
            />
          ) : (
            <h1 className="text-3xl font-semibold text-gray-800">
              {userData.name}
            </h1>
          )}
        </div>

        <hr className="my-6" />

        {/* CONTACT INFORMATION */}
        <div className="mb-8">
          <h2 className="text-gray-500 font-semibold underline mb-5">
            CONTACT INFORMATION
          </h2>

          <div className="grid grid-cols-[150px_1fr] gap-y-4">
            <p className="font-medium text-gray-600">Email :</p>
            <p className="text-blue-600 font-medium">{userData.email}</p>

            <p className="font-medium text-gray-600">Phone :</p>
            {isEdit ? (
              <input
                type="text"
                value={userData.phone || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    phone: e.target.value,
                  })
                }
                className="border px-2 py-1 max-w-xs rounded-md focus:outline-primary"
              />
            ) : (
              <p className="text-blue-600">
                {userData.phone || "Not Provided"}
              </p>
            )}

            <p className="font-medium text-gray-600">Address :</p>
            {isEdit ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={userData.address?.line1 || ""}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      address: {
                        ...(userData.address || {}),
                        line1: e.target.value,
                      },
                    })
                  }
                  className="border px-2 py-1 max-w-md rounded-md focus:outline-primary"
                  placeholder="Address Line 1"
                />

                <input
                  type="text"
                  value={userData.address?.line2 || ""}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      address: {
                        ...(userData.address || {}),
                        line2: e.target.value,
                      },
                    })
                  }
                  className="border px-2 py-1 max-w-md rounded-md focus:outline-primary"
                  placeholder="Address Line 2"
                />
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {userData.address?.line1 || "No Address Line 1"}
                <br />
                {userData.address?.line2 || "No Address Line 2"}
              </p>
            )}
          </div>
        </div>

        {/* BASIC INFORMATION */}
        <div>
          <h2 className="text-gray-500 font-semibold underline mb-5">
            BASIC INFORMATION
          </h2>

          <div className="grid grid-cols-[150px_1fr] gap-y-4">
            <p className="font-medium text-gray-600">Gender :</p>
            {isEdit ? (
              <select
                value={userData.gender || "Male"}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    gender: e.target.value,
                  })
                }
                className="border px-2 py-1 max-w-xs rounded-md focus:outline-primary bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-gray-700">
                {userData.gender || "Not Specified"}
              </p>
            )}

            <p className="font-medium text-gray-600">Birthday :</p>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    dob: e.target.value,
                  })
                }
                className="border px-2 py-1 max-w-xs rounded-md focus:outline-primary"
              />
            ) : (
              <p className="text-gray-700">{userData.dob || "Not Specified"}</p>
            )}
          </div>
        </div>

        {/* DYNAMIC ACTION TRIGGER BUTTON */}
        <button
          onClick={isEdit ? updateUserProfileData : () => setIsEdit(true)}
          className="mt-10 border border-primary text-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white duration-300 font-medium shadow-sm"
        >
          {isEdit ? "Save Information" : "Edit"}
        </button>
      </div>
    )
  );
};

export default MyProfile;
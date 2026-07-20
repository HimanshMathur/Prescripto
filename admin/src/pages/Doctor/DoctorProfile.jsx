import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);

  const [isEdit, setIsEdit] = useState(false);

  // Helper Function: HTTPS Image URL formatting & Fallback Avatar

  
  const getProfileImage = (imgSrc) => {
    if (!imgSrc) {
      return "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop"; 
    }
    // Agar image URL relative path (/uploads/...) hai, toh backend domain prefix lagayega
    if (imgSrc.startsWith('/')) {
      return `${backendUrl}${imgSrc}`;
    }
    // HTTP ko HTTPS URL me auto-convert karne ke liye
    if (imgSrc.startsWith('http://')) {
      return imgSrc.replace('http://', 'https://');
    }
    return imgSrc;
  };

  // Profile Update Function
  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
        about: profileData.about
      };

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`, 
        updateData, 
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message || "Profile Updated Successfully");
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  // Loading State
  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Loading Profile...</p>
      </div>
    );
  }

  // Safe Address Parse
  const addressObj = typeof profileData.address === 'string' 
    ? JSON.parse(profileData.address || '{}') 
    : (profileData.address || {});

  return (
    <div className="max-w-4xl mx-auto m-5 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-8">
        
        {/* Left Side: Profile Image with HTTPS / Fallback logic */}
        <div className="flex-shrink-0">
          <img 
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg object-cover bg-blue-50 shadow-sm border" 
            src={getProfileImage(profileData.image)} 
            alt={profileData.name || "Doctor Profile"} 
            onError={(e) => {
              // Image URL broken hone par automatic fallback image replace kar dega
              e.target.src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop";
            }}
          />
        </div>

        {/* Right Side: Doctor Info */}
        <div className="flex-1 text-gray-700">
          
          {/* Name & Speciality */}
          <h1 className="text-3xl font-semibold text-gray-800">{profileData.name}</h1>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{profileData.degree} - {profileData.speciality}</p>
            <span className="py-0.5 px-2.5 border text-xs rounded-full font-medium border-blue-200 bg-blue-50 text-blue-600">
              {profileData.experience}
            </span>
          </div>

          {/* About Section */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-800">About:</p>
            {isEdit ? (
              <textarea 
                className="w-full mt-1 p-2 border rounded-md text-sm focus:outline-blue-500"
                rows="3"
                value={profileData.about || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
              />
            ) : (
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{profileData.about}</p>
            )}
          </div>

          {/* Appointment Fees */}
          <p className="text-gray-600 font-medium mt-4">
            Appointment fee: <span className="text-gray-800 font-semibold">
              ₹{isEdit ? (
                <input 
                  type="number" 
                  className="border px-2 py-0.5 rounded w-24 text-sm inline-block"
                  value={profileData.fees || 0}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                />
              ) : profileData.fees}
            </span>
          </p>

          {/* Address Section */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-800">Address:</p>
            <div className="text-sm text-gray-600 mt-1">
              {isEdit ? (
                <div className="flex flex-col gap-2 max-w-xs">
                  <input 
                    type="text" 
                    className="border px-2 py-1 rounded text-sm"
                    value={addressObj.line1 || ''} 
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      address: { ...addressObj, line1: e.target.value } 
                    }))}
                  />
                  <input 
                    type="text" 
                    className="border px-2 py-1 rounded text-sm"
                    value={addressObj.line2 || ''} 
                    onChange={(e) => setProfileData(prev => ({ 
                      ...prev, 
                      address: { ...addressObj, line2: e.target.value } 
                    }))}
                  />
                </div>
              ) : (
                <p>
                  {addressObj.line1}
                  <br />
                  {addressObj.line2}
                </p>
              )}
            </div>
          </div>

          {/* Availability Checkbox */}
          <div className="flex items-center gap-2 mt-4">
            <input 
              type="checkbox" 
              id="available"
              checked={profileData.available || false} 
              onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
              disabled={!isEdit}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer disabled:cursor-not-allowed"
            />
            <label htmlFor="available" className="text-sm text-gray-700 font-medium cursor-pointer">
              Available for Appointments
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-6">
            {isEdit ? (
              <button 
                onClick={updateProfile} 
                className="px-5 py-2 bg-blue-600 text-white text-sm rounded-full shadow hover:bg-blue-700 transition-all">
                Save Changes
              </button>
            ) : (
              <button 
                onClick={() => setIsEdit(true)} 
                className="px-5 py-2 border border-blue-600 text-blue-600 text-sm rounded-full hover:bg-blue-600 hover:text-white transition-all">
                Edit Profile
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const { aToken, dashData, getDashData, cancelAppointment, backendUrl } = useContext(AdminContext)
  const DEFAULT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA5uSURBUG==";

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  if (!dashData) {
    return <div className="p-5 text-gray-500 font-medium">Loading Dashboard Data...</div>
  }

  return (
    <div className='m-5 w-full max-w-6xl'>
      
      {/* 📊 Top Stat Cards Section */}
      <div className='flex flex-wrap gap-5 mb-8'>
        
        {/* Doctors Card */}
        <div className='flex items-center gap-4 bg-white p-6 min-w-56 rounded-xl border border-gray-100 shadow-sm hover:scale-105 transition-all duration-300'>
          <img className='w-12 bg-blue-50 p-2 rounded-lg' src={assets.doctor_icon || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} alt="Doctors" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>{dashData.doctors}</p>
            <p className='text-gray-400 text-sm'>Doctors</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className='flex items-center gap-4 bg-white p-6 min-w-56 rounded-xl border border-gray-100 shadow-sm hover:scale-105 transition-all duration-300'>
          <img className='w-12 bg-blue-50 p-2 rounded-lg' src={assets.appointments_icon || "https://cdn-icons-png.flaticon.com/512/2693/2693507.png"} alt="Appointments" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>{dashData.appointments}</p>
            <p className='text-gray-400 text-sm'>Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className='flex items-center gap-4 bg-white p-6 min-w-56 rounded-xl border border-gray-100 shadow-sm hover:scale-105 transition-all duration-300'>
          <img className='w-12 bg-blue-50 p-2 rounded-lg' src={assets.patients_icon || "https://cdn-icons-png.flaticon.com/512/2922/2922503.png"} alt="Patients" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>{dashData.patients}</p>
            <p className='text-gray-400 text-sm'>Patients</p>
          </div>
        </div>

      </div>

      {/* 📋 Latest Appointments Section */}
      <div className='bg-white border rounded-xl shadow-sm'>
        <div className='flex items-center gap-2.5 px-6 py-4 border-b bg-gray-50/50 rounded-t-xl'>
          <img className='w-5' src={assets.list_icon || "https://cdn-icons-png.flaticon.com/512/565/565547.png"} alt="" />
          <p className='font-semibold text-gray-800'>Latest Appointment</p>
        </div>

        <div className='pt-2'>
          {dashData.latestAppointments && dashData.latestAppointments.map((item, index) => (
            <div className='flex items-center px-6 py-3.5 gap-4 justify-between hover:bg-gray-50/80 border-b last:border-b-0 transition-colors duration-200' key={index}>
              
              <div className='flex items-center gap-3'>
                {/* 🌟 Doctor Image with Safe URL Formatting */}
                <img 
                  className='w-11 h-11 rounded-full object-cover border bg-gray-50'
                  src={
                    item.docData?.image && (item.docData.image.startsWith("data:image") || item.docData.image.startsWith("http"))
                      ? item.docData.image 
                      : `${backendUrl || 'http://localhost:4000'}/${item.docData?.image || ''}`.replace(/([^:]\/)\/+/g, "$1")
                  } 
                  alt={item.docData?.name || ''} 
                  onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                />
                <div>
                  <p className='text-gray-900 font-medium text-base'>{item.docData?.name || 'N/A'}</p>
                  <p className='text-gray-400 text-xs mt-0.5'>Booking on {item.slotDate ? item.slotDate.replaceAll('_', ' ') : ''}</p>
                </div>
              </div>

              {/* Action Buttons handling (Cross out or status display) */}
              <div>
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium bg-red-50 px-2.5 py-1 rounded-full border border-red-100'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium bg-green-50 px-2.5 py-1 rounded-full border border-green-100'>Completed</p>
                ) : (
                  <button 
                    onClick={() => {
                      cancelAppointment(item._id);
                      getDashData(); // Refresh state after cancel actions
                    }}
                    className='w-8 h-8 flex items-center justify-center rounded-full bg-red-50/50 hover:bg-red-100 text-red-500 font-bold transition-colors shadow-sm border border-red-100/50'
                    title="Cancel Booking"
                  >
                    &times;
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
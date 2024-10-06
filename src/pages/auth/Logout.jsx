import React, { useState } from 'react';
import { MdLogout } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import Toastify from "../../components/Toastify";
import { IoIosLock } from 'react-icons/io';
import { FaCaretRight } from 'react-icons/fa';

export default function Logout() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      localStorage.clear(); 
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className='font-figtree'>
      <Toastify />

      <div className="bg-blue-500 hover:bg-blue-600 rounded-full p-1 cursor-pointer" onClick={openModal}>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center justify-center bg-blue-800 text-blue-400 py-1 rounded-tl-full rounded-bl-full">
            <IoIosLock size={18} />
          </div>
          <div className="flex space-x-2 col-span-2 text-white">
            <p className="font-medium text-xs uppercase self-center">Logout</p>
            <FaCaretRight className='self-center'/>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/3 lg:w-1/2 xl:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Logout User</h3>
            <div className="flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-exclamation-triangle-fill w-12 h-12 text-red-600" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              <div className="ml-4">
                <p className="font-semibold text-base">You are about to log out of your account.</p>
                <p className="text-xs"> This action will end your session, and you will need to log in again to access your account.</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={closeModal} className="py-2 px-4 border border-gray-400 text-gray-500 uppercase text-xs">Cancel</button>
              <button onClick={handleSubmit} className="py-2 px-4 bg-red-600 text-white uppercase text-xs">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

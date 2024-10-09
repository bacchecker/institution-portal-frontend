import React, { Component } from 'react';
import { MdLogout } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import Toastify from "../../components/Toastify";
import { FaSignOutAlt } from 'react-icons/fa';

class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  openModal = () => {
    this.setState({ isOpen: true });
    //this.props.handleMenuItemClick()
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      localStorage.clear(); 
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  render() {
    const { isOpen } = this.state;

    return (
      <div className='font-figtree'>
        <Toastify />

        <li
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={this.openModal}
        >
          <FaSignOutAlt size={16} />
          <span>Logout</span>
        </li>

        {isOpen && (
          <div className="fixed inset-0 flex items-center backdrop-blur-sm justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-2/3 lg:w-1/2 xl:w-1/3">
              <h3 className="text-lg font-semibold mb-4">Logout User</h3>
              <div className="flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-exclamation-triangle-fill w-12 h-12 text-red-600" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <div className="ml-4">
                  <p className="font-semibold text-base">You are about to log out of your account.</p>
                  <p className="text-xs">This action will end your session, and you will need to log in again to access your account.</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={this.closeModal} className="py-2 px-4 border border-gray-400 text-gray-500 uppercase text-xs">Cancel</button>
                <button onClick={this.handleSubmit} className="py-2 px-4 bg-red-600 text-white uppercase text-xs">Logout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Logout;

import React from 'react';
import { FaBars } from 'react-icons/fa';
import instLogo from '../images/uewlogo.png'

class Navbar extends React.Component {
  render() {
    const { toggleSidebar, toggleSidebarCollapse, user } = this.props;

    return (
      <div className="text-gray-800 bg-white px-4 py-2 flex justify-between items-center border-b">
        <div className="flex items-center">
          {/* Sidebar Toggle Button (Mobile) */}
          <button className="md:hidden focus:outline-none" onClick={toggleSidebar}>
            <FaBars />
          </button>

          {/* Sidebar Collapse Button (Wide Screens) */}
          <button className="hidden md:block focus:outline-none ml-4" onClick={toggleSidebarCollapse}>
            <FaBars />
          </button>

          <h1 className="text-xl ml-4">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="flex items-center space-x-2">
            <img
              src={instLogo}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="w-44 text-sm">
                <p>University of Education Winneba</p>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;

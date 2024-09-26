import React, { Component } from 'react';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import { BsChevronDown } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import withRouter from './withRouter';
import logo from '../images/back-logo.png';
import minLogo from '../images/bclogo.jpg';
import { BiSolidDashboard } from 'react-icons/bi';
import { IoDocuments } from 'react-icons/io5';
class Sidebar extends Component {
  state = {
    activeMenu: '',
  };

  toggleSubMenu = (menu) => {
    this.setState({ activeMenu: this.state.activeMenu === menu ? '' : menu });
  };

  handleLinkClick = () => {
    // Close sidebar only when routing to a new page on mobile
    if (window.innerWidth < 768) {
      this.props.closeSidebar();
    }
  };

  isActive = (path) => {
    return this.props.location.pathname === path;
  }

  render() {
    const { activeMenu } = this.state;
    const { isVisible, isCollapsed, location } = this.props;

    return (
      <div
        className={`fixed inset-y-0 left-0 text-gray-800 bg-white transition-all duration-700 z-50 border-r
          ${isCollapsed ? 'w-16' : 'w-44 xl:w-64'} 
          ${isVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className={`flex justify-center items-center ${isCollapsed ? 'p-0' : 'py-1 px-4'} bg-white border-b`}>
            <img src={isCollapsed ? minLogo : logo} alt="" className={`${isCollapsed ? 'h-14 w-auto' : 'h-12 w-auto'}`}/>
        </div>

        <nav className="mt-10">
          <ul>
          
            <li
              className={`flex items-center py-3 cursor-pointer ${
                this.isActive('/institution/dashboard') ? 'bg-primaryRed text-white' : 'hover:text-primaryRed text-gray-500'
              }`}
            >
              <div className={`w-1 h-6 ${this.isActive('/institution/dashboard') ? 'bg-white' : 'hidden'} rounded-tr-full rounded-br-full`}></div>
              <Link to="/institution/dashboard" onClick={this.handleLinkClick}>
                <BiSolidDashboard
                  className={`inline-block mr-2 -mt-1 ${this.isActive('/institution/dashboard') ? 'text-white ml-4' : 'text-gray-400 hover:text-primaryRed ml-5'}`}
                  size={20}
                />

                <span className={`${isCollapsed ? 'hidden' : 'inline self-center'}`}>Dashboard</span>
              </Link>
            </li>

            <li
              className={`flex items-center py-3 cursor-pointer ${
                this.isActive('/institution/documents') ? 'bg-primaryRed text-white' : 'hover:text-primaryRed text-gray-500'
              }`}
            >
              <div className={`w-1 h-6 ${this.isActive('/institution/documents') ? 'bg-white' : 'hidden'} rounded-tr-full rounded-br-full`}></div>
              <Link to="/institution/documents" onClick={this.handleLinkClick}>
                <IoDocuments
                  className={`inline-block mr-2 -mt-1 ${this.isActive('/institution/documents') ? 'text-white ml-4' : 'text-gray-400 hover:text-primaryRed ml-5'}`}
                  size={20} 
                />
                <span className={`${isCollapsed ? 'hidden' : 'inline self-center'}`}>Requests</span>
              </Link>
            </li>

            

            {/* User Menu with Submenus */}
            <li>
              <div
                className="p-4 hover:bg-gray-700 cursor-pointer flex justify-between"
                onClick={() => this.toggleSubMenu('user')}
              >
                <div>
                  <FaUser className="inline-block mr-2" />
                  <span className={`${isCollapsed ? 'hidden' : 'inline'}`}>User</span>
                </div>
                <BsChevronDown />
              </div>

              {/* Submenu Items */}
              {!isCollapsed && activeMenu === 'user' && (
                <ul className="pl-6">
                  <li className="p-2 hover:bg-gray-600 cursor-pointer">
                    <Link to="/profile" onClick={this.handleLinkClick}>
                      Profile
                    </Link>
                  </li>
                  <li className="p-2 hover:bg-gray-600 cursor-pointer">
                    <Link to="/settings" onClick={this.handleLinkClick}>
                      Settings
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Settings Menu */}
            <li>
              <div
                className="p-4 hover:bg-gray-700 cursor-pointer flex justify-between"
                onClick={() => this.toggleSubMenu('settings')}
              >
                <div>
                  <FaCog className="inline-block mr-2" />
                  <span className={`${isCollapsed ? 'hidden' : 'inline'}`}>Settings12</span>
                </div>
                <BsChevronDown />
              </div>

              {/* Submenu Items */}
              {!isCollapsed && activeMenu === 'settings' && (
                <ul className="pl-6">
                  <li className="p-2 hover:bg-gray-600 cursor-pointer">
                    <Link to="/general" onClick={this.handleLinkClick}>
                      General
                    </Link>
                  </li>
                  <li className="p-2 hover:bg-gray-600 cursor-pointer">
                    <Link to="/security" onClick={this.handleLinkClick}>
                      Security
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default withRouter(Sidebar);

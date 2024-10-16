import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "./withRouter";
import { BiSolidDashboard } from "react-icons/bi";
import { IoDocuments } from "react-icons/io5";
import { GrDocumentConfig } from "react-icons/gr";
import { FaCircleUser, FaUser, FaUsers } from "react-icons/fa6";
import axios from "../axiosConfig";
import { MdAssignmentInd, MdAttachEmail } from "react-icons/md";
import { PiCertificateLight } from "react-icons/pi";

class Sidebar extends Component {
  state = {
    activeMenu: "",
    isCollapsed: this.props.isCollapsed,
    institutionProfile: null,
    institutionStatus: null,
  };

  toggleSubMenu = (menu) => {
    this.setState({ activeMenu: this.state.activeMenu === menu ? "" : menu });
  };

  handleLinkClick = () => {
    if (window.innerWidth < 768) {
      this.props.closeSidebar();
    }
  };

  isActive = (path) => {
    return this.props.location.pathname.startsWith(path);
  };  

  toggleSidebar = () => {
    this.setState((prevState) => ({
      isCollapsed: !prevState.isCollapsed,
    }));
  };

  componentDidMount() {
    this.fetchInstitution();
  }

  fetchInstitution = async () => {
    try {
      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData;

      const { status, profile_complete } = institutionData;
        this.setState({
          institutionStatus: status !== 'inactive',  // Set to true if status is not 'inactive'
          institutionProfile: profile_complete === 'yes'  // Set to true if profile is complete
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  render() {
    const { isVisible, isCollapsed } = this.props;

    return (
      <div className="font-figtree">
        {/* Overlay for mobile screens */}
        {isVisible && (
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm z-20 md:hidden"
            onClick={this.props.closeSidebar} // Close sidebar on click outside
          ></div>
        )}
        
        <div
          className={`fixed inset-y-0 left-0 text-gray-800 bg-white transition-all duration-700 z-40 border-r
            ${isCollapsed ? "w-16" : "w-60 lg:w-[17%]"} 
            ${isVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div
            className={`flex justify-center items-center ${
              isCollapsed ? "p-0" : "py-1.5 xl:py-[3px] px-4"
            } bg-white border-b`}
          >
            <img
              src={isCollapsed ? "/images/bclogo.jpg" : "/images/back-logo.png"}
              alt=""
              className={`${isCollapsed ? "h-14 w-auto" : "lg:h-[42px] xl:h-12 w-auto"}`}
            />
          </div>
          <nav className="mt-10">
            {this.state.institutionProfile == null ? (
              
            <div role="status" className="p-4 rounded animate-pulse">
                
                <div className="flex items-center mb-8">
                  <svg className="w-6 h-6 me-3 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                  </svg>
                  <div>
                      <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-2"></div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center mb-8">
                  <svg className="w-6 h-6 me-3 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                  </svg>
                  <div>
                      <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-2"></div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center mb-8">
                  <svg className="w-6 h-6 me-3 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                  </svg>
                  <div>
                      <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-2"></div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 me-3 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                  </svg>
                  <div>
                      <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-2"></div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <span className="sr-only">Loading...</span>
            </div>
            ): this.state.institutionStatus === false ? (

            <div>
              <ul>
                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/dashboard")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/dashboard") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link onClick={this.handleLinkClick}>
                    <BiSolidDashboard
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/dashboard")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span
                      className={`${isCollapsed ? "hidden" : "inline self-center"}`}
                    >
                      Dashboard
                    </span>
                  </Link>
                </li>

                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/document-requests")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/document-requests") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link
                    
                    onClick={this.handleLinkClick}
                  >
                    <IoDocuments
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/document-requests")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span
                      className={`${isCollapsed ? "hidden" : "inline self-center"}`}
                    >
                      Requests
                    </span>
                  </Link>
                </li>

                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/staff")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/staff") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link onClick={this.handleLinkClick}>
                    <FaCircleUser
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/staff")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span
                      className={`${isCollapsed ? "hidden" : "inline self-center"}`}
                    >
                      Staff
                    </span>
                  </Link>
                </li>
                

                
              </ul>
            </div>
            ): this.state.institutionProfile === true ? (

            <div>
              <ul>
                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/dashboard")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/dashboard") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link to="/dashboard" onClick={this.handleLinkClick}>
                    <BiSolidDashboard
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/dashboard")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span
                      className={`${isCollapsed ? "hidden" : "inline self-center"}`}
                    >
                      Dashboard
                    </span>
                  </Link>
                </li>

                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/document-requests")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/document-requests") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link
                    to="/document-requests"
                    onClick={this.handleLinkClick}
                  >
                    <IoDocuments
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/document-requests")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span
                      className={`${isCollapsed ? "hidden" : "inline self-center"}`}
                    >
                      Requests
                    </span>
                  </Link>
                </li>

                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/staff")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/staff") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link to="/staff" onClick={this.handleLinkClick}>
                    <FaCircleUser
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/staff")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span
                      className={`${isCollapsed ? "hidden" : "inline self-center"}`}
                    >
                      Staff
                    </span>
                  </Link>
                </li>
                

                
              </ul>
            </div>
            ):(
              <ul>
                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/account-profile")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/account-profile") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link to="/account-profile" onClick={this.handleLinkClick}>
                    <FaUser
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/account-profile")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span className={`${isCollapsed ? "hidden" : "inline self-center"}`}>
                      Account Profile
                    </span>
                  </Link>
                </li>
                {/* <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/roles-permissions")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/roles-permissions") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link to="/roles-permissions" onClick={this.handleLinkClick}>
                    <MdAssignmentInd
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/roles-permissions")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span className={`${isCollapsed ? "hidden" : "inline self-center"}`}>
                      Roles & Permissions
                    </span>
                  </Link>
                </li> */}
                
                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/document-types")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/document-types") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link to="/document-types" onClick={this.handleLinkClick}>
                    <GrDocumentConfig
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/document-types")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span className={`${isCollapsed ? "hidden" : "inline self-center"}`}>
                      Document Types
                    </span>
                  </Link>
                </li>
                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/operations-certificate")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/operations-certificate") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link to="/operations-certificate" onClick={this.handleLinkClick}>
                    <PiCertificateLight
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/operations-certificate")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={20}
                    />
                    <span className={`${isCollapsed ? "hidden" : "inline self-center"}`}>
                      Operations Certificate
                    </span>
                  </Link>
                </li>
                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/institution-teams")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/institution-teams") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link to="/institution-teams" onClick={this.handleLinkClick}>
                    <FaUsers
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/institution-teams")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span className={`${isCollapsed ? "hidden" : "inline self-center"}`}>
                      Setup Team
                    </span>
                  </Link>
                </li>
                <li
                  className={`flex items-center py-3 cursor-pointer ${
                    this.isActive("/letter-templates")
                      ? "bg-primaryRed text-white"
                      : "hover:text-primaryRed text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1 h-6 ${
                      this.isActive("/letter-templates") ? "bg-white" : "hidden"
                    } rounded-tr-full rounded-br-full`}
                  ></div>
                  <Link to="/letter-templates" onClick={this.handleLinkClick}>
                    <MdAttachEmail
                      className={`inline-block mr-2 -mt-1 ${
                        this.isActive("/letter-templates")
                          ? "text-white ml-4"
                          : "text-gray-400 hover:text-primaryRed ml-5"
                      }`}
                      size={17}
                    />
                    <span className={`${isCollapsed ? "hidden" : "inline self-center"}`}>
                      Letter Templates
                    </span>
                  </Link>
                </li>
              </ul>
            )}
          </nav>
            
          
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);

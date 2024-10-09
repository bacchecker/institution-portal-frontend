import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "./withRouter";
import { BiSolidDashboard } from "react-icons/bi";
import { IoDocuments } from "react-icons/io5";
import { GrDocumentConfig } from "react-icons/gr";
import { FaCircleUser } from "react-icons/fa6";
import axios from "../axiosConfig";

class Sidebar extends Component {
  state = {
    activeMenu: "",
    isCollapsed: this.props.isCollapsed,
    institutionInfo: []
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

      if (institutionData) {
        this.setState({
          institutionInfo: institutionData,
        });
      }
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
            <ul className={`${this.state.institutionInfo.status == 'inactive' ? 'cursor-not-allowed' : ''}`}>
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

              
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);

import React from "react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import withRouter from '../components/withRouter'
import Logout from "../pages/auth/Logout";
import axios from "../axiosConfig";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogoutModalOpen: false,
      userData: [],
      showMenu: false,
      institutionStatus: null
    };
    this.menuRef = React.createRef();
  }

  handleClickOutside = (event) => {
    if (this.menuRef.current && !this.menuRef.current.contains(event.target)) {
      this.setState({ showMenu: false });
    }
  };

  toggleMenu = () => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };

  handleLogoutClick = () => {
    this.setState({ isLogoutModalOpen: true });
  };

  fetchUserData = async () => {
    try {
      const response = await axios.get("/institution/user-data");
      const institutionData = response.data.userData;

      if (institutionData) {
        this.setState({
          userData: institutionData
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  fetchInstitution = async () => {
    try {
      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData;

      const { status } = institutionData;
        this.setState({
          institutionStatus: status !== 'inactive'
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentDidMount() {
    this.fetchUserData();
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  closeLogoutModal = () => {
    this.setState({ isLogoutModalOpen: false });
  };
  handleMenuItemClick = () => {
      // Close the menu after clicking an item
      this.setState({ showMenu: false });
    };

  render() {
    const { toggleSidebar, toggleSidebarCollapse, user } = this.props;
    const {userData, showMenu} = this.state;

    return (
      <div className="text-gray-800 bg-white px-4 py-[3px] flex justify-between items-center border-b font-figtree" onClick={this.handleLogoutClick}>
        <div className="flex items-center">
          {/* Sidebar Toggle Button (Mobile) */}
          <button
            className="md:hidden focus:outline-none bg-red-200 ml-1 rounded-lg p-1.5"
            onClick={toggleSidebar}
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
            >
                <path d="M17 4H3V6H17V4ZM13 11H3V13H13V11ZM17 18H3V20H17V18ZM22.0104 8.81412L20.5962 7.3999L16 11.9961L20.5962 16.5923L22.0104 15.1781L18.8284 11.9961L22.0104 8.81412Z"></path>
            </svg>
          </button>

          {/* Sidebar Collapse Button (Wide Screens) */}
          <button
            className="hidden md:block focus:outline-none bg-red-200 rounded-lg p-1.5 rotate-180"
            onClick={toggleSidebarCollapse}
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
            >
                <path d="M17 4H3V6H17V4ZM13 11H3V13H13V11ZM17 18H3V20H17V18ZM22.0104 8.81412L20.5962 7.3999L16 11.9961L20.5962 16.5923L22.0104 15.1781L18.8284 11.9961L22.0104 8.81412Z"></path>
            </svg>
            
          </button>

          <h1 className="text-xl font-semibold ml-4">Dashboard</h1>
        </div>
        
        {/* <Logout /> */}
        <div className="flex items-center gap-2 mr-2 hover:bg-blue-100 rounded-md px-2 py-1 cursor-pointer" onClick={this.toggleMenu}>
          <div className="flex items-center justify-center text-gray-400 w-10 h-10 rounded-full bg-blue-50">
            <FaUser size={24}/>
          </div>
          <div className="flex-1 text-sm">
            <p className="font-semibold">{userData.first_name} {userData.other_name} {userData.last_name}</p>
            <p className="text-xs text-gray-400 font-medium">{userData.email}</p>
          </div>
        </div>

        {showMenu && (
          <div
            ref={this.menuRef}
            className="absolute right-4 top-10 mt-2 w-64 bg-white rounded-md shadow-lg py-2 border z-40"
          >
            <div className="pl-2 pb-1 border-b">
              <p className="text-sm font-semibold">Signed in as</p>
              <p className="text-xs font-medium text-gray-400">{userData.email}</p>
            </div>
            <ul className="text-sm">
              {this.state.institutionStatus ? (
                <NavLink to={`/user-profile`}
                  className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={this.handleMenuItemClick}
                >
                  <FaUser size={16} />
                  <span>My Profile</span>
                </NavLink>
              ):(
                <NavLink
                  className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={this.handleMenuItemClick}
                >
                  <FaUser size={16} />
                  <span>My Profile</span>
                </NavLink>
              )}
              
              <Logout />
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Navbar);

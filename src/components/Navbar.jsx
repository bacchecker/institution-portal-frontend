import React from "react";
import { FaBars } from "react-icons/fa";
import withRouter from '../components/withRouter'

class Navbar extends React.Component {
  state = {
    name: "",
  };
  componentDidMount() {
    const { institutionData } = this.props.location.state || {};
    if (institutionData) {
      this.setState({
        name: institutionData.name,
        
      });
    }
  }
  render() {
    const { toggleSidebar, toggleSidebarCollapse, user } = this.props;

    return (
      <div className="text-gray-800 bg-white px-4 py-2 flex justify-between items-center border-b">
        <div className="flex items-center">
          {/* Sidebar Toggle Button (Mobile) */}
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>

          {/* Sidebar Collapse Button (Wide Screens) */}
          <button
            className="hidden md:block focus:outline-none ml-4 bg-red-200 rounded-lg p-2"
            onClick={toggleSidebarCollapse}
          >
            <FaBars size={20} />
          </button>

          <h1 className="text-xl ml-4">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="flex items-center space-x-2">
            <img
              src="/images/uewlogo.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="w-44 text-sm">
              <p>{this.state.name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Navbar);

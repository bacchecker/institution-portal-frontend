import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useLogoutUserMutation } from "../redux/apiSlice";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import LoadItems from "./LoadItems";
import { toast } from "sonner";

function Sidebar() {
  const { pathname } = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownHeights, setDropdownHeights] = useState({});
  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON?.parse(secureLocalStorage?.getItem("user"))?.user;
  const token = JSON?.parse(secureLocalStorage?.getItem("user"))?.token;

  const handleDropdownToggle = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  useEffect(() => {
    if (activeDropdown) {
      const dropdown = dropdownRefs.current[activeDropdown];
      if (dropdown) {
        setDropdownHeights((prevHeights) => ({
          ...prevHeights,
          [activeDropdown]: dropdown.scrollHeight,
        }));
      }
    }
  }, [activeDropdown]);

  useEffect(() => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 768) {
      if (pathname === "/request-document" || pathname === "/application") {
        setActiveDropdown("service");
      }
      if (pathname === "/support-ticket" || pathname === "/faqs") {
        setActiveDropdown("support");
      }
    }
  }, [pathname]);

  const [logoutUser, { data, isSuccess, isLoading, isError, error }] =
    useLogoutUserMutation();

  console.log("activeDropdown", activeDropdown);

  const handleLogout = async () => {
    await logoutUser({ token });
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message, {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(logout());
      secureLocalStorage?.clear();
      navigate("/");
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  return (
    <>
      <div className="w-full h-[20vw] bg-white fixed top-0 flex justify-between items-center z-[1000] display-no-md px-[5vw]">
        <button
          onClick={() => handleDropdownToggle("hamburgermenu")}
          className="w-[11vw] h-[11vw] rounded-[50%] flex justify-center items-center border border-[#000]"
        >
          <i className="bx bx-menu w-[5vw]"></i>
        </button>
        <div className="flex flex-col justify-center items-center">
          <img src="/assets/img/logo1.svg" alt="" className="w-[7vw]" />
          <h4 className="text-[3.5vw]">
            Bac<span className="text-[#ff0404]">C</span>hecker
          </h4>
        </div>
        <div className="w-[11vw] h-[11vw] rounded-[50%]">
          <img
            src="/assets/img/profile.svg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div
        className={`md:w-[18%] fixed md:left-0 left-[-100%] top-0 bottom-0 bg-[#f8f8f8] border-r-2 border-[#E5E5E5] z-[1001] w-full flex md:flex-col flex-col-reverse nav-mobile ${
          (activeDropdown === "hamburgermenu" ||
            activeDropdown === "support" ||
            activeDropdown === "service") &&
          "open1"
        }`}
      >
        <div className="w-full h-[80%]">
          <div className="flex w-full justify-center py-[1vw] md:border-b-2 border-[#E5E5E5]">
            <img
              src="/assets/img/back-logo.png"
              alt=""
              className="md:w-[10vw] display-no-sm"
            />
            <div className="flex flex-col justify-center items-center display-no-md">
              <img src="/assets/img/logo1.svg" alt="" className="w-[13vw]" />
              <h4 className="text-[5vw]">
                Bac<span className="text-[#ff0404]">C</span>hecker
              </h4>
            </div>
          </div>
          <div className="w-full h-[100%] overflow-auto">
            <h4 className="md:ml-[1.5vw] ml-[5vw] mt-[1.5vw] font-[500] md:text-[1.1vw] text-[5vw]">
              Menu
            </h4>
            <div className="h-[70%] overflow-auto md:px-[1.5vw] px-[5vw] sidebar-menu">
              <ul className="flex flex-col gap-[0.7vw] mt-[2vw] item-list">
                <li>
                  <Link
                    to="/overview"
                    onClick={() => handleDropdownToggle("close")}
                    className={`flex items-center md:gap-[0.7vw] gap-[2vw] w-full md:h-[3vw] h-[10vw] md:rounded-[0.5vw] rounded-[2vw] md:pl-[0.7vw] pl-[4vw] ${
                      pathname === "/overview" && "active"
                    }`}
                  >
                    <i className="bx bx-spreadsheet md:text-[1.3vw] text-[5vw] menu-icon"></i>
                    <span className="md:text-[1.1vw] text-[4vw] link">
                      Overview
                    </span>
                  </Link>
                </li>
                <li className="dropdown-side">
                  <button
                    onClick={() => handleDropdownToggle("service")}
                    className="flex items-center md:gap-[0.7vw] gap-[2vw] w-full md:h-[3vw] h-[15vw] md:rounded-[0.5vw] rounded-[2vw] md:pl-[0.7vw] pl-[4vw] relative"
                  >
                    <i className="bx bx-file-blank md:text-[1.3vw] text-[5vw]"></i>
                    <span className="md:text-[1.1vw] text-[4vw]">Service</span>
                    <i
                      className={`bx bx-chevron-down absolute right-0 md:text-[1.5vw] text-[6vw]  ${
                        activeDropdown === "service" ||
                        pathname === "/request-document" ||
                        pathname === "/application"
                          ? "rotate-arrow-active"
                          : "rotate-arrow"
                      }`}
                    ></i>
                  </button>
                  <ul
                    ref={(el) => (dropdownRefs.current["service"] = el)}
                    className={`md:ml-[2vw] ml-[6vw] ${
                      activeDropdown === "service" ||
                      pathname === "/request-document" ||
                      pathname === "/application"
                        ? "sidemenu-h"
                        : "sidemenu-h-active"
                    }`}
                    style={{
                      height:
                        activeDropdown === "service" ||
                        pathname === "/request-document" ||
                        pathname === "/application"
                          ? `${dropdownHeights["service"] || 0}px`
                          : "0",
                      overflow: "hidden",
                      transition: "height 0.3s ease",
                    }}
                  >
                    <li>
                      <Link
                        to="/request-document"
                        onClick={() => handleDropdownToggle("close")}
                        className={`w-full md:h-[2.2vw] h-[10vw] md:rounded-[3vw] rounded-[6vw] cursor-pointer flex md:gap-[0.7vw] gap-[2vw] items-center md:pl-[1.5vw] pl-[10vw] ${
                          pathname === "/request-document" && "active"
                        }`}
                      >
                        <i className="bx bx-file md:text-[1.3vw] text-[5vw] menu-icon"></i>
                        <span className="md:text-[0.9vw] text-[4vw] link">
                          Document Request
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/application"
                        onClick={() => handleDropdownToggle("close")}
                        className={`w-full md:h-[2.2vw] h-[10vw] md:rounded-[3vw] rounded-[6vw] cursor-pointer flex md:gap-[0.7vw] gap-[2vw] items-center md:pl-[1.5vw] pl-[10vw] ${
                          pathname === "/application" && "active"
                        }`}
                      >
                        <i className="bx bx-file md:text-[1.3vw] text-[5vw] menu-icon"></i>
                        <span className="md:text-[0.9vw] text-[4vw] link">
                          Validation Request
                        </span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    to="/payment"
                    onClick={() => handleDropdownToggle("close")}
                    className={`flex items-center md:gap-[0.7vw] gap-[2vw] w-full md:h-[3vw] h-[15vw] md:rounded-[0.5vw] rounded-[2vw] md:pl-[0.7vw] pl-[4vw] ${
                      pathname === "/payment" && "active"
                    }`}
                  >
                    <i className="bx bx-money md:text-[1.3vw] text-[5vw] menu-icon"></i>
                    <span className="md:text-[1.1vw] text-[4vw] link">
                      Payments
                    </span>
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/notification"
                    onClick={() => handleDropdownToggle("close")}
                    className={`flex items-center md:gap-[0.7vw] gap-[2vw] w-full md:h-[3vw] h-[15vw] md:rounded-[0.5vw] rounded-[2vw] md:pl-[0.7vw] pl-[4vw] ${
                      pathname === "/notification" && "active"
                    }`}
                  >
                    <i className="bx bx-bell md:text-[1.3vw] text-[8vw] menu-icon"></i>
                    <span className="md:text-[1.1vw] text-[5vw] link">
                      Notification
                    </span>
                  </Link>
                </li> */}
                <li className="dropdown-side">
                  <button
                    onClick={() => handleDropdownToggle("support")}
                    className="flex items-center md:gap-[0.7vw] gap-[2vw] w-full md:h-[3vw] h-[15vw] md:rounded-[0.5vw] rounded-[2vw] md:pl-[0.7vw] pl-[4vw] relative"
                  >
                    <i className="bx bx-wrench md:text-[1.3vw] text-[5vw]"></i>
                    <span className="md:text-[1.1vw] text-[4vw]">
                      Customer Support
                    </span>
                    <i
                      className={`bx bx-chevron-down absolute right-0 md:text-[1.5vw] text-[6vw]  ${
                        activeDropdown === "support" ||
                        pathname === "/support-ticket" ||
                        pathname === "/faqs"
                          ? "rotate-arrow-active"
                          : "rotate-arrow"
                      }`}
                    ></i>
                  </button>
                  <ul
                    ref={(el) => (dropdownRefs.current["support"] = el)}
                    className={`md:ml-[2vw] ml-[6vw] ${
                      activeDropdown === "service" ||
                      pathname === "/support-ticket" ||
                      pathname === "/faqs"
                        ? "sidemenu-h"
                        : "sidemenu-h-active"
                    }`}
                    style={{
                      height:
                        activeDropdown === "support" ||
                        pathname === "/support-ticket" ||
                        pathname === "/faqs"
                          ? `${dropdownHeights["support"] || 0}px`
                          : "0",
                      overflow: "hidden",
                      transition: "height 0.3s ease",
                    }}
                  >
                    <li className="">
                      <Link
                        to="/support-ticket"
                        onClick={() => handleDropdownToggle("close")}
                        className={`w-full md:h-[2.2vw] h-[10vw] md:rounded-[3vw] rounded-[6vw] cursor-pointer flex items-center md:pl-[1.5vw] pl-[14vw] ${
                          pathname === "/support-ticket" && "active"
                        }`}
                      >
                        <span className="md:text-[0.9vw] text-[4vw] link">
                          Support Ticket
                        </span>
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        to="/faqs"
                        onClick={() => handleDropdownToggle("close")}
                        className={`w-full md:h-[2.2vw] h-[10vw] md:rounded-[3vw] rounded-[6vw] cursor-pointer flex items-center md:pl-[1.5vw] pl-[14vw] ${
                          pathname === "/faqs" && "active"
                        }`}
                      >
                        <span className="md:text-[0.9vw] text-[4vw] link">
                          FAQs
                        </span>
                      </Link>
                    </li> */}
                  </ul>
                </li>
                <li>
                  <Link
                    to="account-settings"
                    onClick={() => handleDropdownToggle("close")}
                    className={`flex items-center md:gap-[0.7vw] gap-[2vw] w-full md:h-[3vw] h-[15vw] md:rounded-[0.5vw] rounded-[2vw] md:pl-[0.7vw] pl-[4vw] ${
                      pathname === "/account-settings" && "active"
                    }`}
                  >
                    <i className="bx bx-cog md:text-[1.3vw] text-[5vw] menu-icon"></i>
                    <span className="md:text-[1.1vw] text-[4vw] link">
                      Account Settings
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="system-logs"
                    onClick={() => handleDropdownToggle("close")}
                    className={`flex items-center md:gap-[0.7vw] gap-[2vw] w-full md:h-[3vw] h-[15vw] md:rounded-[0.5vw] rounded-[2vw] md:pl-[0.7vw] pl-[4vw] ${
                      pathname === "/system-logs" && "active"
                    }`}
                  >
                    <i className="bx bx-cylinder md:text-[1.3vw] text-[5vw] menu-icon"></i>
                    <span className="md:text-[1.1vw] text-[4vw] link">
                      System Logs
                    </span>
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/profile"
                    onClick={() => handleDropdownToggle("close")}
                    className={`flex items-center md:gap-[0.7vw] gap-[2vw] w-full md:h-[3vw] h-[15vw] md:rounded-[0.5vw] rounded-[2vw] md:pl-[0.7vw] pl-[4vw] ${
                      pathname === "/profile" && "active"
                    }`}
                  >
                    <i className="bx bx-user md:text-[1.3vw] text-[8vw] menu-icon"></i>
                    <span className="md:text-[1.1vw] text-[5vw] link">
                      Profile
                    </span>
                  </Link> 
                </li>*/}
              </ul>
            </div>
          </div>
        </div>
        <div className="md:left-[1.5vw] h-[fit-content] dropdown-sidd-mobile">
          <div className="dropdown-side drop-sidd">
            <button
              onClick={() => handleDropdownToggle("close")}
              className="w-[10vw] h-[10vw] rounded-[50%] border border-[#000] flex items-center justify-center display-no-md"
            >
              <i className="bx bx-x text-[8vw]"></i>
            </button>
            <div
              className={`mb-[1vw] side-show ${
                activeDropdown === "signout"
                  ? "sidemenu-h"
                  : "sidemenu-h-active"
              }`}
              ref={(el) => (dropdownRefs.current["signout"] = el)}
              style={{
                height:
                  activeDropdown === "signout"
                    ? `${dropdownHeights["signout"] || 0}px`
                    : "0",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <button
                type="button"
                onClick={handleLogout}
                className="md:w-full w-[40vw] flex gap-[0.5vw] items-center justify-center md:py-[0.5vw] py-[2vw] md:rounded-[2vw] rounded-[6vw] border border-[#FF0404] md:text-[0.8vw] text-[4vw] text-[#FF0404] hover:bg-[#ff0404] hover:text-[#ffffff] transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadItems color={"#ff0404"} size={15} />
                    <h4>Signing out...</h4>
                  </div>
                ) : (
                  <>
                    <i className="bx bx-arrow-from-left md:text-[1vw] text-[6vw]"></i>
                    Sign Out
                  </>
                )}
              </button>
            </div>
            <div
              onClick={() => handleDropdownToggle("signout")}
              className="flex items-center justify-between w-full cursor-pointer h-[4vw] rounded-[0.5vw] px-[0.8vw] relative border border-[#000] display-no-sm"
            >
              <div className="w-[20%]">
                <div className="w-[2.5vw] h-[2.5vw] rounded-[50%] border border-[#000] flex items-center justify-center text-[1vw] font-[600] uppercase">
                  {`${user?.first_name?.[0] || ""}${
                    user?.last_name?.[0] || ""
                  }`}
                </div>
              </div>
              <div className="w-[65%]">
                <h4
                  className="text-[0.7vw] font-[600]  text-nowrap overflow-hidden text-ellipsis"
                  title={`${user?.first_name || ""} ${user?.other_name || ""} ${
                    user?.last_name || ""
                  }`}
                >
                  {`${user?.first_name || ""} ${user?.other_name || ""} ${
                    user?.last_name || ""
                  }`}
                </h4>
                <h4
                  className="text-[0.7vw]  text-nowrap overflow-hidden text-ellipsis"
                  title={user?.email}
                >
                  {user?.email}
                </h4>
              </div>
              <div className="w-[10%] flex flex-col items-center justify-center gap-[0.3vw]">
                <img
                  src="/assets/img/top-arr.svg"
                  alt=""
                  className="w-[0.6vw]"
                />
                <img
                  src="/assets/img/down-arr.svg"
                  alt=""
                  className="w-[0.6vw]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;

import { useState, useEffect, useRef } from "react";
import axios from "../axiosConfig";

//     import { toast, Toaster } from "sonner";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@nextui-org/react";
import BellIcon from "../assets/icons/bell";
import ThemeSwitcher from "./ThemeSwitcher";
import { navLinks } from "../assets/constants";
import { Link, useLocation } from "react-router-dom";

export default function AuthLayout({ children, title = "Page Title" }) {
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const url = useLocation().pathname;
  const [instutituion, setInstutituion] = useState({});
  const [accessibleRoutes, setAccessibleRoutes] = useState([]);
  const [user, setUser] = useState({});

  const fetchInstitution = async () => {
    try {
      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData;
      setInstutituion(institutionData);
    } catch (error) {
      // toast.error(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInstitution();
  }, []);

  useEffect(() => {
    setIsDesktopExpanded(
      localStorage.getItem("isDesktopExpanded") === "true"
        ? true
        : localStorage.getItem("isDesktopExpanded") === null
        ? true
        : false
    );
  }, []);

  const mobileNavRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    const handleClickOutside = (e) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setIsMobileExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasPermission = (userPermissions, routeAcl) => {
    if (!routeAcl) return true; // If no ACL is defined, route is accessible to all
    return routeAcl.some((permission) => userPermissions.includes(permission));
  };

  const getAccessibleRoutes = (routes, userPermissions) => {
    return routes
      .filter((route) => hasPermission(userPermissions, route.acl)) // Filter parent routes
      .map((route) => {
        if (route.children) {
          // Filter children recursively based on permissions
          const accessibleChildren = getAccessibleRoutes(
            route.children,
            userPermissions
          );

          // Return parent route only if there are accessible children or no children
          return accessibleChildren.length > 0
            ? { ...route, children }
            : { ...route, children };
        }
        return route;
      });
  };

  //   const accessibleRoutes = getAccessibleRoutes(adminNavLinks, permissions);

  useEffect(() => {
    /**
     *  TODO: Dont delete this code, Will be used later when roles and permissions are implemented
     *
     * Filter accessible routes based on the user's role
     */
    // filter accessible routes
    // const filteredRoutes = navLinks.filter((route) => {
    //   if (route.acl) {
    //     return route.acl.some((acl) => instutituion?.roles?.includes(acl));
    //   }
    //   return true;
    // });
    // setAccessibleRoutes(filteredRoutes);

    const filteredRoutes = navLinks.filter((route) => {
      if (route.showOn) {
        return route.showOn.includes(instutituion?.status);
      }
      // return true;
    });
    setAccessibleRoutes(filteredRoutes);
  }, [instutituion]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/institution/user-data");
      const institutionData = response.data.userData;

      if (institutionData) {
        setUser(institutionData);
      }
    } catch (error) {
      //   toast.error(error.response.data.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="min-h-screen relative bg-slate-300/30 dark:bg-slate-950 flex !transition-all duration-300">
        {/* sidebar */}
        <motion.div
          className={`${
            isDesktopExpanded ? "xl:w-[17%] w-[17%] " : "w-16 "
          } h-screen fixed flex-col  top-0 left-0 transition-all hidden lg:flex duration-400  bg-white dark:bg-slate-900 border-r dark:border-white/10 `}
        >
          <div
            className={`flex h-14 gap-3 border-b dark:border-white/10 flex-col items-center ${
              isDesktopExpanded ? "px-4" : "px-1 justify-center"
            } py-2`}
          >
            <img
              src={
                isDesktopExpanded
                  ? "/images/back-logo.png"
                  : "/images/bclogo.jpg"
              }
              alt="logo"
              className={` transition-all ${
                isDesktopExpanded ? "h-12" : "w-full"
              } `}
            />
          </div>

          {/* nav links */}
          <div className="flex flex-col mt-11 overflow-hidden relative">
            {accessibleRoutes.map((link, index) => (
              <div key={index} className={`relative `}>
                <Link
                  key={index}
                  to={
                    link.children.length > 0 ? link.children[0].path : link.path
                  }
                  className={`h-12 hover:text-red-600 flex items-center ${
                    isDesktopExpanded ? "gap-4" : "gap-2"
                  } transition-colors duration-300 ${
                    url.startsWith(link.path)
                      ? "text-white dark:text-white hover:text-white/60 bg-[#ff0000]"
                      : "text-slate-500 dark:text-slate-300"
                  }`}
                >
                  {url.startsWith(link.path) ? (
                    <span className="h-6 w-1 rounded-r bg-white"></span>
                  ) : (
                    <span className="h-6 w-1 rounded-r bg-transparent"></span>
                  )}

                  <p
                    className={`${
                      isDesktopExpanded ? "text-lg" : "text-xl mx-2"
                    } ${
                      url.startsWith(link.path)
                        ? "text-white dark:text-white"
                        : "text-slate-400/80 hover:text-[#ff0000]"
                    } transition-all duration-500 ease-in-out`}
                  >
                    {link.icon}
                  </p>

                  {isDesktopExpanded && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p>{link.label}</p>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </Link>

                {/* Child Links */}
                {url.startsWith(link.path) &&
                  isDesktopExpanded &&
                  link?.children?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="left-0 ml-4 top-full mt-1 z-50 bg-white dark:bg-gray-800 w-full"
                    >
                      {link?.children.map((child, childIndex) => {
                        // Strip query parameters for comparison
                        const currentPath = new URL(url, window.location.origin)
                          .pathname;
                        console.log({ currentPath });

                        return (
                          <Link
                            key={childIndex}
                            to={child.path}
                            className={`block px-4 py-2 pl-9 text-sm ${
                              new RegExp(`^${child.path}`).test(currentPath)
                                ? "bg-red-500 text-white"
                                : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* mobile sidenav */}
        <motion.aside
          ref={mobileNavRef}
          className={`h-full fixed top-0 left-0 z-50 bg-white dark:bg-slate-900 overflow-hidden shadow-2xl ${
            isMobileExpanded ? "w-[65%] sm:w-[17%]" : "w-0"
          } transition-all duration-300 ease-in-out`}
        >
          <div className="px-2 py-3">
            <div className="rounded-2xl px-4 py-3 flex flex-col gap-2 shadow-2xl shadow-blue-800/30 mb-10">
              <img src={"/images/bclogo.jpg"} alt="logo" className="" />
            </div>
          </div>

          {/* nav links */}
          <div className="flex flex-col overflow-hidden relative">
            {accessibleRoutes.map((link, index) => (
              <div key={index} className="relative">
                <Link
                  href={link.path}
                  className={`h-12 hover:text-red-600 flex items-center ${
                    isDesktopExpanded ? "gap-4" : "gap-2"
                  } transition-colors duration-300 ${
                    url.startsWith(link.path)
                      ? "text-white dark:text-white hover:text-white/60 bg-[#ff0000]"
                      : "text-slate-500 dark:text-slate-300"
                  }`}
                >
                  {url.startsWith(link.path) ? (
                    <span className="h-6 w-1 rounded-r bg-white"></span>
                  ) : (
                    <span className="h-6 w-1 rounded-r bg-transparent"></span>
                  )}

                  <p
                    className={`${
                      isDesktopExpanded ? "text-lg" : "text-xl mx-2"
                    } ${
                      url.startsWith(link.path)
                        ? "text-white dark:text-white"
                        : "text-slate-400/80 hover:text-[#ff0000]"
                    } transition-all duration-500 ease-in-out`}
                  >
                    {link.icon}
                  </p>

                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p>{link.label}</p>
                    </motion.div>
                  </AnimatePresence>
                </Link>

                {/* Child Links */}
                {url.startsWith(link.path) && link?.children?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="left-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 w-full"
                  >
                    {link?.children.map((child, childIndex) => {
                      const currentPath = new URL(url, window.location.origin)
                        .pathname;

                      return (
                        <Link
                          key={childIndex}
                          href={child?.path}
                          className={`ml-4 block px-4 py-2 pl-9 text-sm ${
                            new RegExp(`^${child.path}`).test(currentPath)
                              ? "bg-red-500 text-white"
                              : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.aside>

        {/* page content */}
        <motion.div
          // className=" w-full h-full"
          className={`transition-all duration-400 flex-grow ${
            isDesktopExpanded ? "lg:ml-[17%] ml-0" : "ml-16"
          }`}
        >
          {/* header */}
          <motion.header className="bg-white w-screen md:w-full dark:bg-slate-900 border-b dark:border-white/10 h-14 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              {/* desktop nav toggler */}
              <Button
                isIconOnly
                variant="flat"
                color="danger"
                size="sm"
                className={`dark:text-white hidden lg:flex ${
                  isDesktopExpanded ? "rotate-0" : "rotate-180"
                }`}
                onClick={() => {
                  setIsDesktopExpanded(!isDesktopExpanded);
                  localStorage.setItem(
                    "isDesktopExpanded",
                    !isDesktopExpanded ? "true" : "false"
                  );
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M17 4H3V6H17V4ZM13 11H3V13H13V11ZM17 18H3V20H17V18ZM22.0104 8.81412L20.5962 7.3999L16 11.9961L20.5962 16.5923L22.0104 15.1781L18.8284 11.9961L22.0104 8.81412Z"></path>
                </svg>
              </Button>

              {/* mobile nav toggler */}
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                color="danger"
                className={`dark:text-white lg:hidden flex ${
                  isMobileExpanded ? "rotate-180" : "rotate-0"
                }`}
                onClick={() => setIsMobileExpanded(!isMobileExpanded)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M17 4H3V6H17V4ZM13 11H3V13H13V11ZM17 18H3V20H17V18ZM22.0104 8.81412L20.5962 7.3999L16 11.9961L20.5962 16.5923L22.0104 15.1781L18.8284 11.9961L22.0104 8.81412Z"></path>
                </svg>
              </Button>

              <h2 className="font-montserrat font-bold md:text-xl text-medium ">
                {title}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <button className="btn btn-sm btn-ghost btn-circle">
                <div className="indicator">
                  <Popover placement="bottom">
                    <PopoverTrigger>
                      <Button isIconOnly variant="light">
                        <BellIcon className="size-5 text-red-700" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="">
                      <div className="px-1 py-2 flex-1 w-64">
                        <div className="text-small font-bold">
                          Notifications
                        </div>
                        <div className="text-tiny">Nothing to show here</div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
              </button>
              <Dropdown>
                <DropdownTrigger>
                  <User
                    classNames={{
                      description: "hidden md:block",
                      name: "hidden md:block",
                    }}
                    as="button"
                    avatarProps={{
                      isBordered: false,
                      className: "size-5",
                      src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                    }}
                    className="transition-transform"
                    // description={"sdsd"}
                    description={user?.email}
                    name={`${user?.first_name} ${user?.last_name}`}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem key="signed-in-as" className="h-14 gap-2">
                    <p className="font-bold">Signed in as</p>
                    <p className="font-semibold">{user?.email}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="profile"
                    onClick={() => router.get(route("profile.edit"))}
                  >
                    My Profile
                  </DropdownItem>
                  <DropdownItem
                    key="settings"
                    onClick={() => router.get(route("profile.settings"))}
                  >
                    Settings
                  </DropdownItem>
                  {/*                                    
                                        <DropdownItem key="help_and_feedback">
                                            Help & Feedback
                                        </DropdownItem>
                                        */}
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={() => {
                      post(route("admin.logout"));
                    }}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </motion.header>

          {/* main content */}
          <motion.main className="text-sm md:flex-1">{children}</motion.main>
        </motion.div>
      </motion.div>

      {/* <Toaster richColors position="bottom-right" /> */}
    </AnimatePresence>
  );
}

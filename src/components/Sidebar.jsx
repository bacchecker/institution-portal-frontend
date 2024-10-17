import React, { useEffect, useRef, useState } from "react";
import { navLinks } from "../assets/constants";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import axios from "../axiosConfig";

export default function Sidebar({
  isDesktopExpanded,
  isMobileExpanded,
  mobileNavRef,
}) {
  const url = useLocation().pathname;
  const [instutituion, setInstutituion] = useState({});
  const [accessibleRoutes, setAccessibleRoutes] = useState([]);

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

  return (
    <div>
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
              isDesktopExpanded ? "/images/back-logo.png" : "/images/bclogo.jpg"
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
    </div>
  );
}

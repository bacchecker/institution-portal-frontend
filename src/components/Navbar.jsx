import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import axios from "@/utils/axiosConfig"
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useGetNotificationsQuery, useUpdateNotificationMutation } from "../redux/apiSlice";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useDispatch } from "react-redux";
import { setSelectedTab } from "../redux/baccheckerSlice";

const Navbar = () => {
  const user = JSON?.parse(secureLocalStorage?.getItem("user"))?.user;
  const token = JSON?.parse(secureLocalStorage?.getItem("userToken")).token;
  const institution = JSON?.parse(secureLocalStorage?.getItem("user"))?.institution;
  const dispatch = useDispatch()
  const [openDropDownFilter, setOpenDropDownFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let permissions = secureLocalStorage.getItem("userPermissions") || [];
  const isAdmin = JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin;
  const { data: notifications, refetch } = useGetNotificationsQuery();

  const navigate = useNavigate();


  window.Pusher = Pusher;
  window.Echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    forceTLS: true,
    // encrypted: false,
    auth: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    enabledTransports: ["ws", "wss"],
  });

  window.Echo.connector.pusher.connection.bind("error", (error) => {
    console.error("WebSocket connection error:", error);
  });


  useEffect(() => {
    if (institution?.id) {
      window.Echo.channel(`institution.${institution?.id}`).listen(
        "ReceiveInstitutionEvent",
        async (event) => {
          if (event) {
            await refetch()
          }
          if (event?.data?.type === "user_permissions" && event?.data?.content?.user_id === user?.id) {
            navigate("/")
          }
        }
      );
    }
  }, [institution?.id, refetch]);


  const handleSearch = async (event) => {
    event.preventDefault();
    setIsLoading(true)

    try {
      const response = await axios.get("/institution/dashboard/search", {
        params: { query: searchQuery },
      });
      navigate("/search-all", { state: { results: response.data } });
      setIsLoading(false)
    } catch (error) {
      console.error("Error while fetching search results:", error);
    }
  };

  const [updateNotification, { data, isSuccess, isError, error }] =
    useUpdateNotificationMutation();

  const handleSubmit = async (notification) => {
    try {
      await updateNotification({
        id: notification.id,
      });
    } catch (error) {
      toast.error("Not error", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setOpenDropDownFilter(false)
  };


  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);
  return (

    <div className="flex justify-between w-full h-[62px] border-b bg-[#f8f8f8] p-4 md:mt-0 mt-[20vw]  z-[-50]">
      <div className="w-full lg:w-96 flex justify-center">
        <form onSubmit={handleSearch} className="relative w-full lg:w-96 flex items-center">
          <input
            id="searchInput"
            className="appearance-none w-full py-2 pl-5 text-gray-900 focus:outline-none rounded-full text-sm pr-[52px] bg-gray-50 border border-gray-200"
            autoComplete="off"
            type="text"
            placeholder="Search something here"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isLoading ? (
            <button
              disabled
              type="button"
              className="absolute right-0 bg-slate-800 px-2 py-[17.5px] text-white h-full border border-white rounded-full flex items-center justify-center"
            >
              <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin fill-gray-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              className="absolute right-0 bg-bChkRed hover:bg-red-500 px-2 py-[17.5px] text-white h-full border border-white rounded-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-search w-5 h-5"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          )}

        </form>
      </div>
      <div className="hidden lg:flex items-center justify-center space-x-2">
        {((permissions?.includes("e-check.view") ||
          permissions.includes("e-check.create") || permissions.includes("e-check.process") || permissions.includes("e-check.cancel")) || isAdmin) && (
            <Dropdown
              buttonContent={
                <>
                  <div className='w-fit h-fit relative pt-[1vw]'>
                    <i class='bx bx-bell text-[2vw]'></i>
                    <div className='rounded-[50%] w-[1.8vw] h-[1.8vw] bg-[#ff0404] flex justify-center items-center absolute top-[0.2vw] right-[-0.8vw]'>
                      <h4 className='text-[0.9vw] text-white font-[600]'>{notifications?.data?.notifications?.length || 0}</h4>
                    </div>
                  </div>
                </>
              }
              buttonClass="action-button-class"
              dropdownClass="action-dropdown-class1"
              openDropDownFilter={openDropDownFilter}
              setOpenDropDownFilter={setOpenDropDownFilter}
            >
              <div className="action-dropdown-content1">
                <div className='max-h-[10vw] nav-sco'>
                  {notifications?.data?.notifications?.length > 0 ? (
                    <>
                      {notifications?.data?.notifications?.map((notification, i) => {
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              navigate("/e-check");
                              dispatch(setSelectedTab("document"))
                              handleSubmit(notification)
                            }}
                            className='w-full p-[0.5vw] border-b hover:bg-[#E5E5E5] cursor-pointer'>
                            <h4 className='text-[1vw]'>{notification?.message}</h4>
                          </div>
                        )
                      })}
                    </>
                  ) : (
                    <div className='w-full flex justify-center items-center h-[2vw]'>
                      <h4 className='text-[1vw]'>No notification</h4>
                    </div>
                  )}
                </div>
              </div>
            </Dropdown>
          )}
        <div className="rounded-full bg-gray-200 text-white p-3">
          <FaUser size={20} />
        </div>
        <div className="">
          <p className="font-medium">
            {`${user?.first_name || ""} ${user?.last_name || ""
              }`}
          </p>
          <p className="text-gray-600 text-xs">{user?.email}</p>
        </div>
      </div>
    </div >
  );
};

export default Navbar;


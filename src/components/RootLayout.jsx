import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import secureLocalStorage from "react-secure-storage";
import { useDispatch } from "react-redux";
import { useGetInstitutionDetailsQuery } from "../redux/apiSlice";
import { useEffect, useState } from "react";
import { setUser } from "../redux/authSlice";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

function RootLayout({ children }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState();

  const user = JSON.parse(secureLocalStorage.getItem("user"));
  const token = JSON?.parse(secureLocalStorage?.getItem("userToken"))?.token;

  window.Pusher = Pusher;
  window.Echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    // wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    // wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    forceTLS: false,
    auth: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    enabledTransports: ["ws", "wss"],
  });

  // TO DO Private Implementation Later

  useEffect(() => {
    if (user?.institution?.id) {
      window.Echo.channel(`institution.${user?.institution?.id}`).listen(
        "InstitutionActivatedEvent",
        (event) => {
          setMessage(event);
        }
      );
    }
  }, [user?.institution?.id]);

  const {
    data: institutionDetails,
    error,
    isError,
  } = useGetInstitutionDetailsQuery();

  useEffect(() => {
    if (message) {
      dispatch(
        setUser({
          user: institutionDetails.institutionData?.user,
          two_factor: user.two_factor,
          institution: institutionDetails.institutionData?.institution,
          selectedTemplate: user.selectedTemplate,
        })
      );
    } else if (institutionDetails && user) {
      dispatch(
        setUser({
          user: institutionDetails.institutionData?.user,
          two_factor: user.two_factor,
          institution: institutionDetails.institutionData?.institution,
          selectedTemplate: user.selectedTemplate,
        })
      );
    }
  }, [institutionDetails, user, dispatch, message, pathname]);

  useEffect(() => {
    const storedUser = JSON.parse(secureLocalStorage.getItem("user"));
    if (storedUser) {
      dispatch(setUser(storedUser));
    }
  }, []);

  useEffect(() => {
    if (isError && error?.data?.message === "Unauthenticated.") {
      navigate("/");
    }
  }, [isError, error, navigate]);

  return (
    <>
      {pathname === "/2fa-authentication" ||
      pathname === "/2fa-authentication-success" ? (
        <div className="flex flex-col p-[5vw] items-center">{children}</div>
      ) : pathname === "/account-under-review" ||
        pathname === "/account-setup" ? (
        <div className="flex flex-col items-center">{children}</div>
      ) : !user?.institution?.setup_done ? (
        <div className="flex flex-col items-center">{children}</div>
      ) : (
        <div className="flex w-full relative">
          <Sidebar />
          <main
            className={`md:pl-[17vw] w-full ${
              pathname === "/account-settings" ? "bg-white" : "bg-[#d6d6d653]"
            }`}
          >
            {children}
          </main>
        </div>
      )}
    </>
  );
}

export default RootLayout;

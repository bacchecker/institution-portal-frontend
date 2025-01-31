import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { storage } from "../utils/storage";
import { useDispatch } from "react-redux";
import { useGetInstitutionDetailsQuery } from "../redux/apiSlice";
import { useEffect, useState } from "react";
import { setUser } from "../redux/authSlice";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import PropTypes from "prop-types";
import LoadItems from "./LoadItems";
import { setSelectedTab } from "../redux/baccheckerSlice";

function RootLayout({ children }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState();

  const user = storage.getUser();
  const token = storage.getToken()?.token;

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
    if (pathname !== "/e-check") {
      dispatch(setSelectedTab("dashboard"))
    }
  }, [pathname, dispatch])


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
    isLoading,
  } = useGetInstitutionDetailsQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (institutionDetails?.institutionData) {
      const updatedUser = {
        user: institutionDetails.institutionData.user,
        two_factor: user?.two_factor,
        institution: institutionDetails.institutionData.institution,
        selectedTemplate: user?.selectedTemplate,
      };

      if (JSON.stringify(user) !== JSON.stringify(updatedUser)) {
        dispatch(setUser(updatedUser));
      }
    }
  }, [institutionDetails, dispatch, user]);

  useEffect(() => {
    if (isError && error?.data?.message === "Unauthenticated.") {
      navigate("/");
    }
  }, [isError, error, navigate]);

  if (isLoading && !user?.institution) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadItems color={"#ff0404"} />
      </div>
    );
  }

  // Simplified layout rendering
  const isAuthPage =
    pathname === "/2fa-authentication" ||
    pathname === "/2fa-authentication-success";
  const isSetupPage =
    pathname === "/account-under-review" || pathname === "/account-setup";

  if (isAuthPage || isSetupPage) {
    return <div className="flex flex-col items-center">{children}</div>;
  }

  return (
    <div className="flex w-full relative">
      <Sidebar />
      <main
        className={`md:pl-[17vw] w-full ${pathname === "/account-settings" ? "bg-white" : "bg-[#d6d6d653]"
          }`}
      >
        {children}
      </main>
    </div>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RootLayout;

import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import secureLocalStorage from "react-secure-storage";
import { useDispatch } from "react-redux";
import { useGetInstitutionDetailsQuery } from "../redux/apiSlice";
import { useEffect } from "react";
import { setUser, setUserToken } from "../redux/authSlice";

function RootLayout({ children }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(secureLocalStorage.getItem("user"));

  const {
    data: institutionDetails,
    error,
    isError,
  } = useGetInstitutionDetailsQuery();

  useEffect(() => {
    if (institutionDetails && user) {
      dispatch(
        setUser({
          user: institutionDetails.institutionData?.user,
          two_factor: user.two_factor,
          institution: institutionDetails.institutionData?.institution,
          selectedTemplate: user.selectedTemplate,
        })
      );
    }
  }, [institutionDetails, user, dispatch]);

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
            className={`md:pl-[20%] px-[5vw] md:pr-[2%] w-full md:pt-[3%] pt-[25%] pb-[3%] ${
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

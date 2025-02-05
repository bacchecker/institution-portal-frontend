import React, { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import Team from "./dashboardComponents/Team";
import DashboardDocumentRequests from "./dashboardComponents/DashboardDocumentRequests";
import Navbar from "@/components/Navbar";
import {
    useCustomizeDashboardMutation,
    useGetDashboardAnalyticsQuery,
    useGetInstitutionRevenueGraphQuery,
    useGetInstitutionVerificationDataQuery,
    useGetRevenuePercentageQuery,
} from "../redux/apiSlice";
import RevenueGraph from "./dashboardComponents/RevenueGraph";
import Dropdown from "../components/Dropdown";
import LoadItems from "../components/LoadItems";
import LoadingPage from "../components/LoadingPage";
import { toast } from "sonner";
import { setUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import DashboardValidationRequest from "./dashboardComponents/DashboardValidationRequest";
import DashboardSupportTickets from "./dashboardComponents/DashboardSupportTickets";
import DashboardReports from "./dashboardComponents/DashboardReports";
import DashboardVerificationRequest from "./dashboardComponents/DashboardVerificationRequest";

function AdminDashboard() {
    const user = JSON.parse(secureLocalStorage.getItem("user"));
    const [currentScreen, setCurrentScreen] = useState(1);
    const [openDropDownFilter, setOpenDropDownFilter] = useState(false);
    const dispatch = useDispatch()
    const lineRef = useRef(null);
    const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
    const [clickedItems, setClickedItems] = useState([]);
    const [clickedDefaultItems, setClickedDefaultItems] = useState([]);
    const cleanedString = user?.institution?.dashboard_screens
        ? user?.institution?.dashboard_screens.replace(/[^\x20-\x7E]/g, '')
        : '["/revenue"]';
    const dashboardScreens = JSON.parse(cleanedString);


    const handleTabClick = (e) => {
        const target = e.target;
        setLineStyle({
            width: target.offsetWidth,
            left: target.offsetLeft,
        });
    };
    useEffect(() => {
        const activeButton = document.querySelector(".active-button");
        if (activeButton) {
            setLineStyle({
                width: activeButton.offsetWidth,
                left: activeButton.offsetLeft,
            });
        }
    }, [currentScreen]);



    useEffect(() => {
        if (dashboardScreens) {
            setClickedItems(dashboardScreens)
        }
    }, [])

    const handleItemClick = (item) => {
        setClickedItems((prevItems) =>
            prevItems.includes(item)
                ? prevItems.filter((i) => i !== item)
                : [...prevItems, item]
        );
    };


    const isItemClicked = (item) => clickedItems.includes(item);



    const {
        data: analytics,
        isLoading,
        isFetching,
    } = useGetDashboardAnalyticsQuery();

    const {
        data: verificationData,

    } = useGetInstitutionVerificationDataQuery();


    const {
        data: revenuePercentage,
        isLoading: isRevenuePercentageLoading,
        isFetching: isRevenuePercentageFetching,
    } = useGetRevenuePercentageQuery();

    const {
        data: revenueGraph,
        // isLoading,
        // isFetching,
    } = useGetInstitutionRevenueGraphQuery();


    const [customizeDashboard, { data, isSuccess, isError, error, isLoading: isCustomizing }] =
        useCustomizeDashboardMutation();

    const handleSubmit = async () => {
        try {
            await customizeDashboard({
                dashboard_screens: JSON.stringify(clickedItems),
            });
        } catch (error) {
            console.error("Error adding show:", error);
        }
    };


    useEffect(() => {
        if (isSuccess) {
            toast.success("Dashboard Customized Successfully", {
                position: "top-right",
                autoClose: 1202,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setOpenDropDownFilter(false)
            setClickedDefaultItems(clickedItems)
            dispatch(
                setUser({
                    user: user?.user,
                    two_factor: user.two_factor,
                    institution: data,
                })
            );
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message);
        }
    }, [isError]);


    return (
        <>
            <Navbar />
            {isCustomizing && <LoadingPage />}
            <div className="bg-white md:p-[1vw] p-[5vw]">
                <div className="flex flex-sm-col justify-between md:items-center">
                    <h1 className="md:text-[1.7vw] text-[4.2vw]">
                        Welcome, {user?.user?.first_name} {user?.user?.other_name}{" "}
                        {user?.user?.last_name}
                    </h1>
                    <div className="flex jus-sm my-[3vw] md:my-0">
                        <Dropdown
                            buttonContent={
                                <button className="flex items-center border border-[#0000000f] md:py-[0.5vw] w-[14vw] md:px-[1vw] px-[3vw] py-[2vw] md:rounded-[0.3vw] rounded-[1vw] bg-[#F9F9F9] gap-[0.3vw]">
                                    <i className="bx bx-cog md:text-[1vw] text-[3vw]"></i>
                                    <h4 className="md:text-[1vw] text-[3vw]">Customize & settings</h4>
                                </button>
                            }
                            // buttonclassName="action-button-class"
                            isClose={isCustomizing}
                            dropdownclassName="action-dropdown-class12"
                            openDropDownFilter={openDropDownFilter}
                            setOpenDropDownFilter={setOpenDropDownFilter}
                        >
                            <div className="action-dropdown-content">
                                <button
                                    className="dropdown-item flex justify-between"
                                    onClick={() => handleItemClick('validation')}
                                >
                                    Validation Requests
                                    {isItemClicked('validation') && (
                                        <i className="bx bx-check text-[1.2rem] text-[#249b56]" />
                                    )}
                                </button>
                                <button
                                    className="dropdown-item flex justify-between"
                                    onClick={() => handleItemClick('verification')}
                                >
                                    Verification Requests
                                    {isItemClicked('verification') && (
                                        <i className="bx bx-check text-[1.2rem] text-[#249b56]" />
                                    )}
                                </button>
                                <button
                                    className="dropdown-item flex justify-between"
                                    onClick={() => handleItemClick('support')}
                                >
                                    Support
                                    {isItemClicked('support') && (
                                        <i className="bx bx-check text-[1.2rem] text-[#249b56]" />
                                    )}
                                </button>
                                <button
                                    className="dropdown-item flex justify-between"
                                    onClick={() => handleItemClick('reports_document_requests')}
                                >
                                    Reports (Document Requests)
                                    {isItemClicked('reports_document_requests') && (
                                        <i className="bx bx-check text-[1.2rem] text-[#249b56]" />
                                    )}
                                </button>
                                <button
                                    className="dropdown-item flex justify-between"
                                    onClick={() => handleItemClick('reports_validation_requests')}
                                >
                                    Reports (Validation Requests)
                                    {isItemClicked('reports_validation_requests') && (
                                        <i className="bx bx-check text-[1.2rem] text-[#249b56]" />
                                    )}
                                </button>
                                <div className="w-full flex justify-end px-[0.5vw]">
                                    <button
                                        type="button"
                                        disabled={isCustomizing}
                                        onClick={handleSubmit}
                                        className="w-fit px-[1vw] md:py-[0.3vw] py-[3vw]  md:my-[0.5vw] mt-[5vw] md:text-[0.9vw] text-[3.5vw] text-white md:rounded-[0.3vw] rounded-[1.5vw] bg-[#FF0000] hover:bg-[#ef4242] transition-all duration-300 disabled:bg-[#ef4242]"
                                    >
                                        {isCustomizing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <LoadItems color={"#ffffff"} size={15} />
                                                <h4 className="md:text-[0.7vw] text-[3.5vw]">Applying...</h4>
                                            </div>
                                        ) : (
                                            <h4 className="md:text-[0.7vw] text-[3.5vw]">Apply</h4>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex flex-sm-col justify-between items-center mt-[2vw] gap-[4vw] md:gap-0">
                    <div className="md:w-[23%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
                        <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
                            <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#ff0404] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                                <img src="/assets/img/docx.svg" alt="" className="md:w-[1.5vw] w-[5vw]" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="md:text-[1.5vw] text-[4vw] font-[600]">
                                    {parseInt(
                                        revenuePercentage?.document_requests?.current_month_count ??
                                        0
                                    ).toLocaleString()}
                                </h4>
                                <h4
                                    className={`md:text-[0.8vw] text-[3.5vw]  ${revenuePercentage?.document_requests?.percentage_change >= 0
                                        ? "text-[#27CA40]"
                                        : "text-[#ff0404]"
                                        }`}
                                >
                                    {parseFloat(
                                        revenuePercentage?.document_requests?.percentage_change ?? 0
                                    ).toFixed(2)}
                                    % Previous Month
                                </h4>
                            </div>
                        </div>
                        <h4 className="md:text-[0.9vw] text-[3vw] md:mt-[0.5vw] mt-[1vw] mb-[0.3vw]">
                            Total Document Request
                        </h4>
                    </div>
                    <div className="md:w-[23%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
                        <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
                            <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#EC7AFF] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                                <img src="/assets/img/docx.svg" alt="" className="md:w-[1.5vw] w-[5vw]" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="md:text-[1.5vw] text-[4vw] font-[600]">
                                    {parseInt(
                                        revenuePercentage?.validation_requests
                                            ?.current_month_count ?? 0
                                    ).toLocaleString()}
                                </h4>
                                <h4
                                    className={`md:text-[0.8vw] text-[3.5vw]  ${revenuePercentage?.validation_requests?.percentage_change >=
                                        0
                                        ? "text-[#27CA40]"
                                        : "text-[#ff0404]"
                                        }`}
                                >
                                    {parseFloat(
                                        revenuePercentage?.validation_requests?.percentage_change ??
                                        0
                                    ).toFixed(2)}
                                    % Previous Month
                                </h4>
                            </div>
                        </div>
                        <h4 className="md:text-[0.9vw] text-[3vw] md:mt-[0.5vw] mt-[1vw] mb-[0.3vw]">
                            Total Validation Request
                        </h4>
                    </div>
                    <div className="md:w-[23%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
                        <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
                            <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#FFC130] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                                <img src="/assets/img/docx.svg" alt="" className="md:w-[1.5vw] w-[5vw]" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="md:text-[1.5vw] text-[4vw] font-[600]">{parseInt(
                                    verificationData?.sent_requests ?? 0
                                ).toLocaleString()}</h4>
                                <h4 className="md:text-[0.8vw] text-[3.5vw] text-[#27CA40]">
                                    0.00% Previous Month
                                </h4>
                            </div>
                        </div>
                        <h4 className="md:text-[0.9vw] text-[3vw] md:mt-[0.5vw] mt-[1vw] mb-[0.3vw]">
                            Total Verification Requests Sent
                        </h4>
                    </div>
                    <div className="md:w-[23%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
                        <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
                            <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#ff0404] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                                <img src="/assets/img/docx.svg" alt="" className="md:w-[1.5vw] w-[5vw]" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="md:text-[1.5vw] text-[4vw] font-[600]">{parseInt(
                                    verificationData?.received_requests ?? 0
                                ).toLocaleString()}</h4>
                                <h4 className="md:text-[0.8vw] text-[3.5vw] text-[#27CA40]">
                                    0.00% Previous Month
                                </h4>
                            </div>
                        </div>
                        <h4 className="md:text-[0.9vw] text-[3vw] md:mt-[0.5vw] mt-[1vw] mb-[0.3vw]">
                            Total Verification Requests Received
                        </h4>
                    </div>
                </div>
                <div className="flex flex-sm-col w-full md:mt-[2vw] mt-[6vw] justify-between">
                    <div className="md:w-[58%] w-full md:h-[26vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f]">
                        <RevenueGraph revenueGraph={revenueGraph} />
                    </div>
                    <div className="md:w-[40%] w-full md:h-[26vw] md:mt-0 mt-[6vw] h-[100vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f overflow-hidden">
                        <Team />
                    </div>
                </div>
                {(clickedDefaultItems.includes("validation") || dashboardScreens.includes("validation")) && (
                    <div className="w-full border-b border-[#d5d6d6] flex md:mt-[3vw] mt-[8vw] md:gap-[2vw] gap-[6vw] relative">
                        <button
                            className={`md:text-[1vw] text-[3.5vw] tab_button py-[0.3vw] ${currentScreen === 1 && "active-button"
                                }`}
                            onClick={(e) => {
                                handleTabClick(e);
                                setCurrentScreen(1);
                            }}
                        >
                            Document Requests
                        </button>
                        <button
                            className={`md:text-[1vw] text-[3.5vw] tab_button py-[0.3vw] ${currentScreen === 2 && "active-button"
                                }`}
                            onClick={(e) => {
                                handleTabClick(e);
                                setCurrentScreen(2);
                            }}
                        >
                            Validation Requests
                        </button>

                        <div
                            className="line"
                            ref={lineRef}
                            style={{
                                width: `${lineStyle.width}px`,
                                left: `${lineStyle.left}px`,
                                position: "absolute",
                                bottom: 0,
                                height: "2px",
                                backgroundColor: "#ff0404",
                                transition: "all 0.3s ease",
                            }}
                        ></div>
                    </div>
                )}
                <div className="w-full md:h-[40vw] mt-[6vw] h-[100vw] md:mt-[2vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f] overflow-hidden">
                    {currentScreen === 1 && (
                        <DashboardDocumentRequests />
                    )}
                    {currentScreen === 2 && (
                        <DashboardValidationRequest />
                    )}
                </div>
                {(clickedDefaultItems.includes("support") || dashboardScreens.includes("support")) && (
                    <div className="w-full md:h-[40vw] mt-[6vw] h-[100vw] md:mt-[2vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f] overflow-hidden">
                        <DashboardSupportTickets />
                    </div>
                )}
                {(clickedDefaultItems.includes("reports_validation_requests") || dashboardScreens.includes("reports_validation_requests") || clickedDefaultItems.includes("reports_document_requests") || dashboardScreens.includes("reports_document_requests")) && (
                    <div className="w-full md:h-[40vw] mt-[6vw] h-[100vw] md:mt-[2vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f] overflow-hidden">
                        <DashboardReports clickedDefaultItems={clickedDefaultItems} dashboardScreens={dashboardScreens} />
                    </div>
                )}
                {(clickedDefaultItems.includes("verification") || dashboardScreens.includes("verification")) && (
                    <DashboardVerificationRequest />
                )}
            </div>
        </>
    );
}

export default AdminDashboard;

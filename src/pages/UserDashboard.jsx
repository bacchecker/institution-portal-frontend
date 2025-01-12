import React, { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import Team from "./dashboardComponents/Team";
import DashboardDocumentRequests from "./dashboardComponents/DashboardDocumentRequests";
import Navbar from "@/components/Navbar";
import {
    useGetDashboardAnalyticsQuery,
    useGetInstitutionRevenueGraphQuery,
    useGetRevenuePercentageQuery,
} from "../redux/apiSlice";
import RevenueGraph from "./dashboardComponents/RevenueGraph";
import DashboardValidationRequest from "./dashboardComponents/DashboardValidationRequest";
import DashboardSupportTickets from "./dashboardComponents/DashboardSupportTickets";
import UserDashboardReports from "./dashboardComponents/UserDashboardReports";

function UserDashboard() {
    const user = JSON.parse(secureLocalStorage.getItem("user"));
    const [currentScreen, setCurrentScreen] = useState(1);
    const lineRef = useRef(null);
    const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });

    let permissions = secureLocalStorage.getItem('userPermissions') || [];




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




    const {
        data: analytics,
        isLoading,
        isFetching,
    } = useGetDashboardAnalyticsQuery();

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


    useEffect(() => {
        if (permissions.includes("document-requests.view") && !permissions.includes("validation-requests.view")) {
            setCurrentScreen(1)
        } else if (permissions.includes("document-requests.view") && permissions.includes("validation-requests.view")) {
            setCurrentScreen(1)
        } else if (!permissions.includes("document-requests.view") && permissions.includes("validation-requests.view")) {
            setCurrentScreen(2)
        }
    }, [permissions])



    return (
        <>
            <Navbar />
            <div className="bg-white md:p-[1vw] p-[5vw]">
                {!permissions?.includes("document-requests.view") && !permissions?.includes("verification-requests.view") && !permissions?.includes("validation-requests.view") && (
                    <div className="flex flex-sm-col justify-between md:items-center">
                        <h1 className="md:text-[1.7vw] text-[4.2vw]">
                            Welcome, {user?.user?.first_name} {user?.user?.other_name}{" "}
                            {user?.user?.last_name}
                        </h1>
                    </div>
                )}
                {(permissions?.includes("document-requests.view") && permissions?.includes("verification-requests.view") && permissions?.includes("validation-requests.view")) ? (
                    <>
                        <div className="flex flex-sm-col justify-between md:items-center">
                            <h1 className="md:text-[1.7vw] text-[4.2vw]">
                                Welcome, {user?.user?.first_name} {user?.user?.other_name}{" "}
                                {user?.user?.last_name}
                            </h1>
                        </div>
                        <div className="flex flex-sm-col justify-between items-center mt-[2vw] gap-[4vw] md:gap-0">
                            <div className="md:w-[32%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
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

                            <div className="md:w-[32%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
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
                            <div className="md:w-[32%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
                                <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
                                    <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#FFC130] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                                        <img src="/assets/img/docx.svg" alt="" className="md:w-[1.5vw] w-[5vw]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="md:text-[1.5vw] text-[4vw] font-[600]">0</h4>
                                        <h4 className="md:text-[0.8vw] text-[3.5vw] text-[#27CA40]">
                                            0.00% Previous Month
                                        </h4>
                                    </div>
                                </div>
                                <h4 className="md:text-[0.9vw] text-[3vw] md:mt-[0.5vw] mt-[1vw] mb-[0.3vw]">
                                    Total Verification Request
                                </h4>
                            </div>
                        </div>
                    </>
                ) : ((!permissions?.includes("document-requests.view") && permissions?.includes("verification-requests.view") && permissions?.includes("validation-requests.view")) ||
                    (permissions?.includes("document-requests.view") && !permissions?.includes("verification-requests.view") && permissions?.includes("validation-requests.view")) ||
                    (permissions?.includes("document-requests.view") && permissions?.includes("verification-requests.view") && !permissions?.includes("validation-requests.view"))) ? (
                    <div className="flex w-full justify-between items-start">
                        <div className="flex flex-sm-col justify-between md:items-center w-[40%]">
                            <h1 className="md:text-[1.7vw] text-[4.2vw]">
                                Welcome, {user?.user?.first_name} {user?.user?.other_name}{" "}
                                {user?.user?.last_name}
                            </h1>
                        </div>
                        <div className="flex flex-sm-col justify-end items-center gap-[4vw] md:gap-[2vw] w-[60%]">
                            {permissions?.includes("document-requests.view") && (
                                <div className="md:w-[48%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
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
                            )}
                            {permissions?.includes("validation-requests.view") && (
                                <div className="md:w-[48%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
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
                            )}
                            {permissions?.includes("verification-requests.view") && (
                                <div className="md:w-[48%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
                                    <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
                                        <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#FFC130] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                                            <img src="/assets/img/docx.svg" alt="" className="md:w-[1.5vw] w-[5vw]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="md:text-[1.5vw] text-[4vw] font-[600]">0</h4>
                                            <h4 className="md:text-[0.8vw] text-[3.5vw] text-[#27CA40]">
                                                0.00% Previous Month
                                            </h4>
                                        </div>
                                    </div>
                                    <h4 className="md:text-[0.9vw] text-[3vw] md:mt-[0.5vw] mt-[1vw] mb-[0.3vw]">
                                        Total Verification Request
                                    </h4>
                                </div>
                            )}

                        </div>
                    </div>
                ) : ((!permissions?.includes("document-requests.view") && !permissions?.includes("verification-requests.view") && permissions?.includes("validation-requests.view")) ||
                    (!permissions?.includes("document-requests.view") && permissions?.includes("verification-requests.view") && !permissions?.includes("validation-requests.view")) ||
                    (permissions?.includes("document-requests.view") && !permissions?.includes("verification-requests.view") && !permissions?.includes("validation-requests.view"))) ? (
                    <div className="flex w-full justify-between items-start">
                        <div className="flex flex-sm-col justify-between md:items-center w-[40%]">
                            <h1 className="md:text-[1.7vw] text-[4.2vw]">
                                Welcome, {user?.user?.first_name} {user?.user?.other_name}{" "}
                                {user?.user?.last_name}
                            </h1>
                        </div>
                        <div className="flex flex-sm-col justify-end items-center gap-[4vw] md:gap-[2vw] w-[60%]">
                            {permissions?.includes("document-requests.view") && (
                                <div className="md:w-[48%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
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
                            )}
                            {permissions?.includes("validation-requests.view") && (
                                <div className="md:w-[48%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
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
                            )}
                            {permissions?.includes("verification-requests.view") && (
                                <div className="md:w-[48%] w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
                                    <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
                                        <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#FFC130] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                                            <img src="/assets/img/docx.svg" alt="" className="md:w-[1.5vw] w-[5vw]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="md:text-[1.5vw] text-[4vw] font-[600]">0</h4>
                                            <h4 className="md:text-[0.8vw] text-[3.5vw] text-[#27CA40]">
                                                0.00% Previous Month
                                            </h4>
                                        </div>
                                    </div>
                                    <h4 className="md:text-[0.9vw] text-[3vw] md:mt-[0.5vw] mt-[1vw] mb-[0.3vw]">
                                        Total Verification Request
                                    </h4>
                                </div>
                            )}

                        </div>
                    </div>
                ) : (
                    <></>
                )}

                {permissions?.includes("institution.dashboard.revenue-stats") && permissions?.includes("institution.users.view") && (
                    <div className="flex flex-sm-col w-full md:mt-[2vw] mt-[6vw] justify-between">
                        <div className="md:w-[58%] w-full md:h-[26vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f]">
                            <RevenueGraph revenueGraph={revenueGraph} />
                        </div>
                        <div className="md:w-[40%] w-full md:h-[26vw] md:mt-0 mt-[6vw] h-[100vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f overflow-hidden">
                            <Team />
                        </div>
                    </div>
                )}
                {permissions?.includes("institution.dashboard.revenue-stats") && !permissions?.includes("institution.users.view") && (
                    <div className="flex flex-sm-col w-full md:mt-[2vw] mt-[6vw] justify-between">
                        <div className="md:w-full w-full md:h-[26vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f]">
                            <RevenueGraph revenueGraph={revenueGraph} />
                        </div>
                        {/* <div className="md:w-[40%] w-full md:h-[26vw] md:mt-0 mt-[6vw] h-[100vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f overflow-hidden">
                            <Team />
                        </div> */}
                    </div>
                )}
                {(permissions?.includes("document-requests.view") && permissions?.includes("validation-requests.view")) && (
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
                {(permissions.includes("document-requests.view") || permissions.includes("validation-requests.view")) && (
                    <div className="w-full md:h-[40vw] mt-[6vw] h-[100vw] md:mt-[2vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f] overflow-hidden">
                        {currentScreen === 1 && (
                            <DashboardDocumentRequests />
                        )}
                        {currentScreen === 2 && (
                            <DashboardValidationRequest />
                        )}
                    </div>
                )}
                {permissions?.includes("institution.tickets.view") && (
                    <div className="w-full md:h-[40vw] mt-[6vw] h-[100vw] md:mt-[2vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f] overflow-hidden">
                        <DashboardSupportTickets />
                    </div>
                )}
                {(permissions?.includes("institution.reports.view") && (permissions.includes("document-requests.view") || permissions.includes("validation-requests.view"))) && (
                    <div className="w-full md:h-[40vw] mt-[6vw] h-[100vw] md:mt-[2vw] border md:rounded-[0.4vw] rounded-[1.1vw] border-[#0000000f] overflow-hidden">
                        <UserDashboardReports permissions={permissions} />
                    </div>
                )}
            </div>
        </>
    );
}

export default UserDashboard;

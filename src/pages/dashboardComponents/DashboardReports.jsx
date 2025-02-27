import React, { useEffect, useRef, useState } from "react";
import { useGetInstitutionRevenueQuery } from "../../redux/apiSlice";
import secureLocalStorage from "react-secure-storage";
import DashboardDocumentRequestReport from "./DashboardDocumentRequestReport";
import DashboardValidationRequestReports from "./DashboardValidationRequestReports";

function DashboardReports({ clickedDefaultItems, dashboardScreens }) {
    const [currentScreen1, setCurrentScreen1] = useState(1);
    const lineRef12 = useRef(null);
    const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });

    const user = JSON.parse(secureLocalStorage.getItem("user"));

    const handleTabClick = (e) => {
        const target = e.target;
        setLineStyle({
            width: target.offsetWidth,
            left: target.offsetLeft,
        });
    };
    useEffect(() => {
        const activeButton = document.querySelector(".active-button2");
        if (activeButton) {
            setLineStyle({
                width: activeButton.offsetWidth,
                left: activeButton.offsetLeft,
            });
        }
    }, [currentScreen1]);

    useEffect(() => {
        if (clickedDefaultItems.includes("reports_document_requests") || dashboardScreens.includes("reports_document_requests")) {
            setCurrentScreen1(1)
        } else {
            setCurrentScreen1(2)
        }
    }, [clickedDefaultItems, dashboardScreens])

    const {
        data: institutionRevenue,
        isLoading: isDocTypesLoading,
        isFetching: isDocTypesFetching,
    } = useGetInstitutionRevenueQuery({
        institutionID: user?.institution?.id,
    });

    return (
        <>
            <div className="bg-white p-[1vw]">
                <div className="bg-white pt-[1vw]">
                    {((clickedDefaultItems.includes("reports_validation_requests") || dashboardScreens.includes("reports_validation_requests")) && (clickedDefaultItems.includes("reports_document_requests") || dashboardScreens.includes("reports_document_requests"))) && (
                        <div className="w-full border-b border-[#d5d6d6] flex md:gap-[2vw] gap-[6vw] relative ">
                            <button
                                className={`md:text-[1vw] text-[3.5vw] tab_button py-[0.3vw] ${currentScreen1 === 1 && "active-button2"
                                    }`}
                                onClick={(e) => {
                                    handleTabClick(e);
                                    setCurrentScreen1(1);
                                }}
                            >
                                Document Requests Report
                            </button>
                            <button
                                className={`md:text-[1vw] text-[3.5vw] tab_button py-[0.3vw] ${currentScreen1 === 2 && "active-button2"
                                    }`}
                                onClick={(e) => {
                                    handleTabClick(e);
                                    setCurrentScreen1(2);
                                }}
                            >
                                Validation Requests Report
                            </button>
                            {/* <button
                            className={`md:text-[1vw] text-[3.5vw] tab_button py-[0.3vw] ${currentScreen1 === 3 && "active-button"
                                }`}
                            onClick={(e) => {
                                handleTabClick(e);
                                setCurrentScreen1(3);
                            }}
                        >
                            Verification Requests
                        </button> */}
                            <div
                                className="line"
                                ref={lineRef12}
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
                    {currentScreen1 === 1 && <DashboardDocumentRequestReport />}
                    {currentScreen1 === 2 && <DashboardValidationRequestReports />}
                </div>
            </div>
        </>
    );
}

export default DashboardReports;

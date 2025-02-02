import React, { useEffect, useRef, useState } from 'react'
import DashboardIncomingVerificationRequest from './DashboardIncomingVerificationRequest';
import DashboardOutgoingVerificationRequest from './DashboardOutgoingVerificationRequest';

function UserDashboardVerificationRequests({ permissions }) {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
    const lineRef1 = useRef(null);

    const handleTabClick = (e) => {
        const target = e.target;
        setLineStyle({
            width: target.offsetWidth,
            left: target.offsetLeft,
        });
    };
    useEffect(() => {
        const activeButton = document.querySelector(".active-button1");
        if (activeButton) {
            setLineStyle({
                width: activeButton.offsetWidth,
                left: activeButton.offsetLeft,
            });
        }
    }, [currentScreen]);

    useEffect(() => {
        if (permissions.includes("e-check.create") && !permissions.includes("e-check.process")) {
            setCurrentScreen(1)
        } else if (permissions.includes("e-check.create") && permissions.includes("e-check.process")) {
            setCurrentScreen(1)
        } else if (!permissions.includes("e-check.create") && !permissions.includes("e-check.process")) {
            setCurrentScreen(2)
        } else if (!permissions.includes("e-check.create") && permissions.includes("e-check.process")) {
            setCurrentScreen(2)
        }
    }, [permissions])

    return (
        <>
            {(permissions.includes("e-check.create") && permissions.includes("e-check.process")) && (
                <div className="w-full border-b border-[#d5d6d6] flex md:mt-[3vw] mt-[8vw] md:gap-[2vw] gap-[6vw] relative">
                    <button
                        className={`md:text-[1vw] text-[3.5vw] tab_button py-[0.3vw] ${currentScreen === 1 && "active-button1"
                            }`}
                        onClick={(e) => {
                            handleTabClick(e);
                            setCurrentScreen(1);
                        }}
                    >
                        Verification Requests Sent
                    </button>
                    <button
                        className={`md:text-[1vw] text-[3.5vw] tab_button py-[0.3vw] ${currentScreen === 2 && "active-button1"
                            }`}
                        onClick={(e) => {
                            handleTabClick(e);
                            setCurrentScreen(2);
                        }}
                    >
                        Verification Requests Received
                    </button>

                    <div
                        className="line"
                        ref={lineRef1}
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
                    <DashboardOutgoingVerificationRequest />
                )}
                {currentScreen === 2 && (
                    <DashboardIncomingVerificationRequest />
                )}
            </div>
        </>
    )
}

export default UserDashboardVerificationRequests
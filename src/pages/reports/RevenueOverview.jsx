import React, { useEffect, useRef, useState } from "react";
import DocumentRequestReport from "./DoumentRequestReport";
import Navbar from "@/components/Navbar";
import { useGetInstitutionRevenueQuery } from "../../redux/apiSlice";
import secureLocalStorage from "react-secure-storage";
import ValidationRequestReport from "./ValidationRequestReport";

function RevenueOverview() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const lineRef = useRef(null);
  const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });

  const user = JSON.parse(secureLocalStorage.getItem("user"));

  console.log("user", user);

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
    data: institutionRevenue,
    isLoading: isDocTypesLoading,
    isFetching: isDocTypesFetching,
  } = useGetInstitutionRevenueQuery({
    institutionID: user?.institution?.id,
  });


  return (
    <>
      <Navbar />
      <div className="bg-white p-[1vw]">
        <div className="flex justify-between items-center">
          <div className="w-[23%] bg-[#f8f8f8] p-[0.2vw] rounded-[0.4vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] rounded-[0.3vw] flex p-[0.5vw] items-center gap-[0.5vw]">
              <div className="w-[3vw] h-[3vw] bg-[#ff0404] rounded-[0.2vw] flex items-center justify-center">
                <i class="bx bx-money-withdraw text-white text-[1.4vw]"></i>
              </div>
              <div className="flex flex-col">
                <h4 className="text-[1.5vw] font-[600]">
                  GH¢{" "}
                  {parseFloat(institutionRevenue?.total_revenue ?? 0).toFixed(
                    2
                  )}
                </h4>
              </div>
            </div>
            <h4 className="text-[0.9vw] mt-[0.5vw] mb-[0.3vw]">
              Total Revenue
            </h4>
          </div>
          <div className="w-[23%] bg-[#f8f8f8] p-[0.2vw] rounded-[0.4vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] rounded-[0.3vw] flex p-[0.5vw] items-center gap-[0.5vw]">
              <div className="w-[3vw] h-[3vw] bg-[#EC7AFF] rounded-[0.2vw] flex items-center justify-center">
                <i class="bx bx-money-withdraw text-white text-[1.4vw]"></i>
              </div>
              <div className="flex flex-col">
                <h4 className="text-[1.5vw] font-[600]">
                  {" "}
                  GH¢{" "}
                  {parseInt(
                    institutionRevenue?.document_request_revenue ?? 0
                  ).toFixed(2)}
                </h4>
              </div>
            </div>
            <h4 className="text-[0.9vw] mt-[0.5vw] mb-[0.3vw]">
              Document Request Revenue
            </h4>
          </div>
          <div className="w-[23%] bg-[#f8f8f8] p-[0.2vw] rounded-[0.4vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] rounded-[0.3vw] flex p-[0.5vw] items-center gap-[0.5vw]">
              <div className="w-[3vw] h-[3vw] bg-[#FFC130] rounded-[0.2vw] flex items-center justify-center">
                <i class="bx bx-money-withdraw text-white text-[1.4vw]"></i>
              </div>
              <div className="flex flex-col">
                <h4 className="text-[1.5vw] font-[600]">
                  GH¢{" "}
                  {parseInt(
                    institutionRevenue?.validation_request_revenue ?? 0
                  ).toFixed(2)}
                </h4>
              </div>
            </div>
            <h4 className="text-[0.9vw] mt-[0.5vw] mb-[0.3vw]">
              Validation Request Revenue
            </h4>
          </div>
          <div className="w-[23%] bg-[#f8f8f8] p-[0.2vw] rounded-[0.4vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] rounded-[0.3vw] flex p-[0.5vw] items-center gap-[0.5vw]">
              <div className="w-[3vw] h-[3vw] bg-[#ff0404] rounded-[0.2vw] flex items-center justify-center">
                <i class="bx bx-money-withdraw text-white text-[1.4vw]"></i>
              </div>
              <div className="flex flex-col">
                <h4 className="text-[1.5vw] font-[600]">GH¢ 0</h4>
              </div>
            </div>
            <h4 className="text-[0.9vw] mt-[0.5vw] mb-[0.3vw]">
              Verification Request Revenue
            </h4>
          </div>
        </div>
        <div className="bg-white pt-[1vw]">
          <div className="w-full border-b border-[#d5d6d6] flex md:mt-[3vw] mt-[8vw] md:gap-[2vw] gap-[6vw] relative ">
            <button
              className={`md:text-[1vw] text-[3.5vw] tab_button py-[0.3vw] ${
                currentScreen === 1 && "active-button"
              }`}
              onClick={(e) => {
                handleTabClick(e);
                setCurrentScreen(1);
              }}
            >
              Document Requests
            </button>
            <button
              className={`md:text-[1vw] text-[3.5vw] tab_button py-[0.3vw] ${
                currentScreen === 2 && "active-button"
              }`}
              onClick={(e) => {
                handleTabClick(e);
                setCurrentScreen(2);
              }}
            >
              Validation Requests
            </button>
            <button
              className={`md:text-[1vw] text-[3.5vw] tab_button py-[0.3vw] ${
                currentScreen === 3 && "active-button"
              }`}
              onClick={(e) => {
                handleTabClick(e);
                setCurrentScreen(3);
              }}
            >
              Verification Requests
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
          {currentScreen === 1 && <DocumentRequestReport />}
          {currentScreen === 2 && <ValidationRequestReport />}
        </div>
      </div>
    </>
  );
}

export default RevenueOverview;

import React from "react";
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

function Dashboard() {
  const user = JSON.parse(secureLocalStorage.getItem("user"));

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

  return (
    <>
      <Navbar />
      <div className="bg-white p-[1vw]">
        <div className="flex justify-between items-center">
          <h1 className="text-[1.7vw]">
            Welcome, {user?.user?.first_name} {user?.user?.other_name}{" "}
            {user?.user?.last_name}
          </h1>
          <div className="flex">
            <button className="flex items-center border border-[#0000000f] py-[0.5vw] px-[1vw] rounded-[0.3vw] bg-[#F9F9F9] gap-[0.3vw]">
              <i className="bx bx-cog text-[1vw]"></i>
              <h4 className="text-[1vw]">Customize & settings</h4>
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-[2vw]">
          <div className="w-[32%] bg-[#f8f8f8] p-[0.2vw] rounded-[0.4vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] rounded-[0.3vw] flex p-[0.5vw] items-center gap-[0.5vw]">
              <div className="w-[3vw] h-[3vw] bg-[#ff0404] rounded-[0.2vw] flex items-center justify-center">
                <img src="/assets/img/docx.svg" alt="" className="w-[1.5vw]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[1.5vw] font-[600]">
                  {parseInt(
                    revenuePercentage?.document_requests?.current_month_count ??
                      0
                  ).toLocaleString()}
                </h4>
                <h4
                  className={`text-[0.8vw]  ${
                    revenuePercentage?.document_requests?.percentage_change >= 0
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
            <h4 className="text-[0.9vw] mt-[0.5vw] mb-[0.3vw]">
              Total Document Request
            </h4>
          </div>
          <div className="w-[32%] bg-[#f8f8f8] p-[0.2vw] rounded-[0.4vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] rounded-[0.3vw] flex p-[0.5vw] items-center gap-[0.5vw]">
              <div className="w-[3vw] h-[3vw] bg-[#EC7AFF] rounded-[0.2vw] flex items-center justify-center">
                <img src="/assets/img/docx.svg" alt="" className="w-[1.5vw]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[1.5vw] font-[600]">
                  {parseInt(
                    revenuePercentage?.validation_requests
                      ?.current_month_count ?? 0
                  ).toLocaleString()}
                </h4>
                <h4
                  className={`text-[0.8vw]  ${
                    revenuePercentage?.validation_requests?.percentage_change >=
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
            <h4 className="text-[0.9vw] mt-[0.5vw] mb-[0.3vw]">
              Total Validation Request
            </h4>
          </div>
          <div className="w-[32%] bg-[#f8f8f8] p-[0.2vw] rounded-[0.4vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] rounded-[0.3vw] flex p-[0.5vw] items-center gap-[0.5vw]">
              <div className="w-[3vw] h-[3vw] bg-[#FFC130] rounded-[0.2vw] flex items-center justify-center">
                <img src="/assets/img/docx.svg" alt="" className="w-[1.5vw]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[1.5vw] font-[600]">0</h4>
                <h4 className="text-[0.8vw] text-[#27CA40]">
                  0.00% Previous Month
                </h4>
              </div>
            </div>
            <h4 className="text-[0.9vw] mt-[0.5vw] mb-[0.3vw]">
              Total Verification Request
            </h4>
          </div>
          {/* <div className="w-[23%] bg-[#f8f8f8] p-[0.2vw] rounded-[0.4vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] rounded-[0.3vw] flex p-[0.5vw] items-center gap-[0.5vw]">
              <div className="w-[3vw] h-[3vw] bg-[#ff0404] rounded-[0.2vw] flex items-center justify-center">
                <img src="/assets/img/docx.svg" alt="" className="w-[1.5vw]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[1.5vw] font-[600]">
                  {parseInt(
                    analytics?.documentRequests?.pending ?? 0
                  ).toLocaleString()}
                </h4>
                <h4 className="text-[0.8vw] text-[#ff0404]">
                  -83.2% Previous Month
                </h4>
              </div>
            </div>
            <h4 className="text-[0.9vw] mt-[0.5vw] mb-[0.3vw]">
              Total Pending Document Request
            </h4>
          </div> */}
        </div>
        <div className="flex w-full mt-[2vw] justify-between">
          <div className="w-[58%] h-[26vw] border rounded-[0.4vw] border-[#0000000f]">
            <RevenueGraph revenueGraph={revenueGraph} />
          </div>
          <div className="w-[40%] h-[26vw] border rounded-[0.4vw] border-[#0000000f overflow-hidden">
            <Team />
          </div>
        </div>
        <div className="w-full h-[40vw] mt-[2vw] border rounded-[0.4vw] border-[#0000000f] overflow-hidden">
          <DashboardDocumentRequests />
        </div>
      </div>
    </>
  );
}

export default Dashboard;

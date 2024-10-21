import React, { useRef, useState } from "react";
import AuthLayout from "@components/AuthLayout";
import { GoGitPullRequest } from "react-icons/go";
import { MdManageHistory } from "react-icons/md";
import { GrValidate } from "react-icons/gr";
import { IoDocuments } from "react-icons/io5";
import useSWR from "swr";
import axios from "@utils/axiosConfig";
import DoumentRequestReport from "./DoumentRequestReport";
import ValidationRequestReport from "./ValidationRequestReport";
import secureLocalStorage from "react-secure-storage";

export default function RevenueOverview() {
  const lineRef = useRef(null);
  const [data, setData] = useState(null);
  const [currentTab, setCurrentTab] = useState(1);
  const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
  const institution_id = JSON?.parse(secureLocalStorage.getItem("auth-storage"))
    ?.state?.institution?.id;
  const handleTabClick = (e) => {
    const target = e.target;
    setLineStyle({
      width: target.offsetWidth,
      left: target.offsetLeft,
    });
  };

  const {
    data: resData,
    error,
    isLoading,
  } = useSWR(
    `/institution/reports/total-income?institution_id=${institution_id}`,
    (url) => axios.get(url).then((res) => res.data)
  );

  console.log(resData);
  return (
    <AuthLayout title="Report Overview">
      <section className="md:px-3 md:w-full w-[98vw] mx-auto">
        <p className="font-bold text-gray-800 text-xl mb-2 mt-6">
          Report Overview
        </p>
        <div className="col-span-2 xl:col-span-3 grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="border rounded-xl p-4 bg-white">
            <div className="flex space-x-2 text-gray-700">
              <div className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white p-1 rounded-md">
                <GoGitPullRequest size={16} />
              </div>
              <p className="font-medium">Total Revenue</p>
            </div>
            <div className="mt-6">
              {isLoading ? (
                <></>
              ) : (
                <>
                  <p className="font-bold text-3xl">
                    GH¢ {parseFloat(resData?.total_revenue).toFixed(2)}
                  </p>
                  <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
                </>
              )}
            </div>
          </div>
          <div className="border rounded-xl p-4 bg-white">
            <div className="flex space-x-2 text-gray-700">
              <div className="flex items-center justify-center w-6 h-6 bg-red-700 text-white p-1 rounded-md">
                <IoDocuments size={16} />
              </div>
              <p className="font-medium">Document Requests Revenue</p>
            </div>
            <div className="mt-6">
              {isLoading ? (
                <></>
              ) : (
                <>
                  <p className="font-bold text-3xl">
                    GH¢ {parseInt(resData?.document_request_revenue).toFixed(2)}
                  </p>
                  <div className="h-1 w-12 bg-red-700 rounded-full"></div>
                </>
              )}
            </div>
          </div>
          <div className="border rounded-xl p-4 bg-white">
            <div className="flex space-x-2 text-gray-700">
              <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white p-1 rounded-md">
                <GrValidate size={16} />
              </div>
              <p className="font-medium">Validation Requests Revenue</p>
            </div>
            <div className="mt-6">
              {isLoading ? (
                <></>
              ) : (
                <>
                  <p className="font-bold text-3xl">
                    GH¢{" "}
                    {parseInt(resData?.validation_request_revenue).toFixed(2)}
                  </p>
                  <div className="h-1 w-12 bg-green-600 rounded-full"></div>
                </>
              )}
            </div>
          </div>
          <div className="border rounded-xl p-4 bg-white">
            <div className="flex space-x-2 text-gray-700">
              <div className="flex items-center justify-center w-6 h-6 bg-gray-700 text-white p-1 rounded-md">
                <MdManageHistory size={16} />
              </div>
              <p className="font-medium">Verification</p>
            </div>
            <div className="mt-6">
              <p className="font-bold text-3xl">GH¢ 0.00</p>
              <div className="h-1 w-12 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="w-full border-b border-[#d5d6d6] flex md:mt-[3vw] mt-[8vw] md:gap-[2vw] gap-[6vw] relative">
          <button
            className={`text-lg tab_button py-[0.3vw] ${
              currentTab === 1 && "active-button font-bold text-[#ff0404]"
            }`}
            onClick={(e) => {
              handleTabClick(e);
              setCurrentTab(1);
            }}
          >
            Document Requests
          </button>
          <button
            className={`text-lg  tab_button py-[0.3vw] ${
              currentTab === 2 && "active-button font-bold text-[#ff0404]"
            }`}
            onClick={(e) => {
              handleTabClick(e);
              setCurrentTab(2);
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
        {currentTab === 1 && <DoumentRequestReport />}
        {currentTab === 2 && <ValidationRequestReport />}
      </section>
    </AuthLayout>
  );
}

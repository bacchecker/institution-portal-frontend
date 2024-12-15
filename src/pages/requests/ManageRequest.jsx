import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { IoDocuments, IoShieldCheckmark } from "react-icons/io5";
import { FaAnchorCircleCheck } from "react-icons/fa6";
import DocumentRequest from "./DocumentRequest";
import ValidationRequest from "./ValidationRequest";
import axios from "../../utils/axiosConfig";
import DocumentRequests from "./DocumentRequests";
import {
  useGetAllExistingDocumentTypesQuery,
  useGetInstitutionDocumentTypesQuery,
} from "../../redux/apiSlice";

export default function ManageRequest() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [docRequest, setDocRequest] = useState(0);
  const [valRequest, setValRequest] = useState(0);
  const lineRef = useRef(null);
  const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });

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
    data: institutionDocumentTypes,
    isLoading: isDocTypesLoading,
    isFetching: isDocTypesFetching,
  } = useGetInstitutionDocumentTypesQuery({
    page: 1,
    perPage: 50,
  });

  useEffect(() => {
    const fetchPendingDocuments = async () => {
      try {
        const response = await axios.get(
          "/institution/requests/pending-documents"
        );
        console.log("API response:", response.data); // Debugging
        setValRequest(response.data.valRequest || 0); // Fallback to 0 if undefined
        setDocRequest(response.data.docRequest || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPendingDocuments();
  }, []);

  return (
    // <div title="Manage Request" className="bg-gray-100 text-sm">
    //   <div className="flex w-full flex-col">
    //     <Tabs
    //       aria-label="Options"
    //       classNames={{
    //         tabList:
    //           "gap-6 w-full relative rounded-none px-2 border-b border-divider",
    //         cursor: "w-full bg-bChkRed",
    //         tab: "max-w-fit px-0 h-[62px]",
    //         tabContent: "group-data-[selected=true]:text-bChkRed",
    //       }}
    //       color="danger"
    //       variant="underlined"
    //     >
    //       <Tab
    //         key="document"
    //         title={
    //           <div className="flex items-center space-x-2">
    //             <IoDocuments size={20} />
    //             <span>Document Request</span>
    //             <Chip size="sm" variant="faded">
    //               {docRequest}
    //             </Chip>
    //           </div>
    //         }
    //       >
    //         <DocumentRequest />
    //       </Tab>
    //       <Tab
    //         key="music"
    //         title={
    //           <div className="flex items-center space-x-2">
    //             <IoShieldCheckmark size={20} />
    //             <span>Validation Request</span>
    //             <Chip size="sm" variant="faded">
    //               {valRequest}
    //             </Chip>
    //           </div>
    //         }
    //       >
    //         <ValidationRequest />
    //       </Tab>
    //       <Tab
    //         key="videos"
    //         title={
    //           <div className="flex items-center space-x-2">
    //             <FaAnchorCircleCheck size={20} />
    //             <span>Verification Request</span>
    //             <Chip size="sm" variant="faded">
    //               1
    //             </Chip>
    //           </div>
    //         }
    //       >
    //         <p>Verification Request</p>
    //       </Tab>
    //     </Tabs>
    //   </div>
    // </div>
    <div className="bg-white pt-[2vw] px-[1vw]">
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
      {currentScreen === 1 && (
        <DocumentRequests
          institutionDocumentTypes={institutionDocumentTypes}
          isDocTypesLoading={isDocTypesLoading}
          isDocTypesFetching={isDocTypesFetching}
        />
      )}
    </div>
  );
}

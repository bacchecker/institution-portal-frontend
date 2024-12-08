import React, { useState, useEffect } from "react";
import AuthLayout from "@components/AuthLayout";
import {Tabs, Tab, Chip} from "@nextui-org/react";
import { IoDocuments, IoShieldCheckmark } from "react-icons/io5";
import { FaAnchorCircleCheck } from "react-icons/fa6";
import DocumentRequest from "./DocumentRequest";
import ValidationRequest from "./ValidationRequest";
import axios from "@utils/axiosConfig";

export default function ManageRequest() {

    const [docRequest, setDocRequest] = useState(0);
    const [valRequest, setValRequest] = useState(0);

    useEffect(() => {
        const fetchPendingDocuments = async () => {
            try {
                const response = await axios.get("/institution/requests/pending-documents");
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
    <AuthLayout title="Manage Request" className="bg-white">
        <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none px-2 border-b border-divider bg-white",
          cursor: "w-full bg-bChkRed",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-bChkRed",
        }}
        color="danger"
        variant="underlined"
      >
        <Tab
          key="document"
          title={
            <div className="flex items-center space-x-2">
              <IoDocuments size={20}/>
              <span>Document Request</span>
              <Chip size="sm" variant="faded">
                {docRequest}
              </Chip>
            </div>
          }
        >
            <DocumentRequest />
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <IoShieldCheckmark size={20} />
              <span>Validation Request</span>
              <Chip size="sm" variant="faded">
                {valRequest}
              </Chip>
            </div>
          }
        >
            <ValidationRequest />
        </Tab>
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <FaAnchorCircleCheck size={20}/>
              <span>Verification Request</span>
              <Chip size="sm" variant="faded">
                1
              </Chip>
            </div>
          }
        >
            <p>Verification Request</p>
        </Tab>
      </Tabs>
    </div>
    </AuthLayout>
  );
}

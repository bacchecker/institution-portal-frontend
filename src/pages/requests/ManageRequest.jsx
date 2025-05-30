import React, { useState, useEffect } from "react";
import {Tabs, Tab, Chip} from "@nextui-org/react";
import { IoDocuments, IoShieldCheckmark } from "react-icons/io5";
import { FaAnchorCircleCheck, FaUser } from "react-icons/fa6";
import DocumentRequest from "./DocumentRequest";
import ValidationRequest from "./ValidationRequest";
import axios from "@/utils/axiosConfig";
import Navbar from "@/components/Navbar";
import secureLocalStorage from "react-secure-storage";

export default function ManageRequest() {

    const [docRequest, setDocRequest] = useState(0);
    const [valRequest, setValRequest] = useState(0);

    useEffect(() => {
        const fetchPendingDocuments = async () => {
            try {
                const response = await axios.get("/institution/requests/pending-documents");
                setValRequest(response.data.valRequest || 0); // Fallback to 0 if undefined
                setDocRequest(response.data.docRequest || 0);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchPendingDocuments();
    }, []);
 

  return (
    <div className="bg-white text-sm w-full">
      <Navbar />
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-bChkRed",
            tab: "max-w-fit px-2 h-[52px]",
            tabContent: "group-data-[selected=true]:text-bChkRed",
          }}
          color="danger"
          variant="underlined"
        >
          {/* Conditionally render Tab components */}
          {(secureLocalStorage.getItem('userPermissions')?.includes('document-requests.view') || 
            JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
            <Tab
              key="document"
              title={
                <div className="flex items-center space-x-2">
                  <IoDocuments size={20} />
                  <span>Document Request</span>
                  <Chip size="sm" variant="faded">
                    {docRequest}
                  </Chip>
                </div>
              }
            >
              <DocumentRequest />
            </Tab>
          )}

          {(secureLocalStorage.getItem('userPermissions')?.includes('validation-requests.view') || 
            JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
              <Tab
                key="validation"
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
          )}

        </Tabs>

      </div>
    </div>
  );
}

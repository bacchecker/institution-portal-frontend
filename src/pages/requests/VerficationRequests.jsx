import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import IncomingRequests from "../requests/verification-request/IncomingRequests"
import OutgoingRequests from "./verification-request/OutgoingRequests";
import Navbar from "@/components/Navbar";
import { FiPhoneIncoming, FiPhoneOutgoing } from "react-icons/fi";
import { FaCircleArrowDown } from "react-icons/fa6";


export default function VerificationRequest() {


  return (
    <>
    <div className="bg-white text-sm w-full">
        <Navbar />
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-bChkRed",
              tab: "max-w-fit px-2 h-[50px]",
              tabContent: "group-data-[selected=true]:text-bChkRed",
            }}
            color="danger"
            variant="underlined"
          >
            <Tab
              key="document"
              title={
                <div className="flex items-center space-x-2">
                  <FaCircleArrowDown className="rotate-45" size={20}/>
                  <span>Incoming</span>
                  {/* <Chip size="sm" variant="faded">
                    {docRequest}
                  </Chip> */}
                </div>
              }
            >
              <IncomingRequests />   
            </Tab>
            <Tab
              key="music"
              title={
                <div className="flex items-center space-x-2">
                  <FaCircleArrowDown style={{ transform: 'rotate(-135deg)' }} size={20}/>
                  <span>Outgoing</span>
                  {/* <Chip size="sm" variant="faded">
                    {docRequest}
                  </Chip> */}
                </div>
              }
            >
              <OutgoingRequests />
            </Tab>
            
          </Tabs>
        </div>
        
      </div>
      
    </>
  );
}

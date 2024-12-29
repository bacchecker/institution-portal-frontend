import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import IncomingRequests from "../requests/verification-request/IncomingRequests"
import OutgoingRequests from "./verification-request/OutgoingRequests";

export default function VerificationRequest() {


  return (
    <>
    <div className="flex w-full flex-col -mt-2">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: "gap-x-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-black",
            tab: "max-w-fit px-2 h-[30px]",
            tabContent: "group-data-[selected=true]:text-black",
          }}
          color="danger"
          variant="underlined"
        >
          <Tab
            key="document"
            title={
              <div className="flex text-sm font-medium uppercase items-center space-x-2">
                <span>Incoming</span>
              </div>
            }
          >
            <IncomingRequests />   
          </Tab>
          <Tab
            key="music"
            title={
              <div className="flex text-sm font-medium uppercase items-center space-x-2">
                <span>Outgoing</span>
              </div>
            }
          >
             <OutgoingRequests />
          </Tab>
          
        </Tabs>
      </div>
      
    </>
  );
}

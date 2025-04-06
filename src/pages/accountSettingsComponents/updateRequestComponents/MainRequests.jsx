import React, { useState, useEffect } from "react";
import {Tabs, Tab, Chip} from "@nextui-org/react";
import { IoDocuments, IoSettingsOutline, IoShieldCheckmark } from "react-icons/io5";
import Navbar from "@/components/Navbar";
import secureLocalStorage from "react-secure-storage";
import { BsBuildingsFill } from "react-icons/bs";
import UpdateRequest from "./UpdateRequest";
import UpdateHistory from "./UpdateHistory";
import { MdNewLabel, MdOutlineHistory } from "react-icons/md";

export default function AccountSettings() { 

  return (
    <div className="bg-white text-sm w-full">
      <Navbar />
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-bChkRed",
            tab: "max-w-fit px-2 h-[48px]",
            tabContent: "group-data-[selected=true]:text-bChkRed",
          }}
          color="danger"
          variant="underlined"
        >
          {(secureLocalStorage.getItem('userPermissions')?.includes('institution.settings.view') || 
            JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
            <Tab
              key="request"
              title={
                <div className="flex items-center space-x-2">
                  <MdNewLabel size={22} />
                  <span>Update Request</span>
                </div>
              }
            >
              <UpdateRequest />
            </Tab>
          )}

          {(secureLocalStorage.getItem('userPermissions')?.includes('institution.settings.view') || 
            JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
            <Tab
              key="history"
              title={
                <div className="flex items-center space-x-2">
                  <MdOutlineHistory size={22} />
                  <span>Request History</span>
                </div>
              }
            >
              <UpdateHistory />
            </Tab>
          )}

        </Tabs>

      </div>
    </div>
  );
}

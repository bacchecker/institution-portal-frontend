import React, { useState, useEffect } from "react";
import {Tabs, Tab, Chip} from "@nextui-org/react";
import { IoDocuments, IoSettingsOutline, IoShieldCheckmark } from "react-icons/io5";
import Navbar from "@/components/Navbar";
import secureLocalStorage from "react-secure-storage";
import InstitutionDepartments from "./InstitutionDepartments";
import InstitutionUsers from "./InstitutionUsers";
import { FaBuilding, FaUsers } from "react-icons/fa";
import SecuritySettings from "./SecuritySettings";
import InstitutionProfile from "./InstitutionProfile";
import { BsBuildingsFill } from "react-icons/bs";

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
              key="profile"
              title={
                <div className="flex items-center space-x-2">
                  <BsBuildingsFill size={18} />
                  <span>Institution Profile</span>
                </div>
              }
            >
              <InstitutionProfile />
            </Tab>
          )}

          {(secureLocalStorage.getItem('userPermissions')?.includes('institution.settings.view') || 
            JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
            <Tab
              key="security"
              title={
                <div className="flex items-center space-x-2">
                  <IoSettingsOutline size={18} />
                  <span>Security Settings</span>
                </div>
              }
            >
              <SecuritySettings />
            </Tab>
          )}

          {(secureLocalStorage.getItem('userPermissions')?.includes('institution.settings.view') || 
            JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
            <Tab
              key="departments"
              title={
                <div className="flex items-center space-x-2">
                  <FaBuilding size={18} />
                  <span>Departments</span>
                </div>
              }
            >
              <InstitutionDepartments />
            </Tab>
          )}

          {(secureLocalStorage.getItem('userPermissions')?.includes('institution.settings.view') || 
            JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
              <Tab
                key="users"
                title={
                  <div className="flex items-center space-x-2">
                    <FaUsers size={20} />
                    <span>Users</span>
                  </div>
                }
              >
                <InstitutionUsers />
              </Tab>
          )}

        </Tabs>

      </div>
    </div>
  );
}

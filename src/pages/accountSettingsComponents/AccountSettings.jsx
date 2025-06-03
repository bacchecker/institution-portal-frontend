import { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { IoDocuments, IoSettingsOutline } from "react-icons/io5";
import Navbar from "@/components/Navbar";
import secureLocalStorage from "react-secure-storage";
import InstitutionDepartments from "./InstitutionDepartments";
import InstitutionUsers from "./InstitutionUsers";
import { FaBuilding, FaUsers, FaCreditCard } from "react-icons/fa";
import SecuritySettings from "./SecuritySettings";
import InstitutionProfile from "./InstitutionProfile";
import { BsBuildingsFill } from "react-icons/bs";
import InstitutionDocTypes from "./InstitutionDocTypes";
import SubscriptionManagement from "./SubscriptionManagement";
import PaymentAccounts from "./PaymentAccounts";
import { RiVipCrownFill } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";

export default function AccountSettings() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <div className="bg-white text-sm w-full">
      <Navbar />
      <div className="flex w-full flex-col">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          aria-label="Options"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-bChkRed",
            tab: "max-w-fit px-2 h-[48px]",
            tabContent: "group-data-[selected=true]:text-bChkRed",
          }}
          color="danger"
          variant="underlined"
        >
          {(secureLocalStorage
            .getItem("userPermissions")
            ?.includes("institution.settings.view") ||
            JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin) && (
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

          {(secureLocalStorage
            .getItem("userPermissions")
            ?.includes("institution.settings.view") ||
            JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin) && (
            <Tab
              key="security"
              id="security"
              title={
                <div className="flex items-center space-x-2">
                  <IoSettingsOutline size={18} />
                  <span>Security Settings</span>
                </div>
              }
            >
              <SecuritySettings setActiveTab={setActiveTab} />
            </Tab>
          )}

          {(secureLocalStorage
            .getItem("userPermissions")
            ?.includes("institution.settings.view") ||
            JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin) && (
            <Tab
              key="subscription"
              id="subscription"
              title={
                <div className="flex items-center space-x-2">
                  <RiVipCrownFill size={18} />
                  <span>Subscription</span>
                </div>
              }
            >
              <SubscriptionManagement />
            </Tab>
          )}

          {(secureLocalStorage
            .getItem("userPermissions")
            ?.includes("institution.settings.view") ||
            JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin) && (
            <Tab
              key="docTypes"
              id="docTypes"
              title={
                <div className="flex items-center space-x-2">
                  <IoDocuments size={18} />
                  <span>Document Types</span>
                </div>
              }
            >
              <InstitutionDocTypes />
            </Tab>
          )}

          {(secureLocalStorage
            .getItem("userPermissions")
            ?.includes("institution.settings.view") ||
            JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin) && (
            <Tab
              key="departments"
              id="departments"
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

          {(secureLocalStorage
            .getItem("userPermissions")
            ?.includes("institution.settings.view") ||
            JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin) && (
            <Tab
              key="users"
              id="users"
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

          {(secureLocalStorage
            .getItem("userPermissions")
            ?.includes("institution.settings.view") ||
            JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin) && (
            <Tab
              key="paymentAccounts"
              id="paymentAccounts"
              title={
                <div className="flex items-center space-x-2">
                  <FaCreditCard size={18} />
                  <span>Payment Accounts</span>
                </div>
              }
            >
              <PaymentAccounts />
            </Tab>
          )}
        </Tabs>
      </div>
    </div>
  );
}

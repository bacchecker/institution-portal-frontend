import React from "react";
import {Tabs, Tab, Chip} from "@nextui-org/react";
import { IoDocuments } from "react-icons/io5";
import DocumentRequest from "./searchComponents/DocumentRequest";
import ValidationRequest from "./searchComponents/ValidationRequest";
import VerificationRequest from "./searchComponents/VerificationRequest";
import Navbar from "@/components/Navbar";
import { useLocation } from "react-router-dom";
import UserList from "./searchComponents/UserList";
import DepartmentList from "./searchComponents/DepartmentList";
import DocumentTypes from "./searchComponents/DocumentTypes";

export default function SearchAll() {

    const location = useLocation();
    const results = location.state?.results || {};
    const { document_requests, validation_requests, verification_requests, users, departments, document_types } = results;

    const tabs = [
        {
          key: "document_requests",
          label: "Document Request",
          count: document_requests.length,
          component: <DocumentRequest data={document_requests} />,
        },
        {
          key: "validation_requests",
          label: "Validation Request",
          count: validation_requests.length,
          component: <ValidationRequest data={validation_requests} />,
        },
        {
          key: "verification_requests",
          label: "Verification Request",
          count: verification_requests.length,
          component: <VerificationRequest data={verification_requests} />,
        },
        {
          key: "users",
          label: "Users",
          count: users.length,
          component: <UserList data={users} />,
        },
        {
          key: "departments",
          label: "Departments",
          count: departments.length,
          component: <DepartmentList data={departments} />,
        },
        {
          key: "document_types",
          label: "Document Types",
          count: document_types.length,
          component: <DocumentTypes data={document_types} />,
        },
    ];

  return (
    <div className="bg-white text-sm w-full">
        <Navbar />
        <div className="flex w-full flex-col">
        {tabs.some((tab) => tab.count > 0) ? (
            <Tabs
                aria-label="Search Results"
                classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-bChkRed",
                tab: "max-w-fit px-2 h-[52px]",
                tabContent: "group-data-[selected=true]:text-bChkRed",
                }}
                color="danger"
                variant="underlined"
            >
                {tabs.map(
                (tab) =>
                    tab.count > 0 && ( // Render tab only if the count is greater than 0
                    <Tab
                        key={tab.key}
                        title={
                        <div className="flex items-center space-x-2">
                            <span>{tab.label}</span>
                            <Chip size="sm" variant="faded">
                            {tab.count}
                            </Chip>
                        </div>
                        }
                    >
                        {tab.component}
                    </Tab>
                    )
                )}
            </Tabs>
            ) : (
            <div className="md:!h-[65vh] h-[60vh] flex flex-col gap-8 items-center justify-center">
                <img src="/assets/img/no-data.svg" alt="No data" className="w-1/4 md:w-1/6 h-auto" />
                <p className="text-center text-slate-500 font-montserrat font-medium text-base -mt-6">
                  No result was found from you search keyword
                </p>
              </div>
            )}

      </div>
    </div>
  );
}

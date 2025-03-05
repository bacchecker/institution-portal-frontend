import React, { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";
import {Tabs, Tab} from "@nextui-org/react";
import secureLocalStorage from "react-secure-storage";
import ValidationListItems from "./ValidationListItems";
import VerificationListItems from "./VerificationListItems";

function ChecklistItems({ setOpenModal, openModal, selectedDocumentType, fetchDocumentType }) {
  const [userInput, setUserInput] = useState([]);
  const [initialUserInput, setInitialUserInput] = useState([]);
  useEffect(() => {
    if (selectedDocumentType) {
      setUserInput(selectedDocumentType);
      setInitialUserInput(selectedDocumentType);
    }
  }, [selectedDocumentType]);


  useEffect(() => {
    if (!openModal) {
      setUserInput(initialUserInput);
    }
  }, [openModal]);
  
  return (
    <Drawer
        isOpen={openModal}
        setIsOpen={setOpenModal}
        title={"Document Type Checklist Items"}
        classNames="w-full md:w-[70%] lg:w-[55%] 2xl:w-[50%]"
    >
        <div className="-mt-4">
            <Tabs
                aria-label="Options"
            >
                {(secureLocalStorage.getItem('userPermissions')?.includes('institution.settings.view') || 
                    JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
                    <Tab
                        key="validation"
                        title={
                            <div className="flex items-center space-x-2">
                            <span>Validation Checklist</span>
                            </div>
                        }
                    >
                    <ValidationListItems 
                        selectedDocumentType = {userInput}
                    />
                    </Tab>
                )}
                {(secureLocalStorage.getItem('userPermissions')?.includes('institution.settings.view') || 
                    JSON.parse(secureLocalStorage.getItem('userRole'))?.isAdmin) && (
                    <Tab
                        key="verification"
                        title={
                            <div className="flex items-center space-x-2">
                            <span>Verification Checklist</span>
                            </div>
                        }
                    >
                        <VerificationListItems
                            selectedDocumentType = {userInput}
                        />
                    </Tab>
                )}
            </Tabs> 
        </div>
        
    </Drawer>
  );
}

export default ChecklistItems;

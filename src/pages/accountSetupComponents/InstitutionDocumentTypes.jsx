import { Button, Card, CardBody, Input, Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import useSWR from "swr";
import axios from "@utils/axiosConfig";
import Drawer from "../../components/Drawer";

function InstitutionDocumentTypes({ setActiveStep }) {
  const [isSaving, setSaving] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("Document Types Details");
  const [openDrawer, setOpenDrawer] = useState(false);

  const institution = secureLocalStorage.getItem("institution");
  const setInstitution = (newInstitution) => {
    secureLocalStorage.setItem("institution", newInstitution);
  };

  const {
    data: existingInstitutionDocumentTypes,
    error,
    isLoading,
  } = useSWR(
    () => {
      if (institution?.type === "bacchecker-academic") {
        return `/institutions/document-types?academic_level=${institution?.academic_level}`;
      } else {
        return `/institutions/document-types?institution_type=non-academic`;
      }
    },
    (url) => axios.get(url).then((res) => res.data)
  );

  const {
    data: institutionDatcc,
    error: institutionError,
    isLoading: institutionDocsLoading,
  } = useSWR("/institution/document-types/available", (url) =>
    axios.get(url).then((res) => res.data)
  );

  console.log("institutionDocuments", existingInstitutionDocumentTypes);

  const handleBackButton = () => {
    const updatedInstitution = {
      ...institution,
      current_step: "1",
    };

    setInstitution(updatedInstitution);
    secureLocalStorage.setItem("institution", updatedInstitution);
    setActiveStep(1);
  };

  return (
    <div className="w-full px-5">
      <div className="border-b border-[#ff0404] py-4">
        <h4 className="text-[1rem] font-[600] mb-4">
          Each institution utilizes specific document types for their
          operations. To proceed with your account setup, please add the
          document types accepted by your school. Below is a list of common
          document types used by {institution?.academic_level ?? "Business or government"} institutions. You may add from the <span className="text-[#ff0404]">existing
          options</span> or <span className="text-[#ff0404]">add new document types if necessary</span>.
        </h4>
        <h4 className="text-[1rem] font-[600] mb-2">
          Existing Document Types
        </h4>
        <div className="w-full flex flex-wrap gap-2">
          {institutionDocsLoading ? (
            <div className="w-full h-[5rem] flex justify-center items-center">
              <Spinner size="sm" color="danger" />
            </div>
          ) : (
            <>
              {existingInstitutionDocumentTypes?.data?.types?.map(
                (documentType, i) => {
                  return (
                    <div className="w-fit h-fit border border-[#333333] px-2 py-2 rounded-[0.3rem]">
                      {documentType?.name}
                    </div>
                  );
                }
              )}
            </>
          )}
        </div>
      </div>
      <div className="my-3 w-full flex justify-end mx-auto dark:bg-slate-900 mt-6">
        <div className="flex gap-4 items-center">
          <button
            type="button"
            onClick={() => {
              setOpenDrawer(true);
            }}
            className="w-fit flex items-center bg-[#000000] hover:bg-[#282727] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
          >
            Add From Existing Type
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenDrawer(true);
            }}
            className="w-fit flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
          >
            Add New Document Type
          </button>
        </div>
      </div>
      <div>
        <Drawer
          title={drawerTitle}
          isOpen={openDrawer}
          setIsOpen={setOpenDrawer}
        >
          <form className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-6 mb-6">
              <Input
                size="sm"
                label="Account Name"
                type="text"
                name="account_name"
                // value={selectedData.account_name}
              />

              {/*<Input
                size="sm"
                label="Account Number"
                type="text"
                name="account_number"
                value={selectedData.account_number}
                id="name"
                onChange={(e) =>
                  setSelectedData((prev) => ({
                    ...prev,
                    account_number: e.target.value,
                  }))
                }
                errorMessage={errors.account_number}
                isInvalid={!!errors.account_number}
              />

              <Input
                size="sm"
                label="Bank Name"
                type="text"
                name="bank_name"
                value={selectedData.bank_name}
                onChange={(e) =>
                  setSelectedData((prev) => ({
                    ...prev,
                    bank_name: e.target.value,
                  }))
                }
                errorMessage={errors.bank_name}
                isInvalid={!!errors.bank_name}
              />

              <Input
                size="sm"
                label="Bank Branch"
                type="text"
                name="bank_branch"
                value={selectedData.bank_branch}
                onChange={(e) =>
                  setSelectedData((prev) => ({
                    ...prev,
                    bank_branch: e.target.value,
                  }))
                }
                errorMessage={errors.bank_branch}
                isInvalid={!!errors.bank_branch}
              />

              <Select
                size="sm"
                label="Account Type"
                className="w-full"
                name="account_type"
                defaultSelectedKeys={[selectedData?.account_type]}
                onChange={(e) =>
                  setSelectedData((prev) => ({
                    ...prev,
                    account_type: e.target.value,
                  }))
                }
              >
                {[
                  {
                    key: "savings",
                    label: "Savings",
                  },
                  {
                    key: "current",
                    label: "Current",
                  },
                  {
                    key: "domiciliary",
                    label: "Domiciliary",
                  },
                ].map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>

              <Input
                size="sm"
                label="Swift Code"
                type="text"
                name="swift_code"
                value={selectedData.swift_code}
                onChange={(e) =>
                  setSelectedData((prev) => ({
                    ...prev,
                    swift_code: e.target.value,
                  }))
                }
                errorMessage={errors.swift_code}
                isInvalid={!!errors.swift_code}
              />

              <Input
                size="sm"
                label="Currency"
                type="text"
                name="currency"
                value={selectedData.currency}
                maxLength={3}
                onChange={(e) =>
                  setSelectedData((prev) => ({
                    ...prev,
                    currency: e.target.value,
                  }))
                }
                errorMessage={errors.currency}
                isInvalid={!!errors.currency}
              /> */}
              {/* 
            <Switch
              size="sm"
              name="is_default"
              checked={selectedData.is_default}
              onValueChange={(value) =>
                setSelectedData((prev) => ({ ...prev, is_default: value }))
              }
              errorMessage={errors.is_default}
              isInvalid={!!errors.is_default}
            >
              Default Account
            </Switch> */}

              {/* 
                        <Select
                            size="sm"
                            label="Institution Type"
                            name="institution_type"
                            // value={selectedData.institution_type}
                            defaultSelectedKeys={[selectedData.institution_type]}
                            onChange={(e) =>
                                setSelectedData("institution_type", e.target.value)
                            }
                            errorMessage={errors.institution_type}
                            isInvalid={!!errors.institution_type}
                        >
                            {[
                                {
                                    label: "Academic",
                                    key: "academic",
                                },
                                {
                                    label: "Non-academic",
                                    key: "non-academic",
                                },
                            ].map((role) => (
                                <SelectItem key={role.key}>
                                    {role.label}
                                </SelectItem>
                            ))}
                        </Select> */}
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="w-1/2"
                size="sm"
                color="default"
                onClick={() => {
                  setOpenDrawer(false);
                  reset();
                }}
              >
                Close
              </Button>

              {/* <Button
                color="danger"
                className="font-montserrat font-semibold w-1/2"
                isLoading={processing}
                type="submit"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  save();
                }}
              >
                Save
              </Button> */}
            </div>
          </form>
        </Drawer>
      </div>
      <div className="flex justify-between w-full mt-[4rem!important]">
        <button
          type="button"
          onClick={handleBackButton}
          className="flex items-center bg-[#ffffff] border border-[#ff0404] hover:bg-[#ff0404] text-[#ff0404] hover:text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
        >
          <FaAnglesLeft className="ml-2" />
          Back
        </button>
        <button
          type="button"
          className={`flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium ${
            isSaving && "cursor-not-allowed bg-[#f77f7f]"
          }`}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Spinner size="sm" color="white" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            <>
              Save and Continue
              <FaAnglesRight className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default InstitutionDocumentTypes;

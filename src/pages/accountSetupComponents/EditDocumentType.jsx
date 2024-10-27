import React, { useEffect, useState } from "react";
import Drawer from "../../components/Drawer";
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { toast } from "sonner";
import { FaAnglesRight } from "react-icons/fa6";
import { mutate } from "swr";
import axios from "@utils/axiosConfig";

function EditDocumentType({
  setOpenDrawer,
  openDrawer,
  existingInstitutionDocumentTypes,
  selectedData,
}) {
  const [drawerTitle, setDrawerTitle] = useState("Document Types Details");
  const [userInput, setUserInput] = useState([]);
  const [initialUserInput, setInitialUserInput] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedData) {
      setUserInput(selectedData);
      setInitialUserInput(selectedData);
    }
  }, [selectedData]);

  useEffect(() => {
    if (!openDrawer) {
      setUserInput(initialUserInput);
    }
  }, [openDrawer]);

  const handleUserInput = (e) => {
    const { name, type, checked, value } = e.target;

    setUserInput((prevUserInput) => ({
      ...prevUserInput,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const {
      base_fee,
      printing_fee,
      validation_fee,
      verification_fee,
      soft_copy,
      hard_copy,
      id,
    } = userInput;

    if (
      base_fee === "" ||
      (hard_copy && printing_fee === "") ||
      validation_fee === "" ||
      verification_fee === "" ||
      (hard_copy && !soft_copy)
    ) {
      toast.error("Fill All required fields", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      const data = {
        base_fee,
        printing_fee: !hard_copy ? 0 : printing_fee,
        validation_fee,
        verification_fee,
        soft_copy,
        hard_copy,
      };

      try {
        const response = await axios.put(
          `/institution/document-types/${id}`,
          data
        );
        toast.success(response.data.message);
        mutate("/institution/document-types");
        setOpenDrawer(!openDrawer);
        setUserInput([]);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setIsSaving(false);
      }
    }
  };

  console.log("userrrr", userInput);

  return (
    <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer}>
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col justify-between"
      >
        <div className="flex flex-col">
          <Input
            size="sm"
            label="Document Name"
            type="text"
            name="base_fee"
            className="mt-4"
            value={userInput?.document_type?.name}
            readOnly
          />
          <h4 className="text-[0.9rem] mt-6">
            Document Formats
            <span className="text-[#ff0404]">*</span>
          </h4>
          <div className="flex w-full gap-4">
            <Checkbox
              name="soft_copy"
              isSelected={userInput?.soft_copy}
              isChecked={userInput?.soft_copy}
              onChange={handleUserInput}
              color="danger"
            >
              <h4 className="text-[0.9rem]">Soft Copy</h4>
            </Checkbox>
            <Checkbox
              name="hard_copy"
              isSelected={userInput?.hard_copy}
              isChecked={Boolean(userInput?.hard_copy)}
              onChange={handleUserInput}
              color="danger"
            >
              <h4 className="text-[0.9rem]">Hard Copy</h4>
            </Checkbox>
          </div>
          <Input
            size="sm"
            label={
              <>
                Document Fee
                <span className="text-[#ff0404]">*</span>
              </>
            }
            type="text"
            name="base_fee"
            className="mt-4"
            value={userInput?.base_fee}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                handleUserInput(e);
              }
            }}
          />

          <Input
            size="sm"
            label={
              <>
                Validation Fee
                <span className="text-[#ff0404]">*</span>
              </>
            }
            type="text"
            name="validation_fee"
            className="mt-4"
            value={userInput?.validation_fee}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                handleUserInput(e);
              }
            }}
          />
          <Input
            size="sm"
            label={
              <>
                Verification Fee
                <span className="text-[#ff0404]">*</span>
              </>
            }
            type="text"
            name="verification_fee"
            className="mt-4"
            value={userInput?.verification_fee}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                handleUserInput(e);
              }
            }}
          />
          <Input
            size="sm"
            label={
              <>
                Printing Fee
                {userInput?.hard_copy && (
                  <span className="text-[#ff0404]">*</span>
                )}
              </>
            }
            type="text"
            name="printing_fee"
            className="mt-4"
            disabled={!Boolean(userInput?.hard_copy)}
            value={Boolean(userInput?.hard_copy) ? userInput?.printing_fee : 0}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                handleUserInput(e);
              }
            }}
          />

          <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600] mt-[0.3vw]">
            <span className="text-[#ff0404]">Note</span>: This can only be add
            when document format includes hard copy
          </h6>
        </div>

        <div className="w-full flex items-center justify-between">
          <Button
            className="py-2.5 font-medium rounded-[0.3rem]"
            color="default"
            onClick={() => {
              setOpenDrawer(false);
              reset();
            }}
          >
            Close
          </Button>

          <button
            type="submit"
            className={`flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium ${
              isSaving && "cursor-not-allowed bg-[#f77f7f]"
            }`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner size="sm" color="white" />
                <span className="ml-2">Updating...</span>
              </>
            ) : (
              <>
                Update
                <FaAnglesRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

export default EditDocumentType;

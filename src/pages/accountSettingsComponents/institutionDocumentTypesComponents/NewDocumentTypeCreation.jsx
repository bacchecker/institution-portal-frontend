import React, { useEffect, useState } from "react";
import Drawer from "../../../components/Drawer";
import { Button, Checkbox, Input, Spinner, Textarea } from "@nextui-org/react";
import { FaAnglesRight } from "react-icons/fa6";
import { mutate } from "swr";
import axios from "@utils/axiosConfig";
import secureLocalStorage from "react-secure-storage";
import Swal from "sweetalert2";

function NewDocumentTypeCreation({ setOpenDrawer, openDrawer }) {
  const [items, setItems] = useState([
    {
      name: "",
      base_fee: "",
      printing_fee: "",
      description: "",
      validation_fee: "",
      verification_fee: "",
      soft_copy: false,
      hard_copy: false,
    },
  ]);
  const [drawerTitle, setDrawerTitle] = useState("Document Types Details");
  const [isSaving, setIsSaving] = useState(false);
  const [hasDuplicate, setHasDuplicate] = useState(false);

  const institution = secureLocalStorage.getItem("institution");

  const handleItemChange = (e, i) => {
    if (hasDuplicate && e.target?.name !== "name") return;

    const { name, type, checked, value } = e.target;
    const onChangeValue = [...items];

    if (type === "checkbox") {
      onChangeValue[i][name] = checked;
    } else {
      onChangeValue[i][name] = value;
    }

    setItems(onChangeValue);
  };

  const handleBlur = () => {
    const documentTypeNames = items.map((item) => item.name);
    const hasDuplicates = documentTypeNames.some(
      (id, index) => documentTypeNames.indexOf(id) !== index
    );

    if (hasDuplicates) {
      Swal.fire({
        title: "Error",
        text: "Document Type Name has already been taken",
        icon: "error",
        button: "OK",
      });
    }

    setHasDuplicate(hasDuplicates);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: "",
        base_fee: "",
        description: "",
        printing_fee: "",
        validation_fee: "",
        verification_fee: "",
        soft_copy: false,
        hard_copy: false,
      },
    ]);
  };
  const handleItemDelete = (i) => {
    const list = [...items];
    list.splice(i, 1);
    setItems(list);
  };

  useEffect(() => {
    if (!openDrawer) {
      setItems([
        {
          name: "",
          base_fee: "",
          description: "",
          printing_fee: "",
          validation_fee: "",
          verification_fee: "",
          soft_copy: false,
          hard_copy: false,
        },
      ]);
    }
  }, [openDrawer]);

  const newItems = items.map((item) => {
    const newItem = { ...item };

    if (!newItem.hard_copy) {
      newItem.printing_fee = "0.00";
    }

    if (institution?.academic_level) {
      newItem.academic_level = institution?.academic_level;
    }

    return newItem;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const hasErrors = items.some((item) => {
      if (
        item.name === "" ||
        item.base_fee === "" ||
        (item.hard_copy && item.printing_fee === "") ||
        item.validation_fee === "" ||
        item.verification_fee === "" ||
        (!item?.hard_copy && !item?.soft_copy) ||
        item?.description === ""
      ) {
        Swal.fire({
          title: "Error",
          text: "Fill All required fields",
          icon: "error",
          button: "OK",
        });
        return true;
      }
      return false;
    });

    if (hasErrors) {
      setIsSaving(false);
      return;
    }

    const data = {
      document_types: newItems,
    };

    try {
      const response = await axios.post(
        "/institution/document-types/general",
        data
      );
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        button: "OK",
        confirmButtonColor: "#00b17d",
      }).then((isOkay) => {
        if (isOkay) {
          mutate("/institution/document-types");
          setOpenDrawer(!openDrawer);
          setItems([
            {
              name: "",
              base_fee: "",
              description: "",
              printing_fee: "",
              validation_fee: "",
              verification_fee: "",
              soft_copy: false,
              hard_copy: false,
            },
          ]);
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message,
        icon: "error",
        button: "OK",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer}>
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col justify-between"
      >
        <div className="flex flex-col">
          {items?.map((item, i) => {
            return (
              <>
                <div className="border border-[#ff0404] py-4 px-2 rounded-[0.5rem]">
                  <Input
                    size="sm"
                    label={
                      <>
                        Document Name
                        <span className="text-[#ff0404]">*</span>
                      </>
                    }
                    type="text"
                    name="name"
                    className="mt-4"
                    value={item.name}
                    onChange={(e) => handleItemChange(e, i)}
                    onBlur={handleBlur}
                    onFocus={() => setFocusedIndex(i)}
                  />
                  <h4 className="text-[0.9rem] mt-6">
                    Document Formats
                    <span className="text-[#ff0404]">*</span>
                  </h4>
                  <div className="flex w-full gap-4">
                    <Checkbox
                      name="soft_copy"
                      isChecked={item.soft_copy}
                      onChange={(e) => handleItemChange(e, i)}
                      color="danger"
                    >
                      <h4 className="text-[0.9rem]">Soft Copy</h4>
                    </Checkbox>
                    <Checkbox
                      name="hard_copy"
                      isChecked={item.hard_copy}
                      onChange={(e) => handleItemChange(e, i)}
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
                    value={item.base_fee}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                        handleItemChange(e, i);
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
                    value={item.validation_fee}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                        handleItemChange(e, i);
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
                    value={item.verification_fee}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                        handleItemChange(e, i);
                      }
                    }}
                  />
                  <Input
                    size="sm"
                    label={
                      <>
                        Printing Fee
                        {item.hard_copy && (
                          <span className="text-[#ff0404]">*</span>
                        )}
                      </>
                    }
                    type="text"
                    name="printing_fee"
                    className="mt-4"
                    disabled={!item?.hard_copy}
                    value={item?.hard_copy ? item.printing_fee : 0}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                        handleItemChange(e, i);
                      }
                    }}
                  />
                  <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600] mt-[0.3vw]">
                    <span className="text-[#ff0404]">Note</span>: This can only
                    be add when document format includes hard copy
                  </h6>
                  <Textarea
                    label={
                      <>
                        Description<span className="text-[#ff0404]">*</span>
                      </>
                    }
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(e, i)}
                    required
                  />
                </div>
                <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7rem] font-[600] mt-[0.3vw]">
                  <span className="text-[#ff0404]">Note</span>: You add multiple
                  document types by clicking on "Add" button
                </h6>
                <div className="flex justify-end gap-x-[0.5vw]">
                  {items.length - 1 === i && (
                    <button
                      type="button"
                      disabled={
                        !item?.name ||
                        !item?.base_fee ||
                        (item?.hard_copy && !item?.printing_fee) ||
                        !item?.validation_fee ||
                        !item?.verification_fee ||
                        (!item?.hard_copy && !item?.soft_copy)
                      }
                      onClick={(e) => handleAddItem(e, i)}
                      className="bg-[#000] md:my-[1vw!important] my-[2vw!important] text-white md:w-[4vw] w-[17vw] md:text-[0.8vw] text-[2.5vw] flex justify-center items-center md:py-[0.5vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#4b4b4b] disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  )}
                  {items.length !== 1 && (
                    <button
                      type="button"
                      onClick={() => handleItemDelete(i)}
                      className="bg-[#FF0404] md:my-[1rem!important] my-[2rem!important] text-white md:w-[6rem]  md:text-[0.8rem] flex justify-center items-center md:py-[0.5vw] py-[2rem] h-[fit-content] md:rounded-[0.3rem] rounded-[1vw] gap-[0.5rem] hover:bg-[#ef4545] transition-all duration-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </>
            );
          })}
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
                <span className="ml-2">Creating...</span>
              </>
            ) : (
              <>
                Create
                <FaAnglesRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

export default NewDocumentTypeCreation;

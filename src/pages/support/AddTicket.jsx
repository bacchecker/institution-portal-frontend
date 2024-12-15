import React, { useEffect, useState } from "react";
import Drawer from "../../components/Drawer";
import {
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { FaAnglesRight } from "react-icons/fa6";
import axios from "../../utils/axiosConfig";
import Swal from "sweetalert2";

function AddTicket({ setOpenDrawer, openDrawer, fetchTickets }) {
  const initialUserInput = {
    title: "",
    description: "",
    other_name: "",
    type: "",
    category: "",
  };
    const [userInput, setUserInput] = useState(initialUserInput);
    const [drawerTitle, setDrawerTitle] = useState("Create Ticket");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const categories = [
        { id: "complaint", name: "Complaint" },
        { id: "inquiry", name: "Inquiry" },
        { id: "request", name: "Request" },
        { id: "suggestion", name: "Inquiry" },
        { id: "other", name: "Other" },
    ];

    const types = [
        { id: "general", name: "General" },
        { id: "technical", name: "Technical" },
        { id: "financial", name: "Financial" },
        { id: "other", name: "Other" },
    ];

    const handleUserInput = (e) => {
      setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
      }));
    };

    useEffect(() => {
        if (!openDrawer) {
        setUserInput(initialUserInput);
        }
    }, [openDrawer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const { title, description, type, file, category } = userInput;

        if (!title || !description || !type || !category) {
        setIsSaving(false);
        Swal.fire({
            title: "Error",
            text: "Fill All required fields",
            icon: "error",
            button: "OK",
        });
        } else {
        const form = new FormData();

        form.append("title", title);
        form.append("description", description);
        form.append("type", type);
        form.append("category", category);
        selectedImage && form.append("file", selectedImage);
        try {
            const response = await axios.post("/tickets", form);
            Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success",
            button: "OK",
            confirmButtonColor: "#00b17d",
            }).then((isOkay) => {
            if (isOkay) {
                fetchTickets()
                setOpenDrawer(!openDrawer);
                setUserInput(initialUserInput);
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
        }
    };

  return (
    <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer}>
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col justify-between"
      >
        <div className="flex flex-col">
          <Input
            size="sm"
            isRequired
            label="Subject"
            type="text"
            name="title"
            className=""
            value={userInput?.title}
            onChange={handleUserInput}
          />
          <Textarea
            size="sm"
            isRequired
            label="Description"
            type="text"
            name="description"
            className="mt-4"
            value={userInput?.description}
            onChange={handleUserInput}
          />
          <Select
            size="sm"
            isRequired
            label="Type"
            className="w-full mt-4"
            name="type"
            value={userInput?.type}
            onChange={handleUserInput}
          >
            {types?.map((item) => (
              <SelectItem key={item.id}>{item.name}</SelectItem>
            ))}
          </Select>
          <Select
            size="sm"
            isRequired
            label="Category"
            className="w-full mt-4"
            name="category"
            value={userInput?.category}
            onChange={handleUserInput}
          >
            {categories?.map((item) => (
              <SelectItem key={item.id}>{item.name}</SelectItem>
            ))}
          </Select>
          
          <div className="w-[100%] h-[10rem] mt-4">
            <h4 className="text-[0.9rem] mb-[0.4rem]">Attach File</h4>
            <div className="w-full h-full flex justify-center items-center rounded-[0.6rem] border">
              <label
                htmlFor="img"
                className="md:text-[0.9vw] text-[3vw] flex-col flex justify-center items-center cursor-pointer text-center"
              >
                {selectedImage !== null ? (
                  <div className="md:w-[4vw] w-[15vw] md:h-[4vw] h-[15vw]">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="md:w-[4vw] w-[15vw] md:h-[4vw] h-[15vw]">
                    <img
                      src={
                        userInput?.logo && userInput?.logo !== "default.png"
                          ? `https://backend.baccheck.online/storage/app/public/${userInput?.logo}`
                          : "/images/upload-t.svg"
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="img"
                  className="hidden"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
                Browse to Upload file or image
              </label>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center">

          <button
            type="submit"
            className={`w-full flex items-center justify-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 text-base rounded-[0.3rem] font-medium ${
              isSaving && "cursor-not-allowed bg-[#f77f7f]"
            }`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner size="sm" color="white" />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              <>
                Submit
                <FaAnglesRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

export default AddTicket;

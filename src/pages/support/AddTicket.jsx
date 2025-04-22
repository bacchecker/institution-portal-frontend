import React, { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
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
import SideModal from "../../components/SideModal";
import SelectInput from "../../components/SelectInput";
import LoadItems from "../../components/LoadItems";

function AddTicket({ setOpenModal, openModal, fetchTickets }) {
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
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");

    const [isSaving, setIsSaving] = useState(false);
    const categoryData = [
        { id: "complaint", name: "Complaint" },
        { id: "inquiry", name: "Inquiry" },
        { id: "request", name: "Request" },
        { id: "other", name: "Other" },
    ];

    const typeData = [
        { id: "general", name: "General" },
        { id: "technical", name: "Technical" },
        { id: "financial", name: "Financial" },
        { id: "other", name: "Other" },
    ];

    useEffect(() => {
      if (!openModal) {
        setUserInput(initialUserInput);
        setSelectedCategory("");
        setSelectedType("");
        setSelectedImage(null)
      }
    }, [openModal]);
  
    const handleSeletedTypeOption = (item) => {
      setSelectedType(item);
    };
  
    const handleSeletedCategoryOption = (item) => {
      setSelectedCategory(item);
    };

    const handleUserInput = (e) => {
      setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
      }));
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedImage(file);
      }
    };

    useEffect(() => {
        if (!openModal) {
        setUserInput(initialUserInput);
        }
    }, [openModal]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSaving(true);
  
      const { title, description, type, file, category } = userInput;
  
      // Check for required fields
      if (!title || !description || !selectedType?.id || !selectedCategory?.id) {
          setIsSaving(false);
          Swal.fire({
              title: "Error",
              text: "Fill all required fields",
              icon: "error",
              button: "OK",
          });
          return; // Exit early if validation fails
      }
  
      const form = new FormData();
  
      // Append required fields
      form.append("title", title);
      form.append("description", description);
      form.append("type", selectedType?.id);
      form.append("category", selectedCategory?.id);
  
      // Conditionally append the file if it exists
      if (selectedImage) {
          form.append("file", selectedImage);
      }
  
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
                  fetchTickets();
                  setOpenModal(!openModal);
                  setUserInput(initialUserInput);
              }
          });
      } catch (error) {
          // Handle validation or other errors from the backend
          const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
          const errorDetails = error.response?.data?.errors;
  
          Swal.fire({
              title: "Error",
              text: errorMessage,
              icon: "error",
              button: "OK",
          });
  
          // Optionally log or display detailed validation errors
          if (errorDetails) {
              console.error("Validation Errors:", errorDetails);
          }
      } finally {
          setIsSaving(false); // Reset the saving state
      }
  };
  

  return (
    <SideModal
      title={"Create Ticket"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <form
        onSubmit={handleSubmit}
        className="md:px-[1vw] px-[5vw] w-full overflow-auto"
      >
        <div className="md:mt-[2vw] mt-[10vw]">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">
            Subject<span className="text-[#f1416c]">*</span>
          </h4>
          <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
            <input
              type="text"
              value={userInput?.title}
              name="title"
              required
              onChange={handleUserInput}
              placeholder="Enter your subject here"
              className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
            />
          </div>
        </div>
        <div className="md:mt-[2vw] mt-[10vw]">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">
            Description
            <span className="text-[#f1416c]">*</span>
          </h4>
          <div className="relative w-full md:h-[7vw] h-[30vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
            <textarea
              placeholder="Enter ticket desription"
              value={userInput?.description}
              name="description"
              required
              onChange={handleUserInput}
              className="w-full h-full md:p-[0.8vw] p-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
            ></textarea>
          </div>
        </div>

        <div className="md:mt-[2vw] mt-[8vw]">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">
            Type<span className="text-[#f1416c]">*</span>
          </h4>
          <SelectInput
            placeholder={"Select option"}
            data={typeData}
            inputValue={selectedType?.name}
            onItemSelect={handleSeletedTypeOption}
            className="custom-dropdown-class display-md-none"
          />
        </div>
        <div className="md:mt-[2vw] mt-[8vw]">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">
            Category<span className="text-[#f1416c]">*</span>
          </h4>
          <SelectInput
            placeholder={"Select option"}
            data={categoryData}
            inputValue={selectedCategory?.name}
            onItemSelect={handleSeletedCategoryOption}
            className="custom-dropdown-class display-md-none"
          />
        </div>
        <div className="md:mt-[2vw] mt-[8vw]">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">Attach Media</h4>
          <div className="relative w-full md:h-[10vw] h-[40vw] flex flex-col md:gap-[0.5vw] gap-[2vw] px-[3vw] justify-center items-center md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[2px] bg-[#f7f7f7] border-[#E5E5E5]">
            <label
              htmlFor="imgR"
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
                <img
                  src="/assets/img/upload-t.svg"
                  alt="uploaded-file"
                  className="w-[5vw]"
                />
              )}
              <input
                type="file"
                id="imgR"
                className="display-none"
                accept=".jpg, .jpeg, .pdf, .png"
                onChange={handleFileChange}
              />
              Browse to Upload file or image
            </label>
          </div>
          <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600]">
            <span className="text-[#ff0404]">Supported formats</span>: .jpg,
            .jpeg, .pdf, .png
          </h6>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-full flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
        >
          {isSaving ? (
            <div className="flex items-center justify-center gap-2">
              <LoadItems color={"#ffffff"} size={15} />
              <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                Submitting...
              </h4>
            </div>
          ) : (
            <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
              Submit
            </h4>
          )}
        </button>
      </form>
    </SideModal>
  );
}

export default AddTicket;

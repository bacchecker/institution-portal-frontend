import React, { useEffect, useState } from "react";
import SideModal from "../../components/SideModal";
import SelectInput from "../../components/SelectInput";
import { toast } from "sonner";
import LoadItems from "../../components/LoadItems";
import { useCreateTicketMutation } from "../../redux/apiSlice";
import moment from "moment";
import formatText from "../../components/FormatText";

function DocumentRequestDetails({ setOpenModal, openModal, selectedRequest }) {
  const initialUserInput = {
    title: "",
    description: "",
  };

  const [userInput, setUserInput] = useState(initialUserInput);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const typeData = [
    { title: "general", value: "general" },
    { title: "technical", value: "technical" },
    { title: "financial", value: "financial" },
    { title: "other", value: "other" },
  ];

  const categoryData = [
    { title: "Complaint", value: "complaint" },
    { title: "Inquiry", value: "inquiry" },
    { title: "Request", value: "request" },
    { title: "Suggestion", value: "suggestion" },
    { title: "Other", value: "other" },
  ];

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (!openModal) {
      setUserInput(initialUserInput);
      setSelectedCategory("");
      setSelectedType("");
      setSelectedImage(null);
    }
  }, [openModal]);

  const handleSeletedTypeOption = (item) => {
    setSelectedType(item);
  };

  const handleSeletedCategoryOption = (item) => {
    setSelectedCategory(item);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const [createTicket, { data, isSuccess, isLoading, isError, error }] =
    useCreateTicketMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description } = userInput;
    if (
      !title ||
      !description ||
      !selectedType?.value ||
      !selectedCategory?.value
    ) {
      toast.error("Fill All Required Fields", {
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
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", selectedType?.value);
      formData.append("category", selectedCategory?.value);
      formData.append("file", selectedImage);
      try {
        await createTicket(formData);
      } catch (error) {
        toast.error("Failed to submit documents", {
          position: "top-right",
          autoClose: 1202,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success("Ticket created successfully", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setOpenModal(!openModal);
      setUserInput(initialUserInput);
      setSelectedImage(null);
      setSelectedCategory("");
      setSelectedType("");
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  return (
    <SideModal
      title={"Request Details"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <div className="flex mx-[1vw] py-[1vw] flex-col gap-[1vw] border-b">
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">Request ID</h4>
          <h4 className="text-[0.9vw] font-[600] w-[60%]">
            #{selectedRequest?.unique_code}
          </h4>
        </div>
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">Requested Date</h4>
          <h4 className="text-[0.9vw] font-[600] w-[60%]">
            {moment(selectedRequest?.created_at).format("Do MMMM, YYYY")}
          </h4>
        </div>
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">Delivery Address</h4>
          <h4 className="text-[0.9vw] font-[600] w-[60%]">
            {selectedRequest?.delivery_address}
          </h4>
        </div>
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">Total Cash</h4>
          <h4 className="text-[0.9vw] font-[600] w-[60%]">
            GH¢{" "}
            {parseFloat(selectedRequest?.total_amount).toLocaleString(
              undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )}
          </h4>
        </div>
      </div>
      <div className="flex mx-[1vw] py-[1vw] flex-col gap-[1vw] border-b">
        <h4 className="text-[1vw] font-[600]">Applicant Details</h4>
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">Applicant Name</h4>
          <h4 className="text-[0.9vw] font-[600] w-[60%]">
            {selectedRequest?.user?.first_name}{" "}
            {selectedRequest?.user?.other_name}{" "}
            {selectedRequest?.user?.last_name}
          </h4>
        </div>
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">Applicant Email</h4>
          <h4 className="text-[0.9vw] font-[600] w-[60%]">
            {selectedRequest?.user?.email}
          </h4>
        </div>
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">Phone Number</h4>
          <h4 className="text-[0.9vw] font-[600] w-[60%]">
            {selectedRequest?.user?.phone}
          </h4>
        </div>
        <div className="flex w-full items-center">
          <h4 className="text-[0.9vw] w-[40%]">Applicant's Picture</h4>
          <div className="w-[3vw] h-[3vw] rounded-[50%] bg-[#ccc] overflow-hidden">
            {selectedRequest?.user?.profile_photo_url && (
              <img
                src={selectedRequest?.user?.profile_photo_url}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex mx-[1vw] py-[1vw] flex-col gap-[1vw] border-b">
        <h4 className="text-[1vw] font-[600]">Document Request Summary</h4>
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">
            {selectedRequest?.document_type?.name}
          </h4>
          <h4 className="text-[0.9vw] font-[600] w-[60%]">
            {`(${selectedRequest?.document_type?.description})`}
          </h4>
        </div>
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">Status</h4>
          <div
            className={`col-span-2 flex items-center justify-center py-[0.4vw] rounded-[0.2vw] px-[1vw] space-x-2  
                    ${
                      selectedRequest?.status === "cancelled" ||
                      selectedRequest?.status === "rejected"
                        ? "text-red-600 bg-red-200"
                        : selectedRequest?.status === "completed"
                        ? "text-green-600 bg-green-200"
                        : selectedRequest?.status === "processing" ||
                          selectedRequest?.status === "received"
                        ? "text-yellow-600 bg-yellow-200"
                        : "text-gray-600 bg-gray-200"
                    }`}
          >
            <div
              className={`h-[0.6vw] w-[0.6vw] rounded-full ${
                selectedRequest?.status === "cancelled" ||
                selectedRequest?.status === "rejected"
                  ? "bg-red-600"
                  : selectedRequest?.status === "completed"
                  ? "bg-green-600"
                  : selectedRequest?.status === "processing" ||
                    selectedRequest?.status === "received"
                  ? "bg-yellow-600"
                  : "bg-gray-600"
              }`}
            ></div>
            <h4 className="text-[0.8vw]">
              {selectedRequest?.status?.charAt(0)?.toUpperCase() +
                selectedRequest?.status?.slice(1)}
            </h4>
          </div>
        </div>
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">Document Format</h4>
          <h4 className="text-[0.9vw] font-[600] w-[60%]">
            {formatText(selectedRequest?.document_format)}
          </h4>
        </div>
        <div className="flex w-full">
          <h4 className="text-[0.9vw] w-[40%]">Total Cash</h4>
          <h4 className="text-[0.9vw] font-[600] w-[60%]">
            GH¢{" "}
            {parseFloat(selectedRequest?.total_amount).toLocaleString(
              undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )}
          </h4>
        </div>
      </div>
      <div className="flex justify-between border-t px-[1vw] w-full py-[1vw]">
        <button className="w-[49%] bg-[#e5e4e4] rounded-[0.2vw] flex justify-center items-center py-[0.5vw]">
          <h4 className="text-[0.9vw]">Decline</h4>
        </button>
        <button className="w-[49%] bg-[#FF0000] hover:bg-[#ef4242] rounded-[0.2vw] flex justify-center items-center py-[0.5vw]">
          <h4 className="text-[0.9vw] text-[#ffffff]">
            {selectedRequest?.status === "submitted"
              ? "Acknowledge Request"
              : selectedRequest?.status === "received"
              ? "Process Request"
              : selectedRequest?.status == "processing"
              ? "Complete Request"
              : selectedRequest?.status == "rejected"
              ? "Revert Rejection"
              : "Acknowledge Request"}
          </h4>
        </button>
      </div>
    </SideModal>
  );
}

export default DocumentRequestDetails;

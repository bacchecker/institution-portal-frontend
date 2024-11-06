import React, { useState, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import { FaPhoneVolume, FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FileText, CheckCircle, Search } from "lucide-react";
import axios from "@utils/axiosConfig";
import Textarea from "@components/Textarea";
import Textbox from "@components/Textbox";
import Select from "@components/Select";
import Spinner from "@components/Spinner";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { toast } from "sonner";

const AccountInactive = () => {
  const features = [
    {
      icon: FileText,
      title: "Document Requisition",
      description:
        "Process and submit requested documents to applicants in their preferred format (soft copy or hard copy).",
    },
    {
      icon: CheckCircle,
      title: "Document Validation",
      description:
        "Validate documents received from applicants to ensure authenticity and completeness.",
    },
    {
      icon: Search,
      title: "Document Verification",
      description:
        "Verify the accuracy and legitimacy of submitted documents through our comprehensive verification process.",
    },
  ];
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [institutionStatus, setInstitutionStatus] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const typeData = [
    { id: "general", name: "General" },
    { id: "technical", name: "Technical" },
    { id: "financial", name: "Financial" },
    { id: "other", name: "Other" },
  ];

  const categoryData = [
    { id: "complaint", name: "Complaint" },
    { id: "inquiry", name: "Inquiry" },
    { id: "request", name: "Request" },
    { id: "suggestion", name: "Suggestion" },
    { id: "other", name: "Other" },
  ];

  useEffect(() => {
    fetchInstitution();
  }, []);

  const fetchInstitution = async () => {
    try {
      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData.institution;

      setInstitutionStatus(institutionData.status);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev);
    handleClear();
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setType("");
    setCategory("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const formData = { title, description, type, category };

    try {
      const response = await axios.post("/tickets", formData);
      toggleModal();
      handleClear();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="w-full relative flex flex-col items-center justify-center bg-white rounded-md min-h-dvh">
        {institutionStatus == null ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-24 h-24 text-gray-200 animate-spin fill-[#ff0404]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : institutionStatus !== "inactive" ? (
          <div className="relative w-full md:w-1/2 lg:w-1/2 xl:w-1/3 flex flex-col justify-center items-center rounded-2xl h-full md:shadow-md shadow-gray-400 overflow-clip">
            <div className="bg-white shadow-2xl w-[500px] h-60 rounded-b-full">
              
              <img
                src="/images/confetti.gif"
                alt="account active gif"
                className="w-auto ml-20 absolute h-80"
              />
              <img src="/images/award.png" alt="" className="w-32 h-auto mx-auto mt-16"/>
            </div>
            <div className="">
              <div className="text-center my-2">
                <p className="text-xl font-semibold text-[#ff0404] mt-16 uppercase  ">
                  Congratulations
                </p>
              </div>
              <div className="w-full px-4">
                <p className="text-justify text-gray-700 text-base">
                  You can now proceed to set up your institution account and
                  access all available features. We recommend completing the
                  setup to take full advantage of our services. If you have any
                  questions or need assistance during the setup process, please
                  feel free to reach out to our support team. We’re here to
                  help! Click on the button below to proceed with setting up
                  your account
                </p>
              </div>
            </div>

            <div className="my-4 flex items-center justify-center z-50">
              <button
                onClick={() => navigate("/account-setup")}
                className="flex items-center w-fit space-x-2 hover:bg-[#ff0404] text-[#ff0404] hover:text-white border border-[#ff0404] px-8 py-2 rounded-full"
              >
                <FaUser /> <p>Continue to set up account</p>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-screen bg-white text-[#000000] overflow-hidden w-[60%]">
              <header className="relative z-10 pt-16 pb-4 text-center">
                <h1 className="text-4xl font-bold mb-2 animate-fade-in-down">
                  Account Under Review
                </h1>
                <p className="animate-fade-in-up">
                  Your institution's account is currently under review. This
                  should be over between 24-48 hours, during this period,
                  certain features may be restricted. We’ll notify you once the
                  review process is complete.
                </p>
              </header>

              <main className="relative z-10 container mx-auto px-4 py-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-semibold mb-8 text-center text-[#ff0404]">
                    Key Features of Our Institution Portal
                  </h2>
                  <div className="grid gap-8 md:grid-cols-3 relative">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className={`bg-[#ffffff]/10  transition-all duration-500 ease-in-out border border-[#ff0404] rounded-[0.5rem] ${
                          index === activeFeature
                            ? "scale-105 shadow-lg shadow-[#ff0404]/20"
                            : "scale-100"
                        }`}
                      >
                        <div className="p-6">
                          <feature.icon
                            className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
                              index === activeFeature && "text-[#ff0404]"
                            }`}
                          />
                          <h3 className="text-xl font-semibold text-center mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-center text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </main>

              <footer className="relative z-10 bg-[#ffffff]/10 py-8 mt-2">
                <div className="container mx-auto px-4 text-center flex flex-col items-center">
                  <p className="mb-4">
                    Need assistance? Our support team is here to help!
                  </p>
                  <button
                    onClick={toggleModal}
                    className="flex items-center w-40 space-x-2 bg-[#ff0404] hover:bg-[#f34a4a] text-white px-4 py-1.5 rounded-md"
                  >
                    <BsSend /> <p>Issue Ticket</p>
                  </button>
                  <div className="flex space-x-6 text-gray-600 text-sm mt-[1rem]">
                    <div className="flex items-center space-x-1">
                      <FaPhoneVolume />
                      <p>0(303)856478996</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IoIosMail size={18} />
                      <a
                        target="blank"
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=info@bacchecker.online"
                      >
                        info@bacchecker.online
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
          <form
            onSubmit={handleSubmit}
            className="w-1/2 lg:w-1/3 xl:w-[28%] h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
            style={{
              right: 0,
              position: "absolute",
              transform: showModal ? "translateX(0)" : "translateX(100%)",
            }}
          >
            <div className="flex justify-between items-center font-medium border-b-2 p-4">
              <h2 className="text-lg">Issue a Ticket</h2>
              <button
                onClick={toggleModal}
                className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md"
              >
                <MdClose size={20} className="text-red-600" />
              </button>
            </div>

            <div className="relative flex flex-col space-y-7 px-4 py-6 overflow-y-auto h-[calc(100%-4rem)]">
              <div className="flex flex-col space-y-8 mb-4">
                <Textbox
                  label="Title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <Textarea
                  label="Describe your issue..."
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Select
                  label="Type"
                  name="type"
                  value={type}
                  itemNameKey="name"
                  menuItems={typeData}
                  onChange={(e) => setType(e.target.value)}
                />
                <Select
                  label="Category"
                  name="category"
                  value={category}
                  itemNameKey="name"
                  menuItems={categoryData}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="w-full absolute bottom-4 right-0 flex space-x-4 px-4">
                <button
                  onClick={toggleModal}
                  type="button"
                  className="text-xs w-1/2 text-gray-600 border px-4 py-1.5 rounded-[0.3rem]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`w-1/2 flex items-center justify-center rounded-[0.3rem] ${
                    isSaving
                      ? "bg-gray-400 text-gray-700"
                      : "bg-[#ff0404] text-white"
                  } py-1.5 text-xs ${isSaving ? "cursor-not-allowed" : ""}`}
                >
                  {isSaving ? (
                    <>
                      <Spinner size="w-4 h-4 mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AccountInactive;

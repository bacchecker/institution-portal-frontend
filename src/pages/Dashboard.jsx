import React, { Component } from "react";
import { GoGitPullRequest } from "react-icons/go";
import { GrValidate } from "react-icons/gr";
import { IoIosMail, IoIosNotificationsOutline } from "react-icons/io";
import { IoDocumentAttach, IoDocuments } from "react-icons/io5";
import { LuClipboardEdit } from "react-icons/lu";
import {
  MdClose,
  MdManageHistory,
  MdOutlineVerifiedUser,
} from "react-icons/md";
import withRouter from "@components/withRouter";
import axios from "@utils/axiosConfig";
import { toast } from "react-hot-toast";
import AuthLayout from "@components/AuthLayout";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { BsSend } from "react-icons/bs";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    name: "",
    description: "",
    prefix: "",
    institutionStatus: this.props.institutionStatus,
    profileComplete: this.props.profileComplete,
    showTicketModal: false,
    title: "",
    type: "",
    category: "",
    isSaving: false,
    typeData: [
      { id: "general", name: "General" },
      { id: "technical", name: "Technical" },
      { id: "financial", name: "Financial" },
      { id: "other", name: "Other" },
    ],
    categoryData: [
      { id: "complaint", name: "Complaint" },
      { id: "inquiry", name: "Inquiry" },
      { id: "request", name: "Request" },
      { id: "suggestion", name: "Suggestion" },
      { id: "other", name: "Other" },
    ],
  };

  componentDidMount() {
    this.fetchInstitution();
  }

  toggleTicketModal = () => {
    this.setState((prevState) => ({
      showTicketModal: !prevState.showTicketModal,
    }));
    this.handleClear();
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleClear = () => {
    (this.state.title = ""),
      (this.state.description = ""),
      (this.state.type = ""),
      (this.state.category = "");
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, description, type, category } = this.state;
    this.setState({ isSaving: true });
    const formData = { title, description, type, category };
    try {
      const response = await axios.post("/tickets", formData);
      this.toggleTicketModal();
      this.handleClear();

      toast.success(response.data.message, {});
      this.setState({ isSaving: false });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      this.setState({ isSaving: false });
    }
  };

  fetchInstitution = async () => {
    try {
      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData;

      if (institutionData) {
        this.setState({
          name: institutionData.name,
          address: institutionData.address,
          prefix: institutionData.prefix,
          description: institutionData.description,
          digital_address: institutionData.digital_address,
          region: institutionData.region,
          academic_level: institutionData.academic_level,
          logo: institutionData.logo,
          status: institutionData.status,
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  render() {
    const {
      type,
      category,
      description,
      title,
      typeData,
      categoryData,
      isSaving,
      showTicketModal,
    } = this.state;
    return (
      <AuthLayout title="Dashboard">
        {this.state.status == "inactive" && (
          <section className="p-3">
            <Card>
              <CardBody className="flex flex-row items-center justify-evenly bg-bChkRed">
                <img
                  src="/images/review.png"
                  alt="account review img"
                  className="size-44"
                />

                <div className="flex flex-col">
                  <div className="my-2">
                    <p className="text-xl font-semibold text-gray-100">
                      Your institution profile is under review
                    </p>
                  </div>
                  <div className="w-full lg:w-[500px]">
                    <p className="text-justify text-white text-sm">
                      Your institution's account is currently under review.
                      Customer service will contact you within 48 hours. If you
                      have any questions, please reach out to our support team.
                    </p>
                  </div>
                  <div className="my-4 flex items-center justify-center">
                    <button
                      onClick={this.toggleTicketModal}
                      className="flex items-center justify-center w-40 space-x-2 bg-white hover:bg-gray-100 text-gray-900 px-4 py-1.5 rounded-md"
                    >
                      <BsSend /> <p>Issue Ticket</p>
                    </button>
                  </div>
                  <div className="flex space-x-6 hover:text-white text-red-200 text-sm">
                    <div className="flex items-center space-x-1">
                      {/* <FaPhoneVolume /> */}
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
              </CardBody>
            </Card>
          </section>
        )}
        {showTicketModal && (
          <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
            <form
              onSubmit={this.handleSubmit}
              className="w-1/2 lg:w-1/3 xl:w-[28%] h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
              style={{
                right: 0,
                position: "absolute",
                transform: showTicketModal
                  ? "translateX(0)"
                  : "translateX(100%)",
              }}
            >
              <div className="flex justify-between items-center font-medium border-b-2 p-4">
                <h2 className="text-lg">Issue a Ticket</h2>
                <button
                  onClick={this.toggleTicketModal}
                  className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md"
                >
                  <MdClose size={20} className="text-red-600" />
                </button>
              </div>

              <div className="relative flex flex-col space-y-7 px-4 py-6 overflow-y-auto h-[calc(100%-4rem)]">
                <div className="flex flex-col space-y-4 mb-4">
                  <Input
                    label="Title"
                    name="title"
                    value={title}
                    onChange={this.handleInputChange}
                  />

                  <Select
                    label="Select your type"
                    className=""
                    name="type"
                    value={type}
                    onChange={this.handleInputChange}
                  >
                    {typeData.map((type) => (
                      <SelectItem key={type.id}>{type.name}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Select category"
                    className=""
                    name="category"
                    value={category}
                    onChange={this.handleInputChange}
                  >
                    {categoryData.map((category) => (
                      <SelectItem key={category.id}>{category.name}</SelectItem>
                    ))}
                  </Select>
                  <Textarea
                    label="Describe your issue..."
                    name="description"
                    value={description}
                    onChange={this.handleInputChange}
                  />
                </div>

                <div className="w-full absolute bottom-4 right-0 flex space-x-4 px-4">
                  <button
                    onClick={this.toggleTicketModal}
                    type="button"
                    className="text-xs w-1/2 text-gray-600 border px-4 py-1.5 rounded-full"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-1/2 flex items-center justify-center rounded-full ${
                      isSaving
                        ? "bg-gray-400 text-gray-700"
                        : "bg-buttonLog text-white"
                    } py-1.5 text-xs ${isSaving ? "cursor-not-allowed" : ""}`}
                  >
                    {isSaving ? (
                      <>
                        <Spinner size="sm" />
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
        <div className="w-full p-3">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="col-span-3 flex items-center xl:space-x-8 space-x-4">
              <div className="">
                <p className="font-bold text-2xl">Hello Admin</p>
                <p className="text-gray-500 text-sm font-medium">
                  Let's do something great today!
                </p>
              </div>
              <div className="relative self-end flex-1">
                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg outline-0 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Search..."
                  required
                />
              </div>
              <div className="border border-gray-300 px-3 py-1.5 rounded-md self-end bg-gray-50">
                <IoIosNotificationsOutline size={24} />
              </div>
            </div>

            <div className="hidden xl:flex justify-between self-center text-blue-800 mt-2 cursor-pointer hover:text-blue-900">
              <p className="font-bold text-lg">Institution Profile</p>
              <LuClipboardEdit size={24} />
            </div>
          </div>
          <div className="">
            <p className="font-bold text-gray-800 text-xl mb-2 mt-6">
              Overview
            </p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-8">
              <div className="col-span-2 xl:col-span-3 grid grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 bg-white">
                  <div className="flex space-x-2 text-gray-700">
                    <div className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white p-1 rounded-md">
                      <GoGitPullRequest size={16} />
                    </div>
                    <p className="font-medium">Document Requests</p>
                  </div>
                  <div className="mt-6">
                    <p className="font-bold text-3xl">15</p>
                    <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
                <div className="border rounded-md p-4 bg-white">
                  <div className="flex space-x-2 text-gray-700">
                    <div className="flex items-center justify-center w-6 h-6 bg-red-700 text-white p-1 rounded-md">
                      <IoDocuments size={16} />
                    </div>
                    <p className="font-medium">Reviewed Documents</p>
                  </div>
                  <div className="mt-6">
                    <p className="font-bold text-3xl">15</p>
                    <div className="h-1 w-12 bg-red-700 rounded-full"></div>
                  </div>
                </div>
                <div className="border rounded-md p-4 bg-white">
                  <div className="flex space-x-2 text-gray-700">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white p-1 rounded-md">
                      <GrValidate size={16} />
                    </div>
                    <p className="font-medium">Validation Requests</p>
                  </div>
                  <div className="mt-6">
                    <p className="font-bold text-3xl">23</p>
                    <div className="h-1 w-12 bg-green-600 rounded-full"></div>
                  </div>
                </div>
                <div className="border rounded-md p-4 bg-white">
                  <div className="flex space-x-2 text-gray-700">
                    <div className="flex items-center justify-center w-6 h-6 bg-gray-700 text-white p-1 rounded-md">
                      <MdManageHistory size={16} />
                    </div>
                    <p className="font-medium">Validation History</p>
                  </div>
                  <div className="mt-6">
                    <p className="font-bold text-3xl">15</p>
                    <div className="h-1 w-12 bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 xl:col-span-1 flex flex-col justify-center bg-white xl:-mt-12 p-6">
                <div className="flex xl:hidden justify-center items-center bg-red-200 rounded-full w-12 h-12 hover:bg-red-300 hover:cursor-pointer">
                  <LuClipboardEdit size={24} className="text-blue-600" />
                </div>

                <div className="flex items-center justify-center w-44 h-44 border-2 border-blue-600 rounded-full mx-auto">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/storage/app/public/${
                      this.state.logo
                    }`}
                    alt="Institution Logo"
                    style={{ width: "170px", height: "170px" }}
                    className="rounded-full"
                  />
                </div>
                <MdOutlineVerifiedUser
                  className="text-green-600 self-center mt-1"
                  size={18}
                />
                <div className="text-center font-bold mt-2">
                  <div className="flex space-x-2 justify-center">
                    <p className="text-gray-800">{this.state.name}</p>
                  </div>
                  <p className="text-gray-600 text-sm my-3">
                    ({this.state.prefix})
                  </p>

                  <p className="text-xs font-light text-gray-800">
                    {this.state.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-8">
              <div className="col-span-3 border p-4 rounded-md mt-6 bg-white">
                <p className="font-bold text-xl mb-4">Recent Requests</p>
                <div className="grid grid-cols-7 gap-4 border rounded-lg p-4">
                  <div className="flex items-center justify-center bg-red-200 rounded-full w-12 h-12">
                    <IoDocumentAttach className="text-gray-900" size={20} />
                  </div>
                  <div className="col-span-3">
                    <p className="font-medium">Fredrick Nyarkoh</p>
                    <p className="text-sm text-gray-700 font-medium">
                      Academic Transcript
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-gray-600">
                      Date Applied
                    </p>
                    <p className="text-sm font-semibold text-yellow-600">
                      Thu 21 Apr, 2022
                    </p>
                  </div>
                  <button className="border rounded-md text-xs font-medium text-gray-700 h-8 self-center hover:bg-red-200">
                    View Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }
}

export default withRouter(Dashboard);

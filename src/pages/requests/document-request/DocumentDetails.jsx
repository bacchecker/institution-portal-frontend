import React, { Component } from "react";
import axios from "@utils/axiosConfig";
import { toast } from "react-hot-toast";
import withRouter from "@components/withRouter";
import { IoDocumentText } from "react-icons/io5";
import { FaRegNoteSticky } from "react-icons/fa6";
import Textarea from "@components/Textarea";
import Select from "@components/Select";
import { IoIosCloudUpload } from "react-icons/io";
import { RiSave2Line } from "react-icons/ri";
import Spinner from "@components/Spinner";
import { TbTruckDelivery } from "react-icons/tb";

class DocumentDetails extends Component {
  constructor(props) {
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this);
  }
  state = {
    documentDetails: null,
    isNoting: false,
    isUpdating: false,
    error: null,
    statusData: [
      { id: "processing", name: "Processing" },
      { id: "rejected", name: "Rejected" },
    ],
    status: "",
    showModal: false,
    modalType: "",
    note: "",
    selectedFile: null,
    rejectionReason: "",
    user_id: "",
    document_request_id: "",
    isUploading: "",
  };

  componentDidMount() {
    this.fetchDocumentDetails();
  }

  fetchDocumentDetails = () => {
    const { documentId } = this.props.params;

    axios
      .get(`/institution/document-requests/${documentId}`)
      .then((response) => {
        this.setState({
          documentDetails: response.data,
          note: response.data.note,
          user_id: response.data.user_id,
          document_request_id: response.data.id,
        });
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message || "Error fetching document details"
        );
      });
  };

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  capitalizeFirstLetter = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  getStatusClass = (status) => {
    switch (status) {
      case "created":
        return "bg-red-100 text-blue-700";
      case "submitted":
        return "bg-yellow-100 text-yellow-700";
      case "received":
        return "bg-danger text-white";
      case "processing":
        return "bg-orange-100 text-orange-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  handleSelectChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => {
      if (value === "processing" || value === "rejected") {
        this.setState({
          showModal: true,
          modalType: value,
        });
      }
    });
  };

  handleModalClose = () => {
    this.setState({
      showModal: false,
      rejectionReason: "",
      status: "",
    });
  };

  handleStatusUpdate = async (e) => {
    e.preventDefault();
    this.setState({ isUpdating: true });

    const { documentId } = this.props.params;
    const { status, rejectionReason, modalType } = this.state;

    try {
      const formData = {
        status: modalType, // 'processing' or 'rejected'
        rejectionReason: modalType === "rejected" ? rejectionReason : null,
      };

      await axios.post(
        `/institution/document-requests/${documentId}/update-status`,
        formData
      );

      toast.success("Status updated successfully!");
      this.setState({ isUpdating: false });
      this.fetchDocumentDetails();
      this.handleModalClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      this.setState({ isUpdating: false });
    }
  };

  handleRejectionReasonChange = (e) => {
    this.setState({ rejectionReason: e.target.value });
  };

  renderModalContent = () => {
    const { modalType, rejectionReason } = this.state;

    if (modalType === "processing") {
      return (
        <div>
          <p>Are you sure you want to proceed with processing this document?</p>
        </div>
      );
    }

    if (modalType === "rejected") {
      return (
        <div>
          <p className="mb-6">Are you sure you want to reject this request?</p>
          <Textarea
            label="Enter reason for rejection"
            name="rejectionReason"
            value={rejectionReason}
            onChange={this.handleRejectionReasonChange}
          />
        </div>
      );
    }

    return null;
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileType = file.type;

    if (fileType === "application/pdf") {
      const pdfUrl = URL.createObjectURL(file);
      this.setState({ selectedFile: file });
    } else {
      toast.error("Only PDF files are allowed.");
      this.setState({ selectedFile: null });
    }
  };

  handleUpdateNote = async (e) => {
    e.preventDefault();
    this.setState({ isNoting: true });
    const { documentId } = this.props.params;
    const formData = {
      note: this.state.note,
    };

    try {
      const response = await axios.post(
        `/institution/document-requests/${documentId}/add-note`,
        formData
      );

      toast.success(response.data.message);
      this.setState({ isNoting: false });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      this.setState({ isNoting: false });
    }
  };

  handleResponseDocument = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", this.state.user_id); // Assuming user_id is stored in state
    formData.append("document_request_id", this.state.document_request_id); // Assuming document_request_id is stored in state
    formData.append("document_file", this.state.selectedFile); // Assuming document_file is the uploaded file in state

    this.setState({ isUploading: true });

    try {
      // Send the POST request to the backend
      const response = await axios.post(
        "/institution/response-document",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);

      this.fetchDocumentDetails();

      this.setState({ isUploading: false });
    } catch (error) {
      // Handle error response
      toast.error(
        error.response?.data?.message ||
          "An error occurred while uploading the document."
      );
      this.setState({ isUploading: false });
    }
  };

  render() {
    const {
      documentDetails,
      statusData,
      status,
      note,
      isNoting,
      showModal,
      isUpdating,
    } = this.state;
    return (
      <>
        {documentDetails && (
          <div className="bg-white rounded-md p-5">
            <div className="flex flex-wrap lg:justify-between mb-2">
              <div className="">
                <div className="flex space-x-2 items-center mb-2">
                  <p className="font-semibold">
                    Unique Code:{" "}
                    <span className="uppercase">
                      {documentDetails.unique_code}
                    </span>
                  </p>
                  <div
                    className={`flex items-center border px-4 py-1 rounded-full text-xs uppercase ${
                      documentDetails.payment_status == "paid"
                        ? "bg-green-200 border-green-600 text-green-600"
                        : "bg-gray-200 border-gray-600 text-gray-600"
                    }`}
                  >
                    {documentDetails.payment_status}
                  </div>
                </div>
                <p className="text-sm">
                  {this.formatDate(documentDetails.created_at)}
                </p>
              </div>
              <div className="w-52 mt-6 lg:mt-4">
                <Select
                  label="Change Status"
                  name="status"
                  value={status}
                  itemNameKey="name"
                  menuItems={statusData}
                  onChange={this.handleSelectChange}
                />
              </div>
              {showModal && (
                <div className="fixed inset-0 flex items-center backdrop-blur-sm justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-lg font-bold mb-4">
                      {this.state.modalType === "processing"
                        ? "Processing Document"
                        : "Reject Document"}
                    </h2>

                    {this.renderModalContent()}

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={this.handleModalClose}
                      >
                        Cancel
                      </button>
                      <button
                        disabled={isUpdating}
                        className="flex space-x-2 px-6 py-2 bg-green-800 text-white rounded hover:bg-green-700"
                        onClick={this.handleStatusUpdate}
                      >
                        {isUpdating ? (
                          <>
                            <Spinner size="w-4 h-4 mr-2" />
                            Updating...
                          </>
                        ) : (
                          "Yes"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <p className="font-bold mb-1">Document Request Summary:</p>
              <p
                className={`inline-block text-xs ${this.getStatusClass(
                  documentDetails.status
                )} px-4 py-1.5 rounded-full`}
              >
                {this.capitalizeFirstLetter(documentDetails.status)}
              </p>
              <div className="xl:flex space-x-2 xl:justify-between">
                <div className="flex space-x-2 items-center mt-4 mb-4 xl:mb-0">
                  <div className="flex items-center justify-center text-gray-700 bg-gray-100 rounded-full w-12 h-12 shadow-md shadow-gray-400">
                    <IoDocumentText size={30} />
                  </div>
                  <div className="">
                    <p className="font-medium text-gray-700">
                      {documentDetails.document_type.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {documentDetails.document_type.description}
                    </p>
                  </div>
                </div>
                <div className="w-1/2 md:w-1/4 xl:w-1/5 xl:self-end text-sm font-semibold text-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="">Copies:</p>
                    <p className="">{documentDetails.number_of_copies}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="">Format:</p>
                    <p className="">
                      {documentDetails.document_format == "soft_copy"
                        ? "Soft Copy"
                        : "Hard Copy"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="">Total Amt:</p>
                    <p className="">GHS {documentDetails.total_amount}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-sm">
                <p className="font-bold mb-2 text-base">Applicant Info:</p>
                <div className="grid grid-cols-5 gap-1">
                  <p className="font-semibold">Name:</p>
                  <p className="col-span-4">
                    {documentDetails.user.first_name}{" "}
                    {documentDetails.user.last_name}
                  </p>
                </div>
                <div className="grid grid-cols-5 gap-1 my-1">
                  <p className="font-semibold">Email:</p>
                  <p className="col-span-4">{documentDetails.user.email}</p>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  <p className="font-semibold">Phone:</p>
                  <p className="col-span-4">{documentDetails.user.phone}</p>
                </div>
              </div>
              <div className="border rounded-lg p-4 text-sm">
                <div className="flex space-x-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 shadow-md shadow-gray-400 rounded-full">
                    <FaRegNoteSticky size={18} />
                  </div>

                  <form onSubmit={this.handleUpdateNote} className="w-full">
                    <p className="font-bold">Notes</p>
                    <Textarea
                      caption="Type a note here"
                      name="note"
                      value={note}
                      onChange={this.handleInputChange}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        disabled={isNoting}
                        className="flex items-center space-x-2 border border-blue-700 rounded-md text-blue-700 hover:text-white hover:bg-red-700 text-xs px-4 py-1"
                      >
                        {isNoting ? (
                          <>
                            <Spinner size="w-4 h-4 mr-2" />
                            Saving...
                          </>
                        ) : (
                          <div className="flex space-x-2">
                            <RiSave2Line size={14} />
                            <p>Save</p>
                          </div>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {documentDetails.status == "completed" &&
              documentDetails.document_format === "soft_copy" && (
                <div className="flex w-4/5 border items-center justify-between border-gray-300 p-4 rounded-lg mt-4">
                  <div className="flex space-x-4 items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-file-earmark-pdf w-6 h-6 text-orange-500"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                      <path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.7 11.7 0 0 0-1.997.406 11.3 11.3 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.245.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 7.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                    </svg>
                    <div className="flex flex-col">
                      <p className="text-base text-black">
                        {documentDetails.document_type.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <a
                      href=""
                      className="flex w-8 h-8 bg-red-600 opacity-60 hover:opacity-100 items-center justify-center rounded-full cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="bi bi-cloud-download w-5 h-5 text-white"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383" />
                        <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}

            {documentDetails.status !== "completed" &&
              documentDetails.status !== "rejected" &&
              documentDetails.document_format === "hard_copy" && (
                <div className="border rounded-lg p-4 text-sm mt-4">
                  <div className="flex space-x-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 shadow-md shadow-gray-400 rounded-full">
                      <TbTruckDelivery size={18} />
                    </div>
                    <div className="">
                      <p className="font-bold mb-2 text-base">
                        Delivery Details:
                      </p>
                      <div className="grid grid-cols-5 gap-1">
                        <p className="font-semibold">Country:</p>
                        <p className="col-span-4">{documentDetails.country}</p>
                      </div>
                      <div className="grid grid-cols-5 gap-1 my-2">
                        <p className="font-semibold">Zip Code:</p>
                        <p className="col-span-4">{documentDetails.zip_code}</p>
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        <p className="font-semibold">Delivery Address:</p>
                        <p className="col-span-4">
                          {documentDetails.delivery_address}
                        </p>
                      </div>
                    </div>
                    <button className="bg-green-800 text-white px-4 h-8 rounded-md self-end">
                      Ready for Pickup ?
                    </button>
                  </div>
                </div>
              )}

            {documentDetails.status !== "completed" &&
              documentDetails.status !== "rejected" &&
              documentDetails.document_format === "soft_copy" && (
                <form
                  onSubmit={this.handleResponseDocument}
                  className="flex flex-col items-center justify-center bg-gray-100 my-4 rounded-lg p-4"
                >
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer w-80 h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-300 ease-in-out"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16l-4-4m0 0l4-4m-4 4h18m-5 4v1a3 3 0 01-3 3H9a3 3 0 01-3-3v-1m3 4h4"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Click to upload a file
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      name="selectedFile"
                      className="hidden"
                      onChange={this.handleFileChange}
                    />
                  </label>
                  {this.state.selectedFile && (
                    <p className="mt-4 text-sm text-gray-700">
                      {this.state.selectedFile.name}
                    </p>
                  )}
                  <div className="w-full flex justify-end">
                    <button
                      type="submit"
                      className="flex space-x-2 items-center border border-blue-700 rounded-md text-blue-700 hover:text-white hover:bg-red-700 text-sm px-4 py-1"
                    >
                      <IoIosCloudUpload size={16} /> <p>Upload</p>
                    </button>
                  </div>
                </form>
              )}
          </div>
        )}
      </>
    );
  }
}

export default withRouter(DocumentDetails);

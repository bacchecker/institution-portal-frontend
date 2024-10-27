import React, { Component } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import axios from "@utils/axiosConfig";
import { toast } from "react-hot-toast";
import { GrDocumentConfig } from "react-icons/gr";
import { IoArrowForwardCircle } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { MdAdd, MdClose } from "react-icons/md";
import withRouter from "@components/withRouter";
import AuthLayout from "@components/AuthLayout";
import Drawer from "../../components/Drawer";
import { Spinner } from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";
import { RiInformation2Fill } from "react-icons/ri";

class InstitutionDocTypes extends Component {
  constructor(props) {
    super(props);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  state = {
    documentTypes: [],
    search: "",
    currentPage: 1,
    lastPage: 1,
    total: 0,
    isLoading: false,
    isSaving: false,
    documentTypesModal: false,
    addNewModal: false,
    availableDocumentTypes: [],
    selectedDocumentTypes: [],
  };

  componentDidMount() {
    this.props.passHandleSubmit(this.props.stepIndex, this.handleSubmit);
    this.fetchDocumentTypes();
    this.fetchAvailableDocumentTypes();
  }

  fetchAvailableDocumentTypes = () => {
    const { search } = this.state;
    this.setState({ isLoading: true });
    axios
      .get(`/institution/document-types/available`, {})
      .then((response) => {
        this.setState({
          availableDocumentTypes: response.data.available_types,
        });

        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isLoading: false });
      });
  };

  fetchDocumentTypes = () => {
    const { search } = this.state;
    this.setState({ isLoading: true });
    axios
      .get(`/institution/document-types`, {
        params: {
          search,
        },
      })
      .then((response) => {
        this.setState({
          documentTypes: response.data.data.types,
        });

        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isLoading: false });
      });
  };

  toggleAddNewModal = () => {
    this.setState({ addNewModal: !this.state.addNewModal });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  handleCheckboxChange(id) {
    this.setState((prevState) => {
      const { selectedDocumentTypes } = prevState;
      if (selectedDocumentTypes.includes(id)) {
        return {
          selectedDocumentTypes: selectedDocumentTypes.filter(
            (item) => item !== id
          ),
        };
      } else {
        return {
          selectedDocumentTypes: [...selectedDocumentTypes, id],
        };
      }
    });
  }

  async handleFormSubmit(event) {
    if (event) event.preventDefault();

    const { selectedDocumentTypes } = this.state;

    if (selectedDocumentTypes.length === 0) {
      toast.error("Please select at least one document type.");
      return false;
    }

    this.setState({ isSaving: true });
    try {
      const response = await axios.post(
        "/institution/store-institution-document-types",
        {
          document_type_ids: selectedDocumentTypes,
        }
      );
      toast.success(response.data.message);
      this.setState({
        selectedDocumentTypes: [],
      });
      this.fetchDocumentTypes();
      this.fetchAvailableDocumentTypes();
      this.toggleDocTypesModal();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      this.setState({ isSaving: false });
      return true;
    }
  }

  async handleDelete(id) {
    this.setState((prevState) => ({
      deletingIds: { ...prevState.deletingIds, [id]: true },
    }));

    try {
      const response = await axios.delete(`/institution/remove-document/${id}`);
      toast.success(response.data.message);
      this.fetchDocumentTypes();

    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting document");
    } finally {
      this.setState((prevState) => ({
        deletingIds: { ...prevState.deletingIds, [id]: false },
      }));
    }
  }

  handleClear = () => {
    this.state.name = "";
    this.state.description = "";
  };

  handleAddNew = async (event) => {
    event.preventDefault();
    this.setState({ isSaving: true });
    const {
      name,
      description,
      base_fee,
      printing_fee,
      validation_fee,
      verification_fee,
    } = this.state;

    try {
      const response = await axios.post("/institution/add-document-type", {
        name,
        description,
        base_fee,
        printing_fee,
        validation_fee,
        verification_fee,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
      }
      this.setState({ isSaving: false });
      this.fetchDocumentTypes();
      this.handleClear();
      this.toggleAddNewModal();
    } catch (error) {
      toast.error(error.response.data.message);
      this.setState({ isSaving: false });
    }
  };


  handleFilterChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () =>
      this.fetchDocumentTypes()
    );
  };

  handleSubmit = () => {
    console.log('Documents');
    
  }

  toggleDocTypesModal = () => {
    this.setState({ documentTypesModal: !this.state.documentTypesModal });
  };

  render() {
    const { documentTypes, isLoading, documentTypesModal, searchAvailableName,
            availableDocumentTypes,
            selectedDocumentTypes,
            isSaving,
            addNewModal, } = this.state;
    return (
        <div className="w-full flex flex-col bg-white dark:bg-slate-900 rounded-md md:px-3 mt-6">
          {/* Filter Section */}
          <div className="mb-4 flex justify-between">
            <div className="relative w-full lg:w-2/3">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
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
                onChange={this.handleFilterChange}
                name="search"
                id="default-search"
                className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by document name or description"
                required
              />
            </div>
            <div 
              onClick={this.toggleDocTypesModal}
              className={`flex items-center bg-danger text-white px-4 rounded-full cursor-pointer`}
            >
              <MdAdd size={24} /> Add / Remove
            </div>
          </div>

          <div className="bg-white rounded-lg py-6 px-8">
            <div className="">
              {isLoading ? (
                <div
                  role="status"
                  className="space-y-2.5 animate-pulse max-w-lg"
                >
                  <div className="flex items-center w-full">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                  </div>
                  <div className="flex items-center w-full max-w-[480px]">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                  </div>
                  <div className="flex items-center w-full max-w-[400px]">
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                    <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                  </div>
                  <div className="flex items-center w-full max-w-[480px]">
                    <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                  </div>
                  <div className="flex items-center w-full max-w-[440px]">
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-32"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                    <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                  </div>
                  <div className="flex items-center w-full max-w-[360px]">
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                    <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                  </div>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : documentTypes.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-2">
                  {documentTypes.map((request) => (
                    <NavLink
                      to={`/account-setup/document-types/${request.id}`}
                      key={request.id}
                      className="relative bg-white shadow-md shadow-gray-300 hover:cursor-pointer hover:shadow-gray-500 group"
                    >
                      <div className="flex items-center space-x-4 absolute left-0 bg-gradient-to-tl from-red-400 via-red-500 to-red-700 rounded-r-full text-white px-2 py-2 shadow-md shadow-gray-500">
                        <p className="text-2xl font-semibold">
                          {request.index}
                        </p>
                        <div className="flex items-center justify-center w-10 h-10 bg-white text-danger rounded-full shadow-md shadow-gray-500">
                          <GrDocumentConfig size={20} />
                        </div>
                      </div>
                      <div className="ml-28 p-3">
                        <p className="text-danger font-semibold">
                          {request.document_type.name}
                        </p>
                        <p className="text-sm font-medium">
                          {request.document_type.description}
                        </p>
                        <div className="flex space-x-4 text-sm mt-2 italic text-gray-500">
                          <p className="w-2/3">
                            Click to setup validation procedure for each
                            document type
                          </p>
                          <IoArrowForwardCircle
                            size={26}
                            className="self-end group-hover:text-red-700"
                          />
                        </div>
                      </div>
                    </NavLink>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center h-full">
                  <img
                    src="/images/nodata.png"
                    alt="No data available"
                    className="w-1/4 h-auto"
                  />
                  <p className="text-gray-500 text-sm -mt-10 font-medium">
                    No document type found
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {/* <div className="flex justify-between items-center mt-4">
                        <div>
                            <span className="text-gray-600 font-medium text-sm">
                                Page {currentPage} of {lastPage}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => this.handlePageChange(currentPage - 1)}
                                className="p-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white"
                            >
                                <FaChevronLeft size={12} />
                            </button>

                            {this.renderPageNumbers()}

                            <button
                                disabled={currentPage === lastPage}
                                onClick={() => this.handlePageChange(currentPage + 1)}
                                className="p-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white disabled:border-0"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                    </div> */}
          </div>
          {documentTypesModal && (
            <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
              <div
                className={`w-full lg:w-2/3 xl:w-1/2 h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform ${
                  documentTypesModal ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{
                  right: 0,
                  position: 'absolute',
                }}
              >
                <div className="flex justify-between items-center font-medium border-b-2 p-4">
                  <h2 className="text-lg">Available Document Types</h2>
                  <button
                    onClick={this.toggleDocTypesModal}
                    className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md"
                  >
                    <MdClose size={20} className="text-red-600" />
                  </button>
                </div>

                <div className="relative flex flex-col space-y-7 px-4 py-6 overflow-y-auto h-[calc(100%-4rem)]">
                  <div className="bg-yellow-100 border-yellow-200 px-4 py-2 mb-3 rounded-lg">
                    <div className="flex space-x-2">
                      <RiInformation2Fill size={24} className="text-yellow-500" />
                      <p className="font-semibold">Information</p>
                    </div>
                    <p className="ml-8">
                      Select all document types that your institution issues to
                      applicants and can validate for employees or other stakeholders
                    </p>
                  </div>
                  {/* <div className="mb-4 flex space-x-4">
                    <div className="relative w-full lg:w-2/3">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 "
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
                        type="text"
                        value={searchAvailableName}
                        onChange={this.handleSearchAvailableNameChange}
                        name="search"
                        id="default-search"
                        className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search document types"
                        required
                      />
                    </div>
                  </div> */}
                  <div className="">
                    {isLoading ? (
                      <div
                        role="status"
                        className="space-y-2.5 animate-pulse max-w-lg"
                      >
                        <div className="flex items-center w-full">
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                        </div>
                        <div className="flex items-center w-full max-w-[480px]">
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                        </div>
                        <div className="flex items-center w-full max-w-[400px]">
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                          <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                        </div>
                        <div className="flex items-center w-full max-w-[480px]">
                          <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                        </div>
                        <div className="flex items-center w-full max-w-[440px]">
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-32"></div>
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                          <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                        </div>
                        <div className="flex items-center w-full max-w-[360px]">
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                          <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <form className="text-sm mb-10">
                        {availableDocumentTypes.length > 0 ? (
                          <div className="flex flex-wrap gap-4 relative">
                            {availableDocumentTypes.map((request) => (
                              <label
                                key={request.id}
                                className={`cursor-pointer flex items-center rounded-full px-4 py-2 transition-all duration-200 ${
                                  selectedDocumentTypes.includes(request.id)
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-600 text-white"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  value={request.id}
                                  checked={selectedDocumentTypes.includes(request.id)}
                                  onChange={() =>
                                    this.handleCheckboxChange(request.id)
                                  }
                                  className="mr-2 accent-green-600"
                                />
                                {request.name}
                              </label>  
                            ))}
                            <br />
                          </div>
                        ) : (
                          <div className="flex flex-col justify-center items-center h-full">
                            <img
                              src="/images/nodata.png"
                              alt="No data available"
                              className="w-1/4 h-auto"
                            />
                            <p className="text-gray-500 text-sm -mt-10 font-medium">
                              No document type found
                            </p>
                          </div>
                        )}
                      </form>
                    )}
                  </div>
                  <div className="w-full fixed bg-yellow-200 py-2 bottom-0 right-0 flex space-x-4 px-4">
                    <button
                      onClick={this.addNewModal}
                      type="button"
                      className="text-sm w-1/2 text-gray-600 bg-white border px-4 py-1.5 rounded-full"
                    >
                      Create New
                    </button>
                    <button
                      onClick={this.handleFormSubmit}
                      disabled={isSaving}
                      className={`w-1/2 flex items-center justify-center rounded-full ${
                        isSaving
                          ? 'bg-gray-400 text-gray-700'
                          : 'bg-bChkRed text-white'
                      } py-1.5 text-sm ${isSaving ? 'cursor-not-allowed' : ''}`}
                    >
                      {isSaving ? (
                        <>
                          <Spinner size="sm" />
                          <span className="ml-2">Adding...</span>
                        </>
                      ) : (
                        'Add'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {addNewModal && (
            <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
              <form
                onSubmit={this.handleAddNew}
                className="w-1/2 lg:w-1/3 xl:w-[28%] h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
                style={{
                  right: 0,
                  position: "absolute",
                  transform: addNewModal ? "translateX(0)" : "translateX(100%)",
                }}
              >
                <div className="flex justify-between items-center font-medium border-b-2 p-4">
                  <h2 className="text-lg">Add New Document Type</h2>
                  <button
                    onClick={this.toggleAddNewModal}
                    className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md"
                  >
                    <MdClose size={20} className="text-red-600" />
                  </button>
                </div>

                <div className="relative flex flex-col space-y-7 px-4 py-6 overflow-y-auto h-[calc(100%-4rem)]">
                  <Input
                    label="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                  />
                  <Textarea
                    label="Description"
                    name="description"
                    value={this.state.description}
                    onChange={this.handleInputChange}
                  />
                  <Input
                    label="Document Validation Fee"
                    name="validation_fee"
                    type="number"
                    value={this.state.validation_fee}
                    onChange={this.handleInputChange}
                  />
                  <Input
                    label="Document Verification Fee"
                    name="verification_fee"
                    type="number"
                    value={this.state.verification_fee}
                    onChange={this.handleInputChange}
                  />
                  <Input
                    label="Document Requisition Fee"
                    name="base_fee"
                    type="number"
                    value={this.state.base_fee}
                    onChange={this.handleInputChange}
                  />
                  <Input
                    label="Printing Fee"
                    name="printing_fee"
                    type="number"
                    value={this.state.printing_fee}
                    onChange={this.handleInputChange}
                  />

                  <div className="w-full absolute bottom-4 right-0 flex space-x-4 px-4">
                    <button
                      onClick={this.toggleAddNewModal}
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
                          <Spinner size="w-4 h-4 mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

        </div>
    );
  }
}

export default withRouter(InstitutionDocTypes);

import React, { Component } from "react";
import axios from "../../axiosConfig";
import { toast } from "react-hot-toast";
import { RiInformation2Fill } from "react-icons/ri";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import Spinner from "../../components/Spinner";
import { MdClose } from "react-icons/md";
import Textarea from "../../components/Textarea";
import Textbox from "../../components/Textbox";

class AddDocumentType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchAvailableName: "",
      searchInstitutionName: "",
      availableDocumentTypes: [],
      institutionDocumentTypes: [],
      selectedDocumentTypes: [],
      isLoading: false,
      isSaving: false,
      isDeleting: false,
      addNewModal: false,
      name: '',
      description: ''
    };

    // Binding methods
    this.fetchDocumentTypes = this.fetchDocumentTypes.bind(this);
    this.handleSearchAvailableNameChange =
      this.handleSearchAvailableNameChange.bind(this);
    this.handleSearchInstitutionNameChange =
      this.handleSearchInstitutionNameChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.fetchDocumentTypes();
  }

  /* componentDidUpdate(prevState) {
    const { searchAvailableName, searchInstitutionName } = this.state;
    if (
      prevState.searchAvailableName !== searchAvailableName ||
      prevState.searchInstitutionName !== searchInstitutionName
    ) {
      this.fetchDocumentTypes();
    }
  } */

  /* async fetchDocumentTypes() {
    this.setState({ isLoading: true });
    const { searchInstitutionName } = this.state;
    try {
      const response = await axios.get("/institutions/document-types", {
        params: {
          institution_type: "academic",
          //   academic_level: "tertiary",
          search_institution_name: searchInstitutionName,
        },
      });

      const insResponse = await axios.get("/institution/document-types");

      this.setState({
        institutionDocumentTypes: insResponse.data?.data?.types,
        isLoading: false,
      });
    } catch (error) {
      toast.error("Error fetching document types: " + (error.message || ""));
      this.setState({ isLoading: false });
    }
  } */

    fetchDocumentTypes = () => {
    const { search } = this.state;
    this.setState({ isLoading: true })
    axios.get(`/institution/available-document-types`, {
    })
    .then( response => {
        this.setState({
            availableDocumentTypes: response.data.data.available_types,
            institutionDocumentTypes: response.data.data.institution_doc_types,
        });
        
        this.setState({ isLoading: false })
    })
    .catch((error) => {
        console.error(error);
        this.setState({ isLoading: false })
    });
  };

  handleSearchAvailableNameChange(event) {
    this.setState({ searchAvailableName: event.target.value });
  }

  handleSearchInstitutionNameChange(event) {
    this.setState({ searchInstitutionName: event.target.value });
  }

  toggleAddNewModal = () => {
    this.setState({ addNewModal: !this.state.addNewModal });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState(prevState => ({
        ...prevState,
      [name]: value,
    }));
}

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
      await this.fetchDocumentTypes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting document");
    } finally {
      this.setState((prevState) => ({
        deletingIds: { ...prevState.deletingIds, [id]: false },
      }));
    }
  }

  handleClear = () =>{
    this.state.name = ''
    this.state.description = ''
  };

  handleAddNew = async (event) => {
    event.preventDefault();
    this.setState({isSaving: true})
    const { name, description } = this.state;
  
    try {
      const response = await axios.post('/institution/add-document-type', {
        name,                   
        description              
      });
  
      if (response.status === 201) {
        toast.success(response.data.message);
      }
      this.setState({isSaving: false})
      this.fetchDocumentTypes();
      this.handleClear(); 
      this.toggleAddNewModal();

    } catch (error) {
     
      toast.error(error.response.data.message);
    }
};

  render() {
    const {
      searchAvailableName,
      searchInstitutionName,
      availableDocumentTypes,
      institutionDocumentTypes,
      selectedDocumentTypes,
      isLoading,
      isSaving,
      addNewModal,
    } = this.state;

    return (
      <>
        {/* Available Document Types */}
        <div className="bg-white w-full rounded-lg p-6 shadow-md shadow-gray-500">
          <p className="-mt-4 mb-3 uppercase bg-white font-bold px-2">
            Available Document Types
          </p>
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
          <div className="mb-4 flex space-x-4">
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
          </div>
          <div className="">
            {isLoading ? (
              <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
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
              <form onSubmit={this.handleFormSubmit} className="text-sm">
                {availableDocumentTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-4 relative">
                    {availableDocumentTypes.map((request) => (
                      <label
                        key={request.id}
                        className={`cursor-pointer flex items-center rounded-full px-4 py-2 transition-all duration-200 ${
                          selectedDocumentTypes.includes(request.id)
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={request.id}
                          checked={selectedDocumentTypes.includes(request.id)}
                          onChange={() => this.handleCheckboxChange(request.id)}
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
                <div className="flex justify-end mt-4">
                  <button
                    className={`flex items-center text-base ${
                      isSaving
                        ? "bg-gray-300 text-gray-500"
                        : "bg-blue-200 text-blue-700 hover:bg-blue-300"
                    } border border-blue-700 px-4 py-1 rounded-md`}
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Spinner size="w-5 h-5" />
                        <span className="ml-2">Adding</span>
                      </>
                    ) : (
                      <>
                        <IoMdAdd size={20} className="mr-2" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Institution Document Types */}
        <div className="bg-white w-full rounded-lg p-6 shadow-md shadow-gray-500 mt-6">
          <p className="-mt-4 mb-3 uppercase font-bold px-2">
            Institution Document Types
          </p>
          <div className="mb-4 flex space-x-4">
            <div className="relative w-full lg:w-2/3">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
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
                value={searchInstitutionName}
                onChange={this.handleSearchInstitutionNameChange}
                name="search"
                id="default-search"
                className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search document types"
                required
              />
            </div>
          </div>
          <div className="">
            {isLoading ? (
              <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
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
              <div className="">
                <div className="flex flex-wrap gap-4 text-sm">
                  {institutionDocumentTypes.length === 0 ? (
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
                  ) : (
                    institutionDocumentTypes.map((request) => (
                      <div key={request.id} className="flex">
                        <div className="bg-green-700 space-y-2 text-white rounded-full py-2 px-4">
                          {request?.document_type?.name}
                        </div>
                        <div className="self-center text-red-600 hover:cursor-pointer">
                          <IoMdClose
                            size={24}
                            onClick={() => this.handleDelete(request.id)} // Trigger delete action
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={this.toggleAddNewModal}
              className={`flex items-center ${
                isSaving
                  ? "bg-gray-300 text-gray-500"
                  : "bg-green-200 text-green-700 hover:bg-green-300"
              } border border-green-700 px-4 py-1 rounded-md`}
              type="button"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Spinner size="w-5 h-5" />
                  <span className="ml-2">Adding</span>
                </>
              ) : (
                <>
                  <IoMdAdd size={20} className="mr-2" />
                  <span>Add New</span>
                </>
              )}
            </button>
          </div>
        </div>
        {addNewModal && (
          <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
              <form onSubmit={this.handleAddNew} className="w-1/2 lg:w-1/3 xl:w-[28%] h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
                  style={{ right: 0, position: 'absolute', transform: addNewModal ? 'translateX(0)' : 'translateX(100%)' }}
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
                      <Textbox
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
                                  isSaving ? 'bg-gray-400 text-gray-700' : 'bg-buttonLog text-white'
                              } py-1.5 text-xs ${isSaving ? 'cursor-not-allowed' : ''}`}
                          >
                              {isSaving ? (
                                  <>
                                      <Spinner size="w-4 h-4 mr-2"/>
                                      Saving...
                                  </>
                              ) : (
                                  'Save'
                              )}
                          </button>
                      </div>   
                  </div>
          
                  
              </form>
          </div>
      
      )}
      </>
    );
  }
}

export default AddDocumentType;
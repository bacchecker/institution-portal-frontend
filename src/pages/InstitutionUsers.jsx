import React, { Component } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import { LuMoreVertical } from 'react-icons/lu';
import axios from '../axiosConfig';
import { MdClose } from 'react-icons/md';
import { SiPinboard } from 'react-icons/si';
import Textbox from '../components/Textbox';
import Select from '../components/Select';
import {toast} from 'react-hot-toast';

class InstitutionUsers extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        institutionUsers: [],
        search: '',
        currentPage: 1,
        lastPage: 1,
        total: 0,
        rowMenuOpen: null,
        createModal: false,
        isSaving: false,
        rolesData: [],
        genderData: [
            { id: 'male', name: 'Male' },
            { id: 'female', name: 'Female' },
            { id: 'other', name: 'Other' },
        ],
        first_name: '',
        other_names: '',
        last_name: '',
        gender: '',
        role_id: '',
        email: '',
        phone: '',
        address: '',

    }

    componentDidMount() {
        this.fetchInstitutionsUsers();
        this.fetchRoles();
    }

    fetchInstitutionsUsers = (page = 1) => {
        const { search } = this.state;
        axios.get(`/institution/institution-users`, {
            params: {
                page,
                search,
            },
        })
        .then((response) => {
        if (response.data.status === 200) {
            this.setState({
            institutionUsers: response.data.institutionUsers.data,
            currentPage: response.data.institutionUsers.current_page,
            lastPage: response.data.institutionUsers.last_page,
            total: response.data.institutionUsers.total,
            });
        } else {
            toast.error('Error fetching institution users');
        }
        })
        .catch((error) => {
        toast.error('Error:', error.response.data.message);
        });
    };

    fetchRoles = async () => {
        try {
        const response = await axios.get('/roles/');
        const responseData = response.data;
      
        this.setState({ 
            rolesData: responseData
        });
        } catch (error) {
        toast.error(error);
        }
    }



    toggleCreateModal = () => {
        this.setState({
            createModal: !this.state.createModal,
            loadingState: false
        });
        this.handleClear()
    }

    handleClear = () =>{
        this.state.first_name = ''
        this.state.last_name = ''
        this.state.other_names = ''
        this.state.address = ''
        this.state.email = ''
        this.state.phone = ''
        this.state.gender = ''
        this.state.role_id = ''
    };


    handleMenuToggle = (requestId) => {
        this.setState((prevState) => ({
          rowMenuOpen: prevState.rowMenuOpen === requestId ? null : requestId,
        }));
    };

    handleFilterChange = (e) => {
        this.setState({ [e.target.name]: e.target.value }, () => this.fetchInstitutionsUsers());
    };

    handlePageChange = (page) => {
        this.fetchInstitutionsUsers(page);
    };

    renderPageNumbers = () => {
        const { currentPage, lastPage } = this.state;
        const pageNumbers = [];

        for (let i = 1; i <= lastPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => this.handlePageChange(i)}
                    className={`px-2.5 py-1 border rounded-lg text-sm ${i === currentPage ? 'bg-buttonLog text-white border-0' : 'bg-white text-gray-800'}`}
                >
                    {i}
                </button>
            );
        }

        return pageNumbers;
    };

    capitalizeFirstLetter = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    handleInputChange = (event) => {
        const { name, value } = event.target;

        this.setState(prevState => ({
            ...prevState,
          [name]: value,
        }));
    }

    getStatusClass = (status) => {
        switch (status) {
            
            case 'active':
                return 'bg-green-100 text-green-700';
            
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
    
        // Collect form data from state
        const formData = {
            first_name: this.state.first_name,
            other_names: this.state.other_names,
            last_name: this.state.last_name,
            email: this.state.email,
            address: this.state.address,
            phone: this.state.phone,
            gender: this.state.gender,
            role_id: this.state.role_id,
        };
    
        try {
            // Send POST request to API endpoint
            const response = await axios.post('/institution/store-users', formData);
    
            this.fetchInstitutionsUsers();
            this.handleClear(); 
            this.toggleCreateModal();
    
            toast.success(response.data.message, {});
        } catch (error) {
            // Show error toast notification in case of an error
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };
    
    render() {
        const { createModal, isSaving, institutionUsers, currentPage, lastPage, rowMenuOpen  } = this.state;
        return ( 
            <>
            <div className="container mx-auto">
                <h1 className="text-xl font-bold mb-4">Employee Directory</h1>

                {/* Filter Section */}
                <div className="mb-4 flex space-x-4">
                    
                    <div className="relative w-full lg:w-2/3">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="search" onChange={this.handleFilterChange} name='search' id="default-search" className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by Employee name, phone number, email or role" required />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg p-4">
                    <div className="overflow-x-auto"> {/* Makes table scrollable on small screens */}
                        <table className="min-w-full table-fixed bg-white text-black text-sm">
                            <thead className="bg-gray-100 rounded-lg sticky top-0 z-10"> {/* Sticky for fixed header */}
                                <tr className="rounded-lg text-xs">
                                    <th className="text-left px-4 py-3 table-cell rounded-l-lg"> {/* Rounded left for first column */}
                                        Employee Name
                                    </th>
                                    <th className="text-left p-2 table-cell">Private Code</th>
                                    <th className="text-left p-2 table-cell">Email</th>
                                    <th className="text-left p-2 table-cell">User Role</th>
                                    <th className="p-2 table-cell text-center">Status</th>
                                    <th className="text-left p-2 table-cell rounded-r-lg">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='mt-2'>
                                {institutionUsers.map((request) => (
                                    <tr key={request.id} className="bg-white">
                                        <td className="pl-4 p-2 table-cell">
                                            <p className='font-semibold text-gray-800 text-base'>{request.user.first_name} {request.user.last_name}</p>
                                            <p className='text-gray-600 font-medium'>{request.user.phone}</p>
                                        </td>
                                        <td className="p-2 table-cell">{request.user.private_code}</td>
                                        <td className="p-2 table-cell">{request.user.email}</td>
                                        <td className="p-2 table-cell">{request.role_id}</td>
                                        <td className="p-2 table-cell text-center">
                                            <span className={`inline-block text-xs ${this.getStatusClass(request.status)} px-4 py-1.5 rounded-full`}>
                                                {this.capitalizeFirstLetter(request.status)}
                                            </span>
                                        </td>

                                        <td className="p-2">
                                            <div className="relative">
                                                {/* Toggle Menu Button */}
                                                <div
                                                className="flex items-center justify-center cursor-pointer hover:border-blue-500 border-2 rounded-md w-8 h-8"
                                                onClick={() => this.handleMenuToggle(request.id)}
                                                >
                                                <LuMoreVertical />
                                                </div>

                                                {/* Menu List - Display only when rowMenuOpen matches the row's request.id */}
                                                {rowMenuOpen === request.id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                                                    <ul className="py-1">
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View</li>
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
                                                    </ul>
                                                </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
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
                    </div>
                    <button
                        className='absolute right-6 xl:right-12 bottom-10 flex space-x-2 bg-deepBlue text-white px-4 rounded-full py-1.5 text-sm font-light shadow-md shadow-gray-500'
                        onClick={this.toggleCreateModal}
                    >
                        <FaPlus className='self-center'/>
                        <p>New Employee</p>
                    </button>
                </div>

                {createModal && (
                    <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
                        <form onSubmit={this.handleSubmit} className="w-1/2 lg:w-1/3 h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
                            style={{ right: 0, position: 'absolute', transform: createModal ? 'translateX(0)' : 'translateX(100%)' }}
                        >
                            <div className="flex justify-between items-center font-medium border-b-2 p-4">
                                <h2 className="text-lg">Add New Employee</h2>
                                <button
                                    onClick={this.toggleCreateModal}
                                    className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md"
                                >
                                    <MdClose size={20} className="text-red-600" />
                                </button>
                            </div>
                    
                            <div className="flex flex-col space-y-4 p-6 xl:p-8 overflow-y-auto h-[calc(100%-4rem)]"> 
                                <Textbox
                                    label="First Name"
                                    name="first_name"
                                    value={this.state.first_name}
                                    onChange={this.handleInputChange}
                                />
                                <Textbox
                                    label="Other Name"
                                    name="other_names"
                                    value={this.state.other_names}
                                    onChange={this.handleInputChange}
                                />
                                <Textbox
                                    label="Last Name"
                                    name="last_name"
                                    value={this.state.last_name}
                                    onChange={this.handleInputChange}
                                />
                                
                                <Textbox
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                />
                                <Textbox
                                    label="Address"
                                    name="address"
                                    value={this.state.address}
                                    onChange={this.handleInputChange}
                                />
                                <Textbox
                                    label="Phone Number"
                                    name="phone"
                                    value={this.state.phone}
                                    onChange={this.handleInputChange}
                                />
                                <Select
                                    label="Gender"
                                    name="gender"
                                    value={this.state.gender}
                                    itemNameKey="name"
                                    menuItems={this.state.genderData}
                                    onChange={this.handleInputChange}
                                />
                                <Select
                                    label="Role"
                                    name="role_id"
                                    value={this.state.role_id}
                                    itemNameKey="name"
                                    menuItems={this.state.rolesData}
                                    onChange={this.handleInputChange}
                                />

                              <div className="flex space-x-4">
                                <button
                                    onClick={this.toggleCreateModal}
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
                                            <SiPinboard size={20} className="mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save'
                                    )}
                                </button>
                            </div>  
                            </div>
                    
                            {/* Fixed button section */}
                            
                        </form>
                    </div>
                
                
                
                )}



                

            </div>
            </>
         );
    }
}
 
export default InstitutionUsers;
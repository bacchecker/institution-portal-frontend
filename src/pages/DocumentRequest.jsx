import React, { Component } from 'react';
import axios from '../axiosConfig';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { LuMoreVertical } from 'react-icons/lu';
import {toast} from 'react-hot-toast';
import withRouter from '../components/withRouter';
class DocumentRequest extends Component {
    constructor(props) {
        super(props);
    }

    state = { 
        documentRequests: [],
        search: '',
        currentPage: 1,
        lastPage: 1,
        total: 0,
        rowMenuOpen: null,
        institutionStatus: this.props.institutionStatus,
        profileComplete: this.props.profileComplete,
    }

    componentDidMount() {
        const { profileComplete, institutionStatus } = this.state;
  
        if (institutionStatus == 'inactive') {
        setTimeout(() => {
            this.props.navigate("/account-inactive");
            return
        }, 0)
        } else if(profileComplete == 'no') {
        setTimeout(() => {
            this.props.navigate("/complete-profile");
            return
        }, 0)
        }else{
            this.fetchDocumentRequests();
        }
        
    }

    fetchDocumentRequests = (page = 1) => {
        const { search } = this.state;
        axios
        .get(`/institution/document-requests`, {
        params: {
            page,
            search,
        },
        })
        .then((response) => {
        if (response.data.status === 200) {
            this.setState({
            documentRequests: response.data.documentRequests.data,
            currentPage: response.data.documentRequests.current_page,
            lastPage: response.data.documentRequests.last_page,
            total: response.data.documentRequests.total,  // Capture total number of records
            });
        } else {
            toast.error(error.response.data.message);
        }
        })
        .catch((error) => {
        toast.error(error.response.data.message);
        });
    };

    handleMenuToggle = (requestId) => {
        this.setState((prevState) => ({
          rowMenuOpen: prevState.rowMenuOpen === requestId ? null : requestId, // Toggle the menu for the specific row
        }));
    };

    handleFilterChange = (e) => {
        this.setState({ [e.target.name]: e.target.value }, () => this.fetchDocumentRequests());
    };

    handlePageChange = (page) => {
        this.fetchDocumentRequests(page);
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

    getStatusClass = (status) => {
        switch (status) {
            case 'created':
                return 'bg-blue-100 text-blue-700';
            case 'submitted':
                return 'bg-yellow-100 text-yellow-700';
            case 'received':
                return 'bg-purple-100 text-purple-700';
            case 'processing':
                return 'bg-orange-100 text-orange-700';
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'declined':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }
    

    render() { 
        const { documentRequests, search, currentPage, lastPage, total, rowMenuOpen  } = this.state;
        return ( 
            <>
            <div className="container mx-auto">
                <h1 className="text-xl font-bold mb-4">Document Requests</h1>

                {/* Filter Section */}
                <div className="mb-4 flex space-x-4">
                    
                    <div className="relative w-full lg:w-2/3">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="search" onChange={this.handleFilterChange} name='search' id="default-search" className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by Document Type, User Name or Unique Code" required />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg p-4">
                    <div className="overflow-x-auto"> {/* Makes table scrollable on small screens */}
                        <table className="min-w-full table-fixed bg-white text-black text-sm">
                            <thead className="bg-gray-100 rounded-lg sticky top-0 z-10"> {/* Sticky for fixed header */}
                                <tr className="rounded-lg text-xs">
                                    <th className="text-left px-4 py-3 table-cell rounded-l-lg"> {/* Rounded left for first column */}
                                        User Name
                                    </th>
                                    <th className="text-left p-2 table-cell">Document Type</th>
                                    <th className="text-left p-2 table-cell">Unique Code</th>
                                    <th className="p-2 table-cell text-center">Status</th>
                                    <th className="text-left p-2 table-cell">Format</th>
                                    <th className="text-left p-2 table-cell">Copies</th>
                                    <th className="text-left p-2 table-cell rounded-r-lg">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='mt-2'>
                                {documentRequests.length > 0 ? (
                                    documentRequests.map((request) => (
                                    <tr key={request.id} className="bg-white">
                                        <td className="pl-4 p-2 table-cell">
                                            <p className='font-semibold text-gray-800 text-base'>{request.user.first_name} {request.user.last_name}</p>
                                            <p className='text-gray-600 font-medium'>{request.user.phone}</p>
                                        </td>
                                        <td className="p-2 table-cell">{request.document_type.name}</td>
                                        <td className="p-2 table-cell">{request.unique_code}</td>
                                        <td className="p-2 table-cell text-center">
                                            <span className={`inline-block text-xs ${this.getStatusClass(request.status)} px-4 py-1.5 rounded-full`}>
                                                {this.capitalizeFirstLetter(request.status)}
                                            </span>
                                        </td>

                                        <td className="p-2 table-cell">{request.document_format === 'soft_copy' ? 'Soft copy' : 'Hard copy'}</td>
                                        <td className="p-2 table-cell">{request.number_of_copies}</td>
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
                                ))
                                ):(
                                    <tr>
                                    <td colSpan="6" className="p-6 text-center">
                                        <div className="flex flex-col justify-center items-center">
                                            <img
                                                src="/images/nodata.png"
                                                alt="No data available"
                                                className="w-1/4 h-auto object-contain"
                                            />
                                            <p className="text-gray-500 text-sm font-medium -mt-5 xl:-mt-12">No document request found</p>
                                        </div>
                                    </td>
                                </tr>
                                )
                                }
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
                </div>

                
            </div>
            </>
        );
    }
}
 
export default withRouter(DocumentRequest);

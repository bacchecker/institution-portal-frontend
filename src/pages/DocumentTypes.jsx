import React, { Component } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import axios from '../axiosConfig';
import {toast} from 'react-hot-toast';
import { GrDocumentConfig } from 'react-icons/gr';
import { IoArrowForwardCircle } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import withRouter from '../components/withRouter';

class DocumentTypes extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        documentTypes: [],
        search: '',
        currentPage: 1,
        lastPage: 1,
        total: 0,
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
            this.fetchDocumentTypes();
        }
    }

    fetchDocumentTypes = (page = 1) => {
        const { search } = this.state;
        axios.get(`/institution/document-types`, {
            params: {
                page,
                search,
            },
        })
        .then((response) => {
        if (response.data.status === 200) {
            this.setState({
            documentTypes: response.data.documentTypes.data,
            currentPage: response.data.documentTypes.current_page,
            lastPage: response.data.documentTypes.last_page,
            total: response.data.documentTypes.total,
            });
        } else {
            toast.error(error.response.data.message);
        }
        })
        .catch((error) => {
        toast.error(error.response.data.message);
        });
    };

    handleFilterChange = (e) => {
        this.setState({ [e.target.name]: e.target.value }, () => this.fetchDocumentTypes());
    };

    handlePageChange = (page) => {
        this.fetchDocumentTypes(page);
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

    
    render() {
        const { documentTypes, currentPage, lastPage  } = this.state;
        return ( 
            <>
            <div className="container mx-auto">
                <h1 className="text-xl font-bold mb-4">Document Types</h1>

                {/* Filter Section */}
                <div className="mb-4 flex justify-between">
                    
                    <div className="relative w-full lg:w-2/3">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="search" onChange={this.handleFilterChange} name='search' id="default-search" className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by document name or description" required />
                    </div>
                    <NavLink to={`/document-types/add-remove`} className={`flex items-center bg-purple-800 text-white px-4 rounded-full`}><MdAdd size={24}/> Add More</NavLink>
                </div>

                <div className="bg-white rounded-lg py-6 px-8">
                    <div className="">
                       
                            <div className='grid grid-cols-1 xl:grid-cols-2 gap-5 mt-2'>
                                {documentTypes.map((request) => (
                                    <NavLink to={`/document-types/${request.id}`} key={request.id} className="relative bg-white shadow-md shadow-gray-300 hover:cursor-pointer hover:shadow-gray-500 group">
                                        <div className="flex items-center space-x-4 absolute left-0 bg-gradient-to-tl from-purple-700 via-purple-800 to-purple-900 rounded-r-full text-white px-2 py-2 shadow-md shadow-gray-500">
                                            <p className='text-2xl font-semibold'>{request.index}</p>
                                            <div className="flex items-center justify-center w-10 h-10 bg-white text-purple-800 rounded-full shadow-md shadow-gray-500">
                                                <GrDocumentConfig size={20}/>
                                            </div>
                                            
                                        </div>
                                        <div className="ml-28 p-3">
                                            <p className='text-purple-800 font-semibold'>{request.document_type.name}</p>
                                            <p className='text-sm font-medium'>{request.document_type.description}</p>
                                            <div className="flex space-x-4 text-sm mt-2 italic text-gray-500">
                                                <p className='w-2/3'>Click to setup validation procedure for each document type</p>
                                                <IoArrowForwardCircle size={26} className='self-end group-hover:text-purple-800'/>
                                            </div>
                                        </div>
                                        
                                    </NavLink>
                                ))}
                            </div>
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
 
export default withRouter(DocumentTypes);
import React, { Component } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import axios from '../../axiosConfig';
import {toast} from 'react-hot-toast';
import { GrDocumentConfig } from 'react-icons/gr';
import { IoArrowForwardCircle } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import withRouter from '../../components/withRouter';
import Textarea from '../../components/Textarea';
import Textbox from '../../components/Textbox';
import { MdClose } from 'react-icons/md';
import Spinner from '../../components/Spinner';
import { FaUsers } from 'react-icons/fa6';

class InstitutionTeams extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        institutionTeams: [],
        search: '',
        currentPage: 1,
        lastPage: 1,
        total: 0,
        createModal: false,
        team_name: '',
        description: '',
        isSaving: false,
    }

    componentDidMount() {
        this.fetchInstitutionTeams();
    }

    fetchInstitutionTeams = (page = 1) => {
        const { search } = this.state;
        axios.get(`/institution/institution-teams`, {
            params: {
                page,
                search,
            },
        })
        .then((response) => {
        if (response.data.status === 200) {
            this.setState({
            institutionTeams: response.data.institutionTeams.data,
            currentPage: response.data.institutionTeams.current_page,
            lastPage: response.data.institutionTeams.last_page,
            total: response.data.institutionTeams.total,
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
        this.setState({ [e.target.name]: e.target.value }, () => this.fetchInstitutionTeams());
    };

    handlePageChange = (page) => {
        this.fetchInstitutionTeams(page);
    };

    toggleCreateModal = () => {
        this.setState({
            createModal: !this.state.createModal,
            loadingState: false
        });
        this.handleClear()
    }

    handleClear = () =>{
        this.state.team_name = ''
        this.state.description = ''
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;

        this.setState(prevState => ({
            ...prevState,
          [name]: value,
        }));
    }

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

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({isSaving: true})

        const formData = {
            team_name: this.state.team_name,
            description: this.state.description,
        };
    
        try {
            // Send POST request to API endpoint
            const response = await axios.post('/institution/institution-teams', formData);
    
            this.fetchInstitutionTeams();
            this.handleClear(); 
            this.toggleCreateModal();
    
            toast.success(response.data.message, {});
            this.setState({isSaving: false})
        } catch (error) {
            // Show error toast notification in case of an error
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };
    
    render() {
        const { institutionTeams, currentPage, lastPage, createModal, isSaving  } = this.state;
        return ( 
            <>
            <div className="container mx-auto">
                <h1 className="text-xl font-bold mb-4">Teams or Departments</h1>

                {/* Filter Section */}
                <div className="mb-4 flex justify-between">
                    
                    <div className="relative w-full lg:w-2/3">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="search" onChange={this.handleFilterChange} name='search' id="default-search" className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by team name or description" required />
                    </div>
                </div>

                <div className="bg-white rounded-lg py-6 px-8">
                    <div className="">
                            {institutionTeams.length > 0 ? (
                                <div className='grid grid-cols-1 xl:grid-cols-2 gap-5 mt-2'>
                                    {institutionTeams.map((request) => (
                                        <NavLink to={`/institution-teams/${request.id}`} key={request.id} className="relative bg-white shadow-md shadow-gray-300 hover:cursor-pointer hover:shadow-gray-500 group">
                                            <div className="flex items-center space-x-4 absolute left-0 bg-gradient-to-tl from-purple-700 via-purple-800 to-purple-900 rounded-r-full text-white px-2 py-2 shadow-md shadow-gray-500">
                                                <p className='text-2xl font-semibold'>{request.index}</p>
                                                <div className="flex items-center justify-center w-10 h-10 bg-white text-purple-800 rounded-full shadow-md shadow-gray-500">
                                                    <FaUsers size={20}/>
                                                </div>
                                                
                                            </div>
                                            <div className="ml-28 p-3">
                                                <p className='text-purple-800 font-semibold'>{request.team_name}</p>
                                                <p className='text-sm font-medium'>{request.description}</p>
                                                <div className="flex space-x-4 text-sm mt-2 italic text-gray-500">
                                                    <p className='w-2/3'>Click to add members for this team or department</p>
                                                    <IoArrowForwardCircle size={26} className='self-end group-hover:text-purple-800'/>
                                                </div>
                                            </div>
                                            
                                        </NavLink>
                                    ))}
                                </div>
                            ):(
                                <div className="flex flex-col justify-center items-center">
                                    <img
                                        src="/images/nodata.png"
                                        alt="No data available"
                                        className="w-1/4 h-auto object-contain"
                                    />
                                    <p className="text-gray-500 text-sm font-medium -mt-5 xl:-mt-12">No teams or department found</p>
                                </div>
                            )}
                            
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
                        <p>New Team</p>
                    </button>
                </div>
                {createModal && (
                    <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
                        <form onSubmit={this.handleSubmit} className="w-1/2 lg:w-1/3 xl:w-[28%] h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
                            style={{ right: 0, position: 'absolute', transform: createModal ? 'translateX(0)' : 'translateX(100%)' }}
                        >
                            <div className="flex justify-between items-center font-medium border-b-2 p-4">
                                <h2 className="text-lg">Add New Team or Department</h2>
                                <button
                                    onClick={this.toggleCreateModal}
                                    className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md"
                                >
                                    <MdClose size={20} className="text-red-600" />
                                </button>
                            </div>
                    
                            <div className="flex flex-col space-y-10 p-6 overflow-y-auto h-[calc(100%-4rem)]"> 
                                <Textbox
                                    label="Team or Department Name"
                                    name="team_name"
                                    value={this.state.team_name}
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

            </div>
            </>
         );
    }
}
 
export default withRouter(InstitutionTeams);
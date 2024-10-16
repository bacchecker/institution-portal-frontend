import React, { Component } from 'react';
import { BsSend } from 'react-icons/bs';
import { FaPhoneVolume } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';
import axios from '../../axiosConfig';
import Textarea from '../../components/Textarea';
import Textbox from '../../components/Textbox';
import Select from '../../components/Select';
import Spinner from '../../components/Spinner';
import {toast} from 'react-hot-toast';
import { FaUser } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';

class AccountInactive extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        showModal: false,
        title: '',
        description: '',
        type: '',
        category: '',
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
        institutionStatus: null
     }

    componentDidMount() {
        this.fetchInstitution();
    }

    fetchInstitution = async () => {
    try {
        const response = await axios.get("/institution/institution-data");
        const institutionData = response.data.institutionData;

        const { status } = institutionData;
        this.setState({
            institutionStatus: status !== 'inactive',  // Set to true if status is not 'inactive'
        });
    } catch (error) {
        toast.error(error.response.data.message);
    }
    };
    
    toggleModal = () => {
        this.setState(prevState => ({
          showModal: !prevState.showModal
        }));
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    }

    handleSubmit = async(event) => {
        event.preventDefault();
        const { title, description, type, category } = this.state;
        this.setState({isSaving: true})
        const formData = { title, description, type, category };
        try {
            const response = await axios.post('/tickets/store', formData);  
            this.toggleModal();
    
            toast.success(response.data.message, {});
            this.setState({isSaving: false})
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
            this.setState({isSaving: false})
        }
    }

    render() { 
        const { type, category, description, title, typeData, categoryData, isSaving, institutionStatus } = this.state
        return ( 
            <>
            <div className="w-full relative flex flex-col items-center justify-center bg-white rounded-md min-h-dvh">
                {institutionStatus == null ? (
                    
                    
                <div role="status">
                    <svg aria-hidden="true" className="w-24 h-24 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>


                ): institutionStatus === true ? (
                    <div className="flex flex-col justify-center items-center">
                        <div className="">
                            <img src="/images/confetti2.gif" alt="account active gif" className="w-auto h-44"/>
                        </div>
                        <div className="">
                            <div className="text-center my-2">
                                <p className="text-xl font-semibold text-green-800">Your institution profile is has been activated</p>
                            </div>
                            <div className="w-full lg:w-[500px] px-2">
                                <p className="text-justify text-gray-700 text-base">
                                    You can now proceed to set up your institution account and access all available features. We recommend completing the setup to take full advantage of our services.
                                    If you have any questions or need assistance during the setup process, please feel free to reach out to our support team. We’re here to help! Click on the button below to proceed with setting up your account
                                </p>
                            </div>
                        </div>
                        
                        <div className="my-4 flex items-center justify-center">
                            <NavLink to={`/account-profile`} className='flex items-center w-44 space-x-2 bg-green-700 hover:bg-green-600 text-white px-4 py-1.5 rounded-md'><FaUser /> <p>Setup Account</p></NavLink>
                        </div>
                        
                    </div> 
                ):(
                <div className="flex flex-col items-center justify-center">
                    <div className=" ">
                        <img src="/images/review.png" alt="account review img" className="w-52 h-52"/>
                    </div>
                    <div className="text-center my-2">
                        <p className="text-xl font-semibold text-gray-900">Your institution profile is under review</p>
                    </div>
                    <div className="w-full lg:w-[500px] px-2">
                        <p className="text-justify text-gray-700 text-sm">Your institution's account is currently under review. This should be over between 24-48 hours, during this period, certain features may be restricted. We’ll notify you once the review process is complete. If you have any questions, please reach out to our support team.</p>
                    </div>
                    <div className="my-4 flex items-center justify-center">
                        <button onClick={this.toggleModal} className='flex items-center w-40 space-x-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md'><BsSend /> <p>Issue Ticket</p></button>
                    </div>
                    <div className="flex space-x-6 text-gray-600 text-sm">
                        <div className="flex items-center space-x-1">
                        <FaPhoneVolume />
                        <p>0(303)856478996</p>
                        </div>
                        <div className="flex items-center space-x-2">
                        <IoIosMail size={18}/>
                        <a target='blank' href="https://mail.google.com/mail/?view=cm&fs=1&to=info@bacchecker.online">info@bacchecker.online</a>
                        </div>
                    </div>
                </div> 
                )}
            </div>
            
            
            {this.state.showModal && (
                <div className="fixed inset-0 flex items-center backdrop-blur-sm justify-center bg-black bg-opacity-50 z-50 px-4">
                    <div className="bg-white rounded-lg shadow-md w-full lg:w-2/3 xl:w-1/2">
                        <h2 className="text-xl font-semibold mb-4 px-4 py-3 shadow-lg uppercase">Issue a Ticket</h2>

                        {/* Ticket form */}
                        <form onSubmit={this.handleSubmit} className='p-6'>
                            <div className="flex flex-col space-y-8 mb-4">
                            <Textbox
                                label="Title"
                                name="title"
                                value={title}
                                onChange={this.handleInputChange}
                            />
                            
                            <Textarea
                                label="Describe your issue..."
                                name="description"
                                value={description}
                                onChange={this.handleInputChange}
                            />
                            <Select
                                label="Type"
                                name="type"
                                value={type}
                                itemNameKey="name"
                                menuItems={typeData}
                                onChange={this.handleInputChange}
                            />
                            <Select
                                label="Category"
                                name="category"
                                value={category}
                                itemNameKey="name"
                                menuItems={categoryData}
                                onChange={this.handleInputChange}
                            />
                            </div>

                            <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                                onClick={this.toggleModal}
                            >
                                Cancel
                            </button>  
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-700"
                            >
                                {isSaving ? (
                                    <>
                                        <Spinner size="w-4 h-4 mr-2"/>
                                        Sending...
                                    </>
                                ) : (
                                    'Send'
                                )}
                            </button>
                            
                            </div>
                        </form>
                        </div>
                </div>
            )}
            </>
         );
    }
}
 
export default AccountInactive;
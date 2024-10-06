import React, { Component } from 'react';
import withRouter from '../components/withRouter';
import {toast} from 'react-hot-toast';
import axios from '../axiosConfig';
import { GiMoneyStack } from 'react-icons/gi';
import { MdClose, MdDelete, MdEdit, MdPrint } from 'react-icons/md';
import { IoWarning } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import Textbox from '../components/Textbox';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Spinner from '../components/Spinner';
import { FaMoneyBill1Wave } from 'react-icons/fa6';

class ValidationQuestions extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        validation_questions: [],
        document_type_details: {},
        loadingState: false,
        createModal: false,
        baseFeeModal: false,
        question: '',
        index: '',
        institution_document_type_id: '',
        isVisible: true,
        isSaving: false,
     }

    componentDidMount(){
        this.fetchValidationQuestions()
    }

    fetchValidationQuestions = async () => {
        const { documentId } = this.props.params;
        
        this.setState({ 
            loadingState: true,
            institution_document_type_id: documentId,
        });
    
        try {
            const response = await axios.get(`/institution/validation-questions/${documentId}`);
            const questionsData = response.data;
    
            this.setState({
                validation_questions: questionsData.questions,
                document_type_details: questionsData.documentType,
                institution_document_type_id: documentId,
                loadingState: false,
            });
        } catch (error) {
            toast.error(error.message);
            this.setState({ loadingState: false });
        }
    }
    
    handleEditClick(request) {
        this.setState({ questionToEdit: request, editingValidationQuestion: request.id });
    }

    handleDeleteClick(request) {
        this.setState({ questionToDelete: request, deleteValidationQuestion: request.id });
    }


    handleCloseDiv = () => {
        this.setState({ isVisible: false });
      };
    
    toggleCreateModal = () => {
        this.setState({ createModal: !this.state.createModal });
    }

    toggleBaseFeeModal = () => {
        this.setState({ baseFeeModal: !this.state.baseFeeModal });
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;

        this.setState(prevState => ({
            ...prevState,
          [name]: value,
        }));
    }

    handleClear = () =>{
        this.state.question = ''
        this.state.index = ''
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({isSaving: true})
        const { institution_document_type_id, question, index } = this.state;
      
        try {
          const response = await axios.post('/institution/validation-questions', {
            institution_document_type_id,
            question,                   
            index              
          });
      
          if (response.status === 201) {
            toast.success(response.data.message);
          }
        this.setState({isSaving: false})
        this.fetchValidationQuestions();
        this.handleClear(); 
        this.toggleCreateModal();

        } catch (error) {
         
          toast.error(error.response.data.message);
        }
    };
      

    render() { 
        const {document_type_details, createModal, baseFeeModal, isSaving, validation_questions, editingValidationQuestion, questionToEdit, deleteValidationQuestion, questionToDelete} = this.state
        return ( 
            <>
                <div className="bg-white py-4">
                    <div className="w-full flex flex-col justify-center items-center border-b pb-2">
                        <h1 className='font-bold text-deepBlue text-xl mb-1'>{document_type_details.name}</h1>
                        <div className="flex space-x-4 lg:space-x-6">
                            <div className="flex space-x-2 text-sm items-center">
                                <FaMoneyBill1Wave size={18} />
                                <p className='font-medium'>Document Request Fee</p>
                                <p>{document_type_details.base_fee ??'0.00'}</p>
                            </div>
                            <div className="flex space-x-2 text-sm items-center bg-blue-700 text-white rounded-lg px-3 py-1 cursor-pointer" onClick={this.toggleBaseFeeModal}>
                                <p>Edit</p> <MdEdit />
                            </div>
                        </div>
                    </div>
                    {this.state.isVisible &&(
                        <div className="px-2 xl:px-0">
                            <div className="w-full xl:w-4/5 bg-red-100 px-4 py-3 mt-2 mx-auto rounded-lg">
                                <div className="flex justify-between border-b border-white pb-2 items-center">
                                    <div className="flex space-x-2">
                                        <IoWarning size={24} className='text-yellow-500'/>
                                        <p className='font-semibold'>Setup Document Validation Process</p>
                                    </div>
                                    <div className="flex items-center justify-center w-8 h-8 rounded bg-red-200 text-red-600 cursor-pointer hover:bg-red-300" onClick={this.handleCloseDiv}>
                                        <MdClose/>
                                    </div>
                                    
                                </div>
                                
                                <div className="text-base mt-1">
                                    <p>To ensure efficient document review and validation, please define the necessary steps or questions for the process. 
                                    </p>
                                    <ul className='px-4 mt-1'>
                                        <li className='list-disc'>Each question represents a step in the validation process.</li>
                                        <li className='list-disc'>Ensure that all required steps are covered to maintain the integrity of the document review.</li>
                                        <li className='list-disc'>You can add as many validation questions as needed to complete the process.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                    )}
                    <div className="mt-6 px-6">
                        {validation_questions.length > 0 ? (
                            <div className="">
                                {validation_questions.map((request) => (
                                    <div key={request.id} className="flex space-x-4 group bg-gray-100 items-center p-2 rounded-md mb-2 cursor-pointer">
                                        <div className={`flex items-center justify-center ${request.status == 'active' ? 'bg-green-600' : 'bg-gray-400'}  text-white w-6 h-6 rounded-full font-bold`}>{request.index}</div>
                                        <div className={`flex-1 ${request.status == 'active' ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {request.question}
                                        </div>
                                        <div className="hidden group-hover:flex space-x-2">
                                            <MdEdit size={28} className='text-green-700 bg-green-100 rounded-md p-1 border' onClick={() => this.handleEditClick(request)}/>
                                            <MdDelete size={28} className='text-red-700 bg-red-100 rounded-md p-1 border' onClick={() => this.handleDeleteClick(request)}/>
                                        
                                            {editingValidationQuestion === request.id && (
                        
                                                <EditValidationQuestion
                                                    fetchValidationQuestions={this.fetchValidationQuestions}
                                                    validationQuestion={questionToEdit}
                                                    onClose={() => this.setState({ editingValidationQuestion: null, questionToEdit: null})}
                                                />
                                            )}
                                            {deleteValidationQuestion === request.id && (
                                            
                                                <DeleteValidationQuestion
                                                    fetchValidationQuestions={this.fetchValidationQuestions}
                                                    validationQuestion={questionToDelete}
                                                    onClose={() => this.setState({ deleteValidationQuestion: null, questionToDelete: null})}
                                                />
                                            )}
                                            {deleteValidationQuestion === request.id && (
                                            
                                                <DeleteValidationQuestion
                                                    fetchValidationQuestions={this.fetchValidationQuestions}
                                                    validationQuestion={questionToDelete}
                                                    onClose={() => this.setState({ deleteValidationQuestion: null, questionToDelete: null})}
                                                />
                                            )}
                                            
                                        </div>
                                    </div>
                                ))} 
                            </div>
                        ):(
                            <div className="flex flex-col justify-center items-center h-full">
                                <img src="/images/nodata.png" alt="No data available" className="w-1/4 h-auto" />
                                <p className='text-gray-500 text-sm -mt-10 font-medium'>No validation questions</p>
                            </div>
                        )}
                    
                        
                    </div>
                    <button
                        className='absolute right-6 xl:right-12 bottom-10 flex space-x-2 bg-deepBlue text-white px-4 rounded-full py-1.5 text-sm font-light shadow-md shadow-gray-500'
                        onClick={this.toggleCreateModal}
                    >
                        <FaPlus className='self-center'/>
                        <p>New Question</p>
                    </button>
                </div>
                {createModal && (
                    <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
                        <form onSubmit={this.handleSubmit} className="w-1/2 lg:w-1/3 h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
                            style={{ right: 0, position: 'absolute', transform: createModal ? 'translateX(0)' : 'translateX(100%)' }}
                        >
                            <div className="flex justify-between items-center font-medium border-b-2 p-4">
                                <h2 className="text-lg">Add New Question</h2>
                                <button
                                    onClick={this.toggleCreateModal}
                                    className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md"
                                >
                                    <MdClose size={20} className="text-red-600" />
                                </button>
                            </div>
                    
                            <div className="relative flex flex-col space-y-4 p-6 xl:p-8 overflow-y-auto h-[calc(100%-4rem)]"> 
                                <Textarea
                                    label="Question"
                                    name="question"
                                    value={this.state.question}
                                    onChange={this.handleInputChange}
                                />
                                <Textbox
                                    label="Index"
                                    name="index"
                                    type="number"
                                    value={this.state.index}
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
                    
                            {/* Fixed button section */}
                            
                        </form>
                    </div>
                
                
                
                )}
                {baseFeeModal && (
                    <UpdateBaseFee 
                        documentType = {document_type_details} 
                        onClose={this.toggleBaseFeeModal}
                        fetchValidationQuestions={this.fetchValidationQuestions}
                    />
                )}
            </>
         );
    }
}
class EditValidationQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
        documentId: props.validationQuestion.id,
        question: props.validationQuestion.question,
        index: props.validationQuestion.index,
        status: props.validationQuestion.status,
        institution_document_type_id: props.validationQuestion.institution_document_type_id,
        isUpdating: false,
        statusData: [
            { id: 'active', name: 'Active' },
            { id: 'inactive', name: 'Inactive' },
        ],
        };
        
    }
    handleInputChange = e => {
        const { name, value } = e.target;
        this.setState(prevState => ({
        ...prevState,
        [name]: value
        }));
    };
    
    handleEditQuestion = async(e, documentId) => {
        e.preventDefault()
        this.setState({isUpdating: true})
        const formData = {
            question: this.state.question,
            index: this.state.index,
            status: this.state.status,
            institution_document_type_id: this.state.institution_document_type_id,
        };
        
        try {
            const response = await axios.post(`/institution/update-questions/${documentId}`, formData);
            this.props.fetchValidationQuestions();
            this.props.onClose()
            toast.success(response.data.message, {});
            this.setState({isUpdating: false})

        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message, {});
                this.setState({isUpdating: false})
            } else {
                toast.error('An error occurred while updating the question.');
            }
        }
    }

    render() {
        const { onClose } = this.props;
        const { question, index, status, documentId, isUpdating } = this.state;
        return (
        <>
        <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
                <form onSubmit={(e) => this.handleEditQuestion(e, documentId)} className="w-1/2 lg:w-1/3 h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
                    style={{ right: 0, position: 'absolute', transform: 'translateX(0)' }}
                >
                    <div className="flex justify-between items-center font-medium border-b-2 p-4">
                        <h2 className="text-lg">Edit Question</h2>
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md"
                        >
                            <MdClose size={20} className="text-red-600" />
                        </button>
                    </div>
            
                    <div className="relative flex flex-col space-y-4 p-6 xl:p-8 overflow-y-auto h-[calc(100%-4rem)]"> 
                        <Textarea
                            label="Question"
                            name="question"
                            value={question}
                            onChange={this.handleInputChange}
                        />
                        <Textbox
                            label="Index"
                            name="index"
                            value={index}
                            onChange={this.handleInputChange}
                        />
                        <Select
                            label="Status"
                            name="status"
                            value={status}
                            itemNameKey="name"
                            menuItems={this.state.statusData}
                            onChange={this.handleInputChange}
                        />

                        <div className="w-full absolute bottom-4 right-0 flex space-x-4 px-4">
                            <button
                                onClick={onClose}
                                type="button"
                                className="text-xs w-1/2 text-gray-600 border px-4 py-1.5 rounded-full"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className={`w-1/2 flex items-center justify-center rounded-full ${
                                    isUpdating ? 'bg-gray-400 text-gray-700' : 'bg-buttonLog text-white'
                                } py-1.5 text-xs ${isUpdating ? 'cursor-not-allowed' : ''}`}
                            >
                                {isUpdating ? (
                                    <>
                                        <Spinner size="w-4 h-4 mr-2"/>
                                        Updating...
                                    </>
                                ) : (
                                    'Update'
                                )}
                            </button>
                        </div>  
                    </div>
                </form>
        </div>
        
           
        
        </>
        
        );
    }
}
class DeleteValidationQuestion extends Component {
constructor(props) {
    super(props);
    this.state = {
        documentId: props.validationQuestion.id,
        isDeleting: false
    };
    
}


handleDeleteQuestion = async(e, documentId) => {
    e.preventDefault()
    this.setState({isDeleting: true})
    try {
        const response = await axios.delete(`/institution/delete-question/${documentId}`);
            this.props.fetchValidationQuestions();
            this.props.onClose()
            toast.success(response.data.message, {});
            this.setState({isDeleting: false})

    } catch (error) {
        if (error.response && error.response.data.message) {
            toast.error(error.response.data.message);
            this.setState({isDeleting: false})
        } else {
            toast.error('An error occurred while deleting the election.');
            this.setState({isDeleting: false})
        }
    }
}

render() {
    const { onClose } = this.props;
    const { documentId, isDeleting } = this.state;
    return (
    <>
        <div className="fixed z-50 backdrop-blur-sm bg-black inset-0 overflow-y-auto bg-opacity-60">
            <form onSubmit={(e) => this.handleDeleteQuestion(e, documentId)} className="flex items-center justify-center min-h-screen">
                <div className="w-full lg:w-1/2 h-44 relative bg-white shadow-lg">
                    <div className="flex justify-between bg-red-600 text-white">
                        <h2 className="text-xl font-medium py-2 px-4 uppercase">Delete Question</h2>
                        <button onClick={onClose} className="px-4 hover:text-gray-200">
                        <MdClose size={24}/>
                        </button>
                    </div>

                    <div className="w-full text-left font-medium text-sm my-6 mx-4">Are you sure you want to delete this question? </div>

                                                    
                    <div className="flex absolute bottom-4 right-4 justify-end gap-x-2">
                        <button onClick={onClose} type="button" className="text-sm text-gray-400 border px-4 py-2 uppercase">Cancel</button>
                        <button type="submit" 
                            disabled={isDeleting}
                            className={`w-full flex items-center justify-center  ${isDeleting ? 'bg-gray-400 text-gray-700' : 'bg-red-600 text-white'}  py-2 px-4 text-sm uppercase ${isDeleting ? 'cursor-not-allowed' : ''}`}>
                            {isDeleting ? (
                                <>
                                    <Spinner size="w-5 h-5 mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    
    </>
    
    );
}
}
class UpdateBaseFee extends Component {
    constructor(props) {
        super(props);
        this.state = {
        documentId: props.documentType.id,
        base_fee: props.documentType.base_fee,
        isUpdating: false,
        };
        
    }
    handleInputChange = e => {
        const { name, value } = e.target;
        this.setState(prevState => ({
        ...prevState,
        [name]: value
        }));
    };
    
    handleUpdateBaseFee = async (e, id) => {
        e.preventDefault()
        const { base_fee } = this.state;
    
        if (!base_fee || isNaN(base_fee) || parseFloat(base_fee) < 0) {
          toast.error("Please enter a valid base fee");
          return;
        }
    
        this.setState({ isUpdating: true });
    
        try {
         
          const response = await axios.post(`/institution/update-base-fee/${id}`, {
            base_fee: base_fee,
          });
    
          toast.success(response.data.message);
          this.props.fetchValidationQuestions()
          this.props.onClose()
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred");
        } finally {
          this.setState({ isUpdating: false });
        }
    };

    render() {
        const { onClose } = this.props;
        const { base_fee, isUpdating, documentId } = this.state;
        return (
        <>
        <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
                <form onSubmit={(e) => this.handleUpdateBaseFee(e, documentId)} className="w-1/2 lg:w-1/3 h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
                    style={{ right: 0, position: 'absolute', transform: 'translateX(0)' }}
                >
                    <div className="flex justify-between items-center font-medium border-b-2 p-4">
                        <h2 className="text-lg">Edit Document Requisition Fee</h2>
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md"
                        >
                            <MdClose size={20} className="text-red-600" />
                        </button>
                    </div>
            
                    <div className="relative flex flex-col space-y-4 p-6 xl:p-8 overflow-y-auto h-[calc(100%-4rem)]"> 
                       
                        <Textbox
                            label="Document Fee"
                            name="base_fee"
                            value={base_fee}
                            onChange={this.handleInputChange}
                        />
                        <div className="w-full absolute bottom-4 right-0 flex space-x-4 px-4">
                            <button
                                onClick={onClose}
                                type="button"
                                className="text-xs w-1/2 text-gray-600 border px-4 py-1.5 rounded-full"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className={`w-1/2 flex items-center justify-center rounded-full ${
                                    isUpdating ? 'bg-gray-400 text-gray-700' : 'bg-buttonLog text-white'
                                } py-1.5 text-xs ${isUpdating ? 'cursor-not-allowed' : ''}`}
                            >
                                {isUpdating ? (
                                    <>
                                        <Spinner size="w-4 h-4 mr-2"/>
                                        Updating...
                                    </>
                                ) : (
                                    'Update'
                                )}
                            </button>
                        </div>  
                    </div>
                </form>
        </div>
        
           
        
        </>
        
        );
    }
}
export default withRouter(ValidationQuestions);
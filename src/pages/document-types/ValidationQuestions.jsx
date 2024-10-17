import React, { Component } from 'react';
import withRouter from '../../components/withRouter';
import {toast} from 'react-hot-toast';
import axios from '../../axiosConfig';
import { MdClose, MdDelete, MdEdit, MdSave } from 'react-icons/md';
import { IoDocumentText, IoWarning } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import Textbox from '../../components/Textbox';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import Spinner from '../../components/Spinner';
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
        soft_copy: false,
        hard_copy: false,
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
                soft_copy: questionsData.documentType.soft_copy,
                hard_copy: questionsData.documentType.hard_copy,
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

    handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        this.setState({
          [name]: checked,
        });
    };

    handleDocumentFormatSubmit = (e) => {
        e.preventDefault();
        this.setState({isSaving: true})
        const { soft_copy, hard_copy, institution_document_type_id } = this.state;

        const payload = {
            soft_copy: soft_copy ? 1 : 0,
            hard_copy: hard_copy ? 1 : 0,
          };
    
        axios.post(`/institution/update-document-format/${institution_document_type_id}`, payload)
          .then((response) => {
            toast.success(response.data.message);
            this.setState({isSaving: false})
          })
          .catch((error) => {
            toast.error(error.response.data.message);
            this.setState({isSaving: false})
          });
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
        const {document_type_details, createModal, baseFeeModal, isSaving, validation_questions, editingValidationQuestion, questionToEdit, deleteValidationQuestion, questionToDelete, soft_copy, hard_copy} = this.state
        return ( 
            <>
                <div className="bg-white py-4 rounded-md min-h-screen">
                    <div className="w-full flex flex-col justify-center border-b items-center pb-2">
                        <h1 className='font-bold text-deepBlue uppercase text-xl mb-1'>{document_type_details.name}</h1>
                        
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 lg:gap-2">
                        <div className="min-h-screen border-r">
                            <h2 className="bg-blue-700 text-white pl-6 pr-4 py-2">Document Billings</h2>
                            <div className="my-4">
                                <div className="flex flex-col space-y-4 px-3">
                                    <div className="grid grid-cols-3 text-sm items-center">
                                        <p className='font-semibold col-span-2'>Validation Fee</p>
                                        <p>GH₵{document_type_details.validation_fee ??'0.00'}</p>
                                    </div>
                                    <div className="grid grid-cols-3 text-sm items-center">
                                        <p className='font-semibold col-span-2'>Verification Fee</p>
                                        <p>GH₵{document_type_details.verification_fee ??'0.00'}</p>
                                    </div>
                                    <div className="grid grid-cols-3 text-sm items-center">
                                        <p className='font-semibold col-span-2'>Requisition Fee</p>
                                        <p>GH₵{document_type_details.base_fee ??'0.00'}</p>
                                    </div>
                                    <div className="grid grid-cols-3 text-sm items-center">
                                        <p className='font-semibold col-span-2'>Printing Fee</p>
                                        <p>GH₵{document_type_details.printing_fee ??'0.00'}</p>
                                    </div>
                                    <div className="w-1/2 self-end flex space-x-2 text-sm items-center justify-center mt-8 border border-blue-700 text-blue-700 hover:bg-blue-600 hover:text-white rounded-md px-3 h-8 cursor-pointer" onClick={this.toggleBaseFeeModal}>
                                        <p>Edit Fees</p> <MdEdit />
                                    </div>
                                </div>
                                
                                <h2 className="bg-blue-700 text-white pl-6 pr-4 py-2 mt-4">Document Formats</h2>
                                <form onSubmit={this.handleDocumentFormatSubmit} className="border-b pb-4">
                                    <div className="flex space-x-5 mt-6 px-4">
                                        <div className="flex items-center mb-4">
                                            <input
                                                name="soft_copy"
                                                type="checkbox"
                                                checked={soft_copy} 
                                                onChange={this.handleCheckboxChange}
                                                className="w-5 h-5 text-blue-700 bg-gray-100 border-gray-300 cursor-pointer rounded-lg"
                                            />
                                            <label className="ms-2 text-sm font-medium text-gray-900">Soft Copy</label>
                                        </div>
                                        <div className="flex items-center mb-4">
                                            <input
                                                name="hard_copy"
                                                type="checkbox"
                                                checked={hard_copy}
                                                onChange={this.handleCheckboxChange}
                                                className="w-5 h-5 text-blue-700 bg-gray-100 border-gray-300 cursor-pointer rounded-lg"
                                            />
                                            <label className="ms-2 text-sm font-medium text-gray-900">Hard Copy</label>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pr-4">
                                        <button 
                                            type='submit'
                                            disabled={isSaving}
                                            className="w-1/2 flex space-x-2 text-sm items-center justify-center mt-8 border border-blue-700 text-blue-700 hover:bg-blue-600 hover:text-white rounded-md px-3 h-8 cursor-pointer"
                                        >
                                        {isSaving ? (
                                            <>
                                                <Spinner size="w-4 h-4 mr-2"/>
                                                Updating...
                                            </>
                                        ) : (
                                             <div className="flex items-center space-x-2"><p>Update</p> <MdSave /></div>
                                        )}
                                           
                                        </button>
                                    </div>
                                    
                                </form>
                                
                                <div className="mt-6 px-4">
                                    <div className="my-2">
                                        <p className='text-sm font-medium text-gray-800 underline'>Validation Fee</p>
                                        <p className='italic text-xs text-gray-700 ml-1'>Fees applicant pay when they request for a document to be validated</p>
                                    </div>
                                    <div className="my-2">
                                        <p className='text-sm font-medium text-gray-800 underline'>Verification Fee</p>
                                        <p className='italic text-xs text-gray-700 ml-1'>Fees institutions pay when they request for a document to be verified for authenticity</p>
                                    </div>
                                    <div className="my-2">
                                        <p className='text-sm font-medium text-gray-800 underline'>Requisition Fee</p>
                                        <p className='italic text-xs text-gray-700 ml-1'>Fees applicant pay when they request for a document</p>
                                    </div>
                                    <div className="my-2">
                                        <p className='text-sm font-medium text-gray-800 underline'>Printing Fee</p>
                                        <p className='italic text-xs text-gray-700 ml-1'>In instances of hard copy format the fee for printing the document</p>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3">
                            {this.state.isVisible &&(
                                <div className="px-2">
                                    <div className="w-full bg-red-100 px-4 py-3 mx-auto rounded-lg">
                                        <div className="flex justify-between border-b border-white pb-2 items-center">
                                            <div className="flex space-x-2">
                                                <IoWarning size={24} className='text-yellow-500'/>
                                                <p className='font-semibold'>Setup Document Verification Process</p>
                                            </div>
                                            {/* <div className="flex items-center justify-center w-8 h-8 rounded bg-red-200 text-red-600 cursor-pointer hover:bg-red-300" onClick={this.handleCloseDiv}>
                                                <MdClose/>
                                            </div> */}
                                            
                                        </div>
                                        
                                        <div className="text-sm mt-1">
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
                            <div className="mt-6 px-4">
                                {validation_questions.length > 0 ? (
                                    <div className="">
                                        {validation_questions.map((request) => (
                                            <div key={request.id} className="flex space-x-4 group bg-gray-100 items-center p-2 rounded-md mb-2 cursor-pointer">
                                                <div className={`flex items-center justify-center ${request.status == 'active' ? 'bg-green-600' : 'bg-gray-400'}  text-white w-6 h-6 rounded-full font-bold`}>{request.index}</div>
                                                <div className={`flex-1 ${request.status == 'active' ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {request.question}
                                                </div>
                                                <div className="flex ">
                                                    <MdEdit size={28} className='text-green-700 bg-green-100 rounded-md p-1 border mr-2' onClick={() => this.handleEditClick(request)}/>
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
                    </div>
                    
                    
                </div>
                {createModal && (
                    <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
                        <form onSubmit={this.handleSubmit} className="w-1/2 lg:w-1/3 xl:w-[28%] h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
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
                    
                            <div className="relative flex flex-col space-y-7 px-4 py-6 overflow-y-auto h-[calc(100%-4rem)]"> 
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
                                    caption="This number decides the order of your verification questions"
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
                    
                            
                        </form>
                    </div>
                
                )}
                {baseFeeModal && (
                    <UpdateDocumentFee 
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
                <form onSubmit={(e) => this.handleEditQuestion(e, documentId)} className="w-1/2 lg:w-1/3 xl:w-[28%] h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
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
                            caption="This number decides the order of your verification questions"
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
class UpdateDocumentFee extends Component {
    constructor(props) {
        super(props);
        this.state = {
        documentId: props.documentType.id,
        validation_fee: props.documentType.validation_fee,
        verification_fee: props.documentType.verification_fee,
        base_fee: props.documentType.base_fee,
        printing_fee: props.documentType.printing_fee,
        isUpdating: false,
        confirmPasswordModal: false,
        password: ''
        };
        
    }
    handleInputChange = e => {
        const { name, value } = e.target;
        this.setState(prevState => ({
        ...prevState,
        [name]: value
        }));
    };

    togglePasswordModal = () => {
        this.setState({ confirmPasswordModal: !this.state.confirmPasswordModal });
    }
    
    handleUpdateBaseFee = async (e, id) => {
        e.preventDefault()
        const { validation_fee, verification_fee, base_fee, printing_fee, password } = this.state;
    
        if (!validation_fee || isNaN(validation_fee) || parseFloat(validation_fee) < 0) {
          toast.error("Please enter a valid validation fee");
          return;
        }
    
        this.setState({ isUpdating: true });        
    
        try {
         
          const response = await axios.post(`/institution/update-base-fee/${id}`, {
            validation_fee: validation_fee,
            verification_fee: verification_fee,
            base_fee: base_fee,
            printing_fee: printing_fee,
            password: password,
          });
    
          toast.success(response.data.message);
          this.props.fetchValidationQuestions()
          this.props.onClose()
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred");
          this.setState({ isUpdating: false });
        } finally {
          this.setState({ isUpdating: false });
        }
    };

    render() {
        const { onClose } = this.props;
        const { validation_fee, verification_fee, base_fee, printing_fee, isUpdating, documentId, confirmPasswordModal } = this.state;
        return (
        <>
        <div className="fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-end">
                <div className="w-1/2 lg:w-1/3 xl:w-[28%] h-full bg-white shadow-lg transition-transform duration-700 ease-in-out transform"
                    style={{ right: 0, position: 'absolute', transform: 'translateX(0)' }}
                >
                    <div className="flex justify-between items-center font-medium border-b-2 p-4 mb-2">
                        <h2 className="text-lg">Edit Document Requisition Fee</h2>
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md"
                        >
                            <MdClose size={20} className="text-red-600" />
                        </button>
                    </div>
            
                    <div className="relative flex flex-col space-y-8 px-4 py-6 overflow-y-auto h-[calc(100%-4rem)]"> 
                       
                        <Textbox
                            label="Document Validation Fee"
                            name="validation_fee"
                            value={validation_fee}
                            onChange={this.handleInputChange}
                        />
                        <Textbox
                            label="Document Verification Fee"
                            name="verification_fee"
                            value={verification_fee}
                            onChange={this.handleInputChange}
                        />
                        <Textbox
                            label="Document Requisition Fee"
                            name="base_fee"
                            value={base_fee}
                            onChange={this.handleInputChange}
                        />
                        <Textbox
                            label="Printing Fee"
                            name="printing_fee"
                            value={printing_fee}
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
                                type="button" onClick={this.togglePasswordModal}
                                className={`w-1/2 flex items-center justify-center rounded-full bg-buttonLog text-white py-1.5 text-xs `}
                            >
                                Update
                            </button>
                        </div>  
                    </div>
                </div>
        </div>
        {confirmPasswordModal && 
            (<div className="fixed z-50 backdrop-blur-sm bg-black inset-0 overflow-y-auto bg-opacity-60">
                <div className="flex items-center justify-center min-h-screen px-2">
                    <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-44 relative bg-white shadow-lg mx-2">
                        <div className="flex justify-between bg-bChkRed text-white">
                            <h2 className="text-xl font-semibold py-2 px-4">Confirm You Password</h2>
                            <button onClick={onClose} className="px-4 hover:text-gray-200">
                            <MdClose size={24}/>
                            </button>
                        </div>
                        <div className="py-6 px-4">
                            <Textbox
                                label="Password"
                                name="password"
                                type="password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        
                                                        
                        <div className="flex absolute bottom-4 right-4 justify-end gap-x-2">
                            <button onClick={onClose} type="button" className="text-sm text-gray-400 border px-4 py-2 uppercase">Cancel</button>
                            <button type="button" onClick={(e) => this.handleUpdateBaseFee(e, documentId)} 
                                disabled={isUpdating}
                                className={`w-full flex items-center justify-center  ${isUpdating ? 'bg-gray-400 text-gray-700' : 'bg-bChkRed text-white'}  py-2 px-4 text-sm uppercase ${isUpdating ? 'cursor-not-allowed' : ''}`}>
                                {isUpdating ? (
                                    <>
                                        <Spinner size="w-5 h-5 mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    'Confirm'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>)
        }
        
           
        
        </>
        
        );
    }
}
export default withRouter(ValidationQuestions);
import React, { Component } from 'react';
import withRouter from '../components/withRouter';
import {toast} from 'react-hot-toast';
import axios from '../axiosConfig';
import { GiMoneyStack } from 'react-icons/gi';
import { MdPrint } from 'react-icons/md';

class ValidationQuestions extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        validation_questions: [],
        document_type_details: {},
        institution_document_type_id: null,
        loadingState: false,
        createModal: false,
        question: ''
     }

    componentDidMount(){
        this.fetchValidationQuestions()
    }

    fetchValidationQuestions = async () => {
        const { documentId } = this.props.params;
        
        this.setState({ loadingState: true });
    
        try {
            const response = await axios.get(`/institution/validation-questions/${documentId}`);
            const questionsData = response.data;
    
            this.setState({
                validation_questions: questionsData.questions, // Ensure you're using questions from the response
                document_type_details: questionsData.documentType,
                institution_document_type_id: documentId,
                loadingState: false, // Set loading to false once the data is fetched
            });
        } catch (error) {
            // Handle errors and set loading to false
            toast.error(error.message); // Use error.message for a clearer message
            this.setState({ loadingState: false });
        }
    }
    
   
    
    toggleCreateModal = () => {
        this.setState({ createModal: !this.state.createModal });
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
    };

    render() { 
        const {document_type_details} = this.state
        return ( 
            <>
                <div className="bg-white py-4">
                    <div className="w-full flex flex-col justify-center items-center border-b pb-2">
                        <h1 className='font-bold text-purple-800 text-xl mb-1'>{document_type_details.name}</h1>
                        <div className="flex space-x-4 lg:space-x-6">
                            <div className="flex space-x-2 text-sm items-center">
                                <GiMoneyStack />
                                <p className='font-medium'>Base Fee</p>
                                <p>{document_type_details.base_fee}</p>
                            </div>
                            <div className="flex space-x-2 text-sm items-center">
                                <MdPrint />
                                <p className='font-medium'>Printing Fee</p>
                                <p>{document_type_details.printing_fee}</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </>
         );
    }
}
 
export default withRouter(ValidationQuestions);
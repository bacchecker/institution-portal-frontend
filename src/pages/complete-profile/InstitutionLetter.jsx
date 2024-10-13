import React, { Component } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import Handlebars from 'handlebars';
import axios from '../../axiosConfig';
import toast from 'react-hot-toast';
import { IoIosMail } from 'react-icons/io';
import { BsSendCheck } from 'react-icons/bs';
import { FaPhoneVolume } from 'react-icons/fa6';
import Spinner from '../../components/Spinner';

class InstitutionLetter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'approved',
            approved_content: `
                        <p style="margin-left: 75px">​​​​​<br><br><br>{{formData.date_of_letter}}</p><p style="margin-left: 75px">{{formData.recepient_institution}}<br></p><p style="margin-left: 75px">{{formData.recepient_institution_mail}}<br></p><p style="margin-left: 75px">{{formData.recepient_institution_address}}<br></p><p style="margin-left: 75px"><br></p><p style="margin-left: 75px">Dear Sir / Madam,</p><p style="text-align: center;margin-left: 75px"><span style="font-size: 18px"><span style="color: rgb(61, 0, 153)"><u><strong>APPROVAL OF DOCUMENT VERIFICATION AND VALIDATION REQUEST</strong></u></span></span><br></p><p style="margin-left: 75px"><span style="font-size: 16px"><u><strong>​</strong></u></span></p><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">                                We are writing to inform you about the verification process for the document(s) submitted for validation on </span><strong><span style="color: rgb(53, 53, 53)">{{formData.date_of_request}}</span></strong><span style="color: rgb(0, 0, 0)"> in relation to </span><span style="color: rgb(53, 53, 53)"><strong>{{formData.document_owner_name}}</strong>.</span><span style="color: rgb(0, 0, 0)">                                 After a thorough review, we have determined the following regarding the submitted document(s):                            </span></div><p style="margin-left: 75px"><span style="font-size: 16px"><u><strong><br></strong></u></span></p><p style="margin-left: 75px"><span style="font-size: 16px"><span style="color: rgb(34, 34, 34)"><strong>Document Title / Reference: {{formData.document_name}}</strong></span></span></p><p style="margin-left: 75px"><span style="font-size: 14px;color: rgb(34, 34, 34)">{{formData.verification_review_results}}</span></p><p style="margin-left: 75px"><span style="font-size: 16px"><span style="color: rgb(34, 34, 34)"><strong>Summary of Findings</strong></span></span></p><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">                                Based on the responses above, we are pleased to inform you that all document verification questions have returned true. The document(s) submitted have been successfully verified, and no inconsistencies were found.                            </span></div><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">                                If you require any clarification regarding this, please do not hesitate to contact us at&nbsp;                            </span><strong><span style="color: rgb(0, 0, 0)">{{institution_email}}</span></strong></div><div style="margin-left: 75px"><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div style="margin-left: 75px"><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">Sincerely,</span></div><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)"><br></span></div><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">_______________________</span></div><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">{{formData.validator_name}}</span></div>
                    `,
            declined_content: `
                        <p style="margin-left: 75px">​​​​​<br><br><br>{{formData.date_of_letter}}</p><p style="margin-left: 75px">{{formData.recepient_institution}}<br></p><p style="margin-left: 75px">{{formData.recepient_institution_mail}}<br></p><p style="margin-left: 75px">{{formData.recepient_institution_address}}<br></p><p style="margin-left: 75px"><br></p><p style="margin-left: 75px">Dear Sir / Madam,</p><p style="text-align: center;margin-left: 75px"><span style="font-size: 18px"><span style="color: rgb(61, 0, 153)"><u><strong>DECLINE OF DOCUMENT VERIFICATION AND VALIDATION REQUEST</strong></u></span></span><br></p><p style="margin-left: 75px"><span style="font-size: 16px"><u><strong>​</strong></u></span></p><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">                                We are writing to inform you about the verification process for the document(s) submitted for validation on </span><strong><span style="color: rgb(53, 53, 53)">{{formData.date_of_request}}</span></strong><span style="color: rgb(0, 0, 0)"> in relation to&nbsp;</span><span style="color: rgb(53, 53, 53)"><strong>{{formData.document_owner_name}}</strong></span><span style="color: rgb(0, 0, 0)">.                                 After a thorough review, we have determined the following regarding the submitted document(s):                            </span></div><p style="margin-left: 75px"><span style="font-size: 16px"><u><strong><br></strong></u></span></p><p style="margin-left: 75px"><span style="font-size: 16px"><strong>Document Title / Reference: {{formData.document_name}}</strong></span></p><p style="margin-left: 75px"><span style="font-size: 14px">{{formData.verification_review_results}}</span></p><p style="margin-left: 75px"><span style="font-size: 16px"><strong>Summary of Findings</strong></span></p><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">                                Based on the responses above, we have determined that while the majority of the document verification questions returned true, there are some inconsistencies that require further investigation.                            </span></div><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">                                If you require any clarification regarding this, please do not hesitate to contact us at&nbsp;                            </span><strong><span style="color: rgb(0, 0, 0)">{{institution_email}}</span></strong></div><div style="margin-left: 75px"><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div style="margin-left: 75px"><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">Sincerely,</span></div><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)"><br></span></div><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">_______________________</span></div><div style="margin-left: 75px"><span style="color: rgb(0, 0, 0)">{{formData.validator_name}}</span></div>
                    `,
            renderedContent: "",
            logo: "",
            institution_name: "",
            address: "",
            institution_email: "",
            helpline_contact: "",
            mailing_address: "",
            isSaving: false
        };
    }

    switchTab = (tab) => {
        this.setState({ activeTab: tab });
    };

    componentDidMount() {
        this.fetchInstitution();
        this.fetchInstitutionLetters();
    }

    fetchInstitution = async () => {
        try {
            const response = await axios.get('/institution/institution-data');
            const institutionData = response.data.institutionData;
            
            if (institutionData) {
                this.setState({
                    institution_name: institutionData.name,
                    address: institutionData.address,
                    logo: institutionData.logo,
                    institution_email: institutionData.institution_email,
                    helpline_contact: institutionData.helpline_contact,
                    mailing_address: institutionData.mailing_address,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch institution data');
        }
    };

    fetchInstitutionLetters = async () => {
        try {
            const response = await axios.get('/institution/institution-letters');
            const letterContent = response.data.letterContent;
                
            if (letterContent.approved_content != null) {
                this.setState({approved_content: letterContent.approved_content});
            }
    
            if (letterContent.declined_content != null) {
                this.setState({declined_content: letterContent.declined_content})
            }
    
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch institution letters');
        }
    };
    

    handleApprovedContentChange = (approved_content) => {
        this.setState({ approved_content });
    };
    
    handlePreviewApprovedTemplate = () => {
        const { approved_content } = this.state;
               
        this.setState({
            renderedContent: approved_content
        });
    };

    handleDeclinedContentChange = (declined_content) => {
        this.setState({ declined_content });
    };
    
    handlePreviewDeclinedTemplate = () => {
        const { declined_content } = this.state;
        this.setState({
            renderedContent: declined_content
        });
    };

    handleSaveTemplate = async() => {
        this.setState({isSaving: true});

        const formData = {
            approved_content: this.state.approved_content,
            declined_content: this.state.declined_content,
        };

        try {
            const response = await axios.post('/institution/institution-letters', formData);
            toast.success(response.data.message);
            this.setState({isSaving: false});
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
            this.setState({isSaving: false});
        }
    };

    render() {
        const { institution_name, institution_email, address, logo, mailing_address, helpline_contact, renderedContent, activeTab, isSaving } = this.state;

        let renderedHtml = '';
        if (renderedContent) {
            const template = Handlebars.compile(renderedContent);
            const data = {
                institution_name,
                institution_email,
                address,
                mailing_address,
                helpline_contact,
                formData:{
                    date_of_letter: new Date().toLocaleDateString(),
                    document_owner_name: "Jane Aba Doe",
                    recepient_institution: "XYC Company Ltd",
                    recepient_institution_mail: "P.O.Box, 25KMS",
                    recepient_institution_address: "Bannerman Street, Winneba",
                    document_name: "Sample Document",
                    validator_name: "John Doe",
                    verification_review_results: "<-------------------------------Verification results content----------------------------->",
                    date_of_request: new Date().toLocaleDateString(),
                },
               
            };
            renderedHtml = template(data);
        }

        return (
            <div className="p-2 bg-white">
                {/* Tabs */}
                <div className="flex border-b border-gray-300">
                    <button
                        className={`px-4 py-2 font-semibold focus:outline-none transition-all duration-300 ${
                            activeTab === 'approved'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600'
                        }`}
                        onClick={() => this.switchTab('approved')}
                    >
                        Validation Approved Letter
                    </button>
                    <button
                        className={`ml-4 px-4 py-2 font-semibold focus:outline-none transition-all duration-300 ${
                            activeTab === 'declined'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600'
                        }`}
                        onClick={() => this.switchTab('declined')}
                    >
                        Validation Declined Letter
                    </button>
                </div>

                {/* Tab approved_content */}
                <div
                    className={`mt-4 transition-opacity duration-500 ${
                        activeTab === 'approved' ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {activeTab === 'approved' && (
                        <div>
                            <div className='w-full min-h-screen mb-10'>
                                <h3>Create Letter Template</h3>
                                <SunEditor
                                    height="100%"
                                    setContents={this.state.approved_content}
                                    onChange={this.handleApprovedContentChange}
                                    setOptions={{
                                        buttonList: [
                                            ['undo', 'redo'],
                                            ['font', 'fontSize'],
                                            ['formatBlock'],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            ['fontColor'],
                                            ['align', 'list', 'indent', 'outdent'],
                                            ['table', 'link'],
                                            ['removeFormat'],
                                            ['fullScreen'],
                                        ],
                                        addTagsWhitelist: 'style',
                                    }}
                                />
                                <button className='bg-blue-800 text-white px-6 rounded-md py-1 my-2' onClick={this.handlePreviewApprovedTemplate}>Preview Template</button>
                                
                                <div className="w-full border rounded-md p-6 bg-white">
                                    <div className="w-full flex flex-col items-center justify-center">
                                        <img src={`${import.meta.env.VITE_BASE_URL}/storage/${logo}`} alt="" className='w-20 h-20 mb-2' />
                                        <div className="uppercase font-bold mb-2">{institution_name}</div>
                                        <div className="flex items-center space-x-4 xl:space-x-6 text-sm">
                                            <div className="flex space-x-2">
                                                <IoIosMail size={18} className="text-gray-500" />
                                                <p>{mailing_address}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <BsSendCheck size={16} className="text-gray-500" />
                                                <p>{institution_email}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <FaPhoneVolume size={16} className="text-gray-500" />
                                                <p>{helpline_contact}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: renderedHtml }} className="mt-4 text-gray-700"></div>
                                </div>
                            </div>
                            <button
                                className={`flex items-center bg-green-600 text-white px-6 rounded-md py-1 my-2 
                                    ${isSaving ? 'cursor-not-allowed opacity-50' : ''}`}
                                onClick={this.handleSaveTemplate}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Spinner size="w-5 h-5" />
                                        <span className="ml-2">Saving...</span>
                                    </>
                                ) : (
                                    'Save Template'
                                )}
                            </button>

                        </div>
                    )}
                </div>

                {/* Tab declined_content */}
                <div
                    className={`mt-4 transition-opacity duration-500 ${
                        activeTab === 'declined' ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {activeTab === 'declined' && 
                    (<div>
                        <div className='w-full min-h-screen mb-10'>
                            <h3>Create Letter Template</h3>
                            <SunEditor
                                height="100%"
                                setContents={this.state.declined_content}
                                onChange={this.handleDeclinedContentChange}
                                setOptions={{
                                    buttonList: [
                                        ['undo', 'redo'],
                                        ['font', 'fontSize'],
                                        ['formatBlock'],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        ['fontColor'],
                                        ['align', 'list', 'indent', 'outdent'],
                                        ['table', 'link'],
                                        ['removeFormat'],
                                        ['fullScreen'],
                                    ],
                                    addTagsWhitelist: 'style',
                                }}
                            />
                            <button className='bg-blue-800 text-white px-6 rounded-md py-1 my-2' onClick={this.handlePreviewDeclinedTemplate}>Preview Template</button>
                            
                            <div className="w-full border rounded-md p-6 bg-white">
                                <div className="w-full flex flex-col items-center justify-center">
                                    <img src={`${import.meta.env.VITE_BASE_URL}/storage/${logo}`} alt="" className='w-20 h-20 mb-2' />
                                    <div className="uppercase font-bold mb-2">{institution_name}</div>
                                    <div className="flex items-center space-x-4 xl:space-x-6 text-sm">
                                        <div className="flex space-x-2">
                                            <IoIosMail size={18} className="text-gray-500" />
                                            <p>{mailing_address}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <BsSendCheck size={16} className="text-gray-500" />
                                            <p>{institution_email}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <FaPhoneVolume size={16} className="text-gray-500" />
                                            <p>{helpline_contact}</p>
                                        </div>
                                    </div>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: renderedHtml }} className="mt-4 text-gray-700"></div>
                            </div>
                        </div>
                        <button
                            className={`flex items-center bg-green-600 text-white px-6 rounded-md py-1 my-2 
                                ${isSaving ? 'cursor-not-allowed opacity-50' : ''}`}
                            onClick={this.handleSaveTemplate}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Spinner size="w-5 h-5" />
                                    <span className="ml-2">Saving...</span>
                                </>
                            ) : (
                                'Save Template'
                            )}
                        </button>
                    </div>)
                    }
                </div>
            </div>
        );
    }
}

export default InstitutionLetter;

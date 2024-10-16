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
            activeTab: 'validation_letters',
            activeSubTab: 'validation_approved_letter',
            validation_approved_content: `
                        <p style="margin-left: 25px">​​​​​<br><br><br>{{date_of_letter}}</p><p style="margin-left: 25px">{{recepient_institution}}<br></p><p style="margin-left: 25px">{{recepient_institution_mail}}<br></p><p style="margin-left: 25px">{{recepient_institution_address}}<br></p><p style="margin-left: 25px"><br></p><p style="margin-left: 25px">Dear Sir / Madam,</p><p style="text-align: center;margin-left: 25px"><span style="font-size: 18px"><span style="color: rgb(61, 0, 153)"><u><strong>APPROVAL OF DOCUMENT&nbsp; VALIDATION REQUEST</strong></u></span></span><br></p><p style="margin-left: 25px"><span style="font-size: 16px"><u><strong>​</strong></u></span></p><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">                                We are writing to inform you about the verification process for the document(s) submitted for validation on </span><strong><span style="color: rgb(53, 53, 53)">{{date_of_request}}</span></strong><span style="color: rgb(0, 0, 0)"> in relation to </span><span style="color: rgb(53, 53, 53)"><strong>{{document_owner_name}}</strong>.</span><span style="color: rgb(0, 0, 0)">                                 After a thorough review, we have determined the following regarding the submitted document(s):                            </span></div><p style="margin-left: 25px"><span style="font-size: 16px"><u><strong><br></strong></u></span></p><p style="margin-left: 25px"><span style="font-size: 16px"><span style="color: rgb(34, 34, 34)"><strong>Document Title / Reference: {{document_name}}</strong></span></span></p><p style="margin-left: 25px"><span style="font-size: 14px;color: rgb(34, 34, 34)">{{verification_review_results}}</span></p><p style="margin-left: 25px"><span style="font-size: 16px"><span style="color: rgb(34, 34, 34)"><strong>Summary of Findings</strong></span></span></p><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">                                Based on the responses above, we are pleased to inform you that all document verification questions have returned true. The document(s) submitted have been successfully verified, and no inconsistencies were found.                            </span></div><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">                                If you require any clarification regarding this, please do not hesitate to contact us at&nbsp;                            </span><strong><span style="color: rgb(0, 0, 0)">{{institution_email}}</span></strong></div><div style="margin-left: 25px"><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div style="margin-left: 25px"><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">Sincerely,</span></div><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)"><br></span></div><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">_______________________</span></div><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">{{validator_name}}</span></div>
                    `,
            validation_declined_content: `
                        <p>​​​​​<br><br><br>{{date_of_letter}}</p><p>{{recepient_institution}}<br></p><p>{{recepient_institution_mail}}<br></p><p>{{recepient_institution_address}}<br></p><p><br></p><p>Dear Sir / Madam,</p><p style="text-align: center"><span style="font-size: 18px"><span style="color: rgb(61, 0, 153)"><u><strong>DECLINE OF DOCUMENT VALIDATION REQUEST</strong></u></span></span><br></p><p><span style="font-size: 16px"><u><strong>​</strong></u></span></p><div><span style="color: rgb(0, 0, 0)">We are writing to inform you about the verification process for the document(s) submitted for validation on</span><strong><span style="color: rgb(53, 53, 53)">{{date_of_request}}</span></strong><span style="color: rgb(0, 0, 0)">in relation to&nbsp;</span><span style="color: rgb(53, 53, 53)"><strong>{{document_owner_name}}</strong></span><span style="color: rgb(0, 0, 0)">. After a thorough review, we have determined the following regarding the submitted document(s):</span></div><p><span style="font-size: 16px"><u><strong><br></strong></u></span></p><p><span style="font-size: 16px"><strong>Document Title / Reference: {{document_name}}</strong></span></p><p><span style="font-size: 14px">{{verification_review_results}}</span></p><p><span style="font-size: 16px"><strong>Summary of Findings</strong></span></p><div><span style="color: rgb(0, 0, 0)">Based on the responses above, we have determined that while the majority of the document verification questions returned true, there are some inconsistencies that require further investigation.</span></div><div><span style="color: rgb(0, 0, 0)">If you require any clarification regarding this, please do not hesitate to contact us at&nbsp;</span><strong><span style="color: rgb(0, 0, 0)">{{institution_email}}</span></strong></div><div><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div><span style="color: rgb(0, 0, 0)">Sincerely,</span></div><div><span style="color: rgb(0, 0, 0)"><br></span></div><div><span style="color: rgb(0, 0, 0)">_______________________</span></div><div><span style="color: rgb(0, 0, 0)">{{validator_name}}</span></div>
                    `,
            verification_approved_content: `
                        <p style="margin-left: 25px">​​​​​<br><br><br>{{date_of_letter}}</p><p style="margin-left: 25px">{{recepient_institution}}<br></p><p style="margin-left: 25px">{{recepient_institution_mail}}<br></p><p style="margin-left: 25px">{{recepient_institution_address}}<br></p><p style="margin-left: 25px"><br></p><p style="margin-left: 25px">Dear Sir / Madam,</p><p style="text-align: center;margin-left: 25px"><span style="font-size: 18px"><span style="color: rgb(61, 0, 153)"><u><strong>APPROVAL OF DOCUMENT&nbsp; VALIDATION REQUEST</strong></u></span></span><br></p><p style="margin-left: 25px"><span style="font-size: 16px"><u><strong>​</strong></u></span></p><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">                                We are writing to inform you about the verification process for the document(s) submitted for validation on </span><strong><span style="color: rgb(53, 53, 53)">{{date_of_request}}</span></strong><span style="color: rgb(0, 0, 0)"> in relation to </span><span style="color: rgb(53, 53, 53)"><strong>{{document_owner_name}}</strong>.</span><span style="color: rgb(0, 0, 0)">                                 After a thorough review, we have determined the following regarding the submitted document(s):                            </span></div><p style="margin-left: 25px"><span style="font-size: 16px"><u><strong><br></strong></u></span></p><p style="margin-left: 25px"><span style="font-size: 16px"><span style="color: rgb(34, 34, 34)"><strong>Document Title / Reference: {{document_name}}</strong></span></span></p><p style="margin-left: 25px"><span style="font-size: 14px;color: rgb(34, 34, 34)">{{verification_review_results}}</span></p><p style="margin-left: 25px"><span style="font-size: 16px"><span style="color: rgb(34, 34, 34)"><strong>Summary of Findings</strong></span></span></p><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">                                Based on the responses above, we are pleased to inform you that all document verification questions have returned true. The document(s) submitted have been successfully verified, and no inconsistencies were found.                            </span></div><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">                                If you require any clarification regarding this, please do not hesitate to contact us at&nbsp;                            </span><strong><span style="color: rgb(0, 0, 0)">{{institution_email}}</span></strong></div><div style="margin-left: 25px"><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div style="margin-left: 25px"><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">Sincerely,</span></div><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)"><br></span></div><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">_______________________</span></div><div style="margin-left: 25px"><span style="color: rgb(0, 0, 0)">{{validator_name}}</span></div>
                    `,
            verification_declined_content: `
                        <p>​​​​​<br><br><br>{{date_of_letter}}</p><p>{{recepient_institution}}<br></p><p>{{recepient_institution_mail}}<br></p><p>{{recepient_institution_address}}<br></p><p><br></p><p>Dear Sir / Madam,</p><p style="text-align: center"><span style="font-size: 18px"><span style="color: rgb(61, 0, 153)"><u><strong>DECLINE OF DOCUMENT VALIDATION REQUEST</strong></u></span></span><br></p><p><span style="font-size: 16px"><u><strong>​</strong></u></span></p><div><span style="color: rgb(0, 0, 0)">We are writing to inform you about the verification process for the document(s) submitted for validation on</span><strong><span style="color: rgb(53, 53, 53)">{{date_of_request}}</span></strong><span style="color: rgb(0, 0, 0)">in relation to&nbsp;</span><span style="color: rgb(53, 53, 53)"><strong>{{document_owner_name}}</strong></span><span style="color: rgb(0, 0, 0)">. After a thorough review, we have determined the following regarding the submitted document(s):</span></div><p><span style="font-size: 16px"><u><strong><br></strong></u></span></p><p><span style="font-size: 16px"><strong>Document Title / Reference: {{document_name}}</strong></span></p><p><span style="font-size: 14px">{{verification_review_results}}</span></p><p><span style="font-size: 16px"><strong>Summary of Findings</strong></span></p><div><span style="color: rgb(0, 0, 0)">Based on the responses above, we have determined that while the majority of the document verification questions returned true, there are some inconsistencies that require further investigation.</span></div><div><span style="color: rgb(0, 0, 0)">If you require any clarification regarding this, please do not hesitate to contact us at&nbsp;</span><strong><span style="color: rgb(0, 0, 0)">{{institution_email}}</span></strong></div><div><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div><strong><span style="color: rgb(0, 0, 0)"><br></span></strong></div><div><span style="color: rgb(0, 0, 0)">Sincerely,</span></div><div><span style="color: rgb(0, 0, 0)"><br></span></div><div><span style="color: rgb(0, 0, 0)">_______________________</span></div><div><span style="color: rgb(0, 0, 0)">{{validator_name}}</span></div>
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
        this.validationApprovedEditorRef = null;
        this.validationDeclinedEditorRef = null;
        this.verificationApprovedEditorRef = null;
        this.verificationDeclinedEditorRef = null;
    }

    switchTab = (tab) => {
        this.setState({ activeTab: tab });
    };

    switchSubTab = (subtab) => {
        this.setState({ activeSubTab: subtab });
    };

    componentDidMount() {
        this.fetchInstitution();
        this.fetchInstitutionLetters();
    }

    componentDidUpdate(prevState) {
        // Check if editor reference exists before calling setContents
        if (this.validationApprovedEditorRef && prevState.validation_approved_content !== this.state.validation_approved_content) {
          this.validationApprovedEditorRef.setContents(this.state.validation_approved_content);
        }
        if (this.validationDeclinedEditorRef && prevState.validation_declined_content !== this.state.validation_declined_content) {
          this.validationDeclinedEditorRef.setContents(this.state.validation_declined_content);
        }
        if (this.verificationApprovedEditorRef && prevState.verification_approved_content !== this.state.verification_approved_content) {
          this.verificationApprovedEditorRef.setContents(this.state.verification_approved_content);
        }
        if (this.verificationDeclinedEditorRef && prevState.verification_declined_content !== this.state.verification_declined_content) {
          this.verificationDeclinedEditorRef.setContents(this.state.verification_declined_content);
        }
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
                
            if (letterContent.validation_approved_content != null) {
                this.setState({validation_approved_content: letterContent.validation_approved_content});
            }
    
            if (letterContent.validation_declined_content != null) {
                this.setState({validation_declined_content: letterContent.validation_declined_content})
            }

            if (letterContent.verification_approved_content != null) {
                this.setState({verification_approved_content: letterContent.verification_approved_content});
            }
    
            if (letterContent.verification_declined_content != null) {
                this.setState({verification_declined_content: letterContent.verification_declined_content})
            }
    
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch institution letters');
        }
    };
    

    validationApprovedContentChange = (validation_approved_content) => {
        this.setState({ validation_approved_content });
    };
    
    previewValidationApprovedTemplate = () => {
        const { validation_approved_content } = this.state;                
        this.setState({
            renderedContent: validation_approved_content
        });
    };

    validationDeclinedContentChange = (validation_declined_content) => {
        this.setState({ validation_declined_content });
    };
    
    previewValidationDeclinedTemplate = () => {
        const { validation_declined_content } = this.state;
        
        this.setState({
            renderedContent: validation_declined_content
        });
    };

    verificationApprovedContentChange = (verification_approved_content) => {
        this.setState({ verification_approved_content });
    };
    
    previewVerificationApprovedTemplate = () => {
        const { verification_approved_content } = this.state;
               
        this.setState({
            renderedContent: verification_approved_content
        });
    };

    verificationDeclinedContentChange = (verification_declined_content) => {
        this.setState({ verification_declined_content });
    };
    
    previewVerificationDeclinedTemplate = () => {
        const { verification_declined_content } = this.state;
        this.setState({
            renderedContent: verification_declined_content
        });
    };

    handleSaveTemplate = async() => {
        this.setState({isSaving: true});

        const formData = {
            validation_approved_content: this.state.validation_approved_content,
            verification_approved_content: this.state.verification_approved_content,
            validation_declined_content: this.state.validation_declined_content,
            verification_declined_content: this.state.verification_declined_content,
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
        const { institution_name, institution_email, address, logo, mailing_address, helpline_contact, renderedContent, activeTab, isSaving, activeSubTab } = this.state;

        let renderedHtml = '';
        if (renderedContent) {
            const template = Handlebars.compile(renderedContent);
            const data = {
                /* Institution Details */
                institution_name,
                institution_email,
                address,
                mailing_address,
                helpline_contact,
                /* Placeholders */
                date_of_letter: new Date().toLocaleDateString(),
                document_owner_name: "Jane Aba Doe",
                recepient_institution: "XYC Company Ltd",
                recepient_institution_mail: "P.O.Box, 25KMS",
                recepient_institution_address: "Bannerman Street, Winneba",
                document_name: "Sample Document",
                validator_name: "John Doe",
                verification_review_results: "<-------------------------------Verification results content----------------------------->",
                date_of_request: new Date().toLocaleDateString(),
               
            };
            renderedHtml = template(data);
        }

        return (
            <div className="p-2 bg-white">
                
                <div className="col-span-2">
                        {/* Tabs */}
                    <div className="flex border-b border-gray-300">
                        <button
                            className={`px-4 py-2 font-semibold focus:outline-none transition-all duration-300 ${
                                activeTab === 'validation_letters'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600'
                            }`}
                            onClick={() => {
                                this.setState({ activeSubTab: 'validation_approved_letter' });
                                this.switchTab('validation_letters');
                            }}
                        >
                            Validation Letters
                        </button>
                        <button
                            className={`ml-4 px-4 py-2 font-semibold focus:outline-none transition-all duration-300 ${
                                activeTab === 'verification_letters'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600'
                            }`}
                            onClick={() => {
                                this.setState({ activeSubTab: 'verification_approved_letter' });
                                this.switchTab('verification_letters');
                            }}
                        >
                            Verification Letters
                        </button>
                    </div>

                    {/* Tab for validation letters content */}
                    <div
                        className={`mt-1 transition-opacity duration-500 ${
                            activeTab === 'validation_letters' ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {activeTab === 'validation_letters' && (
                            <div className="flex border-b border-gray-300">
                                <button
                                    className={`px-4 py-2 font-semibold focus:outline-none transition-all duration-300 text-sm ${
                                        activeSubTab === 'validation_approved_letter'
                                            ? 'bg-blue-600 text-white rounded-t-md'
                                            : 'text-gray-600'
                                    }`}
                                    onClick={() => this.switchSubTab('validation_approved_letter')}
                                >
                                    Approval Letter
                                </button>
                                <button
                                    className={`ml-4 px-4 py-2 font-semibold focus:outline-none transition-all duration-300 text-sm ${
                                        activeSubTab === 'validation_declined_letter'
                                            ? 'bg-blue-600 text-white rounded-t-md'
                                            : 'text-gray-600'
                                    }`}
                                    onClick={() => this.switchSubTab('validation_declined_letter')}
                                >
                                    Declined Letter
                                </button>
                            </div>
                            
                        )}
                    </div>

                    {/* Tab for verification letters content */}
                    <div
                        className={`mt-1 transition-opacity duration-500 ${
                            activeTab === 'verification_letters' ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {activeTab === 'verification_letters' && (
                            <div className="flex border-b border-gray-300">
                                <button
                                    className={`px-4 py-2 font-semibold focus:outline-none transition-all duration-300 text-sm ${
                                        activeSubTab === 'verification_approved_letter'
                                            ? 'bg-blue-600 text-white rounded-t-md'
                                            : 'text-gray-600'
                                    }`}
                                    onClick={() => this.switchSubTab('verification_approved_letter')}
                                >
                                    Approval Letter
                                </button>
                                <button
                                    className={`ml-4 px-4 py-2 font-semibold focus:outline-none transition-all duration-300 text-sm ${
                                        activeSubTab === 'verification_declined_letter'
                                            ? 'bg-blue-600 text-white rounded-t-md'
                                            : 'text-gray-600'
                                    }`}
                                    onClick={() => this.switchSubTab('verification_declined_letter')}
                                >
                                    Declined Letter
                                </button>
                            </div>
                            
                        )}
                    </div>

                    {/* Validation Tab Content */}
                        {/* Validation Approved Letter */}
                        <div className="">
                            {activeSubTab == 'validation_approved_letter' && 
                            (
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                                    <div className="col-span-1 xl:col-span-2 w-full">
                                        <div className="w-full ">
                                    
                                            <SunEditor
                                            getSunEditorInstance={editor => { this.validationApprovedEditorRef = editor; }}
                                            height="100%"
                                            setContents={this.state.validation_approved_content}
                                            onChange={this.validationApprovedContentChange}
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
                                    
                                            <button className="bg-blue-800 text-white px-6 rounded-md py-1 my-2" onClick={this.previewValidationApprovedTemplate}>
                                            Preview Template
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-1 overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-300">
                                            <thead>
                                            <tr>
                                                <th className="px-1 py-2 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-gray-600 uppercase">
                                                Placeholder
                                                </th>
                                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-gray-600 uppercase tracking-wider">
                                                Description
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className='text-sm'>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{institution_email}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's email address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{institution_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's geographic address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{helpline_contact}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's primary phone number.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{mailing_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's postal address eg P.O.Box 123
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{date_of_letter}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Date that the letter is being issued to applicant.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's name.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution_mail}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's email address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's geographic address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{date_of_request}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Date the document was requested by applicant
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{document_owner_name}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Personal owner of the document being verified
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{document_type_name}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Name of the document type in question
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{verification_review_results}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Verification template question results
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-span-3">
                                        <div className=" w-full border rounded-md p-6 bg-white">
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
                                </div>
                            )}
                        </div>
                        {/* Validation Declined Letter */}
                        <div className="">
                            {activeSubTab == 'validation_declined_letter' && 
                            (
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                                    <div className="col-span-1 xl:col-span-2 w-full">
                                        <div className="w-full ">
                                    
                                            <SunEditor
                                            getSunEditorInstance={editor => { this.validationDeclinedEditorRef = editor; }}
                                            height="100%"
                                            setContents={this.state.validation_declined_content}
                                            onChange={this.validationDeclinedContentChange}
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
                                    
                                            <button className="bg-blue-800 text-white px-6 rounded-md py-1 my-2" onClick={this.previewValidationDeclinedTemplate}>
                                            Preview Template
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-1 overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-300">
                                            <thead>
                                            <tr>
                                                <th className="px-1 py-2 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-gray-600 uppercase">
                                                Placeholder
                                                </th>
                                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-gray-600 uppercase tracking-wider">
                                                Description
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className='text-sm'>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{institution_email}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's email address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{institution_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's geographic address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{helpline_contact}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's primary phone number.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{mailing_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's postal address eg P.O.Box 123
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{date_of_letter}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Date that the letter is being issued to applicant.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's name.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution_mail}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's email address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's geographic address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{date_of_request}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Date the document was requested by applicant
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{document_owner_name}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Personal owner of the document being verified
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{document_type_name}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Name of the document type in question
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{verification_review_results}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Verification template question results
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-span-3">
                                        <div className=" w-full border rounded-md p-6 bg-white">
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
                                </div>
                            )}
                        </div>

                    {/* End of Validation Tab Content */}

                    {/* Verification Tab Content */}
                        {/* Verification Approved Letter */}
                        <div className="">
                            {activeSubTab == 'verification_approved_letter' && 
                            (
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                                    <div className="col-span-1 xl:col-span-2 w-full">
                                        <div className="w-full ">
                                    
                                            <SunEditor
                                            getSunEditorInstance={editor => { this.verificationApprovedEditorRef = editor; }}
                                            height="100%"
                                            setContents={this.state.verification_approved_content}
                                            onChange={this.verificationApprovedContentChange}
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
                                    
                                            <button className="bg-blue-800 text-white px-6 rounded-md py-1 my-2" onClick={this.previewVerificationApprovedTemplate}>
                                            Preview Template
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-1 overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-300">
                                            <thead>
                                            <tr>
                                                <th className="px-1 py-2 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-gray-600 uppercase">
                                                Placeholder
                                                </th>
                                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-gray-600 uppercase tracking-wider">
                                                Description
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className='text-sm'>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{institution_email}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's email address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{institution_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's geographic address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{helpline_contact}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's primary phone number.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{mailing_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's postal address eg P.O.Box 123
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{date_of_letter}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Date that the letter is being issued to applicant.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's name.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution_mail}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's email address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's geographic address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{date_of_request}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Date the document was requested by applicant
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{document_owner_name}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Personal owner of the document being verified
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{document_type_name}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Name of the document type in question
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{verification_review_results}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Verification template question results
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-span-3">
                                        <div className=" w-full border rounded-md p-6 bg-white">
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
                                </div>
                            )}
                        </div>
                        {/* Verification Declined Letter */}
                        <div className="">
                            {activeSubTab == 'verification_declined_letter' && 
                            (
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                                    <div className="col-span-1 xl:col-span-2 w-full">
                                        <div className="w-full ">
                                    
                                            <SunEditor
                                            getSunEditorInstance={editor => { this.verificationDeclinedEditorRef = editor; }}
                                            height="100%"
                                            setContents={this.state.verification_declined_content}
                                            onChange={this.verificationDeclinedContentChange}
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
                                    
                                            <button className="bg-blue-800 text-white px-6 rounded-md py-1 my-2" onClick={this.previewVerificationDeclinedTemplate}>
                                            Preview Template
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-1 overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-300">
                                            <thead>
                                            <tr>
                                                <th className="px-1 py-2 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-gray-600 uppercase">
                                                Placeholder
                                                </th>
                                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-gray-600 uppercase tracking-wider">
                                                Description
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className='text-sm'>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{institution_email}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's email address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{institution_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's geographic address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{helpline_contact}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's primary phone number.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{mailing_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Your institution's postal address eg P.O.Box 123
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{date_of_letter}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Date that the letter is being issued to applicant.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's name.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution_mail}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's email address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{recepient_institution_address}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                The recipient institution's geographic address.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{date_of_request}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Date the document was requested by applicant
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{document_owner_name}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Personal owner of the document being verified
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{document_type_name}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Name of the document type in question
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-1 border-b border-r border-gray-200">
                                                {"{{verification_review_results}}"}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200">
                                                Verification template question results
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-span-3">
                                        <div className=" w-full border rounded-md p-6 bg-white">
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
                                </div>
                            )}
                        </div>
                    {/* End of Verification Tab Content */}

                    
                </div>
                

            </div>
        );
    }
}

export default InstitutionLetter;

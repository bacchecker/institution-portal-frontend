import React, { useState } from 'react';
import AuthLayout from "@components/AuthLayout";
import { Button, Switch } from '@nextui-org/react';
import { useNavigate } from "react-router-dom";
import axios from "@utils/axiosConfig";
import toast from 'react-hot-toast';

const TermsConditions = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(0);
    const [isAgreed, setIsAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    const handleNextAccordion = (index) => {
        const nextIndex = (index + 1) % accordions.length;
        setOpenIndex(nextIndex);
    };

    const handleAgreement = async () => {
        if (!isAgreed) return; 

        setLoading(true);
        try {
        const response = await axios.post('/institution/accept-terms');
        
        toast.success(response.data.message)
        setTimeout(() => {
            window.location.href = '/dashboard';
          }, 3000);

        } catch (error) {
        toast.error(error?.response?.data?.message || "Error submitting agreement form");
        
        } finally {
        setLoading(false); // Stop the loading state
        }
    };

    const accordions = [
        {
        title: '1. Account Setup and Eligibility',
        content: (
            <div className="text-gray-900">
                <ul className='w-full xl:w-[90%] list-disc list-inside mt-2'>
                    <li className='mb-2'>
                        <span className='font-semibold text-base'>Eligibility Requirements</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>Only recognized academic and non-academic institutions in Ghana can create accounts on the platform.</li>
                            <li>The information provided during account setup must be accurate, including institution details and documents</li>
                        </ul>
                    </li>
                    <li className=''>
                        <span className='font-semibold text-base'>Account Activation</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>After registration, accounts will be reviewed by the platform management team, and full access will be granted upon approval.</li>
                            <li>Institutions must set up document types they can honor, validate, and verify, and upload sample templates where required.</li>
                        </ul>
                    </li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
                    <strong className='text-base'>Note: </strong>
                    Please note that any document certifying your operations uploaded to our system is securely stored and will not be used outside this platform.
                </div>
            <div className="w-full flex justify-end mt-2">
                <button onClick={() => handleNextAccordion(0)} className='bg-green-800 text-white px-6 rounded-full py-1'>I Agree</button>
            </div>
            </div>
        ),
        },
        {
        title: '2. Document Requests and Services',
        content: (
            <div className="">
                <ul className='w-full xl:w-[90%] list-disc list-inside mt-2'>
                    <li className='mb-2'>
                        <span className='font-semibold text-base'>Processing Document Requests</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>Institutions must process and respond to valid document requests submitted by applicants, which may include former students or employees.</li>
                            <li>Institutions are responsible for providing documents in the requested format (soft or hard copy).</li>
                        </ul>
                    </li>
                    <li className=''>
                        <span className='font-semibold text-base'>Failure to Honor Requests</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>If institutions do not honor legitimate document requests, they may face account restrictions or suspension.</li>
                        </ul>
                    </li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
                    <strong>Note:</strong> Institutions are required to provide both digital and physical copies of requested documents within a reasonable time frame to ensure timely service delivery.
                </div>
                <div className="w-full flex justify-end mt-2">
                    <button onClick={() => handleNextAccordion(1)} className='bg-green-800 text-white px-6 rounded-full py-1'>I Agree</button>
                </div>
            </div>
        ),
        },
        {
        title: '3. Document Verification and Validation',
        content: (
            <div className="">
                <ul className='w-full xl:w-[90%] list-disc list-inside mt-2'>
                    <li className='mb-2'>
                        <span className='font-semibold text-base'>Verification of Documents</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>Institutions may be asked to verify documents for other institutions and must perform these tasks accurately and in good faith.</li>
                        </ul>
                    </li>
                    <li className=''>
                        <span className='font-semibold text-base'>Validation of Documents</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>Institutions are expected to validate documents issued by their institution for users and must ensure the accuracy of all validations.</li>
                        </ul>
                    </li>
                    <li className=''>
                        <span className='font-semibold text-base'>Legal Compliance</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>All verification and validation activities must comply with Ghanaian laws and any applicable international regulations.
                            </li>
                        </ul>
                    </li>
                </ul>
                <div className="w-full flex justify-end mt-2">
                    <button onClick={() => handleNextAccordion(2)} className='bg-green-800 text-white px-6 rounded-full py-1'>I Agree</button>
                </div>
            </div>
        ),
        },
        {
        title: '4. Data Privacy and Confidentiality',
        content: (
            <div className="">
                <ul className='w-full xl:w-[90%] list-disc list-inside mt-2'>
                    <li className='mb-2'>
                        <span className='font-semibold text-base'>Handling Applicant Data</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>Institutions must maintain the confidentiality of all personal data and documents processed through the platform.</li>
                            <li>Data handling must comply with Ghana's Data Protection Act and international privacy regulations.</li>
                        </ul>
                    </li>
                    <li className=''>
                        <span className='font-semibold text-base'>Inter-Institutional Information Sharing</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>Information exchanged between institutions for verification and validation must only be used for legitimate requests and not for unrelated purposes.</li>
                        </ul>
                    </li>
                </ul>
                <div className="w-full flex justify-end mt-2">
                    <button onClick={() => handleNextAccordion(3)} className='bg-green-800 text-white px-6 rounded-full py-1'>I Agree</button>
                </div>
            </div>
        ),
        },
        {
        title: '5. Fees, Platform Use, and Legal Terms',
        content: (
            <div className="">
            <ul className='w-full xl:w-[90%] list-disc list-inside mt-2'>
                    <li className='mb-2'>
                        <span className='font-semibold text-base'>Fees and Payments</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>Any fees for document requests or validation services will be communicated clearly during transactions. Institutions are responsible for timely payments.</li>
                        </ul>
                    </li>
                    <li className=''>
                        <span className='font-semibold text-base'>Platform Use Restrictions</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>Institutions must use the platform solely for document-related requests, verifications, and validations.</li>
                            <li>Misuse of the platform, including falsifying documents or engaging in fraudulent activities, will result in suspension or termination.</li>
                        </ul>
                    </li>
                    <li className=''>
                        <span className='font-semibold text-base'>Limitation of Liability</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>The platform is not liable for errors made by institutions during document issuance or verification.</li>
                            <li>The platform does not guarantee the authenticity of documents and serves only as an intermediary.</li>
                        </ul>
                    </li>
                    <li className=''>
                        <span className='font-semibold text-base'>Amendments and Termination</span>
                        <ul className="flex flex-col space-y-1 list-disc list-inside ml-6 mt-2">
                            <li>The platform reserves the right to update the terms at any time, and institutions are expected to comply with any changes.</li>
                            <li>Either party may terminate the agreement with notice, and breach of terms can lead to immediate suspension.</li>
                        </ul>
                    </li>
                </ul>
                <div className="w-full flex justify-end mt-2">
                    <button onClick={() => toggleAccordion(4)} className='bg-green-800 text-white px-6 rounded-full py-1'>I Agree</button>
                </div>
            </div>
        ),
        },
    ];

  return (
    <AuthLayout title='Terms and Conditions'>
        <div className="w-full bg-white p-6">
            <div className="flex space-x-2 mb-4">
                <img
                    src="/images/t_and_c.svg"
                    alt="account active gif"
                    className="w-auto h-12"
                />
                <div className="">
                    <p className='font-bold text-2xl'>Policy Terms and Conditions</p>
                    <p className='font-medium'>Updated at October 17, 2024</p>
                </div>
            </div>
            <div className="w-full mb-10 ">
                <div className="space-y-4">
                    {accordions.map((accordion, index) => (
                        <div key={index} className="border rounded-lg shadow-md bg-blue-900 text-white">
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full p-4 font-semibold text-left focus:outline-none text-base"
                        >
                            {accordion.title}
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-500 ${
                            openIndex === index ? 'opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="p-4 bg-white text-gray-900">{accordion.content}</div>
                        </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex space-x-2 justify-end mt-6 pr-4">
                    <Switch 
                    defaultSelected={false} 
                    size="sm" 
                    onChange={() => setIsAgreed(!isAgreed)}
                    />
                    <p className="text-base">I agree to Bacchecker's Terms, Privacy Policy and E-Sign Consent.</p>
                </div>
                
                <div className="flex justify-end mt-4 mr-4">
                    <Button
                        color="primary"
                        onClick={handleAgreement}
                        isLoading={loading}
                        disabled={!isAgreed}
                    >
                        Submit Agreement Form
                    </Button>
                    {/* <button
                        onClick={handleAgreement}
                        className={`bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-md text-base ${!isAgreed && 'opacity-50 cursor-not-allowed'}`}
                        disabled={!isAgreed || loading}
                    >
                    {loading ? 'Submitting...' : 'Submit Agreement Form'}
                    </button> */}
                </div>
                
            </div> 
        </div>
        
    </AuthLayout>
    
  );
};

export default TermsConditions;

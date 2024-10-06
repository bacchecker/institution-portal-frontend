import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from '../../axiosConfig';
import { IoIosMail } from 'react-icons/io';
import { BsSendCheck } from 'react-icons/bs';
import { FaPhoneVolume } from 'react-icons/fa';
import { FaCheck } from "react-icons/fa6";
import { LiaTimesSolid } from 'react-icons/lia';
import { RiInformation2Fill } from 'react-icons/ri';
import { toast } from 'react-hot-toast';

const LetterTemplate = forwardRef((props, ref) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        institution_email: '',
        mailing_address: '',
        helpline_contact: '',
        logo: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchInstitution();
    }, []);

    const fetchInstitution = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/institution/institution-data/');
            const institutionData = response.data.institutionData;

            if (institutionData) {
                setFormData({
                    name: institutionData.name,
                    address: institutionData.address,
                    institution_email: institutionData.institution_email,
                    mailing_address: institutionData.mailing_address,
                    helpline_contact: institutionData.helpline_contact,
                    logo: institutionData.logo,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load institution data");
        }
        setIsLoading(false);
    };

    const handleSubmit = async () => {
        return true;
    };

    // Expose handleSubmit to parent using useImperativeHandle
    useImperativeHandle(ref, () => ({
        submitForm: handleSubmit,
    }));

    return (
        <>
            <div className="bg-yellow-100 border-yellow-200 px-4 py-2 mb-3 rounded-lg">
                <div className="flex space-x-2">
                    <RiInformation2Fill size={24} className="text-yellow-500" />
                    <p className="font-semibold">Information</p>
                </div>
                <p className="ml-8">
                    Please note that the letter you are viewing is a template for all document verifications and validations that will be attached and addressed to users who seek such services.
                </p>
            </div>
            <div className="w-full xl:w-4/5 min-h-96 px-6 py-10 bg-white border shadow-gray-300 mx-auto">
                {isLoading ? (
                    <div role="status" className="animate-pulse">
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
                        <div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 max-w-[540px]"></div>
                        <div className="flex items-center justify-center mt-4">
                            <svg
                                className="w-8 h-8 text-gray-200 dark:text-gray-700 me-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                            <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
                            <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <div>
                        {/* Letter Head */}
                        <div className="relative">
                            <div className="">
                                <div className="w-full h-6 bg-black mb-1 text-white uppercase"></div>
                                <div className="w-full h-1 bg-red-600 mb-1"></div>
                            </div>
                            <div className="absolute top-[-24px] left-40">
                                <p className="uppercase">{formData.name}</p>
                                <p className="uppercase text-white mb-4">Office of the Registrar</p>
                                <div className="flex items-center space-x-4 xl:space-x-6 text-sm">
                                    <div className="flex space-x-2">
                                        <IoIosMail size={18} className="text-gray-500" />
                                        <p>{formData.mailing_address}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <BsSendCheck size={18} className="text-gray-500" />
                                        <p>{formData.institution_email}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <FaPhoneVolume size={18} className="text-gray-500" />
                                        <p>{formData.helpline_contact}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-[-24px] left-10">
                                <img
                                    src={`${import.meta.env.VITE_BASE_URL}/storage/${formData.logo}`}
                                    alt="Institution Logo"
                                    style={{ width: '100px', height: '100px' }}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        {/* Letter Body */}
                        <div className="mt-24 px-12 text-sm">
                            <div>
                                <p>October 10, 2024</p>
                                <p>Nestle Ghana Company Ltd</p>
                                <p>P.O.Box GA141</p>
                                <p>Tema - Ghana</p>
                            </div>
                            <div className="mt-10">
                                <p className="mb-2">Dear Sir/Madam</p>
                                <h2 className="uppercase text-lg font-semibold text-center mb-2 border-b text-blue-900">
                                    Document verification and validation status
                                </h2>
                                <p>
                                    We are writing to inform you about the verification process for the document(s) submitted for validation on September 18th, 2024. After a thorough review, we have determined the following regarding the submitted document(s):
                                </p>
                            </div>
                            <div className="mt-4 space-y-2">
                                <p className="font-semibold">Document Title/Reference: Degree Certificate</p>
                                <div className="flex justify-between items-center">
                                    <p className="flex-1">1. Does the degree certificate have the official seal of the institution?</p>
                                    <FaCheck size={18} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="flex-1">2. Is the degree certificate issued by an accredited institution?</p>
                                    <FaCheck size={18} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="flex-1">3. Is the name on the degree certificate consistent with the identification provided?</p>
                                    <LiaTimesSolid size={18} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="flex-1">4. Does the date of graduation match the institution's records?</p>
                                    <FaCheck size={18} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="flex-1">5. Are there any alterations or signs of tampering on the document?</p>
                                    <FaCheck size={18} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="font-semibold">Summary of Findings</p>
                                <p>
                                    Based on the responses above, we have determined that while the majority of the document verification questions returned true, there are some inconsistencies that require further investigation.
                                </p>
                                <p className="mt-2">
                                    If you require further clarification regarding this, please do not hesitate to contact us at {formData.institution_email}.
                                </p>
                            </div>
                            <div className="flex flex-col space-2 mt-10">
                                <p>Sincerely</p>
                                <p className="h-[2px] w-60 bg-black mt-5"></p>
                                <p className="uppercase">The Registrar</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
});

export default LetterTemplate;

import React, { useState } from 'react';
import AuthLayout from "@components/AuthLayout";
import { Switch } from '@nextui-org/react';

const TermsConditions = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const handleNextAccordion = (index) => {
    const nextIndex = (index + 1) % accordions.length;
    setOpenIndex(nextIndex);
  };

  const accordions = [
    {
      title: 'Account Setup and Eligibility',
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
      title: 'Document Requests and Services',
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
      title: 'Document Verification and Validation',
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
      title: 'Data Privacy and Confidentiality',
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
      title: 'Fees, Platform Use, and Legal Terms',
      content: (
        <div className="">
          <p className="text-gray-700">
            This section outlines the fees associated with using the platform and the legal terms
            institutions agree to when utilizing services.
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>Platform usage fees may vary based on services.</li>
            <li>Legal agreements must be reviewed before accepting terms.</li>
            <li>Dispute resolution is handled through an internal platform mechanism.</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <AuthLayout title='Terms and Conditions'>
        <div className="w-full bg-white p-6">
            <div className="flex space-x-2">
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
            <div className="w-full my-10 ">
                <div className="space-y-4">
                    {accordions.map((accordion, index) => (
                        <div key={index} className="border rounded-lg shadow-md bg-purple-900 text-white">
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
                    <Switch defaultSelected={false} size='sm'/>
                    <p className='text-lg font-medium'>I agree to Bacchecker's Terms,Privacy Policy and E-Sign Consent.</p>
                </div>
                
            </div> 
        </div>
        
    </AuthLayout>
    
  );
};

export default TermsConditions;

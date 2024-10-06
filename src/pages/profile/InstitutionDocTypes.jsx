import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-hot-toast';
import { RiInformation2Fill } from 'react-icons/ri';
import { IoMdAdd, IoMdClose } from 'react-icons/io';

const InstitutionDocTypes = forwardRef((props, ref) => {
    
    const [searchAvailableName, setSearchAvailableName] = useState('');
    const [searchInstitutionName, setSearchInstitutionName] = useState('');
    const [availableDocumentTypes, setAvailableDocumentTypes] = useState([]);
    const [institutionDocumentTypes, setInstitutionDocumentTypes] = useState([]);
    const [selectedDocumentTypes, setSelectedDocumentTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchDocumentTypes();
    }, [searchAvailableName, searchInstitutionName]);

    const fetchDocumentTypes = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/institution/profile/document-types', {
                params: {
                    search_available_name: searchAvailableName,
                    search_institution_name: searchInstitutionName
                }
            });

            setAvailableDocumentTypes(response.data.available_document_types);
            setInstitutionDocumentTypes(response.data.institution_document_types);
            setIsLoading(false)
        } catch (error) {
            toast.error("Error fetching document types:", error);
            setIsLoading(false)
        }
    };

    const handleSearchAvailableNameChange = (event) => {
        setSearchAvailableName(event.target.value);
    };

    const handleSearchInstitutionNameChange = (event) => {
        setSearchInstitutionName(event.target.value);
    };

    const handleCheckboxChange = (id) => {
        setSelectedDocumentTypes(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(item => item !== id)
                : [...prevSelected, id]
        );
    };

    const handleFormSubmit = async(event) => {
        if (event) event.preventDefault();
        setIsSaving(true);

        if (selectedDocumentTypes.length === 0) {
            toast.error("Please select at least one document type.");
            setIsSaving(false);
            return false;
        }
        try {
            const response = await axios.post('/institution/store-institution-document-types', {
                document_type_ids: selectedDocumentTypes,
            })
            toast.success(response.data.message);
            setSelectedDocumentTypes([]);
            fetchDocumentTypes();
            return true
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setIsSaving(false);
            return true
        }

    };

    const handleDelete = async (id) => {
        try {
        const response = await axios.delete(`/institution/remove-document/${id}`);
        toast.success(response.data.message);
        fetchDocumentTypes();
        } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting document');
        }
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
            <div className="bg-white w-full rounded-lg p-6 shadow-md shadow-gray-500">
                <p className='-mt-4 mb-3 uppercase bg-white font-bold px-2'>Available Document Types</p>
                <div className="bg-yellow-100 border-yellow-200 px-4 py-2 mb-3 rounded-lg">
                    <div className="flex space-x-2">
                        <RiInformation2Fill size={24} className='text-yellow-500'/>
                        <p className='font-semibold'>Information</p>
                    </div>
                    <p className='ml-8'>Select all document types that your institution issues to applicants and can validate for employees or other stakeholders</p>
                </div>
                <div className="mb-4 flex space-x-4">
                    <div className="relative w-full lg:w-2/3">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            value={searchAvailableName} 
                            onChange={handleSearchAvailableNameChange} 
                            name='search' 
                            id="default-search" 
                            className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Search document types" 
                            required 
                        />
                    </div>
                </div>
                <div className="">
                    
                {isLoading ? (
                    
                    <div role="status" class="space-y-2.5 animate-pulse max-w-lg">
                        <div class="flex items-center w-full">
                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                        </div>
                        <div class="flex items-center w-full max-w-[480px]">
                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                                    <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                        </div>
                        <div class="flex items-center w-full max-w-[400px]">
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                            <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                        </div>
                        <div class="flex items-center w-full max-w-[480px]">
                            <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                                    <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                        </div>
                        <div class="flex items-center w-full max-w-[440px]">
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-32"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                            <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                        </div>
                        <div class="flex items-center w-full max-w-[360px]">
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                            <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                        </div>
                        <span class="sr-only">Loading...</span>
                    </div>

                ) : (
                    <form onSubmit={handleFormSubmit} className="text-sm">
                        { availableDocumentTypes.length > 0 ? (
                            <div className="flex flex-wrap gap-4 relative">
                                 {availableDocumentTypes.map((request) => (
                                    <label
                                        key={request.id}
                                        className={`cursor-pointer flex items-center rounded-full px-4 py-2 transition-all duration-200 ${
                                        selectedDocumentTypes.includes(request.id) ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                                        }`}
                                    >
                                        <input
                                        type="checkbox"
                                        value={request.id}
                                        checked={selectedDocumentTypes.includes(request.id)}
                                        onChange={() => handleCheckboxChange(request.id)}
                                        className="mr-2 accent-green-600"
                                        />
                                        {request.name}
                                    </label>
                                    ))}
                                    <br />
                                    
                            </div>
                            
                        ):(
                            <div className="flex flex-col justify-center items-center h-full">
                                <img src="/images/nodata.png" alt="No data available" className="w-1/4 h-auto" />
                                <p className='text-gray-500 text-sm -mt-10 font-medium'>No document type found</p>
                            </div>
                        )
                          
                        }
                        <div className="flex justify-end mt-4">
                            <button className='flex items-center bg-green-200 hover:bg-green-300 border border-green-700 text-green-700 px-4 py-1 rounded-md' type='submit'><IoMdAdd size={20} className='mr-2'/> Add</button>
                        </div>
                        
                    </form>
                    
                )}
                </div>
                
                
            </div>
            {/* Institution Documents */}
            <div className="bg-white w-full rounded-lg p-6 shadow-md shadow-gray-500 mt-6">
                <p className='-mt-4 mb-3 uppercase font-bold px-2'>Institution Document Types</p>
                <div className="mb-4 flex space-x-4">
                    <div className="relative w-full lg:w-2/3">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            value={searchInstitutionName} 
                            onChange={handleSearchInstitutionNameChange} 
                            name='search' 
                            id="default-search" 
                            className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Search document types" 
                            required 
                        />
                    </div>
                </div>
                <div className="">
                    
                {isLoading ? (
                    
                    <div role="status" class="space-y-2.5 animate-pulse max-w-lg">
                        <div class="flex items-center w-full">
                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                        </div>
                        <div class="flex items-center w-full max-w-[480px]">
                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                                    <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                        </div>
                        <div class="flex items-center w-full max-w-[400px]">
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                            <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                        </div>
                        <div class="flex items-center w-full max-w-[480px]">
                            <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                                    <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                        </div>
                        <div class="flex items-center w-full max-w-[440px]">
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-32"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                            <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                        </div>
                        <div class="flex items-center w-full max-w-[360px]">
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                            <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                            <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                        </div>
                        <span class="sr-only">Loading...</span>
                    </div>

                ) : (
                    <div className="">
                            <div className="flex flex-wrap gap-4">
                                {institutionDocumentTypes.length === 0 ? (
                                    <div className="flex flex-col justify-center items-center h-full">
                                        <img src="/images/nodata.png" alt="No data available" className="w-1/4 h-auto" />
                                        <p className='text-gray-500 text-sm -mt-10 font-medium'>No document type found</p>
                                    </div>
                                ):(
                                    institutionDocumentTypes.map((request) => (
                                        <div key={request.id} className="flex ">
                                            <div className="bg-green-700 space-y-2 text-white rounded-full py-2 px-4">
                                            {request.name}
                                            </div>
                                            <div className="self-center text-red-600 hover:cursor-pointer">
                                                <IoMdClose size={24} onClick={() => handleDelete(request.id)}/>
                                            </div>
                                        </div>
                                    ))
                                )}

                            </div> 
                        
                    </div>
                    
                )}
                </div>
            </div>
        </>
    );
});

export default InstitutionDocTypes;

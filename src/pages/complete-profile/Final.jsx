import React, { useState, forwardRef, useImperativeHandle } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Final = forwardRef((props, ref) => {
    const { onSavingChange } = props;
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();
        setIsSaving(true); 
        onSavingChange(true);

        try {
            const response = await axios.post("/institution/complete-profile");
            toast.success(response.data.message);
            
            navigate("/dashboard");
            
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
            return false;
        } finally {
            setIsSaving(false);
            onSavingChange(false);
        }
    };

    useImperativeHandle(ref, () => ({
        submitForm: handleSubmit,
    }));

    return (
        <>
            <div className="px-10">
                <div className="">
                    <p className='font-semibold text-lg'>Review Institution's Information</p>
                    <p>
                        Before proceeding, please take a moment to carefully review the details you have provided about your institution. It is crucial that all the information entered accurately reflects the official records of your institution, as this data will be used for future communications, document validations, and verifications.
                    </p>
                </div>
                <div className="mt-6">
                    <p className='mb-2'>Make sure to verify the following key details:</p>
                    <ul className='px-6'>
                        <li className='font-semibold list-disc mb-2'>
                            Institution Name: 
                            <span className='font-normal'> Ensure the name is spelled correctly and matches the official name used in all formal documents.</span>
                        </li>
                        <li className='font-semibold list-disc mb-2'>
                            Address & Contact Information: 
                            <span className='font-normal'> Confirm that the address, email, and contact numbers are accurate, as they will be used for important communications.</span>
                        </li>
                        <li className='font-semibold list-disc mb-2'>
                            Institution Logo: 
                            <span className='font-normal'> If a logo has been uploaded, ensure that it is the most current version representing your institution.</span>
                        </li>
                    </ul>
                </div>
                <div className="mt-6">
                    <p>
                        If any of the provided details are incorrect, you can return to the previous steps and make the necessary adjustments. Once you submit, the information will be used throughout the system for verification and validation purposes. However, you can make changes or update your information from your profile at any time.
                    </p>
                </div>
            </div>
        </>
    );
});

export default Final;

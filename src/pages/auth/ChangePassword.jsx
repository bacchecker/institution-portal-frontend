import React, { useState } from 'react';
import axios from "@utils/axiosConfig";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Input, Spinner } from '@nextui-org/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

const ChangePassword = () => {
  // State for form inputs
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // Toggle visibility for password and confirm password
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Passwords do not match!',
        icon: 'error',
        confirmButtonColor: '#FF0000',
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await axios.post('/auth/change-password', {
        password: password,
        password_confirmation: confirmPassword,
      });

      Swal.fire({
        title: 'Success',
        text: response.data.message,
        icon: 'success',
        confirmButtonColor: '#00b17d',
      }).then(() => {
        navigate('/dashboard');
      });
    } catch (error) {
      
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred while changing the password.',
        icon: 'error',
        confirmButtonColor: '#FF0000',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
        <div className="text-center text-yellow-100">
              <div className="flex items-center justify-center mx-auto w-28 h-28">
                <img src="/images/bclogo.jpg" alt="BacChecker Logo" />
              </div>
            </div>
        <h2 className="text-xl font-semibold text-center text-gray-800">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            
          {/* Password Field */}
            <div>
                <Input
                isRequired
                label="Password"
                variant="bordered"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                endContent={
                    <button
                    className="focus:outline-none"
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label="toggle password visibility"
                    >
                    {isPasswordVisible ? (
                        <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                    ) : (
                        <FaEye className="text-xl text-default-400 pointer-events-none" />
                    )}
                    </button>
                }
                type={isPasswordVisible ? "text" : "password"}
                className=""
                />
            </div>

            {/* Confirm Password Field */}
            <div>
                <Input
                isRequired
                id="confirmPassword"
                label="Confirm Password"
                variant="bordered"
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                endContent={
                    <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label="toggle password visibility"
                    >
                    {isConfirmPasswordVisible ? (
                        <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                    ) : (
                        <FaEye className="text-xl text-default-400 pointer-events-none" />
                    )}
                    </button>
                }
                type={isConfirmPasswordVisible ? "text" : "password"}
                className=""
                />
            </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2 text-white bg-bChkRed hover:opacity-80 rounded-md focus:outline-none"
          >
             {isSaving ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="white" />
                  <h4>Processing...</h4>
                </div>
              ) : (
                <h4>Change Password</h4>
              )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

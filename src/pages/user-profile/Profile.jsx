import React, { Component } from 'react';
import Select from '../../components/Select';
import Textbox from '../../components/Textbox';
import axios from '../../axiosConfig';
import Spinner from '../../components/Spinner';
import {toast} from 'react-hot-toast';

class Profile extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        genderData: [
            { id: 'male', name: 'Male' },
            { id: 'female', name: 'Female' },
            { id: 'other', name: 'Other' },
        ],
        first_name: '',
        other_name: '',
        last_name: '',
        gender: '',
        role_id: '',
        email: '',
        phone: '',
        address: '',
        photo: '',
        address: '',
        digital_address: '',
        isUpdating: false,
        isChanging: false,
        current_password: '',
        password: '',
        confirm_password: '',
        errors: {},
    }

    componentDidMount() {
        this.fetchUserData();
      }

    fetchUserData = async () => {
        try {
          const response = await axios.get("/institution/user-data");
          const userData = response.data.userData;
    
          if (userData) {
            this.setState({
                first_name: userData.first_name,
                other_name: userData.other_name,
                last_name: userData.last_name,
                address: userData.address,
                gender: userData.gender,
                email: userData.email,
                digital_address: userData.digital_address,
                phone: userData.phone,
                photo: userData.photo,
            });
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
    };

    validateForm = () => {
        const { current_password, password, confirm_password } = this.state;
        let newErrors = {};
        
        if (!current_password) {
          newErrors.current_password = 'Current password is required.';
        }
    
        if (!password) {
          newErrors.password = 'New password is required.';
        }
    
        if (!confirm_password) {
          newErrors.confirm_password = 'Confirm password is required.';
        }
    
        if (password !== confirm_password) {
          newErrors.confirm_password = 'New password and confirm password do not match.';
        }
    
        return newErrors;
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const errors = this.validateForm();

        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return
        } 
    
        try {
            // Send POST request to API endpoint
            const response = await axios.post('/institution/store-users', formData);
    
            this.fetchInstitutionsUsers();
            this.handleClear(); 
            this.toggleCreateModal();
    
            toast.success(response.data.message, {});
            this.setState({isSaving: false})
        } catch (error) {
            // Show error toast notification in case of an error
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    render() { 
        const { isUpdating, isChanging, errors } = this.state
        return ( 
            <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                <div className="p-4 bg-white rounded-md">
                    <div className="">
                        <p className='text-lg font-semibold'>Profile Information</p>
                        <p className='text-sm font-medium text-gray-500 mt-1'>Update your account's profile information.</p>
                    </div>
                    <div className="relative flex flex-col space-y-4 p-4 mt-2"> 
                        <Textbox
                            label="First Name"
                            name="first_name"
                            value={this.state.first_name}
                            onChange={this.handleInputChange}
                        />
                        <Textbox
                            label="Other Name"
                            name="other_name"
                            value={this.state.other_name}
                            onChange={this.handleInputChange}
                        />
                        <Textbox
                            label="Last Name"
                            name="last_name"
                            value={this.state.last_name}
                            onChange={this.handleInputChange}
                        />
                        
                        <Textbox
                            label="Email Address"
                            name="email"
                            type="email"
                            value={this.state.email}
                            onChange={this.handleInputChange}
                        />
                        <Textbox
                            label="Address"
                            name="address"
                            value={this.state.address}
                            onChange={this.handleInputChange}
                        />
                        <Textbox
                            label="Phone Number"
                            name="phone"
                            value={this.state.phone}
                            onChange={this.handleInputChange}
                        />
                        <Select
                            label="Gender"
                            name="gender"
                            value={this.state.gender}
                            itemNameKey="name"
                            menuItems={this.state.genderData}
                            onChange={this.handleInputChange}
                        />
                        <div className="flex space-x-4">
                            <div className=""></div>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className={`flex items-center justify-center rounded-lg px-4 ${
                                    isUpdating ? 'bg-gray-400 text-gray-700' : 'bg-buttonLog text-white'
                                } py-1.5 text-base font-medium ${isUpdating ? 'cursor-not-allowed' : ''}`}
                            >
                                {isUpdating ? (
                                    <>
                                        <Spinner size="w-4 h-4 mr-2"/>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Profile'
                                )}
                            </button>
                        </div>  
                    </div>
                </div>
                <div className="p-4 bg-white rounded-md">
                    <div className="">
                        <p className='text-lg font-semibold'>Update Password</p>
                        <p className='text-sm font-medium text-gray-500 mt-1'>Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    <form onSubmit={this.handleSubmit} className="relative flex flex-col space-y-4 p-4 mt-2"> 
                        <Textbox
                            label="Current Password"
                            name="current_password"
                            type="password"
                            value={this.state.current_password}
                            onChange={this.handleInputChange}
                            error_message={errors.current_password}
                        />
                        <Textbox
                            label="New Password"
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            error_message={errors.password}
                        />
                        <Textbox
                            label="Confirm Password"
                            name="confirm_password"
                            type="password"
                            value={this.state.confirm_password}
                            onChange={this.handleInputChange}
                            error_message={errors.confirm_password}
                        />

                        <div className="flex space-x-4">
                            <div className=""></div>
                            <button
                                type="submit"
                                disabled={isChanging}
                                className={`flex items-center justify-center rounded-lg px-4 ${
                                    isChanging ? 'bg-gray-400 text-gray-700' : 'bg-buttonLog text-white'
                                } py-1.5 text-base font-medium ${isChanging ? 'cursor-not-allowed' : ''}`}
                            >
                                {isChanging ? (
                                    <>
                                        <Spinner size="w-4 h-4 mr-2"/>
                                        Changing Password...
                                    </>
                                ) : (
                                    'Change Password'
                                )}
                            </button>
                        </div>  
                    </form>
                </div>
            </div>
            </>
         );
    }
}
 
export default Profile;
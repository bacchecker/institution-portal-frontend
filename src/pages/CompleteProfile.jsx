import React, { Component } from 'react';
import withRouter from '../components/withRouter';
import logo from '../images/back-logo.png';
import Textbox from '../components/Textbox';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axios from '../axiosConfig';
import toast from 'react-hot-toast';

class CompleteProfile extends Component {
    constructor(props) {
        super(props);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.confirmSubmit = this.confirmSubmit.bind(this);
    }
    
    state = { 
        name: '',
        description: '',
        address: '',
        digital_address: '',
        region: '',
        academic_level: '',
        logo: '',
        logoFile: null,
        regionData: [
            { id: 'Ahafo', name: 'Ahafo' },
            { id: 'Ashanti', name: 'Ashanti' },
            { id: 'Bono East', name: 'Bono East' },
            { id: 'Brong Ahafo', name: 'Brong Ahafo' },
            { id: 'Central', name: 'Central' },
            { id: 'Eastern', name: 'Eastern' },
            { id: 'Greater Accra', name: 'Greater Accra' },
            { id: 'North East', name: 'North East' },
            { id: 'Northern Oti', name: 'Northern Oti' },
            { id: 'Oti', name: 'Oti' },
            { id: 'Savannah', name: 'Savannah' },
            { id: 'Upper East', name: 'Upper East' },
            { id: 'Upper West', name: 'Upper West' },
            { id: 'Volta', name: 'Volta' },
            { id: 'Western', name: 'Western' },
            { id: 'Western North', name: 'Western North' },

        ],
        academicLeveData: [
            { id: 'Tertiary', name: 'Tertiary' },
            { id: 'Secondary', name: 'Secondary' },
            { id: 'Basic', name: 'Basic' },
        ],
        errors: {},
        modalOpen: false,
     }

    validateForm() {
        const { name, description, academic_level, region, address, digital_address, logo } = this.state;
        let errors = {};

        if (!name) errors.name = "Institution Name is required";
        if (!description) errors.description = "Description is required";
        if (!academic_level) errors.academic_level = "Academic Level is required";
        if (!region) errors.region = "Region is required";
        if (!address) errors.address = "Address is required";
        if (!digital_address) errors.digital_address = "Digital Address is required";
        if (!logo || logo === "default-logo.png") {
            errors.logo = "Institution Logo is required and cannot be default.";
        }

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    }
    
    componentDidMount() {
        const { institutionData } = this.props.location.state || {};
        if (institutionData) {
            this.setState({
                name: institutionData.name,
                address: institutionData.address,
                description: institutionData.description,
                digital_address: institutionData.digital_address,
                region: institutionData.region,
                academic_level: institutionData.academic_level,
                logo: institutionData.logo,
            });
        }
    }
    handleInputChange = e => {
        const { name, value } = e.target;
        this.setState(prevState => ({
        ...prevState,
        [name]: value
        }));
    };

    handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    logo: reader.result,
                    logoFile: file,
                });
            };
            reader.readAsDataURL(file);
        }
    }

    toggleModal() {
        this.setState(prevState => ({ modalOpen: !prevState.modalOpen }));
    }
    
    confirmSubmit() {
        
        this.handleSubmit();
    
    }
    
    

    handleSubmit = async (event) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        } 
        
        if (!this.validateForm()) {
            this.toggleModal()
            return; 
        }
    
        const formData = new FormData();
        formData.append('name', this.state.name);
        formData.append('description', this.state.description);
        formData.append('academic_level', this.state.academic_level);
        formData.append('region', this.state.region);
        formData.append('address', this.state.address);
        formData.append('digital_address', this.state.digital_address);
    
        if (this.state.logoFile && this.state.logoFile.name !== 'default-logo.png') {
            formData.append('logo', this.state.logoFile);
        }
    
        try {
            
            const response = await axios.post('/institution/account-setup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            toast.success(response.data.message, {});
            this.props.navigate('/institution/dashboard');
            
    
        } catch (error) {
            toast.error(error.response.data.message, {});
            return false;
        }
    };
    


      
    render() {
        return ( 
            <>
            <div className="w-full flex flex-col bg-white">
                <div className="px-4 py-2 border-b">
                    <img src={logo} alt="BacChecker Logo" className='h-10 w-auto'/>
                </div>
                <div className="mx-auto xl:mt-12 my-8 px-4">
                    <div className="">
                        <p className='text-gray-500 text-lg'>Let's get started</p>
                        <p className='text-3xl font-bold my-2'>Complete your account setup</p>
                        <p className='font-medium text-gray-700 text-lg'>Every Institution is unique, we want to know about yours. <br />Make sure the information you submitted during registration is your exact institutional details.</p>
                    </div>
                    <form onSubmit={this.handleSubmit} className="flex-col space-y-6 mt-10">
                        <Textbox label="Institution Name" name="name" value={this.state.name} onChange={this.handleInputChange} error_message={this.state.errors.name}/>
                        <Textarea label="Description" name="description" value={this.state.description} onChange={this.handleInputChange} error_message={this.state.errors.description}/>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Select label="Academic Level" name="academic_level" value={this.state.academic_level} itemNameKey="name" menuItems={this.state.academicLeveData} onChange={this.handleInputChange} error_message={this.state.errors.academic_level}/>
                            <Select label="Select Region" name="region" value={this.state.region} itemNameKey="name" menuItems={this.state.regionData} onChange={this.handleInputChange} error_message={this.state.errors.region}/>
                            <Textbox label="Address" name="address" value={this.state.address} onChange={this.handleInputChange} error_message={this.state.errors.address}/>
                            <Textbox label="Digital Address" name="digital_address" value={this.state.digital_address} onChange={this.handleInputChange} error_message={this.state.errors.digital_address}/>
                        </div>
                        <div className="w-full grid grid-cols-2 xl:grid-cols-5 gap-4">
                            <div className="col-span-2">
                                <p>Institution Logo</p>
                                <div className='flex flex-col items-center justify-center bg-white shadow-md shadow-gray-500 rounded-md p-4'>
                                    <img
                                        src={this.state.logo}
                                        alt="Institution Logo"
                                        style={{ width: '160px', height: '160px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={this.handleImageChange}
                                            name="logo"
                                        />
                                    </div>
                                    {this.state.errors.logo && <p className="text-red-500">{this.state.errors.logo}</p>}
                                </div>
                            </div>
                            <div className="col-span-3">
                                
                            </div>
                            
                        
                        </div>
                        <div className="flex justify-center w-full">
                            <button type="button" onClick={this.toggleModal} className='bg-green-700 text-white w-1/2 rounded-full text-center py-2 text-lg font-semibold hover:bg-green-600'>Complete Account Setup</button>
                        </div>
                        
                    </form>
                </div>
                    <ConfirmModal
                        isOpen={this.state.modalOpen}
                        onClose={this.toggleModal}
                        onConfirm={this.confirmSubmit}
                    />
            </div>


              
            </>
         );
    }
}

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed z-20 backdrop-blur-sm bg-black inset-0 overflow-y-auto bg-opacity-60">
            <div className='flex items-center justify-center min-h-screen'>
                <div className="w-1/2 relative bg-white shadow-lg">
                    <div className="flex justify-between bg-white text-black shadow-md shadow-gray-400">
                        <h2 className="text-xl font-medium py-3 px-4 uppercase">Confirm Submission</h2>
                        <button onClick={onClose} className="px-4 hover:text-gray-700">
                        <IoMdCloseCircleOutline size={24}/>
                        </button>
                    </div>
                    <div className="p-6">
                        <p>
                            Are you sure you want to proceed with the details provided? 
                            These details will appear in all document validations sent out. 
                            However, you will have the ability to modify these details afterward if necessary.
                        </p>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 mr-2"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-700 text-white px-4 py-2"
                                onClick={onConfirm}
                            >
                                Proceed
                            </button>
                        </div> 
                    </div>
                    
                </div>
            </div>
            
        </div>
    );
};
 
export default withRouter(CompleteProfile);
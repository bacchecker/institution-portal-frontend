import React, { Component } from 'react';
import withRouter from '../components/withRouter';
import logo from '../images/back-logo.png';
import Textbox from '../components/Textbox';
import Textarea from '../components/Textarea';
import Select from '../components/Select';

class CompleteProfile extends Component {
    constructor(props) {
        super(props);
    }
    
    state = { 
        name: '',
        description: '',
        address: '',
        digital_address: '',
        region: '',
        academic_level: '',
        logo: '',
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
        ]
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

      
    render() {
        return ( 
            <>
            <div className="w-full flex flex-col">
                <div className="px-4 py-2 border-b">
                    <img src={logo} alt="BacChecker Logo" className='h-10 w-auto'/>
                </div>
                <div className="mx-auto xl:mt-12 mt-8 px-4">
                    <div className="">
                        <p className='text-gray-500'>Let's get started</p>
                        <p className='text-2xl font-bold my-2'>Complete your account setup</p>
                        <p className='font-medium text-gray-700'>Every Institution is unique, we want to know about yours. <br />Make sure the information you submitted during registration is your exact institutional details.</p>
                    </div>
                    <div className="flex-col space-y-6 mt-10">
                        <Textbox label="Institution Name" name="name" value={this.state.name} onChange={this.handleInputChange}/>
                        <Textarea label="Description" name="description" value={this.state.description} onChange={this.handleInputChange}/>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Textbox label="Address" name="address" value={this.state.address} onChange={this.handleInputChange}/>
                            <Textbox label="Digital Address" name="digital_address" value={this.state.digital_address} onChange={this.handleInputChange}/>
                            <Select label="Academic Level" name="academic_level" value={this.state.academic_level} itemNameKey="name" menuItems={this.state.academicLeveData} onChange={this.handleInputChange}/>
                            <Select label="Select Region" name="region" value={this.state.region} itemNameKey="name" menuItems={this.state.regionData} onChange={this.handleInputChange}/>
                        </div>
                        <div className="w-full">
                        <img
                            src={this.state.logo}
                            alt="Institution Logo"
                            style={{ width: '160px', height: '160px' }}
                        />
                        </div>
                        
                    </div>
                </div>
                
            </div>


              
            </>
         );
    }
}
 
export default withRouter(CompleteProfile);
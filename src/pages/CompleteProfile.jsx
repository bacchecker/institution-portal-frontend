import React, { Component } from 'react';
import Stepper from '../components/Stepper';

class CompleteProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedInUser: [],
        };
    }
 
    toggleSidebar = () => {
        this.setState((prevState) => ({
            isCollapsed: !prevState.isCollapsed,
        }));
    };
  render() {
    const { isCollapsed } = this.state;
    return (
        <>
            <div className="fixed w-full z-40 px-4 py-2 border-b border-blue-200 bg-blue-100">
              <img
                src="/images/back-logo.png"
                alt="BacChecker Logo"
                className="h-10 w-auto"
              />
            </div>
            <div className='min-h-screen py-10 px-3 lg:px-20 lg:py-16 bg-blue-100'>
              
                <div className="bg-white rounded-xl w-full min-h-screen shadow-xl">
                    <div className="flex justify-between px-10 py-5 shadow-md shadow-blue-200 ">
                        <div className="">
                            <p className='font-bold text-2xl text-uewBlue mb-1'>Institution Account Setup</p>
                            <p className='text-sm text-gray-700 font-normal'>Please provide all required details and manage your document types efficiently to activate your institution's account</p>
                        </div>
                    </div>
                    <div className="mx-2 py-2 lg:mx-5 lg:py-5">
                        <Stepper />
                    </div>
                
                </div>
            </div>
        </>
      
    );
  }
}

export default CompleteProfile;

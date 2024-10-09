import React, { Component } from 'react';
import { FaPhoneVolume } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';

class AccountInactive extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }
    render() { 
        return ( 
            <>
            <div className="w-full relative flex flex-col items-center justify-center">
                <div className=" ">
                    <img src="/images/review.png" alt="account review img" className="w-60 h-60"/>
                </div>
                <div className="w-64 text-center my-2">
                    <p className="text-2xl font-bold text-gray-900">Your institution profile is under review</p>
                </div>
                <div className="w-96">
                    <p className="text-justify font-medium text-gray-700">Your institution's account is currently under review. During this period, certain features may be restricted. We’ll notify you once the review process is complete. If you have any questions, please reach out to our support team.</p>
                </div>
                <div className="flex space-x-6 mt-10 text-gray-600 text-sm">
                    <div className="flex items-center space-x-1">
                    <FaPhoneVolume />
                    <p>0(303)856478996</p>
                    </div>
                    <div className="flex items-center space-x-2">
                    <IoIosMail size={18}/>
                    <a href="mailto:info@bacchecker.online">info@bacchecker.online</a>
                    </div>
                </div>
            </div>
            </>
         );
    }
}
 
export default AccountInactive;
import React, { Component } from 'react';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }
    render() { 
        return ( 
            <>
            <div className="bg-black rounded-lg p-6 text-white text-2xl">
                <p className='font-semibold'>Get set up to bill clients</p>
                <div className="flex justify-between my-6">
                    <div className="text-lg ml-6">
                        <div className="flex space-x-4">
                            <p>Get approved to accept payments</p>
                            <div className='flex bg-gray-900 text-xs font-semibold text-gray-300 rounded-full px-4'><p className='self-center'>Required</p></div>
                        </div>
                    </div>
                    <div className="bg-blue-700 text-white rounded-lg font-semibold text-base px-6">Start</div>
                </div>
                <div className="h-[1px] w-full bg-gray-800"></div>
                <div className="flex justify-between my-4 ml-4">
                    <div className="text-lg">
                        <p className='font-bold'>Description</p>
                        <p>Start taking payments from customers on your mobile device.</p>
                    </div>
                </div>
            </div>
            </>
         );
    }
}
 
export default Dashboard;
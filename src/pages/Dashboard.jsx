import React, { Component } from 'react';
import { GoGitPullRequest } from 'react-icons/go';
import { GrValidate } from 'react-icons/gr';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import { LuClipboardEdit } from 'react-icons/lu';
import { MdManageHistory, MdOutlineVerifiedUser } from 'react-icons/md';
import withRouter from '../components/withRouter';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        name: ""
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

    render() { 
        return ( 
            <>
            <div className="w-full">
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-8">
                    <div className="col-span-3 flex items-center xl:space-x-8 space-x-4">
                        <div className="">
                            <p className='font-bold text-2xl'>Hello Admin</p>
                            <p className='text-gray-500 text-sm font-medium'>Let's do something great today!</p>
                        </div>
                        <div className="relative self-end flex-1">
                            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg outline-0 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder="Search..." required />
                        </div>
                        <div className="border border-gray-300 px-3 py-1.5 rounded-md self-end bg-gray-50">
                            <IoIosNotificationsOutline size={24}/>
                        </div>
                    </div>
                    
                        
                    <div className="flex justify-between self-center text-blue-800 mt-2 cursor-pointer hover:text-blue-900">
                        <p className='font-bold text-lg'>Institution Profile</p>
                        <LuClipboardEdit size={24}/>
                    </div>
                    
                    
                </div>
                <div className="">
                    <p className='font-bold text-gray-800 text-xl mb-2 mt-6'>Overview {this.state.name}</p>
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-8">
                        <div className="col-span-3 grid grid-cols-2 xl:grid-cols-3 gap-4">
                            <div className="border rounded-md p-4 bg-white">
                                <div className="flex space-x-2 text-gray-700">
                                    <div className="bg-orange-500 text-white p-1 rounded-md">
                                        <GoGitPullRequest size={16}/>
                                    </div>
                                    <p className='font-medium'>Document Requests</p>
                                </div>
                                <div className="mt-6">
                                    <p className='font-bold text-3xl'>15</p>
                                    <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="border rounded-md p-4 bg-white">
                                <div className="flex space-x-2 text-gray-700">
                                    <div className="bg-blue-700 text-white p-1 rounded-md">
                                        <IoDocuments size={16}/>
                                    </div>
                                    <p className='font-medium'>Reviewed Documents</p>
                                </div>
                                <div className="mt-6">
                                    <p className='font-bold text-3xl'>15</p>
                                    <div className="h-1 w-12 bg-blue-700 rounded-full"></div>
                                </div>
                            </div>
                            <div className="border rounded-md p-4 bg-white">
                                <div className="flex space-x-2 text-gray-700">
                                    <div className="bg-yellow-500 text-white p-1 rounded-md">
                                        <GrValidate size={16}/>
                                    </div>
                                    <p className='font-medium'>Validation Requests</p>
                                </div>
                                <div className="mt-6">
                                    <p className='font-bold text-3xl'>23</p>
                                    <div className="h-1 w-12 bg-yellow-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="border rounded-md p-4 bg-white">
                                <div className="flex space-x-2 text-gray-700">
                                    <div className="bg-green-700 text-white p-1 rounded-md">
                                        <MdManageHistory size={16}/>
                                    </div>
                                    <p className='font-medium'>Validation History</p>
                                </div>
                                <div className="mt-6">
                                    <p className='font-bold text-3xl'>15</p>
                                    <div className="h-1 w-12 bg-green-700 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center bg-white -mt-12 p-6">
                            <div className="w-32 h-32 border-2 border-blue-600 rounded-full mx-auto">

                            </div>
                            <div className="text-center font-bold mt-2">
                                <div className="flex space-x-2 justify-center">
                                    <p className='text-gray-800'>Kwame Nkrumnah UST</p>
                                    <MdOutlineVerifiedUser className='text-green-600 self-center' size={18}/>
                                </div>
                                <p className='text-gray-600'>KNUST</p>
                                <p className='font-light text-gray-800'>knust@uew.ef.com</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            </>
         );
    }
}
 
export default withRouter(Dashboard);
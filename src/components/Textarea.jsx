import React, { Component } from 'react';

class Textarea extends Component {
   
    render() { 
        const {label, name, value, onChange, className, error_message} = this.props;

        return (
            <div className={className}>
                <div className="relative h-16 w-full">
                    <textarea
                        className="peer h-full w-full bg-gray-100 pl-3 pt-2 pr-9 outline-0 transition-all focus:border focus:border-blue-600 focus:outline-0 disabled:border-0 rounded-lg"
                        placeholder="" 
                        name={name} 
                        onChange={onChange} 
                        value={value}
                    />
                    
                    <label className="before:content[' '] after:content[' '] text-gray-900 pointer-events-none absolute right-0 -top-[18px] peer-focus:-top-[18px] peer-placeholder-shown:text-gray-500 peer-placeholder-shown:leading-[4.75] flex h-full w-full select-none text-sm font-normal leading-tight transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:block before:h-1.5 before:w-2.5 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-base peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-sm peer-focus:leading-tight peer-focus:text-blue-600 peer-focus:before:border-blue-600 peer-focus:after:border-blue-600 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 peer-not-placeholder-shown:-top-[18px] peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-600">
                        <p>{label}</p>
                    </label>
                    
                    {error_message && <p className='text-sm text-red-600 text-right'>{error_message}</p>}
                </div>

            </div>
           

          

        );
    }
}
 
export default Textarea;
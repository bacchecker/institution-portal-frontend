import React, { Component } from 'react';

class BasicTextFields extends Component {
  render() {
    const { label, name, onChange, value, error, className, type, error_message } = this.props;
    
    return (
      <div className={className}>
       
        <div className="relative h-12 w-full">
          <input
            className="peer h-full w-full  bg-gray-100 pl-4 py-3 pr-9 font-sans rounded-md font-semibold text-blue-gray-700 outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-600 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder="" name={name} onChange={onChange} value={value} type={type}
          />
          {error}
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute right-0 -top-2 flex h-full w-full select-none rounded-tl-md text-[12px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-semibold peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-gray-800 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-600 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-600 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-600 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            <p>{label}</p>
          </label>
        </div>
        {error_message && <p className='text-sm text-red-600 text-right'>{error_message}</p>}
      </div>
    );
  }
}

export default BasicTextFields;

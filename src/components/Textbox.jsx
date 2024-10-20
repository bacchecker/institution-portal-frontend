import React, { Component } from 'react';

class BasicTextFields extends Component {
  render() {
    const { label, name, onChange, value, error, className, type, error_message, caption, disabled } = this.props;
    
    return (
      <div className={className}>
        <div className="relative h-10 w-full"> {/* Adjusted height */}
          <input
            className={`peer h-full w-full bg-gray-100 pl-3 py-2 pr-9 rounded-md text-sm text-blue-gray-700 outline-0 transition-all placeholder-shown:border-0 placeholder-shown:border-blue-gray-200 focus:border focus:border-blue-600 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            placeholder="" 
            name={name} 
            onChange={onChange} 
            value={value} 
            type={type}
            disabled={disabled}
          />
          {error}
          <label className="absolute left-3 -top-[18px] text-gray-900 transition-all pointer-events-none text-sm font-normal text-blue-gray-700 leading-tight 
            peer-placeholder-shown:-top-[10px] peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-gray-500 
            peer-focus:-top-[18px] peer-focus:text-sm peer-focus:text-blue-600">
            {label}
          </label>
        </div>
        <p className="text-xs text-blue-800 text-right">{caption}</p>
        {error_message && <p className="text-sm text-red-600 text-right">{error_message}</p>}
      </div>
    );
  }
}

export default BasicTextFields;

import React, { Component } from 'react';

class SelectSmall extends Component {
  render() {
    const { label, value, onChange, menuItems, name, itemNameKey, error_message } = this.props;

    return (
      <div className="w-full">
        <label
          htmlFor={name}
          className="block ml-3 text-sm text-gray-900 -mt-4"
        >
          {label}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="bg-gray-100 text-gray-900 focus:outline-0 focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-2.5 rounded-md"
        >
          <option value="" disabled>
            Select an option
          </option>
          {menuItems.map((item, id) => (
            <option key={id} value={item.id}>
              {item[itemNameKey]}
            </option>
          ))}
        </select>
        {error_message && <p className='text-sm text-red-600 text-right'>{error_message}</p>}
      </div>
    );
  }
}

export default SelectSmall;

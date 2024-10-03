import React, { Component } from 'react';

class SelectSmall extends Component {
  render() {
    const { label, value, onChange, menuItems, name, itemNameKey, error_message } = this.props;

    return (
      <form className="w-full">
        <label
          htmlFor={name}
          className="block mb-1 text-sm text-gray-900"
        >
          {label}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="bg-gray-100 text-gray-900 font-semibold focus:outline-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 rounded-md"
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
      </form>
    );
  }
}

export default SelectSmall;

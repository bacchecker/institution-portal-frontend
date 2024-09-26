import React, { Component } from 'react';

class SelectSmall extends Component {
  render() {
    const { label, value, onChange, menuItems, name, itemNameKey } = this.props;

    return (
      <form className="w-full">
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
      </form>
    );
  }
}

export default SelectSmall;

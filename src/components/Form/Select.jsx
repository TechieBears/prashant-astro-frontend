import React from 'react';

const Select = ({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`${containerClassName} flex flex-col h-full`}>
      <div>
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      <div className="flex-grow flex flex-col justify-center">
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none bg-white ${className}`}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value || option} 
              value={option.value || option}
            >
              {option.label || option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;

import React from 'react';

// Helper function to normalize options to {value, label} format
const normalizeOption = (option) => {
  if (!option) return { value: '', label: 'Invalid option' };

  // If it's already in the correct format
  if (typeof option === 'object' && 'value' in option && 'label' in option) {
    return {
      value: option.value,
      label: option.label || String(option.value || '')
    };
  }

  // If it's an object but not in the correct format
  if (typeof option === 'object') {
    return {
      value: option._id || option.id || JSON.stringify(option),
      label: option.name || option.title || option.label || JSON.stringify(option)
    };
  }

  // If it's a primitive value
  return {
    value: option,
    label: String(option)
  };
};

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
  isLoading = false, // Add isLoading prop
  ...props
}) => {
  // Normalize all options to ensure they have value and label
  const normalizedOptions = React.useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.map(option => normalizeOption(option));
  }, [options]);

  // Normalize the current value for comparison
  const normalizedValue = React.useMemo(() => {
    if (value === undefined || value === null) return '';
    return String(value);
  }, [value]);

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
      <div className="flex-grow flex flex-col justify-center relative">
        <select
          id={id}
          value={normalizedValue}
          onChange={onChange}
          required={required}
          disabled={disabled || isLoading}
          className={`w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none bg-white ${className} ${isLoading ? 'opacity-75' : ''}`}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {normalizedOptions.map((option, index) => (
            <option
              key={`${id}-option-${option.value}-${index}`}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;

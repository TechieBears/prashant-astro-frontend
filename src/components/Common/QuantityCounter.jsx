import React from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const QuantityCounter = ({
    value,
    onChange,
    min = 1,
    max = 999,
    disabled = false,
    size = 'default'
}) => {
    const handleIncrement = () => {
        if (disabled) return;
        const newValue = Math.min(max, value + 1);
        onChange(newValue);
    };

    const handleDecrement = () => {
        if (disabled) return;
        const newValue = Math.max(min, value - 1);
        onChange(newValue);
    };

    const handleInputChange = (e) => {
        if (disabled) return;
        const inputValue = parseInt(e.target.value) || min;
        const clampedValue = Math.min(max, Math.max(min, inputValue));
        onChange(clampedValue);
    };

    const handleInputBlur = (e) => {
        if (disabled) return;
        const inputValue = parseInt(e.target.value) || min;
        const clampedValue = Math.min(max, Math.max(min, inputValue));
        onChange(clampedValue);
    };

    const sizeClasses = {
        small: 'h-7 text-xs',
        default: 'h-8 text-sm',
        large: 'h-10 text-base'
    };

    const iconSizes = {
        small: 'w-2.5 h-2.5',
        default: 'w-3 h-3',
        large: 'w-4 h-4'
    };

    return (
        <div className={`flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {/* Minus Button */}
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                className={`flex items-center justify-center w-8 h-full border-r border-gray-200 hover:bg-gray-50 transition-colors ${disabled || value <= min ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
            >
                <FaMinus className={`${iconSizes[size]} text-gray-600`} />
            </button>

            {/* Quantity Display */}
            <div className="flex-1 min-w-0">
                <input
                    type="number"
                    value={value}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    min={min}
                    max={max}
                    disabled={disabled}
                    className={`w-full h-full text-center border-0 outline-none focus:ring-0 bg-transparent text-gray-900 font-medium ${disabled ? 'cursor-not-allowed' : 'cursor-text'
                        } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
            </div>

            {/* Plus Button */}
            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                className={`flex items-center justify-center w-8 h-full border-l border-gray-200 hover:bg-gray-50 transition-colors ${disabled || value >= max ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
            >
                <FaPlus className={`${iconSizes[size]} text-gray-600`} />
            </button>
        </div>
    );
};

export default QuantityCounter;

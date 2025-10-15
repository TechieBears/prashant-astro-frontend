import Error from "../Errors/Error";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const TextInput = ({ label, type, props, errors, registerName, style, placeholder, disabled }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const inputId = registerName || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            <div className="relative">
                <input
                    disabled={disabled}
                    type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
                    id={inputId}
                    className={`h-[55px] w-full outline-none px-4 text-base font-tbLex text-black rounded-md bg-slate-100 border-[1.5px] ${errors ? 'border-red-500' : 'border-transparent'} ${style}`}
                    placeholder={placeholder}
                    aria-invalid={!!errors}
                    aria-describedby={`${inputId}-error`}
                    {...props}
                />

                {isPasswordField && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {!showPassword ? (
                            <EyeSlashIcon className="h-6 w-6" />
                        ) : (
                            <EyeIcon className="h-6 w-6" />
                        )}
                    </button>
                )}
            </div>
            {errors && (
                <div id={`${inputId}-error`} className="mt-1">
                    <Error
                        message={
                            errors.message ||
                            `${label.replace(/\b(enter|your)\b/gi, "").trim()} is required`
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default TextInput;

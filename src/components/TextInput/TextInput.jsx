import Error from "../Errors/Error";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const TextInput = ({ label, type, props, errors, registerName, style, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';

    return (
        <>
            <div className="relative">
                <input
                    type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
                    id={registerName}
                    className={`h-[55px] w-full  outline-none px-4 text-base font-tbLex text-black rounded-md bg-slate1 border-[1.5px] ${errors ? 'border-red-500' : 'border-transparent '} ${style}`}
                    placeholder={placeholder}
                    {...props}
                />

                {isPasswordField && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
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
                <Error
                    message={
                        errors.message ||
                        `${label.replace(/\b(enter|your)\b/gi, "").trim()} is required`
                    }
                />
            )}
        </>
    );
};

export default TextInput;

import Error from "../Errors/Error";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const TextInput = ({ label, type, props, errors, registerName, style }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';

    return (
        <>
            <div className="h-[53px] relative flex rounded-lg w-full">
                <input
                    type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
                    id={registerName}
                    className={`peer w-full bg-transparent outline-none px-4 text-base font-tbLex text-black rounded-lg bg-white border-[1.5px] ${errors ? 'border-red-500' : 'border-slate-300 focus:border-primary'} ${style}`}
                    placeholder=" "
                    {...props}
                />
                <label
                    htmlFor={registerName}
                    className={`absolute left-4 px-2 bg-white text-base font-tbLex ${errors ? 'text-red-500' : 'text-slate-400'} top-1/2 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:left-4 peer-placeholder-shown:text-slate-400 peer-focus:top-0 peer-focus:left-3 peer-focus:text-sm peer-focus:text-primary  peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-sm transition-all duration-150 `}
                >
                    {label}
                </label>

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

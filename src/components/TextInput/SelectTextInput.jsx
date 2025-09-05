import { useState } from 'react';
import Error from "../Errors/Error";

const SelectTextInput = ({ label, options, props, errors, registerName, style, disabled }) => {
    const [hasValue, setHasValue] = useState(false);

    const handleChange = (e) => {
        props?.onChange(e);
        setHasValue(!!e?.target?.value);
    };

    return (
        <>
            <div className="h-[53px] relative flex rounded-lg w-full">
                <select
                    disabled={disabled}
                    id={registerName}
                    className={`peer w-full bg-transparent outline-none px-4 text-base font-tbLex text-black rounded-lg bg-white border-[1.5px] appearance-none ${errors ? 'border-red-500' : 'border-slate-300 focus:border-primary'} ${style}`}
                    {...props}
                    onChange={handleChange}
                >
                    <option value="" hidden></option>
                    {options?.map((option) => (
                        <option key={option?.value} value={option?.value}>
                            {option?.label}
                        </option>
                    ))}
                </select>
                <label
                    htmlFor={registerName}
                    className={`absolute left-4 px-2 bg-white text-base font-tbLex ${errors ? 'text-red-500' : 'text-slate-400'} transition-all duration-150 ${hasValue || props?.value ? 'top-[-9px] left-3 text-sm' : 'top-1/2 -translate-y-1/2'
                        }`}
                >
                    {label}
                </label>
            </div>
            {errors?.type === "required" ? <Error message={`${label?.replace(/\b(enter|your)\b/gi, '')?.trim()} is required` || "This field is required"} /> : errors?.type == "validate" && errors?.message && <Error message={errors.message} />}
        </>
    );
};

export default SelectTextInput;

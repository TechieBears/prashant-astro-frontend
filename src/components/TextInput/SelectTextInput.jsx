
import Error from "../Errors/Error";

const SelectTextInput = ({ label, options, props, errors, registerName, style, disabled, placeholder }) => {

    return (
        <>
            <div className="">
                <select
                    disabled={disabled}
                    id={registerName}
                    className={`h-[55px] w-full  outline-none px-4 text-base font-tbLex text-black rounded-md bg-slate1 border-[1.5px] ${errors ? 'border-red-500' : 'border-transparent '} ${style}`}
                    placeholder={placeholder}
                    {...props}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options?.map((option) => (
                        <option key={option?.value} value={option?.value}>
                            {option?.label}
                        </option>
                    ))}
                </select>
            </div>
            {errors?.type === "required" ? <Error message={`${label?.replace(/\b(enter|your)\b/gi, '')?.trim()} is required` || "This field is required"} /> : errors?.type == "validate" && errors?.message && <Error message={errors.message} />}
        </>
    );
};

export default SelectTextInput;

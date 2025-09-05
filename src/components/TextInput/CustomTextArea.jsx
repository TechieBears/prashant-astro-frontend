import Error from "../Errors/Error";

const CustomTextArea = ({ label, props, errors, registerName, style }) => {
    return (
        <>
            <div className="h-[100px] relative flex rounded-lg w-full">
                <textarea
                    id={registerName}
                    className={`peer w-full bg-transparent outline-none px-4 py-3 text-base font-tbLex text-black rounded-lg bg-white border-[1.5px] ${errors ? 'border-red-500' : 'border-slate-300 focus:border-primary'} resize-none ${style}`}
                    placeholder=" "
                    {...props}
                />
                <label
                    htmlFor={registerName}
                    className={`absolute left-4 px-2 bg-white text-base font-tbLex ${errors ? 'text-red-500' : 'text-slate-400'} top-4 -translate-y-1/2 peer-placeholder-shown:top-1/4 peer-placeholder-shown:text-base peer-placeholder-shown:left-4 peer-placeholder-shown:text-slate-400 peer-focus:top-0 peer-focus:left-3 peer-focus:text-sm peer-focus:text-primary peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-sm transition-all duration-150 `}
                >
                    {label}
                </label>
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

export default CustomTextArea;

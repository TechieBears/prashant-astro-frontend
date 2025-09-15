import Error from "../Errors/Error";

const CustomTextArea = ({ label, props, errors, registerName, style, placeholder }) => {
    return (
        <>
            <div className="h-[100px] relative flex rounded-md w-full">
                <textarea
                    id={registerName}
                    className={`peer w-full  outline-none px-4 py-3 text-base font-tbLex text-black rounded-md bg-slate1 border-[1.5px] ${errors ? 'border-red-500' : 'border-transparent '} ${style}`}
                    placeholder={placeholder}
                    {...props}
                />
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

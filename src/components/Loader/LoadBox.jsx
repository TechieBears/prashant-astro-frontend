import { PulseLoader } from "react-spinners";
const LoadBox = ({ className }) => {
    return (
        <button
            type='button'
            disabled
            className={className ? `${className}` : "h-[52px] flex w-full justify-center items-center tracking-wider font-tbPop rounded-lg bg-primary px-3 py-2.5 text-base font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"}
        >
            Loading<span><PulseLoader color="#fff" size={4} /></span>
        </button>
    )
}

export default LoadBox

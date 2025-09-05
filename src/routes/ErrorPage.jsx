import { useNavigate } from "react-router-dom"
import { formBtn1 } from "../utils/CustomClass";
import notFound from "../assets/notFound.svg";

const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center text-sm max-md:px-4">
            <img loading="lazy" src={notFound} alt="page not found" className="w-1/3 h-1/3" />
            <div className="h-1 w-16 rounded bg-primary my-5 md:my-7"></div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800">Page Not Found</p>
            <p className="text-sm md:text-base mt-4 text-slate-500 max-w-md text-center">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <div className="flex items-center gap-4 mt-6">
                <button className={formBtn1} onClick={() => navigate('/')}> Return Home</button>
            </div>
        </div>
    )
}

export default ErrorPage

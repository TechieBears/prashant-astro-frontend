import ProfileSidebar from "../../../components/Sidebar/ProfileSidebar";
import CustomerCareImg from "../../../assets/customer-care.svg";
import Phone from "../../../assets/phone.png";
import Email from "../../../assets/email.png";
import Whatsapp from "../../../assets/whatsapp.png";

const CustomerSupport = () => {

    return (
        <>
            <div className="flex flex-col sm:flex-row px-4 sm:px-6 lg:px-40 py-6 sm:py-12 gap-4 lg:gap-6">
                <div className="w-full sm:w-64">
                    <ProfileSidebar />
                </div>

                <div className="flex-1 rounded-lg bg-white p-4 sm:p-6">
                    <h2 className="font-semibold text-lg mb-6">Customer Care</h2>

                    <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-4">
                        <div className="w-full max-w-xs mx-auto md:mx-0 md:w-1/2 lg:px-8 flex items-center justify-center">
                            <img 
                                src={CustomerCareImg} 
                                alt="Customer Care" 
                                className="w-full h-auto max-h-64 object-contain" 
                            />
                        </div>

                        <div className="w-full space-y-8 md:space-y-6 pt-0 md:pt-4">
                            <div className="flex gap-3 sm:gap-4 items-center">
                                <img 
                                    src={Phone} 
                                    alt="Phone" 
                                    className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" 
                                />
                                <div>
                                    <h2 className="font-semibold text-sm sm:text-base">Phone Support</h2>
                                    <p className="text-sm sm:text-base">+91-9619793852</p>
                                </div>
                            </div>

                            <div className="flex gap-3 sm:gap-4 items-center">
                                <img 
                                    src={Whatsapp} 
                                    alt="Whatsapp" 
                                    className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" 
                                />
                                <div>
                                    <h2 className="font-semibold text-sm sm:text-base">Whatsapp Support</h2>
                                    <p className="text-sm sm:text-base">+91-9619793852</p>
                                </div>
                            </div>

                            <div className="flex gap-3 sm:gap-4 items-center">
                                <img 
                                    src={Email} 
                                    alt="Email" 
                                    className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" 
                                />
                                <div>
                                    <h2 className="font-semibold text-sm sm:text-base">E-Mail Support</h2>
                                    <p className="text-sm sm:text-base break-all">panditprashant@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
export default CustomerSupport;
import ProfileSidebar from "../../../components/Sidebar/ProfileSidebar";
import CustomerCareImg from "../../../assets/customer-care.svg";
import Phone from "../../../assets/phone.png";
import Email from "../../../assets/email.png";
import Whatsapp from "../../../assets/whatsapp.png";

const CustomerSupport = () => {

    return (
        <>
            <div className="flex px-40 py-12">
                <ProfileSidebar />

                <div className="flex-1 ml-6 rounded-lg bg-white p-4">
                    <h2 className="font-semibold text-lg mb-6">Customer Care</h2>

                    <div className="flex items-stretch gap-4">
                        <img src={CustomerCareImg} alt="Customer Care" className="object-contain px-16" />

                        <div className="flex flex-col pt-20 space-y-16">
                            <div className="flex gap-4">
                                <img src={Phone} alt="Phone" className="w-[54px] h-[54px]" />
                                <div>
                                    <h2 className="font-semibold">Phone Support</h2>
                                    <p>+91-9619793852</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <img src={Whatsapp} alt="Whatsapp" className="w-[54px] h-[54px]" />
                                <div>
                                    <h2 className="font-semibold">Whatsapp Support</h2>
                                    <p>+91-9619793852</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <img src={Email} alt="Email" className="w-[54px] h-[54px]" />
                                <div>
                                    <h2 className="font-semibold">E-Mail Support</h2>
                                    <p>panditprashant@gmail.com</p>
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
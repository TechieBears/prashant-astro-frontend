import { useSelector } from 'react-redux';
import { ArrowLeft, CallCalling, Profile2User, SmsNotification } from 'iconsax-reactjs';
import PathName from '../../../components/PathName/PathName';

const AdminProfile = () => {
    const user = useSelector(state => state?.user?.userDetails)

    return (
        <div className='h-screen bg-slate-100'>
            <div className="flex items-center justify-between px-10 pt-5">
                <button className="flex items-center space-x-1 bg-transparent " onClick={() => window.history.back()}>
                    <ArrowLeft size={25} className='text-black' />
                    <span className='fs-3 base-font-600'>Back</span>
                </button>
                <div className="">
                    <PathName />
                </div>
            </div>
            <div className="lg:flex lg:items-center lg:justify-between bg-white p-8 m-4 sm:m-8 rounded-xl">
                <div className="min-w-0 flex-1">
                    <div className="flex  gap-x-6 ">
                        <img loading="lazy" className="h-[120px] w-[120px] rounded-full border object-contain" src={user?.user?.profilePicture || "https://cdn.tailgrids.com/assets/images/core-components/account-dropdowns/image-1.jpg"} alt="User_Profile" />
                        <div>
                            <h2 className="text-xl font-bold font-tb leading-7 text-gray-700 sm:truncate sm:text-2xl sm:tracking-tight capitalize">
                                {user?.user?.firstName || "-----"} {user?.user?.lastName || "-----"}
                            </h2>
                            <div className="flex items-center space-x-5">
                                <div className="mt-2 flex items-center  text-base text-gray-500">
                                    <SmsNotification variant='TwoTone' size="22" className='text-gray-400 mr-1.5' />
                                    {user?.user?.email ? user?.user?.email : "-------------"}
                                </div>
                                <div className="mt-2 flex items-center  text-base text-gray-500">
                                    <CallCalling variant='TwoTone' size="22" className='text-gray-400 mr-1.5' />
                                    {user?.user?.mobileNo ? user?.user?.mobileNo : "-------------"}
                                </div>

                            </div>
                            <div className="mt-2 flex items-center  text-base text-gray-500 capitalize">
                                <Profile2User variant='TwoTone' size="22" className='text-gray-400 mr-1.5' />
                                {user?.user?.role ? user?.user?.role : "-------------"}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div>

    )
}

export default AdminProfile

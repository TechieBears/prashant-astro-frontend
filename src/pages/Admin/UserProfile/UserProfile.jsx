import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import userImg from '../../../assets/user.webp';
import { ArrowLeft, Building3, CallCalling, Edit, Profile2User, SmsNotification } from 'iconsax-reactjs';
import { formBtn1, formBtn2, inputClass } from '../../../utils/CustomClass';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import Error from '../../../components/Errors/Error';
import { editUser } from '../../../api';
import toast from 'react-hot-toast';
import { setLoggedUserDetails } from '../../../redux/Slices/loginSlice';
import PathName from '../../../components/PathName/PathName';

const UserProfile = () => {
    const user = useSelector(state => state?.user?.userDetails)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [open, setOpen] = useState(true)
    const [file, setFile] = useState('')
    const [upload, setUpload] = useState('')
    const dispatch = useDispatch()


    const handleChange = (e) => {
        setUpload(e.target.files[0]);
        setFile(URL.createObjectURL(e.target.files[0]));
    }
    // ================================ Submit form data ===========================
    const onSubmit = (data) => {

        data.email = user?.email
        try {
            editUser(user?.userid, data).then(res => {
                if (res) {

                    setOpen(!open);
                    dispatch(setLoggedUserDetails({ ...user, ...data }))
                    toast.success(res?.message);
                } else {
                    console.log('failed to update user')
                }
            })
        } catch (error) {
            console.log("error:", error)
        }
    }
    // ====================================== close ==================================
    const close = () => {
        reset();
        setOpen(!open);
    }

    // ==================================== Reset form ==================================
    useEffect(() => {
        reset({
            first_name: user?.first_name,
            last_name: user?.last_name,
            phone_no: user?.phone_no,
            address: user?.address,
            city: user?.city,
            state: user?.state,
        })
        setFile(user?.profile)
    }, [])
    return (
        <>
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
                        <img loading="lazy" className="h-[120px] w-[120px] rounded-full border object-contain" src={user?.user?.profilePicture ? user?.user?.profilePicture : userImg} alt="User_Profile" />
                        <div>
                            <h2 className="text-xl font-bold font-tb leading-7 text-gray-700 sm:truncate sm:text-2xl sm:tracking-tight capitalize">
                                {user?.user?.fullName || "-----"}
                            </h2>
                            <div className="flex items-center space-x-5">
                                <div className="mt-2 flex items-center  text-base text-gray-500">
                                    <SmsNotification size="22" className='text-gray-400 mr-1.5' />
                                    {user?.user?.email ? user?.user?.email : "-------------"}
                                </div>
                                <div className="mt-2 flex items-center  text-base text-gray-500">
                                    <CallCalling size="22" className='text-gray-400 mr-1.5' />
                                    {user?.user?.phoneNumber ? user?.user?.phoneNumber : "-------------"}
                                </div>

                            </div>
                            <div className="mt-2 flex items-center  text-base text-gray-500 capitalize">
                                <Profile2User size="22" className='text-gray-400 mr-1.5' />
                                {user?.user?.baseRole ? user?.user?.baseRole : "-------------"}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>

    )
}

export default UserProfile

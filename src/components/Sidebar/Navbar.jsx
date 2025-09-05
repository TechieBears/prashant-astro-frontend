import "../../css/Navbar.css"
import { XMarkIcon } from "@heroicons/react/24/outline";
import { HamburgerMenu, Profile, SmsNotification } from 'iconsax-reactjs';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { useEffect, useState } from 'react';
import LogoutModal from '../Modals/NavbarModals/LogoutModal';
import { formBtn1 } from '../../utils/CustomClass';

const Navbar = ({ mobileSidebar, setMobileSidebar, setIsActiveLink, isActiveLink }) => {
    const user = useSelector((state) => state.user.userDetails)
    const [open, setOpen] = useState(false)
    const [card, setCard] = useState(true)
    const [openSlide, setOpenSlide] = useState(false)
    const [Notification, setNotification] = useState(false)
    // ============================= logout user dashbaord ================================
    const logOut = () => {
        setOpen(!open)
        setCard(!card)
    }

    const [scrolled, setScrolled] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const shouldShowShadow =
                (prevScrollPos < currentScrollPos) ||
                (currentScrollPos > 20);

            setScrolled(shouldShowShadow);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    return (
        <>
            <div className={`${mobileSidebar ? "left-[15rem]" : ""} ${isActiveLink ? "left-[5rem]" : "left-0 xl:left-[15rem]"}  duration-700 transition-all ease-in-out fixed top-0 right-0 py-3.5 px-4 z-50 md:px-3 ${scrolled ? 'bg-white/90 backdrop-blur-[3px] ' : 'bg-white/50'}`} >
                <div className="flex items-center justify-between md:px-2">
                    <div className="hidden xl:block">
                        <button onClick={() => { setIsActiveLink(!isActiveLink), console.log("ss") }} className=''>
                            <HamburgerMenu size={27} variant="TwoTone" className={` duration-700 ease-in-out transition-all ${!isActiveLink ? "-rotate-180" : ""}`} />
                        </button>
                    </div>
                    <button className='relative xl:hidden  shadow-none ' onClick={() => { setMobileSidebar(!mobileSidebar), console.log("ff") }}>
                        {mobileSidebar ? <XMarkIcon className='w-8 h-8 text-gray-500' /> : <HamburgerMenu size={28} className='text-gray-500' />}
                    </button>
                    <div className="flex item-center space-x-7">
                        {/* <button className=' relative' onClick={() => setNotification(!Notification)}>
                            <span className="absolute flex top-0 -right-2 h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <NotificationBing size="26" className='text-black' variant='TwoTone' />
                        </button> */}
                        <div className="flex items-center" onClick={() => setCard(!card)}>
                            <div className="flex-shrink-0">
                                <img loading="lazy" className="h-12 w-12 rounded-full object-cover bg-slate1 border-2 border-primary " src={user?.user?.profilePicture != "" ? user?.user?.profilePicture : 'https://bootstrapdemos.wrappixel.com/materialM/dist/assets/images/profile/user-1.jpg'} alt="user" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============= profile seacation ========= */}
            <ProfileSection card={card} setCard={setCard} logOut={logOut} />

            {/* ============= notification seacation ========= */}
            {/* <NotificationSection notification={Notification} setNotification={setNotification} /> */}
            {/* ============= profile seacation ========= */}
            <LogoutModal setOpen={setOpen} open={open} />
        </>
    )
}

const ProfileSection = ({ card, setCard, logOut }) => {
    const user = useSelector((state) => state.user.userDetails)
    return (
        <div className={`${card ? "top-20 -right-96 opacity-0" : "top-20 right-5 opacity-100"} bg-white/90 backdrop-blur-[3px]  transition-all ease-in-out duration-700 fixed shadow-lg  z-20 rounded-lg `}>
            <div
                className="z-20 items-center  text-start transition-opacity duration-100 border-none bg-white/90 backdrop-blur-[3px] text-lg  focus:outline-none w-screen sm:w-[340px] py-5 rounded-lg"
                role="menu"
                aria-labelledby="user-profile-button"
                aria-orientation="vertical"
            >
                <ul className="focus:outline-none">
                    <div className="px-6">
                        <h3 className="text-lg font-semibold text-tbLex">User Profile</h3>
                        <div className="flex items-center gap-4 pb-4 border-b border-dashed border-slate-300 mt-5 mb-3">
                            <img
                                alt="logo"
                                className="rounded-full w-20 h-20 object-cover bg-slate1"
                                src={user?.user?.profilePicture != "" ? user?.user?.profilePicture : 'https://bootstrapdemos.wrappixel.com/materialM/dist/assets/images/profile/user-1.jpg'}
                            />
                            <div className="leading-4">
                                <h5 className="text-base font-tbLex font-medium">{user?.user?.fullName}</h5>
                                <span className="text-xs font-tbLex text-slate-500 font-normal">Admin</span>
                                <p className=" mb-0 mt-1 flex items-center space-x-1">
                                    <span><SmsNotification size={20} className='text-slate-500' /></span>
                                    <span className='text-xs font-tbLex font-normal'>{user?.user?.email}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        <li role="menuitem" className="focus:outline-none">
                            <NavLink to={"/profile"} onClick={() => setCard(!card)}
                                className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                            >
                                <div className="flex items-center w-full">
                                    <div className="h-8 w-8 flex-shrink-0 rounded-md flex justify-center items-center bg-lightprimary">
                                        <Profile size={25} className='group-hover/link:text-primary' variant='TwoTone' />
                                    </div>
                                    <div className="ps-4 flex justify-between w-full">
                                        <div className="w-3/4 -space-y-0.5">
                                            <h5 className="mb-1 text-sm font-tbLex group-hover/link:text-primary">My Profile</h5>
                                            <h6 className="text-xs text-slate-500">Account settings</h6>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        </li>

                        {/* <li role="menuitem" className="focus:outline-none">
                            <a
                                href="/"
                                className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                            >
                                <div className="flex items-center w-full">
                                    <div className="h-8 w-8 flex-shrink-0 rounded-md flex justify-center items-center bg-lightprimary">
                                        <Notepad2 size={25} className='group-hover/link:text-primary' variant='TwoTone' />
                                    </div>
                                    <div className="ps-4 flex justify-between w-full">
                                        <div className="w-3/4 -space-y-0.5">
                                            <h5 className="mb-1 text-sm font-tbLex group-hover/link:text-primary">My Notes</h5>
                                            <h6 className="text-xs text-slate-500">My deily Notes</h6>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </li>

                        <li role="menuitem" className="focus:outline-none">
                            <a
                                href="/"
                                className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                            >
                                <div className="flex items-center w-full">
                                    <div className="h-8 w-8 flex-shrink-0 rounded-md flex justify-center items-center bg-lightprimary">
                                        <Setting2 size={25} className='group-hover/link:text-primary' variant='TwoTone' />
                                    </div>
                                    <div className="ps-4 flex justify-between w-full">
                                        <div className="w-3/4 -space-y-0.5">
                                            <h5 className="mb-1 text-sm font-tbLex group-hover/link:text-primary">Setting</h5>
                                            <h6 className="text-xs text-slate-500">My deily Notes</h6>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </li> */}
                    </div>
                    <div className="pt-5 px-5">
                        <button type='submit' onClick={logOut} className={`${formBtn1}  bg-red-500 hover:bg-red-500/90 w-full tracking-tight text-sm`}>Logout</button>
                    </div>
                </ul>
            </div>

        </div>
    )
}
const NotificationSection = ({ notification, setNotification }) => {
    return (
        <div className={`${!notification ? " -top-96 opacity-0" : " top-20 opacity-100"} bg-white/90 right-20 backdrop-blur-[3px]  transition-all ease-in-out duration-500 fixed shadow-lg  z-20 rounded-lg `}>
            <div
                data-testid="flowbite-dropdown"
                aria-expanded="true"
                tabIndex="-1"
                className="z-10 items-center shadow-lg text-start transition-opacity duration-100 border-none bg-white text-lg focus:outline-none w-screen sm:w-[340px] py-5 rounded-lg"
                id=":r1u:"
                role="menu"
                aria-labelledby=":r1v:"
                aria-orientation="vertical"
            >
                <ul className="focus:outline-none" tabIndex="-1">
                    <div className="flex items-center px-6 justify-between">
                        <h3 className="mb-0 text-lg font-semibold font-tbLex">Notifications</h3>
                        <span className="flex h-fit w-fit items-center font-medium font-tbPop bg-red-500 text-white p-1 text-xs rounded-full px-2.5 py-1" data-testid="flowbite-badge">
                            <span>5 new</span>
                        </span>
                    </div>

                    <div data-simplebar="init" className="max-h-80 mt-3 overflow-y-scroll">
                        <div
                            className="simplebar-content-wrapper"
                            tabIndex="0"
                            role="region"
                            aria-label="scrollable content"
                            style={{ height: 'auto', overflow: ' scroll' }}
                        >
                            <div className="simplebar-content" style={{ padding: '0px' }}>
                                {/* Notification Item 1 */}
                                <li role="menuitem" className="focus:outline-none">
                                    <a
                                        href="/headless-ui/dropdown"
                                        type="button"
                                        className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                                        tabIndex="-1"
                                        data-discover="true"
                                    >
                                        <div className="flex items-center w-full space-x-2">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full flex justify-center items-center bg-lighterror ">
                                                <SmsNotification size={24} variant='TwoTone' className='text-orange-500' />
                                            </div>
                                            <div className=" flex justify-between w-full">
                                                <div className="w-3/4 text-start leading-4 -space-y-0.5">
                                                    <h5 className="mb-1 text-sm font-tbLex font-medium group-hover/link:text-primary">Launch Admin</h5>
                                                    <div className="text-xs text-slate-500  line-clamp-1">Just see the my new admin!</div>
                                                </div>
                                                <h6 className="text-xs block font-tbPop self-start pt-1.5">9:30 AM</h6>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li role="menuitem" className="focus:outline-none">
                                    <a
                                        href="/headless-ui/dropdown"
                                        type="button"
                                        className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                                        tabIndex="-1"
                                        data-discover="true"
                                    >
                                        <div className="flex items-center w-full space-x-2">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full flex justify-center items-center bg-lighterror ">
                                                <SmsNotification size={24} variant='TwoTone' className='text-orange-500' />
                                            </div>
                                            <div className=" flex justify-between w-full">
                                                <div className="w-3/4 text-start leading-4 -space-y-0.5">
                                                    <h5 className="mb-1 text-sm font-tbLex font-medium group-hover/link:text-primary">Launch Admin</h5>
                                                    <div className="text-xs text-slate-500  line-clamp-1">Just see the my new admin!</div>
                                                </div>
                                                <h6 className="text-xs block font-tbPop self-start pt-1.5">9:30 AM</h6>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li role="menuitem" className="focus:outline-none">
                                    <a
                                        href="/headless-ui/dropdown"
                                        type="button"
                                        className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                                        tabIndex="-1"
                                        data-discover="true"
                                    >
                                        <div className="flex items-center w-full space-x-2">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full flex justify-center items-center bg-lighterror ">
                                                <SmsNotification size={24} variant='TwoTone' className='text-orange-500' />
                                            </div>
                                            <div className=" flex justify-between w-full">
                                                <div className="w-3/4 text-start leading-4 -space-y-0.5">
                                                    <h5 className="mb-1 text-sm font-tbLex font-medium group-hover/link:text-primary">Launch Admin</h5>
                                                    <div className="text-xs text-slate-500  line-clamp-1">Just see the my new admin!</div>
                                                </div>
                                                <h6 className="text-xs block font-tbPop self-start pt-1.5">9:30 AM</h6>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li role="menuitem" className="focus:outline-none">
                                    <a
                                        href="/headless-ui/dropdown"
                                        type="button"
                                        className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                                        tabIndex="-1"
                                        data-discover="true"
                                    >
                                        <div className="flex items-center w-full space-x-2">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full flex justify-center items-center bg-lighterror ">
                                                <SmsNotification size={24} variant='TwoTone' className='text-orange-500' />
                                            </div>
                                            <div className=" flex justify-between w-full">
                                                <div className="w-3/4 text-start leading-4 -space-y-0.5">
                                                    <h5 className="mb-1 text-sm font-tbLex font-medium group-hover/link:text-primary">Launch Admin</h5>
                                                    <div className="text-xs text-slate-500  line-clamp-1">Just see the my new admin!</div>
                                                </div>
                                                <h6 className="text-xs block font-tbPop self-start pt-1.5">9:30 AM</h6>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li role="menuitem" className="focus:outline-none">
                                    <a
                                        href="/headless-ui/dropdown"
                                        type="button"
                                        className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                                        tabIndex="-1"
                                        data-discover="true"
                                    >
                                        <div className="flex items-center w-full space-x-2">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full flex justify-center items-center bg-lighterror ">
                                                <SmsNotification size={24} variant='TwoTone' className='text-orange-500' />
                                            </div>
                                            <div className=" flex justify-between w-full">
                                                <div className="w-3/4 text-start leading-4 -space-y-0.5">
                                                    <h5 className="mb-1 text-sm font-tbLex font-medium group-hover/link:text-primary">Launch Admin</h5>
                                                    <div className="text-xs text-slate-500  line-clamp-1">Just see the my new admin!</div>
                                                </div>
                                                <h6 className="text-xs block font-tbPop self-start pt-1.5">9:30 AM</h6>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li role="menuitem" className="focus:outline-none">
                                    <a
                                        href="/headless-ui/dropdown"
                                        type="button"
                                        className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                                        tabIndex="-1"
                                        data-discover="true"
                                    >
                                        <div className="flex items-center w-full space-x-2">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full flex justify-center items-center bg-lighterror ">
                                                <SmsNotification size={24} variant='TwoTone' className='text-orange-500' />
                                            </div>
                                            <div className=" flex justify-between w-full">
                                                <div className="w-3/4 text-start leading-4 -space-y-0.5">
                                                    <h5 className="mb-1 text-sm font-tbLex font-medium group-hover/link:text-primary">Launch Admin</h5>
                                                    <div className="text-xs text-slate-500  line-clamp-1">Just see the my new admin!</div>
                                                </div>
                                                <h6 className="text-xs block font-tbPop self-start pt-1.5">9:30 AM</h6>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li role="menuitem" className="focus:outline-none">
                                    <a
                                        href="/headless-ui/dropdown"
                                        type="button"
                                        className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                                        tabIndex="-1"
                                        data-discover="true"
                                    >
                                        <div className="flex items-center w-full space-x-2">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full flex justify-center items-center bg-lighterror ">
                                                <SmsNotification size={24} variant='TwoTone' className='text-orange-500' />
                                            </div>
                                            <div className=" flex justify-between w-full">
                                                <div className="w-3/4 text-start leading-4 -space-y-0.5">
                                                    <h5 className="mb-1 text-sm font-tbLex font-medium group-hover/link:text-primary">Launch Admin</h5>
                                                    <div className="text-xs text-slate-500  line-clamp-1">Just see the my new admin!</div>
                                                </div>
                                                <h6 className="text-xs block font-tbPop self-start pt-1.5">9:30 AM</h6>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5 px-5">
                        <button type='submit' className={`${formBtn1}  bg-red-500 hover:bg-red-500/90 w-full tracking-tight font-normal text-sm`}>See All Notifications</button>
                    </div>
                </ul>
            </div>

        </div>
    )
}


export default Navbar

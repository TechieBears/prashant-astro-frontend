import "../../css/Navbar.css"
import {
    ArrowDown2,
    LoginCurve,
    NotificationBing,
    Profile,
    Setting2,
    SmsNotification,
    User,
} from 'iconsax-reactjs';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import LogoutModal from '../Modals/NavbarModals/LogoutModal';
import { formBtn1 } from '../../utils/CustomClass';
import greetingTime from "greeting-time";
import moment from "moment";

const Navbar = ({ mobileSidebar, setMobileSidebar, setIsActiveLink, isActiveLink }) => {
    const user = useSelector((state) => state.user.userDetails)
    const [open, setOpen] = useState(false)
    const [card, setCard] = useState(true)
    // ============================= logout user dashbaord ================================
    const logOut = () => {
        setOpen(!open)
        setCard(!card)
    }
    return (
        <>
            <div className={`${mobileSidebar ? "left-[15rem]" : ""} ${isActiveLink ? "left-[5rem]" : "left-0 xl:left-[15rem]"}  duration-700 transition-all ease-in-out  pt-3.5 py-2 px-4 z-50 md:px-3 m-5 mx-7 rounded-xl bg-white mt-7`} >
                <div className="md:px-2">
                    {/* <div className="hidden xl:block">
                        <button onClick={() => { setIsActiveLink(!isActiveLink), console.log("ss") }} className=''>
                            <HamburgerMenu size={27} variant="TwoTone" className={` duration-700 ease-in-out transition-all ${!isActiveLink ? "-rotate-180" : ""}`} />
                        </button>
                    </div>
                    <button className='relative xl:hidden  shadow-none ' onClick={() => { setMobileSidebar(!mobileSidebar), console.log("ff") }}>
                        {mobileSidebar ? <XMarkIcon className='w-8 h-8 text-gray-500' /> : <HamburgerMenu size={28} className='text-gray-500' />}
                    </button> */}
                    <div className="flex items-center justify-between">
                        {/* =====================Dashboard header===================== */}
                        <div className="px-1 py-3 space-y-1">
                            <h4 className="text-xs font-tbPop font-medium text-slate-800">
                                {moment().format('ddd , DD MMMM YYYY')}
                            </h4>
                            <div className="flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6 ">
                                <h2 className="font-tbLex font-bold text-2xl  md:text-2xl whitespace- tracking-tight capitalize text-slate-800">
                                    {greetingTime(new Date())} 👋🏻, <span className="capitalize text-primary"> {user?.user?.fullName || "Guest User"}</span>
                                </h2>
                            </div>
                            <div className="flex items-center text-xs font-tbPop font-normal text-slate-500">
                                Track the daily activity of your users and manage them easily.
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <NotificationSection />
                            <ProfilePage />
                            {/* <div className="" onClick={() => setCard(!card)}>
                                <div className="bg-white shadow-md rounded-3xl px-1.5 pr-2 py-1 w-full flex items-center space-x-2 cursor-pointer">
                                    <img loading="lazy" className="h-10 w-10 rounded-full object-cover bg-slate1 border-2 border-primary " src={'https://bootstrapdemos.wrappixel.com/materialM/dist/assets/images/profile/user-1.jpg'} alt="user" />
                                    <h5 className="text-sm font-tbPop font-medium text-black">{user?.user?.fullName || "Guest User"}</h5>
                                    <ArrowDown2 size="20" className='text-slate-500' variant='TwoTone' />
                                </div>
                            </div> */}

                        </div>

                    </div>
                </div>
            </div>

            {/* ============= profile seacation ========= */}
            {/* <ProfileSection card={card} setCard={setCard} logOut={logOut} /> */}


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
        <div className={`${card ? " -right-96 opacity-0" : " right-5 opacity-100"} top-24 bg-white/90 backdrop-blur-[3px]  transition-all ease-in-out duration-700 fixed shadow-lg  z-20 rounded-2xl `}>
            <div
                className="z-20 items-center  text-start transition-opacity duration-100 border-none bg-white/90 backdrop-blur-[3px] text-lg  focus:outline-none w-screen sm:w-[340px] py-5 rounded-2xl"
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


const ProfilePage = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return (
        <section className=" ">
            <div className="container">
                <div className="flex justify-center">
                    <div className="relative inline-block">
                        <div className="" ref={trigger}
                            onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <div className="bg-white shadow-md rounded-3xl px-1.5 pr-2 py-1 w-full flex items-center space-x-2 cursor-pointer">
                                <img loading="lazy" className="h-10 w-10 rounded-full object-cover bg-slate1 border-2 border-primary " src={'https://bootstrapdemos.wrappixel.com/materialM/dist/assets/images/profile/user-1.jpg'} alt="user" />
                                <h5 className="text-sm font-tbPop font-medium text-black">{"Guest User"}</h5>
                                <span className={dropdownOpen ? "-rotate-180 duration-300 transition-all" : "rotate-0 duration-300 transition-all"}>
                                    <ArrowDown2 size="20" className='text-slate-500' variant='TwoTone' />
                                </span>
                            </div>
                        </div>
                        <div
                            ref={dropdown}
                            onFocus={() => setDropdownOpen(true)}
                            onBlur={() => setDropdownOpen(false)}
                            className={`absolute right-0 top-14 w-[240px] overflow-hidden rounded-lg z-50 bg-white shadow-lg border border-slate-100 transition-all ease-in-out duration-500 ${dropdownOpen ? "block opacity-100 transition-all ease-in-out duration-500" : "hidden opacity-0 transition-all ease-in-out duration-500"}`}
                        >
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="relative aspect-square w-16 rounded-full">
                                    <img
                                        src="https://cdn.tailgrids.com/assets/images/core-components/account-dropdowns/image-1.jpg"
                                        alt="account"
                                        className="w-full rounded-full object-cover object-center"
                                    />
                                    <span className="absolute right-0 top-1 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 "></span>
                                </div>
                                <div>
                                    <p className="text-base font-tbLex font-semibold text-dark ">
                                        Andrio Miller
                                    </p>
                                    <p className="text-xs font-tbPop text-slate-500 ">
                                        miller@company.com
                                    </p>
                                </div>
                            </div>
                            <div>
                                <a
                                    href="#0"
                                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium font-tbLex text-black hover:bg-gray-50 "
                                >
                                    <span className="flex items-center gap-2">
                                        <User size={22} variant="TwoTone" />
                                        View profile
                                    </span>
                                </a>
                                <a
                                    href="#0"
                                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium font-tbLex text-black hover:bg-gray-50 "
                                >
                                    <span className="flex items-center gap-2">
                                        <Setting2 size={22} variant="TwoTone" />
                                        Settings
                                    </span>
                                </a>
                            </div>
                            <div>
                                <button className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium font-tbLex text-red-500 hover:bg-gray-50 ">
                                    <span className="flex items-center gap-2">
                                        <LoginCurve size={22} variant="TwoTone" />
                                        Log out
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const NotificationSection = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return (
        <section className=" ">
            <div className="container">
                <div className="flex justify-center">
                    <div className="relative inline-block">
                        <button className=' relative' ref={trigger}
                            onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <span className="absolute flex top-0 -right-2 h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <div className="flex items-center space-x-2 p-1.5 bg-slate1 rounded-full">
                                <NotificationBing size="26" className='text-black' variant='TwoTone' />
                            </div>
                        </button>
                        <div
                            ref={dropdown}
                            onFocus={() => setDropdownOpen(true)}
                            onBlur={() => setDropdownOpen(false)}
                            className={`absolute right-0 top-14 py-5 w-[350px] overflow-hidden rounded-lg z-50 bg-white shadow-lg border border-slate-100 transition-all ease-in-out duration-500 ${dropdownOpen ? "block opacity-100 transition-all ease-in-out duration-500" : "hidden opacity-0 transition-all ease-in-out duration-500"}`}
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
                </div>
            </div>
        </section>
    );
}

export default Navbar

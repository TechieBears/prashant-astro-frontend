import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SidebarLink from './SidebarLink';
import Navbar from './Navbar';
import { SidebarAdminApi } from './SidebarApi';
import logo from '../../assets/logo.png';

const Sidebar = ({ children }) => {
    const [isActiveLink, setIsActiveLink] = useState(false);
    const [mobileSidebar, setMobileSidebar] = useState(false);
    return (
        <>
            <div className="w-full h-screen  flex ">
                {mobileSidebar && <div className="w-full h-screen fixed top-0 left-0 bottom-0 right-0 bg-gray-600/20 z-50" onClick={() => setMobileSidebar(!mobileSidebar)} />}
                {/* ====================== sidebar start ===================== */}
                <aside>
                    <div className={`${isActiveLink ? "w-[5rem]" : "w-[15rem]"}  bg-white h-full  duration-700 xl:block  transition-all ease-in-out top-0 left-0 fixed shadow-sm ${mobileSidebar ? "block z-[90]" : "hidden"}`}>
                        <div className="flex  py-5 px-5">
                            <NavLink className="flex space-x-2 items-center" to="/">
                                {/* <Trade size={isActiveLink ? "36" : "30"} className="text-primary " variant='Bulk' /> */}
                                <img loading="lazy" src={logo} className='w-11 h-11 object-contain' />
                                <h2 className={isActiveLink ? 'hidden ' : 'font-tbLex font-bold  text-2xl text-black transition-all duration-700 delay-200 capitalize'}>Soul Plan<span className="text-primary">.</span></h2>
                            </NavLink>
                        </div>
                        <ul className='flex  items-center flex-col overflow-y-scroll h-full  mt-2 mb-20 space-y-1.5 scroll-hide'>
                            {SidebarAdminApi?.map((item, i) =>
                                <SidebarLink
                                    i={i}
                                    key={i}
                                    item={item}
                                    isActiveLink={isActiveLink}
                                />
                            )}
                        </ul>
                    </div>
                </aside>
                {/* ====================== sidebar end ===================== */}
                <div className={isActiveLink ? "navbar-section-active transition-all duration-700 w-full" : "navbar-section transition-all duration-700  w-full "} >
                    {/* ====================== Navbar start ===================== */}
                    <Navbar setMobileSidebar={setMobileSidebar} mobileSidebar={mobileSidebar} setIsActiveLink={setIsActiveLink} isActiveLink={isActiveLink} />
                    {/* ====================== sidebar end ===================== */}
                    <main className="pb-5 pt-20" >
                        {/* ====================== Routes start ===================== */}
                        {children}
                        {/* ======================Routes start ===================== */}
                    </main>
                </div>
            </div>
        </>
    )
}

export default Sidebar

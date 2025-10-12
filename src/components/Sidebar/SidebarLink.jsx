import React from 'react'
import { NavLink } from 'react-router-dom'
import DropdownMenu from './DropdownMenu';
import { CaretDown } from '@phosphor-icons/react';


const SidebarLink = ({ item, isActiveLink, index, setMobileSidebar }) => {
    const { icon, link, title, subMenu } = item
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [textIndex, setTextIndex] = React.useState(null);

    const handleclick = (i) => {
        if (textIndex === i) {
            setShowDropdown(null)
        }
        setShowDropdown(!showDropdown)
    }

    const handleLinkClick = () => {
        if (setMobileSidebar) {
            setMobileSidebar(false);
        }
    }
    return (<>
        {subMenu ?
            <NavLink to={link} key={index} onClick={() => { handleclick(index), setTextIndex(index) }} className={`${!isActiveLink ? "px-5 justify-between" : "justify-center"}  flex items-center  space-x-2  group pt-2 pb-1  my-1 w-full origin-left relative transition-all duration-500 `}>
                {!isActiveLink && <div className="absolute top-0 left-0 transition-all duration-300 origin-left w-1.5 h-full rounded-r-md "></div>
                }
                <div className="flex items-center  space-x-2">
                    <span className="text-black  group-hover:text-primary duration-500 transition-all origin-left icon-wrapper">{icon}</span>
                    {!isActiveLink && <h4 className="text-sm font-tbLex font-medium origin-left text-black group-hover:text-primary duration-500 whitespace-nowrap transition-all  text-title">{title}</h4>}
                </div>

                {!isActiveLink && <div className="">
                    <CaretDown size={20} weight="bold" className={`text-slate-300 duration-300 ease-in-out transition-all ${showDropdown ? "-rotate-180" : ""}`} />
                </div>}
            </NavLink > : <NavLink to={link} i={index} onClick={handleLinkClick} className={`${!isActiveLink ? "px-5" : "justify-center"} flex items-center  space-x-2  group pt-2 pb-1 my-1 w-full origin-left relative transition-all duration-500`}>
                {!isActiveLink && <div className="absolute top-0 left-0 transition-all duration-300 origin-left w-1.5 h-full rounded-r-md left-border opacity-0"></div>
                }
                <div className="flex items-center  space-x-2">
                    <span className="text-black  group-hover:text-primary duration-500 transition-all origin-left icon-wrapper">{icon}</span>
                    {!isActiveLink && <h4 className="text-sm font-tbLex font-medium origin-left text-black group-hover:text-primary duration-500 whitespace-nowrap transition-all  text-title">{title}</h4>}
                </div>
            </NavLink >}
        <div className={showDropdown ? "opacity-100 duration-500 transition-all " + `${!isActiveLink ? "self-start" : ""}` : "opacity-0 duration-700 transition-all"}>
            {showDropdown && subMenu && (
                <DropdownMenu
                    items={subMenu}
                    isActiveLink={isActiveLink}
                    setMobileSidebar={setMobileSidebar}
                />
            )}
        </div>
    </>)
}

export default SidebarLink

import { ArrowRight } from 'iconsax-reactjs'
import { NavLink } from 'react-router-dom'

const ArrowBtn = ({ to, title, newType }) => {
    return (
        <NavLink to={to} onClick={() => window.scrollTo(0, 0)} state={newType} className=" flex items-center space-x-1 !mt-3 group">
            <h4 className='text-primary text-[10px] md:text-sm font-medium font-tbPop group-hover:ml-1 duration-300 transition-all'>{title || "View Profile"}</h4>
            <span><ArrowRight size={20} className='text-primary group-hover:ml-1.5 duration-300 transition-all' /></span>
        </NavLink>
    )
}

export default ArrowBtn

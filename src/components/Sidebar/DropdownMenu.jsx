import { NavLink } from 'react-router-dom';

const DropdownMenu = ({ items, isActiveLink }) => {
    return (
        <>
            {items.map((item, i) => (
                <NavLink to={item?.link} i={i} className={`${!isActiveLink ? "px-9" : "justify-center"} flex items-center  space-x-2  group pt-2.5 pb-1 my-1 w-full origin-left relative transition-all duration-500`}>
                    {!isActiveLink && <div className="absolute top-0 left-0 transition-all duration-300 origin-left w-1.5 h-full rounded-r-md left-border opacity-0"></div>
                    }
                    <div className="flex items-center  space-x-2">
                        <span className="text-slate-700  group-hover:text-primary duration-500 transition-all origin-left icon-wrapper">{item?.icon}</span>
                        {!isActiveLink && <h4 className="text-sm font-tbLex font-medium tracking-tight origin-left text-slate-600 group-hover:text-primary duration-500 whitespace-nowrap transition-all  text-title">{item?.title}</h4>}
                    </div>
                </NavLink >
            ))}
        </>
    );
}

export default DropdownMenu;

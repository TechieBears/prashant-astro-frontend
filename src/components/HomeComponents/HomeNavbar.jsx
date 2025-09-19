import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/astroguid logo.png";
import logoText from "../../assets/astroguid logo text.png";
import { formBtn1 } from "../../utils/CustomClass";
import { List, X } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { LoginCurve, Profile } from "iconsax-reactjs";
import { formatRole } from "../../helper/Helper";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShoppingCart, Phone, ArrowDown01Icon, ArrowDown, ArrowDown01, ArrowDownAZ } from "lucide-react";
import { logoutUser } from "../../redux/Slices/loginSlice";
import toast, { Toaster } from "react-hot-toast";
import { ArrowDown04Icon, ArrowLeft01Icon } from "hugeicons-react";
import { ChevronDown, ChevronUp, User } from 'lucide-react';

const HomeNavbar = () => {
    const { servicesDropdown, productsDropdown } = useSelector(state => state.nav);
    const [expandedItems, setExpandedItems] = useState({});
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [card, setCard] = useState(true);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const login = useSelector((state) => state.user.isLogged);
    const user = useSelector((state) => state.user.userDetails);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);


    const toggleExpanded = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };



    // const transformedServicess = servicesDropdown.map(category => ({
    //    category: category.name,
    //    services: category.services 
    //  }));

    //  console.log('servicesDropdown', servicesDropdown)

const navLinks = useMemo(() => {
    const transformedServices = servicesDropdown.map(category => ({
        category: category.name,
        services: category.services.map(service => ({
            name: service.name,
            path: `/services/${service._id}`,
        })),
    }));

    return [
        login && {
            name: 'Profile',
            path: '/',
            dropdown: [
                { name: "My Account", path: "/profile" },
                { name: "My Orders", path: "/profile/orders" },
                { name: "My Address", path: "/profile/address" },
                { name: "Customer Support", path: "/profile/customer-support" },
                { name: "Privacy Policy", path: "/profile/privacy-policy" },
            ],
        },
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        {
            name: 'Services',
            path: '/services',
            dropdown: transformedServices,
        },
        {
            name: 'Products',
            path: '/products',
            dropdown: [
                {
                    category: 'Spiritual Products',
                    services: [
                        { name: 'Rudraksha Beads', path: '/products/spiritual/rudraksha' },
                        { name: 'Vastu Shastra Books', path: '/products/spiritual/vastu-books' },
                    ],
                },
                {
                    category: 'Accessories',
                    services: [
                        { name: 'Puja Thali', path: '/products/accessories/puja-thali' },
                        { name: 'Incense Sticks', path: '/products/accessories/incense' },
                    ],
                },
            ],
        },
        { name: 'Contact', path: '/contact' },
    ].filter(Boolean); // <- filters out 'false'
}, [servicesDropdown, login]);


    console.log('navLinks', navLinks)

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const handleMouseEnter = (dropdown) => {
        setActiveDropdown(dropdown);
    };

    const handleMouseLeave = () => {
        setActiveDropdown(null);
        setActiveCategory(null);
    };

    const handleCategoryMouseEnter = (categoryName) => {
        setActiveCategory(categoryName);
    };

    const handleCategoryMouseLeave = () => {
        setActiveCategory(null);
    };

    // Ensure component is mounted
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.pageYOffset > 80);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Ensure navbar visibility is maintained
    useEffect(() => {
        setIsNavbarVisible(true);
    }, [login, user]);

    const handleLogout = async () => {
        try {
            const res = await dispatch(logoutUser()).unwrap();

            if (res?.success) {
                toast.success(res.message || "Logged out successfully");
                navigate("/");
                setCard(true);
            } else {
                toast.error(res?.message || "Something went wrong");
            }
        } catch (err) {
            toast.error(err || "Logout failed");
            console.error("Logout Failed:", err);
        }
    };

    useGSAP(() => {
        if (!isMounted) return;

        // Set initial state to visible to prevent disappearing
        gsap.set(".navbar", {
            y: 0,
            opacity: 1,
            immediateRender: true
        });

        // Then animate from hidden state with error handling
        try {
            gsap.from(".navbar", {
                y: -80,
                opacity: 0,
                ease: "power1.inOut",
                duration: 1.2,
                delay: 0.1, // Small delay to ensure DOM is ready
                onComplete: () => {
                    // Ensure navbar is visible after animation
                    gsap.set(".navbar", { opacity: 1, y: 0 });
                }
            });
        } catch (error) {
            console.warn("GSAP animation failed, ensuring navbar visibility:", error);
            gsap.set(".navbar", { opacity: 1, y: 0 });
        }
    }, [isMounted]);

    // Fallback render to ensure navbar is always visible
    if (!isMounted) {
        return (
            <nav className="navbar fixed top-0 left-0 z-[900] w-full bg-white shadow">
                <div className="flex items-center justify-between px-10 md:px-40 gap-4 py-3">
                    <div className="flex items-center">
                        <img src={logo} alt="logo" className="h-10 md:h-12" />
                        <img
                            src={logoText}
                            alt="Pandit Prashant"
                            className="hidden sm:block h-6 md:h-7 mt-1"
                        />
                    </div>
                </div>
            </nav>
        );
    }


    return (
        <>
            <nav className="navbar fixed top-0 left-0 z-[900] w-full bg-white shadow transition-all duration-500 ">
                {/* Top Row - Hidden on Scroll */}
                <div
                    className={`flex items-center justify-between w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16  gap-4 transition-all duration-500 ease-in-out
                    ${isScrolled
                            ? "opacity-0 -translate-y-5 pointer-events-none h-0 overflow-hidden"
                            : "opacity-100 translate-y-0 py-3"
                        }`}
                >
                    {/* Logo */}
                    <button
                        onClick={() => {
                            navigate("/");
                            window.scrollTo(0, 0, { behavior: "smooth" });
                        }}
                        className="flex items-center gap-2"
                    >
                        <img src={logo} alt="logo" className="h-10 md:h-12" />
                        <img
                            src={logoText}
                            alt="Pandit Prashant"
                            className="hidden sm:block h-6 md:h-7 mt-1"
                        />
                    </button>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 mx-6">
                        <div className="relative w-full max-w-lg">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full max-w-lg rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-light-pg border-0"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-font"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Phone + CTA */}
                    <div className="flex items-center gap-10">
                        {
                            !isMenuOpen && (
                                <div className="hidden lg:flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-base-font">
                                        <Phone size={18} />
                                        <span className="text-base-font font-medium">+91 95682 45762</span>
                                    </div>
                                    <button onClick={() => navigate('/services')} className="bg-gradient-orange text-white font-medium px-6 py-2 rounded shadow hover:opacity-90 transition">
                                        Book Consultation
                                    </button>
                                </div>
                            )
                        }

                        {/* Mobile Menu Toggle */}
                        <div className="lg:hidden">
                            <List
                                size={30}
                                className="cursor-pointer"
                                onClick={() => setIsMenuOpen(true)}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="bg-light-gradient-orange">
                    <div className=" flex  justify-between w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
                        {/* Nav Links */}
                        <div className="hidden lg:flex">
                            <div className="flex gap-10 text-white font-medium">
                                {navLinks
                                    .filter(link => link.name !== "Profile")  
                                    .map((link, i) => (
                                        link.dropdown ? (
                                            <div
                                                key={i}
                                                className="relative group py-3"
                                                onMouseEnter={() => handleMouseEnter(link.name)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <NavLink
                                                    to={link.path}
                                                    className={({ isActive }) =>
                                                        `border-b-2 flex gap-1 transition ${isActive ? "border-white" : "border-transparent hover:border-white"}`
                                                    }
                                                >
                                                    <span>{link.name}</span>
                                                    <span>
                                                        <ArrowLeft01Icon size={25} className="text-white -rotate-90" />
                                                    </span>
                                                </NavLink>

                                                {activeDropdown === link.name && (
                                                    <div className="absolute left-0 mt-3 bg-primary shadow-lg rounded-b-md w-max z-50 py-3">
                                                        {link.dropdown.map((category, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="relative px-2"
                                                                onMouseEnter={() => handleCategoryMouseEnter(category.category)}
                                                                onMouseLeave={handleCategoryMouseLeave}
                                                            >
                                                                <p className="text-white text-sm hover:bg-[#FFFFFF26] p-2 pr-4 rounded-md cursor-pointer">
                                                                    <span className="inline-block transform transition-transform duration-300 hover:translate-x-2">
                                                                        {category.category}
                                                                    </span>
                                                                </p>

                                                                {activeCategory === category.category && (
                                                                    <div className="absolute left-full top-0 ml-1 bg-primary shadow-lg rounded-md w-max z-50 py-3">
                                                                        <ul className="space-y-2">
                                                                            {category.services.map((service, j) => (
                                                                                <li key={j}>
                                                                                    <NavLink
                                                                                        to={service.path}
                                                                                        className="text-white text-sm hover:bg-[#FFFFFF26] p-2 pr-4 mx-2 rounded-md block"
                                                                                    >
                                                                                        <span className="inline-block transform transition-transform duration-300 hover:translate-x-2">
                                                                                            {service.name}
                                                                                        </span>
                                                                                    </NavLink>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="py-3" key={i}>
                                                <NavLink
                                                    key={i}
                                                    to={link.path}
                                                    className={({ isActive }) =>
                                                        `inline-block border-b-2 transition ${isActive ? "border-white" : "border-transparent hover:border-white"}`
                                                    }
                                                >
                                                    {link.name}
                                                </NavLink>
                                            </div>
                                        )
                                    ))}
                            </div>

                        </div>

                        {/* Cart & Profile */}
                        <div className="hidden lg:flex items-center gap-5 text-white py-2.5">
                            <ShoppingCart size={20} className="cursor-pointer" onClick={() => navigate("/cart")} />
                            {login ? (
                                <NavLink to={'/profile'}>
                                    <img
                                        alt="profile"
                                        src={
                                            user?.user?.profilePicture ||
                                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                                        }
                                        onClick={() => setCard(!card)}
                                        className="size-7 rounded-full border-2 border-white cursor-pointer"
                                    />
                                </NavLink>

                            ) : (
                                <button
                                    className={`bg-transparent text-white`}
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>

                </div>

                {/* Mobile Menu */}
                <div
                    className={`fixed top-0 left-0 w-screen h-screen lg:hidden bg-white/95 backdrop-blur-md flex flex-col items-center justify-start gap-6 font-medium text-gray-800 transition-all duration-500 ease-in-out z-50 overflow-y-auto ${isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                        }`}
                >
                    {/* Header Section */}
                    <div className="w-full flex justify-between items-center p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <X size={24} className="text-gray-700" />
                        </button>
                    </div>

                    {/* Profile Section - Show if user is logged in */}
                    {login && (
                        <div className="w-full px-6 mb-2">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Welcome back!</h3>
                                        <p className="text-sm text-gray-600">Manage your account</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="flex flex-col w-full px-6 gap-2 flex-1">
                        {navLinks.map((link, i) => (
                            <div key={i} className="w-full">
                                {/* Main Navigation Item */}
                                {link.dropdown ? (
                                    <button
                                        className="w-full flex items-center justify-between text-left py-4 px-4 rounded-lg hover:bg-slate1 transition-all duration-200 text-lg font-medium text-gray-700"
                                        onClick={() => toggleExpanded(i)}
                                    >
                                        <span>{link.name}</span>
                                        {expandedItems[i] ? (
                                            <ChevronUp size={20} className="text-gray-500" />
                                        ) : (
                                            <ChevronDown size={20} className="text-gray-500" />
                                        )}
                                    </button>
                                ) : (
                                   
                                    <NavLink
                                        to={link.path}
                                        onClick={() => {
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                            setIsMenuOpen(false);
                                        }}
                                        className={({ isActive }) =>
                                            `block w-full py-4 px-4 rounded-lg transition-all duration-200 text-lg font-medium ${isActive
                                                ? "text-primary bg-primary-light border-l-4 border-primary"
                                                : "text-gray-700 hover:bg-slate1"
                                            }`
                                        }
                                    >
                                        {link.name}
                                    </NavLink>
                                )}

                                {/* Dropdown Menu */}
                                {link.dropdown && expandedItems[i] && (
                                    <div className="ml-4 mt-2 pb-2 border-l-2 border-gray-100">
                                        {/* Check if it's a grouped dropdown (has category + services) */}
                                        {Array.isArray(link.dropdown) && link.dropdown[0]?.services ? (
                                            link.dropdown.map((category, categoryIndex) => (
                                                <div key={categoryIndex} className="mb-4">
                                                    {category.services.length > 0 && (
                                                        <>
                                                            <h4 className="text-sm font-semibold text-base-font uppercase tracking-wide mb-2 px-4">
                                                                {category.category}
                                                            </h4>
                                                            {category.services.map((service, serviceIndex) => (
                                                                <NavLink
                                                                    key={serviceIndex}
                                                                    to={service.path}
                                                                    onClick={() => {
                                                                        setIsMenuOpen(false);
                                                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                                                    }}
                                                                    className={({ isActive }) =>
                                                                        `block py-2 px-4 ml-2 rounded-md text-base transition-all duration-200 ${isActive
                                                                            ? "text-blue-600 bg-blue-50 font-medium"
                                                                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                                                        }`
                                                                    }
                                                                >
                                                                    {service.name}
                                                                </NavLink>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            // Flat dropdown (like Profile)
                                            link.dropdown?.length > 0 ? (
                                                 link.dropdown.map((item, itemIndex) => (
                                                <NavLink
                                                    key={itemIndex}
                                                    to={item.path}
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                                    }}
                                                    className={({ isActive }) =>
                                                        `block py-2 px-4 ml-2 rounded-md text-base transition-all duration-200 ${isActive
                                                            ? "text-blue-600 bg-blue-50 font-medium"
                                                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                                        }`
                                                    }
                                                >
                                                    {item.name}
                                                </NavLink>
                                            ))
                                            ) : null
                                           
                                        )}
                                    </div>
                                )}

                            </div>
                        ))}
                    </nav>

                    {/* Authentication Buttons - Bottom Section */}
                    <div className="w-full px-6 py-4 border-t border-gray-100 bg-white/80">
                        {!login ? (
                            <div className="flex flex-col gap-4">
                                <button className={`${formBtn1}`} onClick={() => navigate("/login")}>
                                    Login
                                </button>
                                <button
                                    className={`${formBtn1}`}
                                    onClick={() => navigate("/register")}
                                >
                                    Register
                                </button>
                            </div>
                        ) : (
                            <button
                                className={`${formBtn1} !bg-red-500`}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </nav>

        </>
    );
};



export default HomeNavbar;
import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
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

const HomeNavbar = () => {
    const { servicesDropdown, productsDropdown } = useSelector(state => state.nav);

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
 
     // You can similarly map productsDropdown if needed
     return [
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
     ];
   }, [servicesDropdown]);

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
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="logo" className="h-10 md:h-12" />
                        <span className="hidden sm:block text-lg md:text-xl font-semibold text-gray-800">
                            Pandit Prashant
                        </span>
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
                        <span className="hidden sm:block text-lg md:text-xl font-semibold text-gray-800">
                            Pandit Prashant
                        </span>
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
                                    <button className="bg-gradient-orange text-white font-medium px-6 py-2 rounded shadow hover:opacity-90 transition">
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
                            <div className="flex  gap-10 text-white font-medium">
                                {navLinks.map((link, i) => (
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
                                                    ` border-b-2 flex gap-1 transition ${isActive ? "border-white" : "border-transparent hover:border-white"}`
                                                }
                                            >
                                                <span>
                                                {link.name}
                                                </span>
                                                <span>
                                                      <ArrowLeft01Icon   size={25} className="text-white -rotate-90" />
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

                                                            {/* Sub-dropdown (appears on hover of specific category) */}
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
                                <img
                                    alt="profile"
                                    src={
                                        user?.user?.profilePicture ||
                                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                                    }
                                    onClick={() => setCard(!card)}
                                    className="size-10 rounded-full border-2 border-white cursor-pointer"
                                />
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
                   className={`fixed top-0 left-0 w-screen h-screen lg:hidden bg-white flex flex-col items-center justify-center gap-6 font-medium text-gray-800 transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
    }`}

                >
                    <button
                        className="absolute top-4 right-4"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X size={30} color="black" />
                    </button>
                    {navLinks.map((link, i) => (
                        <NavLink
                            key={i}
                            to={link.path}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setIsMenuOpen(false);
                            }}
                            className="text-xl"
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    {!login ? (
                        <div className="flex flex-col gap-4">
                            <button className={`${formBtn1}`} onClick={() => navigate("/login")}>
                                Login
                            </button>
                            <button
                                className={`${formBtn1}`}
                                onClick={() => navigate("/registerName")}
                            >
                                registerName
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
            </nav>

            {/* Profile Dropdown */}
            <ProfileSection card={card} setCard={setCard} onLogout={handleLogout} />
        </>
    );
};

// ProfileSection kept same
const ProfileSection = ({ card, setCard, onLogout }) => {
    const user = useSelector((state) => state.user.userDetails);
    return (
        <div
            className={`${card
                ? "-top-96 right-0 opacity-0"
                : "top-36 lg:right-[1.5rem] xl:right-[6.5rem] opacity-100"
                } bg-white/90 backdrop-blur-[3px] transition-all ease-in-out duration-700 fixed z-[100] rounded-xl hidden lg:block`}
        >
            <div className='absolute -top-2 right-6 bg-white z-20 h-4 w-4 rotate-45 rounded-sm' />
            <div
                className="z-20 items-center text-start transition-opacity duration-100 border-none bg-white/90 backdrop-blur-[3px] text-lg focus:outline-none w-screen sm:w-[11rem] py-3 rounded-xl shadow-xl"
                role="menu"
                aria-labelledby="user-profile-button"
                aria-orientation="vertical"
            >
                <ul className="focus:outline-none">
                    <div className="max-h-[300px] overflow-y-auto">
                        <div className="flex items-center flex-col justify-center">
                            <h3 className='text-sm md:text-sm font-tbPop font-medium text-black'>
                                {formatRole(
                                    user?.user?.role === "primary" ? "Primary Actor" :
                                        user?.user?.role === "secondary" ? "Secondary Actor" :
                                            user?.user?.role === "castingTeam" ? "Casting Team" :
                                                "Production Team"
                                )}
                            </h3>
                            <span className='w-full h-0.5 rounded-full bg-primary inline-block my-2' />
                        </div>
                        <li role="menuitem">
                            <NavLink to={"/profile"} onClick={() => setCard(!card)}
                                className="cursor-pointer text-sm text-ld hover:text-primary px-4 py-2 flex items-center bg-hover group/link"
                            >
                                <div className="h-8 w-8 flex-shrink-0 rounded-md flex justify-center items-center bg-lightprimary">
                                    <Profile size={25} className='group-hover/link:text-primary' variant='TwoTone' />
                                </div>
                                <div className="ps-2">
                                    <h5 className="mb-1 text-sm font-tbLex group-hover/link:text-primary">My Profile</h5>
                                </div>
                            </NavLink>
                        </li>
                        <li role="menuitem">
                            <NavLink onClick={onLogout}
                                className="cursor-pointer text-sm text-ld hover:text-red-500 px-4 py-2 flex items-center bg-hover group/link"
                            >
                                <div className="h-8 w-8 flex-shrink-0 rounded-md flex justify-center items-center bg-lightprimary">
                                    <LoginCurve size={25} className='group-hover/link:text-red-500' variant='TwoTone' />
                                </div>
                                <div className="ps-2">
                                    <h5 className="mb-1 text-sm font-tbLex group-hover/link:text-red-500">Logout</h5>
                                </div>
                            </NavLink>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default HomeNavbar;
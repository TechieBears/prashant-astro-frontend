import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/astroguid logo.png";
import logoText from "../../assets/astroguid logo text.png";
import { formBtn1 } from "../../utils/CustomClass";
import { List, X } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { LoginCurve, Profile } from "iconsax-reactjs";
import { fetchNavDropdownsSuccess, setLoading as setNavLoading, setError as setNavError } from "../../redux/Slices/navSlice";
import { getNavDropdowns } from "../../api";
import { ShoppingCart, Phone, ArrowDown01Icon } from "lucide-react";
import { logoutSuccess, setLoading, setError } from "../../redux/Slices/loginSlice";
import { logoutUser } from "../../api";
import { clearCart } from "../../redux/Slices/cartSlice";
import toast from "react-hot-toast";
import { ArrowDown04Icon, ArrowLeft01Icon } from "hugeicons-react";
import { ChevronDown, User } from 'lucide-react';

const HomeNavbar = () => {
    const { servicesDropdown, productsDropdown } = useSelector(state => state.nav);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [card, setCard] = useState(true);
    const [isProductsHovered, setIsProductsHovered] = useState(false);
    const [isServicesHovered, setIsServicesHovered] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
    const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

    const login = useSelector((state) => state.user.isLogged);
    const user = useSelector((state) => state.user.userDetails);
    const { productItems, serviceItems } = useSelector((state) => state.cart);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // Check if current page is meeting page
    const isMeetingPage = location.pathname === '/meeting';

    // Calculate total cart items count
    const totalCartItems = useMemo(() => {
        const productCount = productItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
        const serviceCount = serviceItems?.length || 0;
        return productCount + serviceCount;
    }, [productItems, serviceItems]);


    const navLinks = useMemo(() => {
        // Filter products dropdown to only show categories with products
        const filteredProductsDropdown = productsDropdown?.filter(
            category => category.products && category.products.length > 0
        );

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
                dropdown: servicesDropdown,
            },
            {
                name: 'Products',
                path: '/products',
                dropdown: filteredProductsDropdown,
            },
            {
                name: 'Talk With Astrologer',
                path: '/talk-with-astrologer',
            },
            { name: 'Contact', path: '/contact' },
        ].filter(Boolean);
    }, [servicesDropdown, productsDropdown, login]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.pageYOffset > 80);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fetch navigation data when component mounts
    useEffect(() => {
        const fetchNavData = async () => {
            try {
                dispatch(setNavLoading(true));
                const response = await getNavDropdowns();

                if (response.success) {
                    dispatch(fetchNavDropdownsSuccess(response.data));
                } else {
                    dispatch(setNavError(response.message || 'Failed to fetch navigation data'));
                }
            } catch (error) {
                dispatch(setNavError(error.message || 'Failed to fetch navigation data'));
            }
        };

        fetchNavData();
    }, [dispatch]);

    const handleMouseEnter = (dropdown) => {
        if (dropdown === 'Products') {
            setIsProductsHovered(true);
        } else if (dropdown === 'Services') {
            setIsServicesHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsProductsHovered(false);
        setIsServicesHovered(false);
        setHoveredCategory(null);
    };

    const handleLogout = async () => {
        try {
            dispatch(setLoading(true));

            const response = await logoutUser();

            if (response.success) {
                dispatch(logoutSuccess());
                dispatch(clearCart());
                toast.success(response.message || "Logged out successfully");
                navigate("/");
                setCard(true);
            } else {
                dispatch(setError(response.message || "Something went wrong"));
                toast.error(response.message || "Something went wrong");
            }
        } catch (error) {
            dispatch(setError(error.message || "Logout failed"));
            toast.error(error.message || "Logout failed");
            console.error("Logout Failed:", error);
        }
    };


    // If it's meeting page, show only logo
    if (isMeetingPage) {
        return (
            <nav className="navbar fixed top-0 left-0 z-[900] w-full bg-white shadow transition-all duration-500">
                <div className="flex items-center justify-center w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-3">
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
                            className="block h-6 md:h-7 mt-1 object-contain"
                        />
                    </button>
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
                            className="block h-6 md:h-7 mt-1 object-contain"
                        />
                    </button>

                    {/* Search */}
                    {/* <div className="hidden md:flex flex-1 mx-6">
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
                    </div> */}

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
                                onClick={() => {
                                    setIsMenuOpen(true);
                                    setIsMobileProductsOpen(false);
                                    setIsMobileServicesOpen(false);
                                }}
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

                                                {link.name === 'Products' && isProductsHovered && link.dropdown && link.dropdown.length > 0 && (
                                                    <div
                                                        className="absolute left-0 mt-1 bg-primary shadow-lg rounded-b-md w-max z-50 py-1"
                                                        onMouseEnter={() => setIsProductsHovered(true)}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        {link.dropdown.map((category, idx) => {
                                                            const categoryId = category._id;

                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="relative px-1"
                                                                >
                                                                    <p
                                                                        className="text-white text-sm hover:bg-[#FFFFFF26] p-2 px-3 rounded-md cursor-pointer"
                                                                        onClick={() => {
                                                                            if (categoryId) {
                                                                                navigate('/products', {
                                                                                    state: {
                                                                                        selectedCategoryId: categoryId,
                                                                                        selectedCategoryName: category.name
                                                                                    }
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        <span className="inline-block transform transition-transform duration-300 hover:translate-x-2">
                                                                            {category.name}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {link.name === 'Services' && isServicesHovered && servicesDropdown && servicesDropdown.length > 0 && (
                                                    <div
                                                        className="absolute left-0 mt-1 bg-primary shadow-lg rounded-b-md w-max z-50 py-1"
                                                        onMouseEnter={() => setIsServicesHovered(true)}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        {servicesDropdown.map((category, idx) => {
                                                            const categoryId = category._id;

                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="relative px-1"
                                                                    onMouseEnter={() => setHoveredCategory(idx)}
                                                                    onMouseLeave={() => setHoveredCategory(null)}
                                                                >
                                                                    <p
                                                                        className="text-white text-sm hover:bg-[#FFFFFF26] p-2 px-3 rounded-md cursor-pointer"
                                                                        onClick={() => {
                                                                            if (categoryId) {
                                                                                navigate('/services', {
                                                                                    state: {
                                                                                        selectedCategoryId: categoryId,
                                                                                        selectedCategoryName: category.name
                                                                                    }
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        <span className="inline-block transform transition-transform duration-300 hover:translate-x-2">
                                                                            {category.name}
                                                                        </span>
                                                                    </p>

                                                                    {hoveredCategory === idx && category.services && category.services.length > 0 && (
                                                                        <>
                                                                            {/* Bridge element to prevent gap */}
                                                                            <div className="absolute left-full top-0 w-2 h-full" />
                                                                            <div className="absolute left-full top-0 ml-1 bg-primary shadow-lg rounded-md w-max z-50 py-1 min-w-[200px] border-l-2 border-white/20">
                                                                                <ul className="space-y-1">
                                                                                    {category.services.map((service, j) => (
                                                                                        <li key={j}>
                                                                                            <NavLink
                                                                                                to={`/services/${service._id}`}
                                                                                                className="text-white text-sm hover:bg-[#FFFFFF26] p-2 px-3 rounded-md block transition-all duration-200"
                                                                                            >
                                                                                                <span className="inline-block transform transition-transform duration-300 hover:translate-x-1">
                                                                                                    {service.name}
                                                                                                </span>
                                                                                            </NavLink>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
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
                            <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
                                <ShoppingCart size={20} />
                                {totalCartItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium border border-red-200">
                                        {totalCartItems > 99 ? '99+' : totalCartItems}
                                    </span>
                                )}
                            </div>
                            {login ? (
                                <NavLink to={'/profile'}>
                                    <img
                                        alt="profile"
                                        src={
                                            user?.profileImage ||
                                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                                        }
                                        onClick={() => {
                                            setCard(!card);
                                        }}
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e";
                                        }}
                                        className="size-7 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform duration-200"
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
                            onClick={() => {
                                setIsMenuOpen(false);
                                setIsMobileProductsOpen(false);
                                setIsMobileServicesOpen(false);
                            }}
                            aria-label="Close menu"
                        >
                            <X size={24} className="text-gray-700" />
                        </button>
                    </div>

                    {/* Profile Section - Show if user is logged in */}
                    {login && (
                        <div className="w-full px-4 sm:px-6 mb-6">
                            <NavLink
                                to="/profile"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsMobileProductsOpen(false);
                                    setIsMobileServicesOpen(false);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="block w-full group"
                            >
                                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-5 border border-blue-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-3 sm:-translate-y-5 translate-x-3 sm:translate-x-5"></div>

                                    <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                alt="profile"
                                                src={
                                                    user?.profileImage ||
                                                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                                                }
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e";
                                                }}
                                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-white shadow-md object-cover ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 border-2 border-white rounded-full"></div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-relaxed break-words group-hover:text-blue-700 transition-colors duration-200">
                                                Welcome back, {user?.firstName || 'User'}!
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                                                Manage your account
                                            </p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-blue-600 font-medium">Tap to view profile</span>
                                            </div>
                                        </div>

                                        {/* Arrow indicator */}
                                        <div className="text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="flex flex-col w-full px-4 sm:px-6 gap-2 flex-1">
                        {navLinks.filter(link => link.name !== 'Profile').map((link, i) => (
                            <div key={i} className="w-full">
                                {link.dropdown ? (
                                    <div className="w-full">
                                        <button
                                            className="w-full flex items-center justify-between text-left py-4 px-4 rounded-lg hover:bg-slate1 transition-all duration-200 text-lg font-medium text-gray-700"
                                            onClick={() => {
                                                if (link.name === 'Products') {
                                                    setIsMobileProductsOpen(!isMobileProductsOpen);
                                                } else if (link.name === 'Services') {
                                                    setIsMobileServicesOpen(!isMobileServicesOpen);
                                                }
                                            }}
                                        >
                                            <span>{link.name}</span>
                                            <ChevronDown
                                                size={20}
                                                className={`text-gray-500 transition-transform duration-200 ${(link.name === 'Products' && isMobileProductsOpen) ||
                                                    (link.name === 'Services' && isMobileServicesOpen)
                                                    ? 'rotate-180'
                                                    : 'rotate-0'
                                                    }`}
                                            />
                                        </button>

                                        {/* Show products dropdown when Products is clicked and expanded */}
                                        {link.name === 'Products' && isMobileProductsOpen && link.dropdown && link.dropdown.length > 0 && (
                                            <div className="ml-4 mt-2 pb-2 border-l-2 border-gray-100">
                                                {link.dropdown.map((category, categoryIndex) => {
                                                    const categoryId = category._id;

                                                    return (
                                                        <div key={categoryIndex} className="mb-4">
                                                            {category.products && category.products.length > 0 && (
                                                                <>
                                                                    <h4
                                                                        className="text-sm font-semibold text-base-font uppercase tracking-wide mb-2 px-4 cursor-pointer hover:text-primary transition-colors"
                                                                        onClick={() => {
                                                                            if (categoryId) {
                                                                                navigate('/products', {
                                                                                    state: {
                                                                                        selectedCategoryId: categoryId,
                                                                                        selectedCategoryName: category.name
                                                                                    }
                                                                                });
                                                                                setIsMenuOpen(false);
                                                                                setIsMobileProductsOpen(false);
                                                                                setIsMobileServicesOpen(false);
                                                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                                                            }
                                                                        }}
                                                                    >
                                                                        {category.name}
                                                                    </h4>
                                                                    <div className="ml-4">
                                                                        {category.products.map((product, productIndex) => (
                                                                            <NavLink
                                                                                key={productIndex}
                                                                                to={`/products/${product._id}`}
                                                                                onClick={() => {
                                                                                    setIsMenuOpen(false);
                                                                                    setIsMobileProductsOpen(false);
                                                                                    setIsMobileServicesOpen(false);
                                                                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                                                                }}
                                                                                className={({ isActive }) =>
                                                                                    `block py-2 px-4 ml-2 rounded-md text-base transition-all duration-200 ${isActive
                                                                                        ? "text-blue-600 bg-blue-50 font-medium"
                                                                                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                                                                    }`
                                                                                }
                                                                            >
                                                                                {product.name}
                                                                            </NavLink>
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Show services dropdown when Services is clicked and expanded */}
                                        {link.name === 'Services' && isMobileServicesOpen && servicesDropdown && servicesDropdown.length > 0 && (
                                            <div className="ml-4 mt-2 pb-2 border-l-2 border-gray-100">
                                                {servicesDropdown.map((category, categoryIndex) => {
                                                    const categoryId = category._id;

                                                    return (
                                                        <div key={categoryIndex} className="mb-4">
                                                            {category.services && category.services.length > 0 && (
                                                                <>
                                                                    <h4
                                                                        className="text-sm font-semibold text-base-font uppercase tracking-wide mb-2 px-4 cursor-pointer hover:text-primary transition-colors"
                                                                        onClick={() => {
                                                                            if (categoryId) {
                                                                                navigate('/services', {
                                                                                    state: {
                                                                                        selectedCategoryId: categoryId,
                                                                                        selectedCategoryName: category.name
                                                                                    }
                                                                                });
                                                                                setIsMenuOpen(false);
                                                                                setIsMobileProductsOpen(false);
                                                                                setIsMobileServicesOpen(false);
                                                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                                                            }
                                                                        }}
                                                                    >
                                                                        {category.name}
                                                                    </h4>
                                                                    <div className="ml-4">
                                                                        {category.services.map((service, serviceIndex) => (
                                                                            <NavLink
                                                                                key={serviceIndex}
                                                                                to={`/services/${service._id}`}
                                                                                onClick={() => {
                                                                                    setIsMenuOpen(false);
                                                                                    setIsMobileProductsOpen(false);
                                                                                    setIsMobileServicesOpen(false);
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
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-3" key={i}>
                                        <NavLink
                                            key={i}
                                            to={link.path}
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsMobileProductsOpen(false);
                                                setIsMobileServicesOpen(false);
                                                window.scrollTo({ top: 0, behavior: "smooth" });
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
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Cart & Authentication Buttons - Bottom Section */}
                    <div className="w-full px-4 sm:px-6 py-5 border-t border-gray-100 bg-gradient-to-t from-white via-white to-white/95 backdrop-blur-sm">
                        {/* Cart Button */}
                        <div className="mb-5">
                            <button
                                className="w-full flex items-center justify-center gap-3 py-4 px-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform"
                                onClick={() => {
                                    navigate("/cart");
                                    setIsMenuOpen(false);
                                    setIsMobileProductsOpen(false);
                                    setIsMobileServicesOpen(false);
                                }}
                            >
                                <div className="relative">
                                    <ShoppingCart size={20} />
                                    {totalCartItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-orange-100 shadow-sm">
                                            {totalCartItems > 99 ? '99+' : totalCartItems}
                                        </span>
                                    )}
                                </div>
                                <span>Cart ({totalCartItems} items)</span>
                            </button>
                        </div>

                        {!login ? (
                            <div className="flex flex-col gap-3">
                                <button className={`${formBtn1} !rounded-xl !py-3 !font-semibold hover:!scale-[1.02] transition-all duration-300`} onClick={() => {
                                    navigate("/login");
                                    setIsMenuOpen(false);
                                    setIsMobileProductsOpen(false);
                                    setIsMobileServicesOpen(false);
                                }}>
                                    Login
                                </button>
                                <button
                                    className={`${formBtn1} !bg-gradient-to-r !from-gray-100 !to-gray-200 !text-gray-700 !border-gray-300 !rounded-xl !py-3 !font-semibold hover:!scale-[1.02] hover:!from-gray-200 hover:!to-gray-300 transition-all duration-300`}
                                    onClick={() => {
                                        navigate("/register");
                                        setIsMenuOpen(false);
                                        setIsMobileProductsOpen(false);
                                        setIsMobileServicesOpen(false);
                                    }}
                                >
                                    Register
                                </button>
                            </div>
                        ) : (
                            <button
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl py-3 font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform"
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

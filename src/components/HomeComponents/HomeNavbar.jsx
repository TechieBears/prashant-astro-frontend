import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/astroguid logo.png";
import logoText from "../../assets/astroguid logo text.png";
import { formBtn1 } from "../../utils/CustomClass";
import { List, X } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { LoginCurve, Profile } from "iconsax-reactjs";
import { formatRole } from "../../helper/Helper";
import { fetchNavDropdownsSuccess, setLoading as setNavLoading, setError as setNavError } from "../../redux/Slices/navSlice";
import { getNavDropdowns } from "../../api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShoppingCart, Phone, ArrowDown01Icon, ArrowDown, ArrowDown01, ArrowDownAZ } from "lucide-react";
import { logoutSuccess, setLoading, setError } from "../../redux/Slices/loginSlice";
import { logoutUser } from "../../api";
import { clearCart } from "../../redux/Slices/cartSlice";
import toast, { Toaster } from "react-hot-toast";
import { ArrowDown04Icon, ArrowLeft01Icon } from "hugeicons-react";
import { ChevronDown, ChevronUp, User } from 'lucide-react';

const HomeNavbar = () => {
    const { servicesDropdown, productsDropdown, hasAttemptedFetch } = useSelector(state => state.nav);
    const [expandedItems, setExpandedItems] = useState({});
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [card, setCard] = useState(true);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const login = useSelector((state) => state.user.isLogged);
    const user = useSelector((state) => state.user.userDetails);
    const { productItems, serviceItems } = useSelector((state) => state.cart);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);

    // Calculate total cart items count
    const totalCartItems = useMemo(() => {
        const productCount = productItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
        const serviceCount = serviceItems?.length || 0;
        return productCount + serviceCount;
    }, [productItems, serviceItems]);


    const toggleExpanded = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const navLinks = useMemo(() => {
        const transformedServices = (servicesDropdown || []).map(category => ({
            category: category.name,
            services: (category.services || []).map(service => ({
                name: service.name,
                path: `/services/${service._id}`,
            })),
        }));

        const transformedProducts = (productsDropdown || []).map(product => ({
            category: product.name,
            products: (product.products || []).map(product => ({
                name: product.name,
                path: `/products/${product._id}`,
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
                dropdown: transformedProducts,
            },
            { name: 'Contact', path: '/contact' },
        ].filter(Boolean); // <- filters out 'false'
    }, [servicesDropdown, productsDropdown, login]);

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
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setActiveDropdown(dropdown);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setActiveDropdown(null);
            setActiveCategory(null);
        }, 150); // Small delay to allow moving to submenu
        setHoverTimeout(timeout);
    };

    const handleCategoryMouseEnter = (categoryName) => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setActiveCategory(categoryName);
    };

    const handleCategoryMouseLeave = () => {
        const timeout = setTimeout(() => {
            setActiveCategory(null);
        }, 150);
        setHoverTimeout(timeout);
    };

    const handleCategoryClick = (categoryId, categoryName) => {
        // Close dropdowns
        setActiveDropdown(null);
        setActiveCategory(null);

        // Navigate to products page with category pre-selected
        navigate('/products', {
            state: {
                selectedCategoryId: categoryId,
                selectedCategoryName: categoryName
            }
        });
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

    // Fetch navigation data when component mounts
    useEffect(() => {
        const fetchNavData = async () => {
            // Only fetch if we haven't attempted to fetch yet
            if (!hasAttemptedFetch) {
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
            }
        };

        fetchNavData();
    }, [dispatch, hasAttemptedFetch]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
        };
    }, [hoverTimeout]);

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
                delay: 0.1,
                onComplete: () => {
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
                                                    <div
                                                        className="absolute left-0 mt-3 bg-primary shadow-lg rounded-b-md w-max z-50 py-3"
                                                        onMouseEnter={() => {
                                                            if (hoverTimeout) {
                                                                clearTimeout(hoverTimeout);
                                                                setHoverTimeout(null);
                                                            }
                                                        }}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        {link.dropdown.map((category, idx) => {
                                                            // Get category ID - for products it's from the original productsDropdown
                                                            const originalCategory = link.name === 'Products'
                                                                ? productsDropdown?.find(cat => cat.name === category.category)
                                                                : servicesDropdown?.find(cat => cat.name === category.category);
                                                            const categoryId = originalCategory?._id;

                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="relative px-2"
                                                                    onMouseEnter={() => handleCategoryMouseEnter(category.category)}
                                                                >
                                                                    <p
                                                                        className="text-white text-sm hover:bg-[#FFFFFF26] p-2 pr-4 rounded-md cursor-pointer"
                                                                        onClick={() => {
                                                                            if (link.name === 'Products' && categoryId) {
                                                                                handleCategoryClick(categoryId, category.category);
                                                                            } else if (link.name === 'Services') {
                                                                                // Navigate to services page with category query parameter
                                                                                setActiveDropdown(null);
                                                                                setActiveCategory(null);
                                                                                navigate(`/services?category=${encodeURIComponent(category.category)}`);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <span className="inline-block transform transition-transform duration-300 hover:translate-x-2">
                                                                            {category.category}
                                                                        </span>
                                                                    </p>

                                                                    {activeCategory === category.category && (category.services?.length > 0 || category.products?.length > 0) && (
                                                                        <div
                                                                            className="absolute left-full top-0 ml-0 bg-primary shadow-lg rounded-md w-max z-50 py-3 min-w-[200px] border-l-2 border-white/20"
                                                                        >
                                                                            <ul className="space-y-1">
                                                                                {(category.services || category.products || []).map((item, j) => (
                                                                                    <li key={j}>
                                                                                        <NavLink
                                                                                            to={item.path}
                                                                                            className="text-white text-sm hover:bg-[#FFFFFF26] p-2 px-3 rounded-md block transition-all duration-200"
                                                                                        >
                                                                                            <span className="inline-block transform transition-transform duration-300 hover:translate-x-1">
                                                                                                {item.name}
                                                                                            </span>
                                                                                        </NavLink>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
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
                                        {/* Check if it's a grouped dropdown (has category + services/products) */}
                                        {Array.isArray(link.dropdown) && (link.dropdown[0]?.services || link.dropdown[0]?.products) ? (
                                            link.dropdown.map((category, categoryIndex) => {
                                                const items = category.services || category.products || [];
                                                // Get category ID for products
                                                const originalCategory = link.name === 'Products'
                                                    ? productsDropdown?.find(cat => cat.name === category.category)
                                                    : servicesDropdown?.find(cat => cat.name === category.category);
                                                const categoryId = originalCategory?._id;

                                                return (
                                                    <div key={categoryIndex} className="mb-4">
                                                        {items.length > 0 && (
                                                            <>
                                                                <h4
                                                                    className="text-sm font-semibold text-base-font uppercase tracking-wide mb-2 px-4 cursor-pointer hover:text-primary transition-colors"
                                                                    onClick={() => {
                                                                        if (link.name === 'Products' && categoryId) {
                                                                            handleCategoryClick(categoryId, category.category);
                                                                            setIsMenuOpen(false);
                                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                                        } else if (link.name === 'Services') {
                                                                            // Navigate to services page with category query parameter
                                                                            navigate(`/services?category=${encodeURIComponent(category.category)}`);
                                                                            setIsMenuOpen(false);
                                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                                        }
                                                                    }}
                                                                >
                                                                    {category.category}
                                                                </h4>
                                                                {items.map((item, itemIndex) => (
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
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })
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

                    {/* Cart & Authentication Buttons - Bottom Section */}
                    <div className="w-full px-6 py-4 border-t border-gray-100 bg-white/80">
                        {/* Cart Button */}
                        <div className="mb-4">
                            <button
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                onClick={() => {
                                    navigate("/cart");
                                    setIsMenuOpen(false);
                                }}
                            >
                                <div className="relative">
                                    <ShoppingCart size={20} />
                                    {totalCartItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium border border-red-200">
                                            {totalCartItems > 99 ? '99+' : totalCartItems}
                                        </span>
                                    )}
                                </div>
                                <span>Cart ({totalCartItems} items)</span>
                            </button>
                        </div>

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

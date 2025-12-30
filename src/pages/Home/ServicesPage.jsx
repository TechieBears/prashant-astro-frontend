import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import { getCategoriesList, getServicesList } from '../../api';
import Preloaders from '../../components/Loader/Preloaders';

const ServicesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [hasScrolledToCategory, setHasScrolledToCategory] = useState(false);

    // Refs for each category to scroll to
    const categoryRefs = useRef({});

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        const fetchServices = async () => {
            const response = await getServicesList();
            if (response?.success) {
                setServices(response?.data);
            }
            setIsLoading(false);
        };
        const fetchCategories = async () => {
            const response = await getCategoriesList();
            if (response?.success) {
                setCategories(response?.data);
                setSelectedCategory(response?.data[0]);
            }
            setIsLoading(false);
        };

        fetchCategories();
        fetchServices();
    }, []);

    // Handle URL parameter for pre-selecting category
    // Memoized URL parameter extraction
    const categoryParam = useMemo(() => {
        const urlParams = new URLSearchParams(location.search);
        return urlParams.get('category');
    }, [location.search]);

    // Memoized category finder
    const matchingCategory = useMemo(() => {
        if (!categoryParam || categories.length === 0) return null;
        return categories.find(cat =>
            cat.name.toLowerCase() === categoryParam.toLowerCase()
        );
    }, [categoryParam, categories]);

    // Optimized scroll function with cleanup
    const scrollToCategoryElement = useCallback((categoryId) => {
        const element = categoryRefs.current[categoryId];
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - 120; // HEADER_OFFSET constant

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            return true; // Success
        }
        return false; // Element not found
    }, []);

    // Main effect for URL parameter handling
    useEffect(() => {
        if (categoryParam && matchingCategory && services.length > 0 && !hasScrolledToCategory) {
            setSelectedCategory(matchingCategory);
            setHasScrolledToCategory(true);

            // Optimized scroll with retry mechanism
            const attemptScroll = () => {
                if (!scrollToCategoryElement(matchingCategory._id)) {
                    // Retry with exponential backoff
                    setTimeout(attemptScroll, 50);
                }
            };

            // Use requestAnimationFrame for optimal timing
            requestAnimationFrame(attemptScroll);
        }
    }, [categoryParam, matchingCategory, services.length, hasScrolledToCategory, scrollToCategoryElement]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        // Small delay to ensure state update is reflected
        setTimeout(() => {
            const categorySection = categoryRefs.current[category._id];
            if (categorySection) {
                const headerOffset = 120; // Consistent with URL parameter scroll
                const elementPosition = categorySection.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    const handleServiceClick = (serviceId) => {
        navigate(`/services/${serviceId}`);
    };

    return (
        <div className="min-h-screen bg-slate1" style={{ scrollBehavior: 'smooth' }}>
            <BackgroundTitle
                title="Services"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Services", href: null }
                ]}
                backgroundImage={bannerImage}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />

            <div className="container mx-auto px-4 md:px-8 max-w-7xl pb-8">
                {/* Loading State */}
                {isLoading ? (
                    <Preloaders />
                ) : (
                    <>
                        {/* Category Filter Card */}
                        <div className="sticky top-0 md:top-[44px] z-30 mb-6 md:mb-8">
                            <div className="bg-white rounded-b-2xl shadow-lg px-3 sm:px-4 md:px-6 py-3 md:py-4 mx-2 sm:mx-4 md:mx-0 md:w-fit md:mx-auto">
                                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                                    {categories.map(category => (
                                        <button
                                            key={category?._id}
                                            onClick={() => handleCategoryClick(category)}
                                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${selectedCategory?._id === category?._id
                                                ? 'bg-button-vertical-gradient-orange text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-400 hover:text-orange-600'
                                                }`}
                                        >
                                            {category?.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {
                            services.map(category => (
                                <div
                                    key={category._id}
                                    className="mb-10"
                                    ref={el => categoryRefs.current[category._id] = el} // Assign ref for each category
                                >
                                    {/* Category Heading */}
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold bg-gradient-orange bg-clip-text text-transparent">
                                            {category.name}
                                        </h2>
                                    </div>

                                    {/* Services Grid */}
                                    {category.services.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {category.services.map(service => (
                                                <div
                                                    key={service._id}
                                                    onClick={() => handleServiceClick(service._id)}
                                                    className="relative rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 h-84 md:h-72 lg:h-96"
                                                >
                                                    {/* Service Image with Gradient Overlay */}
                                                    <div className="relative h-full">
                                                        <img
                                                            src={service.image}
                                                            alt={service.title || service.name}
                                                            className="w-full h-full object-cover"
                                                        />

                                                        {/* Gradient Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                                                        {/* Service Info - Positioned at bottom */}
                                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                                                            <h3 className="font-bold text-white mb-2 text-lg">
                                                                {service.title || service.name}
                                                            </h3>

                                                            <p className="text-gray-300 text-sm">
                                                                {service.subTitle}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 italic">No services available.</p>
                                    )}
                                </div>
                            ))
                        }

                        {/* No Results */}
                        {services.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No services found</h3>
                                <p className="text-gray-500">Try selecting a different category</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ServicesPage;

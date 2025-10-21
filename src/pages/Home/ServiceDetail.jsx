import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt, FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import { getSelectedService, getFilteredReviews } from '../../api';
import { Clock05Icon, ShareKnowledgeIcon } from 'hugeicons-react';
import { useSelector } from 'react-redux';
import UserReviews from '../../components/Common/UserReviews';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { servicesDropdown, isLogged, loggedUserDetails } = useSelector(state => ({
        servicesDropdown: state.nav.servicesDropdown,
        isLogged: state.user.isLogged,
        loggedUserDetails: state.user.loggedUserDetails
    }));
    const userId = loggedUserDetails?._id;

    const [selectedService, setSelectedService] = useState({});
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [totalReviews, setTotalReviews] = useState(0);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [currentServiceId, setCurrentServiceId] = useState(id);

    const transformedServices = useMemo(() => {
        return servicesDropdown.map(category => ({
            category: category.name,
            services: category.services.map(service => ({
                name: service.name,
                path: `/services/${service._id}`,
            })),
        }));
    }, [servicesDropdown]);

    const [cardHeight, setCardHeight] = useState(null);
    const cardRef = useRef(null);

    // Utility function to find category containing a service
    const findServiceCategory = useCallback((serviceId) => {
        return servicesDropdown.find(category =>
            category.services.some(service => service._id === serviceId)
        );
    }, [servicesDropdown]);

    useEffect(() => {
        const fetchService = async () => {
            const response = await getSelectedService(id);
            if (response?.success) {
                setSelectedService(response?.data);

                // Find and expand the category that contains this service
                const currentCategory = findServiceCategory(response.data._id);
                if (currentCategory) {
                    setExpandedCategory(currentCategory.name);
                }
            }
            // setIsLoading(false);
        };

        fetchService();
    }, [id, findServiceCategory]);

    const handleCheckAvailability = () => {
        navigate(`/booking-calendar/${currentServiceId}`, {
            state: {
                serviceData: selectedService
            }
        });
    };

    const handleCategoryClick = (href) => {
        navigate(href);
    };

    const [expandedCategory, setExpandedCategory] = useState(null);

    const handleCategoryToggle = (categoryName) => {
        setExpandedCategory(prev => prev === categoryName ? null : categoryName);
    };

    const handleServiceClick = async (path) => {
        // Extract service ID from path
        const serviceId = path.split('/services/')[1];

        try {
            // Fetch the new service data
            const response = await getSelectedService(serviceId);
            if (response?.success) {
                // Update the selected service state
                setSelectedService(response.data);
                setCurrentServiceId(serviceId);

                // Update URL without triggering React Router navigation
                window.history.replaceState(null, '', path);

                // Find and expand the category that contains this service
                const currentCategory = findServiceCategory(response.data._id);
                if (currentCategory) {
                    setExpandedCategory(currentCategory.name);
                }
            }
        } catch (error) {
            console.error('Error fetching service:', error);
        }
    };

    // Fetch reviews for the service
    const fetchServiceReviews = useCallback(async () => {
        if (!currentServiceId) return;
        try {
            setLoadingReviews(true);
            const response = await getFilteredReviews({
                serviceId: currentServiceId
            });
            if (response.success) {
                setReviews(response.data || []);
                setTotalReviews(response.data?.length || 0);
            }
        } catch (err) {
            console.error('Error fetching service reviews:', err);
        } finally {
            setLoadingReviews(false);
        }
    }, [currentServiceId]);

    // Fetch reviews when service is loaded
    useEffect(() => {
        if (selectedService && currentServiceId) {
            fetchServiceReviews();
        }
    }, [selectedService, currentServiceId, fetchServiceReviews]);

    // Keep the image height in sync with the booking card's natural height
    useEffect(() => {
        if (!cardRef.current) return;

        const updateHeight = () => {
            const height = cardRef.current?.offsetHeight ?? null;
            setCardHeight(height);
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(cardRef.current);

        window.addEventListener('resize', updateHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeight);
        };
    }, []); // Remove unnecessary dependencies

    return (
        <div className="min-h-screen bg-slate1">
            <BackgroundTitle
                title={selectedService.name}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Services", href: "/services" },
                    { label: selectedService.name, href: null }
                ]}
                backgroundImage={bannerImage}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />

            <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl py-4 sm:py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative">
                    {/* Left Column - Related Services */}
                    <div className="lg:col-span-1 mt-6 lg:mt-0">
                        <div className="lg:sticky lg:top-24">
                            <div className="shadow-lg">
                                <div className="space-y-0">
                                    {transformedServices.map((category, index) => (
                                        <div key={index} className="mt-0 border-b border-gray-200 last:border-b-0">
                                            {/* Category Button */}
                                            <button
                                                onClick={() => handleCategoryToggle(category.category)}
                                                className="w-full flex items-center justify-between hover:bg-orange-100 transition-colors duration-200 group p-4"
                                            >
                                                <span className="font-medium text-base sm:text-lg">{category.category}</span>
                                                {expandedCategory === category.name ? (
                                                    <FaChevronUp className="w-4 h-4 transition-transform duration-300 flex-shrink-0" />
                                                ) : (
                                                    <FaChevronDown className="w-4 h-4 transition-transform duration-300 flex-shrink-0" />
                                                )}
                                            </button>

                                            {expandedCategory === category.category && (
                                                <div className="h-0.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
                                            )}

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCategory === category.category ? 'max-h-none mt-2' : 'max-h-0'
                                                    }`}
                                            >
                                                <ul className="pl-2 sm:pl-4 space-y-1 sm:space-y-2">
                                                    {category.services.map((service, i) => (
                                                        <li key={i}>
                                                            <button
                                                                onClick={() => handleServiceClick(service.path)}
                                                                className={`text-xs sm:text-sm hover:bg-[#FFFFFF26] p-1.5 sm:p-2 pr-4 sm:pr-6 rounded-md transition-colors duration-200 w-full text-left ${service.path === `/services/${currentServiceId}` ? 'border-b border-orange-300' : ''
                                                                    }`}
                                                            >
                                                                <span className="inline-block transform transition-transform duration-300 hover:translate-x-2">
                                                                    {service.name}
                                                                </span>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Service Details */}
                    <div className="lg:col-span-2">
                        {/* Service Image and Book Your Session - Side by Side */}
                        <div className="flex flex-col md:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
                            {/* Main Service Image */}
                            <div className="w-full md:w-[230px] lg:w-[280px] xl:w-[320px] flex-shrink-0 h-fit">
                                <img
                                    src={selectedService.image}
                                    alt={selectedService.name}
                                    className="w-full h-auto max-h-[300px] object-cover rounded-lg shadow-lg"
                                />
                            </div>

                            {/* Book Your Session Card */}
                            <div ref={cardRef} className="bg-[#F7E8D4] rounded-lg shadow-lg p-4 sm:p-6 flex-1 min-w-0">
                                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-button-gradient-orange bg-clip-text text-transparent">
                                    Book Your Session
                                </h2>

                                <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                                    {selectedService.subTitle}
                                </p>

                                {/* Session Details */}
                                <div className="mb-2">
                                    <div className="flex items-center text-gray-700 gap-3 sm:gap-4 mb-3">
                                        <Clock05Icon size={18} color='#000' className="flex-shrink-0" />
                                        <span className="font-medium text-sm sm:text-base">Session Duration: {selectedService.durationInMinutes}</span>
                                    </div>

                                    <div className="flex items-center text-gray-700 gap-3 sm:gap-4 mb-4">
                                        <ShareKnowledgeIcon size={18} color='#000' className="flex-shrink-0" />
                                        <span className="font-medium text-sm sm:text-base">Mode: {selectedService.serviceType}</span>
                                    </div>

                                    {/* Check Availability Button */}
                                    <button
                                        onClick={handleCheckAvailability}
                                        className="bg-button-diagonal-gradient-orange text-white px-4 sm:px-6 py-2 sm:py-3 rounded-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base w-full"
                                    >
                                        Check Availability
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4 sm:mt-6 prose max-w-none prose-sm sm:prose-base' dangerouslySetInnerHTML={{ __html: selectedService.htmlContent }} />

                        {selectedService.videoUrl && selectedService.videoUrl.length > 0 && (
                            <div className="mt-8 sm:mt-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {selectedService.videoUrl.map((video, index) => {
                                        const getYouTubeThumbnail = (url) => {
                                            if (!url || typeof url !== 'string') return null;
                                            const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                                            return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
                                        };

                                        const thumbnailUrl = getYouTubeThumbnail(video?.videoUrl);

                                        return (
                                            <div key={video._id || index} className="relative group">
                                                <div className="relative overflow-hidden rounded-lg shadow-lg bg-gradient-to-br from-amber-50 to-orange-100">
                                                    <div className="aspect-video flex items-center justify-center relative">
                                                        {thumbnailUrl ? (
                                                            <img
                                                                src={thumbnailUrl}
                                                                alt={`${selectedService.name} - Video ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = '/path/to/your/placeholder-image.jpg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <img
                                                                src="/path/to/your/placeholder-image.jpg"
                                                                alt="Video Placeholder"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}

                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <button
                                                                onClick={() => window.open(video.videoUrl, '_blank')}
                                                                className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border-2 border-amber-300"
                                                            >
                                                                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                        <h4 className="text-white font-medium text-sm sm:text-base">
                                                            {selectedService.name} - Video {index + 1}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Reviews Section */}
                        <div className="mt-8 sm:mt-10">
                            <UserReviews
                                reviews={reviews}
                                loadingReviews={loadingReviews}
                                onReviewUpdate={fetchServiceReviews}
                                editingReviewId={editingReviewId}
                                setEditingReviewId={setEditingReviewId}
                                variant="detailed"
                                currentUserId={userId}
                                showEmptyState={true}
                                showWriteReview={true}
                                productId={null}
                                serviceId={currentServiceId}
                                isLogged={isLogged}
                                onLoginClick={() => navigate('/login')}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;

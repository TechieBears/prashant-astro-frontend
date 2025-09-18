import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt, FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import { getSelectedService } from '../../api';
import { Clock05Icon, ShareKnowledgeIcon } from 'hugeicons-react';
import { useSelector } from 'react-redux';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { servicesDropdown } = useSelector(state => state.nav);

    const [selectedService, setSelectedService] = useState({});

    const transformedServices = servicesDropdown.map(category => ({
        category: category.name,
        services: category.services.map(service => ({
            name: service.name,
            path: `/services/${service._id}`,
        })),
    }));


    useEffect(() => {
        const fetchService = async () => {
            const response = await getSelectedService(id);
            console.log('selected services', response?.data)
            if (response?.success) {
                setSelectedService(response?.data);
            }
            // setIsLoading(false);
        };

        fetchService();
    }, [id]);

    const handleCheckAvailability = () => {
        console.log('Check availability clicked');
        // Navigate to booking calendar page with service ID and data
        navigate(`/booking-calendar/${id}`, {
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

    const handleServiceClick = (path) => {
        navigate(path);
    };

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

            <div className="container mx-auto px-8 max-w-7xl py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                    {/* Left Column - Service Details */}
                    <div className="lg:col-span-2">
                        {/* Main Service Image */}
                        <div className="mb-6">
                            <img
                                src={selectedService.image}
                                alt={selectedService.name}
                                className="w-full object-cover rounded-lg shadow-lg"
                                style={{ height: '564px' }}
                            />
                        </div>

                        {/* Book Your Session Card */}
                        <div className="bg-[#F7E8D4] rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 bg-button-gradient-orange bg-clip-text text-transparent">
                                Book Your Session
                            </h2>

                            <p className="text-gray-700 mb-6">
                                {selectedService.subTitle}
                            </p>

                            {/* Session Details */}
                            <div className="space-y-4 mb-2">
                                <div className="flex items-center text-gray-700 gap-4">
                                    <Clock05Icon size={20} color='#000' />
                                    <span className="font-medium">Session Duration: {selectedService.durationInMinutes}</span>
                                </div>

                                <div className="flex items-center justify-between flex-wrap gap-6 text-gray-700">
                                    <div className="flex items-center gap-4">
                                        <ShareKnowledgeIcon size={20} color='#000' />
                                        <span className="font-medium">Mode: {selectedService.serviceType}</span>
                                    </div>

                                    {/* Check Availability Button */}
                                    <button
                                        onClick={handleCheckAvailability}
                                        className="bg-button-diagonal-gradient-orange text-white px-6 py-3 rounded-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Check Availability
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-6 prose max-w-none' dangerouslySetInnerHTML={{ __html: selectedService.htmlContent }} />
                    </div>

                    {/* Right Column - Related Services */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-primary-orange rounded-2xl shadow-lg p-6">
                                <div className="space-y-4">
                                    {transformedServices.map((category, index) => (
                                        <div key={index}>
                                            {/* Category Button */}
                                            <button
                                                onClick={() => handleCategoryToggle(category.category)}
                                                className="w-full flex items-center justify-between text-white hover:text-orange-100 transition-colors duration-200 group"
                                            >
                                                <span className="font-medium text-lg">{category.category}</span>
                                                {expandedCategory === category.name ? (
                                                    <FaChevronUp className="w-4 h-4 transition-transform duration-300" />
                                                ) : (
                                                    <FaChevronDown className="w-4 h-4 transition-transform duration-300" />
                                                )}
                                            </button>

                                            {/* Animated Services List */}
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCategory === category.category ? 'max-h-96 mt-2' : 'max-h-0'
                                                    }`}
                                            >
                                                <ul className="pl-4 space-y-2">
                                                    {category.services.map((service, i) => (
                                                        <li key={i}>
                                                            <button
                                                                onClick={() => handleServiceClick(service.path)}
                                                                className="text-sm text-white hover:bg-[#FFFFFF26] p-2 pr-6 rounded-md transition-colors duration-200"
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

                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;

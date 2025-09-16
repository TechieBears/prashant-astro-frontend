import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import { getSelectedService } from '../../api';
import { Clock05Icon, ShareKnowledgeIcon } from 'hugeicons-react';

// Import service images
import service1 from '../../assets/user/services/service (1).png';
import service2 from '../../assets/user/services/service (2).png';
import service3 from '../../assets/user/services/service (3).png';
import service4 from '../../assets/user/services/service (4).png';
import service5 from '../../assets/user/services/service (5).png';
import service6 from '../../assets/user/services/service (6).png';
import service7 from '../../assets/user/services/service (7).png';
import service8 from '../../assets/user/services/service (8).png';
import service9 from '../../assets/user/services/service (9).png';
import service10 from '../../assets/user/services/service (10).png';
import service11 from '../../assets/user/services/service (11).png';
import service12 from '../../assets/user/services/service (12).png';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedService, setSelectedService] = useState({});
    // Mock service data - replace with actual data from API
    const service = {
        id: id || 'S1001',
        title: 'Daily Horoscope',
        description: 'Book your Daily Horoscope today and take a step closer to clarity.',
        duration: '30-60 minutes',
        mode: 'In-person / Online',
        image: service1,
        category: 'Astrology',
        features: [
            'Personalized horoscope reading',
            'Detailed planetary analysis',
            'Daily guidance and predictions',
            'Remedy suggestions',
            'Follow-up consultation'
        ]
    };

    // Related service categories
    const relatedCategories = [
        { name: 'Astrology', href: '/services?category=Astrology' },
        { name: 'Vastu remedy', href: '/services?category=Vastu remedy' },
        { name: 'Pooja Vidhi', href: '/services?category=Pooja Vidhi' },
        { name: 'Kundali Dosh', href: '/services?category=Kundali Dosh' }
    ];

    useEffect(() => {
        const fetchService = async () => {
            const response = await getSelectedService(id);
            console.log('selected services', response?.data)
            if(response?.success){
                setSelectedService(response?.data);
            }
            // setIsLoading(false);
        };
        
         fetchService();
    }, [id]);

    const handleCheckAvailability = () => {
        console.log('Check availability clicked');
        // Navigate to booking page or open booking modal
    };

    const handleCategoryClick = (href) => {
        navigate(href);
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

                                <div className="flex items-center justify-between text-gray-700">
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
                        <div className="bg-primary-orange rounded-2xl shadow-lg p-6">
                            <div className="space-y-4">
                                {relatedCategories.map((category, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleCategoryClick(category.href)}
                                        className="w-full flex items-center justify-between text-white hover:text-orange-100 transition-colors duration-200 group"
                                    >
                                        <span className="font-medium text-lg">
                                            {category.name}
                                        </span>
                                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-200" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;

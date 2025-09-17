

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import { getCategoriesList, getServicesList } from '../../api';

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

const ServicesPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);

    // Service categories matching the image
    // const categories = ['Astrology', 'Vastu remedy', 'Pooja Vidhi', 'Kundali Dosh'];

    // Services data for all categories
    // const services = [
    //     // Astrology Services
    //     {
    //         id: 'S1001',
    //         title: 'Daily horoscope',
    //         category: 'Astrology',
    //         description: 'Your hands hold the story of your life.',
    //         image: service1
    //     },
    //     {
    //         id: 'S1002',
    //         title: 'Astrology',
    //         category: 'Astrology',
    //         description: 'Your hands hold the story of your life.',
    //         image: service2
    //     },
    //     {
    //         id: 'S1003',
    //         title: 'Match Making',
    //         category: 'Astrology',
    //         description: 'The stars have a story to tell about you.',
    //         image: service3
    //     },
    //     {
    //         id: 'S1004',
    //         title: 'Career',
    //         category: 'Astrology',
    //         description: 'The cards have a message to share for you.',
    //         image: service4
    //     },
    //     {
    //         id: 'S1005',
    //         title: 'Kundali',
    //         category: 'Astrology',
    //         description: 'Your hands hold the story of your life.',
    //         image: service5
    //     },
    //     {
    //         id: 'S1006',
    //         title: 'Relationship',
    //         category: 'Astrology',
    //         description: 'Your hands hold the story of your life.',
    //         image: service6
    //     },
    //     {
    //         id: 'S1007',
    //         title: 'Marriage',
    //         category: 'Astrology',
    //         description: 'Your hands hold the story of your life.',
    //         image: service7
    //     },
    //     {
    //         id: 'S1008',
    //         title: 'Education',
    //         category: 'Astrology',
    //         description: 'Your hands hold the story of your life.',
    //         image: service8
    //     },
    //     {
    //         id: 'S1009',
    //         title: 'Health',
    //         category: 'Astrology',
    //         description: 'Your hands hold the story of your life.',
    //         image: service9
    //     },
    //     {
    //         id: 'S1010',
    //         title: 'Family',
    //         category: 'Astrology',
    //         description: 'The stars have a story to tell about you.',
    //         image: service10
    //     },
    //     {
    //         id: 'S1011',
    //         title: 'Numerology',
    //         category: 'Astrology',
    //         description: 'The cards have a message to share for you.',
    //         image: service11
    //     },
    //     {
    //         id: 'S1012',
    //         title: 'Name Correction',
    //         category: 'Astrology',
    //         description: 'Your hands hold the story of your life.',
    //         image: service12
    //     },
    //     // Vastu Remedy Services
    //     {
    //         id: 'S2001',
    //         title: 'Home Vastu',
    //         category: 'Vastu remedy',
    //         description: 'Transform your living space for prosperity.',
    //         image: service1
    //     },
    //     {
    //         id: 'S2002',
    //         title: 'Office Vastu',
    //         category: 'Vastu remedy',
    //         description: 'Enhance your workplace energy and success.',
    //         image: service2
    //     },
    //     {
    //         id: 'S2003',
    //         title: 'Shop Vastu',
    //         category: 'Vastu remedy',
    //         description: 'Boost your business with Vastu principles.',
    //         image: service3
    //     },
    //     {
    //         id: 'S2004',
    //         title: 'Factory Vastu',
    //         category: 'Vastu remedy',
    //         description: 'Optimize your industrial space for growth.',
    //         image: service4
    //     },
    //     {
    //         id: 'S2005',
    //         title: 'Garden Vastu',
    //         category: 'Vastu remedy',
    //         description: 'Create harmony in your outdoor spaces.',
    //         image: service5
    //     },
    //     {
    //         id: 'S2006',
    //         title: 'Kitchen Vastu',
    //         category: 'Vastu remedy',
    //         description: 'Enhance health and prosperity in your kitchen.',
    //         image: service6
    //     },
    //     {
    //         id: 'S2007',
    //         title: 'Bedroom Vastu',
    //         category: 'Vastu remedy',
    //         description: 'Improve sleep and relationships with Vastu.',
    //         image: service7
    //     },
    //     {
    //         id: 'S2008',
    //         title: 'Prayer Room Vastu',
    //         category: 'Vastu remedy',
    //         description: 'Create a sacred space for spiritual growth.',
    //         image: service8
    //     },
    //     // Pooja Vidhi Services
    //     {
    //         id: 'S3001',
    //         title: 'Ganpati Pooja',
    //         category: 'Pooja Vidhi',
    //         description: 'Remove obstacles and bring success.',
    //         image: service9
    //     },
    //     {
    //         id: 'S3002',
    //         title: 'Lakshmi Pooja',
    //         category: 'Pooja Vidhi',
    //         description: 'Invoke wealth and prosperity in your life.',
    //         image: service10
    //     },
    //     {
    //         id: 'S3003',
    //         title: 'Durga Pooja',
    //         category: 'Pooja Vidhi',
    //         description: 'Seek protection and strength from the divine.',
    //         image: service11
    //     },
    //     {
    //         id: 'S3004',
    //         title: 'Shiv Pooja',
    //         category: 'Pooja Vidhi',
    //         description: 'Connect with the cosmic consciousness.',
    //         image: service12
    //     },
    //     {
    //         id: 'S3005',
    //         title: 'Satyanarayan Pooja',
    //         category: 'Pooja Vidhi',
    //         description: 'Bring peace and happiness to your family.',
    //         image: service1
    //     },
    //     {
    //         id: 'S3006',
    //         title: 'Navgrah Pooja',
    //         category: 'Pooja Vidhi',
    //         description: 'Balance planetary influences in your life.',
    //         image: service2
    //     },
    //     {
    //         id: 'S3007',
    //         title: 'Havan Ceremony',
    //         category: 'Pooja Vidhi',
    //         description: 'Purify your environment with sacred fire.',
    //         image: service3
    //     },
    //     {
    //         id: 'S3008',
    //         title: 'Rudra Abhishek',
    //         category: 'Pooja Vidhi',
    //         description: 'Seek divine blessings and protection.',
    //         image: service4
    //     },
    //     // Kundali Dosh Services
    //     {
    //         id: 'S4001',
    //         title: 'Mangal Dosh',
    //         category: 'Kundali Dosh',
    //         description: 'Remedy for Mars-related challenges.',
    //         image: service5
    //     },
    //     {
    //         id: 'S4002',
    //         title: 'Kaal Sarp Dosh',
    //         category: 'Kundali Dosh',
    //         description: 'Overcome serpent-related obstacles.',
    //         image: service6
    //     },
    //     {
    //         id: 'S4003',
    //         title: 'Pitru Dosh',
    //         category: 'Kundali Dosh',
    //         description: 'Resolve ancestral karma and blessings.',
    //         image: service7
    //     },
    //     {
    //         id: 'S4004',
    //         title: 'Nadi Dosh',
    //         category: 'Kundali Dosh',
    //         description: 'Harmonize relationship compatibility.',
    //         image: service8
    //     },
    //     {
    //         id: 'S4005',
    //         title: 'Rahu Ketu Dosh',
    //         category: 'Kundali Dosh',
    //         description: 'Balance the shadow planets influence.',
    //         image: service9
    //     },
    //     {
    //         id: 'S4006',
    //         title: 'Shani Dosh',
    //         category: 'Kundali Dosh',
    //         description: 'Mitigate Saturn\'s challenging effects.',
    //         image: service10
    //     },
    //     {
    //         id: 'S4007',
    //         title: 'Chandra Dosh',
    //         category: 'Kundali Dosh',
    //         description: 'Stabilize emotional and mental well-being.',
    //         image: service11
    //     },
    //     {
    //         id: 'S4008',
    //         title: 'Surya Dosh',
    //         category: 'Kundali Dosh',
    //         description: 'Enhance confidence and leadership qualities.',
    //         image: service12
    //     }
    // ];

    useEffect(() => {
        const fetchServices = async () => {
            const response = await getServicesList();
            console.log('services', response?.data)
            if (response?.success) {
                setServices(response?.data);
            }
            setIsLoading(false);
        };
        const fetchCategories = async () => {
            const response = await getCategoriesList();
            console.log('categories', response)
            if (response?.success) {
                setCategories(response?.data);
                  setSelectedCategory(response?.data[0]);
            }
            setIsLoading(false);
        };

        fetchCategories();
        fetchServices();
    }, []);

    // Filter services based on category
    const filteredServices = services.filter(service => {
        return service.category === selectedCategory;
    });

    const handleServiceClick = (serviceId) => {
        navigate(`/services/${serviceId}`);
    };

    return (
        <div className="min-h-screen bg-slate1">
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
                {/* Category Filter Card */}
                <div className="sticky top-0 md:top-[44px] z-30 mb-8 flex justify-center">
                    <div className="bg-white rounded-b-2xl shadow-lg px-6 py-4 inline-block">
                        <div className="flex flex-wrap gap-4">
                            {categories.map(category => (
                                <button
                                    key={category?._id}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedCategory?._id === category?._id
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

                {/* Category Heading */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-orange bg-clip-text text-transparent">
                        {selectedCategory?.name}
                    </h2>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <div
                            key={service._id}
                            onClick={() => handleServiceClick(service._id)}
                            className="relative rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
                        >
                            {/* Service Image with Gradient Overlay */}
                            <div className="relative">
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-64 md:h-72 lg:h-80 object-cover"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                                {/* Service Info - Positioned at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                                    <h3 className="font-bold text-white mb-2 text-lg">
                                        {service.name}
                                    </h3>

                                    <p className="text-gray-300 text-sm">
                                        {service.subTitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {services.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No services found</h3>
                        <p className="text-gray-500">Try selecting a different category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesPage


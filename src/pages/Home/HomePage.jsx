import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/Titles/SectionHeader';
import HomeBanner from '../../components/HomeComponents/HomeBanner';
import aboutImg from '../../assets/user/home/about.png';
import certifiedExpert from '../../assets/user/home/certifiedExpert.png';
import clients from '../../assets/user/home/clients.png';
import multipleLanguage from '../../assets/user/home/multipleLanguage.png';
import Flowers from '../../assets/user/home/flowers.png';
import Flower from '../../assets/user/home/flower2.png';
import Testimonial1 from '../../assets/user/home/t1.png';
import Testimonial2 from '../../assets/user/home/t2.png';
import Testimonial3 from '../../assets/user/home/t3.jpg';
import Profile1 from '../../assets/user/home/profile1.png';
import Profile2 from '../../assets/user/home/profile2.png';
import Profile3 from '../../assets/user/home/profile3.png';
import Comment from '../../assets/user/home/comment.png';
import GooglePlay from '../../assets/user/home/googleplay.png';
import Mobile from '../../assets/user/home/mobile.png';
import Group from '../../assets/user/home/Group.png';
import Service1 from '../../assets/user/home/services/service-homepage (1).png';
import Service2 from '../../assets/user/home/services/service-homepage (2).png';
import Service3 from '../../assets/user/home/services/service-homepage (3).png';
import Service4 from '../../assets/user/home/services/service-homepage (4).png';
import { getActiveBanners, getOurProducts, getOurServiceCategories } from "../../api";
import { environment } from "../../env";

import { Medal06Icon, FavouriteIcon } from 'hugeicons-react';


const HomePage = () => {
    const [slidesData, setSlidesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productsData, setProductsData] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [servicesData, setServicesData] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            const banners = await getActiveBanners("website");

            const formattedSlides = await Promise.all(banners.map(async (item) => {
                let imageUrl;
                if (item.image && item.image.startsWith('http')) {
                    imageUrl = item.image;
                } else {
                    const baseUrl = environment.baseUrl.replace('/api/', '');
                    imageUrl = item.image ? `${baseUrl}${item.image}` : '';
                }
                let finalImageUrl = imageUrl;

                try {
                    const response = await fetch(imageUrl, {
                        mode: 'cors',
                        credentials: 'omit'
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        finalImageUrl = URL.createObjectURL(blob);
                    } else {
                        console.warn("Fetch failed, using original URL:", response.status);
                    }
                } catch (error) {
                    console.warn("Blob conversion failed, using original URL:", error.message);
                }

                return {
                    id: item.id,
                    image: finalImageUrl,
                    title: item.title,
                    description: item.description,
                    button: item.button?.length > 0,
                    background: true,
                    video: null,
                    onClick: () => {
                        if (item.button?.[0]?.buttonLink) {
                            window.location.href = item.button[0].buttonLink;
                        }
                    },
                    onImageError: (e) => {
                        console.error("Image failed to load:", finalImageUrl);
                        console.error("Error event:", e);
                    }
                };
            }));
            setSlidesData(formattedSlides);
            setIsLoading(false);
        };

        fetchSlides();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setProductsLoading(true);
            try {
                const response = await getOurProducts();
                setProductsData(response.success && response.data?.length > 0
                    ? response.data
                    : []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProductsData([]);
            } finally {
                setProductsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            setServicesLoading(true);
            try {
                const response = await getOurServiceCategories();
                if (response.success && response.data?.length > 0) {
                    // Transform API data to match UI structure
                    const fallbackImages = [Service1, Service2, Service3, Service4];
                    const fallbackDescriptions = [
                        "The cards have a message to share for you.",
                        "Your hands hold the story of your life.",
                        "The stars have a story to tell about you.",
                        "Your hands hold the story of your life."
                    ];

                    const transformedData = response.data.map((category, index) => ({
                        id: category._id,
                        title: category.name,
                        description: fallbackDescriptions[index % fallbackDescriptions.length],
                        category: category.name,
                        image: fallbackImages[index % fallbackImages.length],
                        alt: `${category.name} Service`
                    }));

                    setServicesData(transformedData);
                } else {
                    setServicesData([]);
                }
            } catch (error) {
                console.error("Error fetching service categories:", error);
                setServicesData([]);
            } finally {
                setServicesLoading(false);
            }
        };

        fetchServices();
    }, []);
    const aboutData = [
        {
            title: "Certified Expert",
            image: certifiedExpert,
            content:
                "Recognized astrologer with proven track record.",
        },
        {
            title: "500+ Clients",
            image: clients,
            content:
                "Satisfied clients across the globe",
        },
        {
            title: "Multiple language",
            image: multipleLanguage,
            content:
                "Fluent in Hindi, English, and Marathi",
        },
    ];

    const whyData = [
        {
            icon: <Medal06Icon size={36} className="text-white" />,
            title: '16+ Years Experience',
            description:
                'Extensive experience in Vedic astrology with thousands of successful consultations',
        },
        {
            icon: <Medal06Icon size={36} className="text-white" />,
            title: '95% Accuracy Rate',
            description:
                'Proven track record with highly accurate predictions and effective remedies',
        },
        {
            icon: <Medal06Icon size={36} className="text-white" />,
            title: 'Quick Results',
            description:
                'Detailed reports delivered within 24-48 hours of consultation booking',
        },
        {
            icon: <Medal06Icon size={36} className="text-white" />,
            title: 'Confidential & Secure',
            description:
                'Your personal information and consultations are completely confidential',
        },
        {
            icon: <Medal06Icon size={36} className="text-white" />,
            title: '500+ Happy Clients',
            description:
                'JTrusted by clients worldwide for life-changing guidance and solutions',
        },
        {
            icon: <FavouriteIcon size={36} className="text-white" />,
            title: 'Personalized Solutions',
            description:
                'Receive tailored astrological solutions that cater to your unique life circumstances.',
        },
    ];

    function Card({ product, className = "", heightClass = "h-full" }) {
        const title = product.name || product.title;
        const price = product.sellingPrice ? `Rs ${product.sellingPrice}` : product.price;
        const image = product.images?.[0] || '';

        return (
            <div className={`relative rounded-xl overflow-hidden shadow-sm w-full ${heightClass} ${className}`}>
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent"></div>
                <h3 className="absolute top-3 left-3 right-3 text-white font-semibold drop-shadow text-sm">
                    {title}
                </h3>
                <div className="absolute bottom-0 left-0 right-0 bg-button-gradient-orange px-3 py-1 flex items-center justify-between">
                    <span className="px-2 py-1 text-white text-sm rounded-md">{price}</span>
                    <button className="px-3 py-1 text-sm font-semibold text-white rounded-md">
                        Book Now
                    </button>
                </div>
            </div>
        );
    }

    const testimonialsData = [
        {
            name: "Vikram Singh",
            location: "Pune, Maharashtra",
            category: "Business Consultation",
            description:
                "I was skeptical about astrology, but Pandit Prashant's predictions about my business were remarkably accurate. His spiritual remedies brought positive changes I never expected.",
            image: Testimonial1,
            video: "https://via.placeholder.com/400x250",
            image2: Profile1,
        },
        {
            name: "Priya Sharma",
            location: "Mumbai, Maharashtra",
            category: "Kundli Analysis",
            description:
                "Pandit Prashant's guidance brought clarity when nothing else helped. His Kundli analysis was incredibly accurate and the remedies he suggested transformed my career completely.",
            image: Testimonial2,
            video: "https://via.placeholder.com/400x250",
            image2: Profile2,
        },
        {
            name: "Rajesh Kumar",
            location: "Delhi, NCR",
            category: "Vastu Consultation",
            description:
                "The Vastu consultation for our new home was exceptional. Within months of implementing his suggestions, our family experienced unprecedented peace and prosperity.",
            image: Testimonial3,
            video: "https://via.placeholder.com/400x250",
            image2: Profile3,
        },
    ];

    return (
        <div>
            <HomeBanner slidesData={slidesData} isLoading={isLoading} />
            {/* <HomeAboutUs /> */}
            <div className="bg-slate1 px-4 sm:px-6 lg:px-16 py-10  w-full max-w-[1280px] mx-auto ">
                {/* Header */}
                <SectionHeader
                    prefix="About"
                    highlight="Pandit Prashant Shastri"
                />

                {/* Content */}
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Left: Image */}
                    <div className="w-full lg:w-1/2">
                        <img
                            src={aboutImg}
                            alt="Home Banner"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Right: Text & Cards */}
                    <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                            16 Years of Spiritual Guidance
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            With over 16 years of dedicated practice in Vedic Astrology, I have guided thousands of souls
                            towards clarity, peace, and prosperity. My expertise spans across traditional Vedic sciences
                            including Kundli analysis, Vastu Shastra, and spiritual counseling.
                        </p>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            I believe in combining ancient wisdom with practical solutions, helping individuals navigate
                            life's challenges with confidence and spiritual awareness.
                        </p>

                        {/* Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                            {aboutData.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-md border border-[#00000026] p-4 flex flex-col h-full shadow-sm"
                                >
                                    {/* Image */}
                                    <div className="flex justify-center mb-2">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-16 h-16 object-contain"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Text */}
                                    <div className="text-center">
                                        <h3 className="text-sm font-semibold text-slate-800 mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-500 text-xs leading-relaxed">
                                            {item.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <div className="bg-gradient-orange py-8 md:py-12 lg:py-16 w-full">
                {/* Header */}
                <SectionHeader
                    prefix="Why Choose"
                    highlight="Pandit Prashant Shastri"
                    white={true}
                    highlightColor="text-white"
                />

                {/* Features Grid */}
                <div className='w-full max-w-[1280px] mx-auto  px-4 sm:px-6 lg:px-16'>

                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
                        {whyData.map((item, index) => (
                            <div
                                key={index}
                                className="bg-[#0000000D] border-[1px] border-[#FFFFFF66] rounded-lg p-6 shadow flex flex-col items-center text-center hover:shadow-lg transition"
                            >
                                {/* Icon */}
                                <div className="mb-4 bg-gradient-orange rounded-sm p-2">{item.icon}</div>

                                {/* Title */}
                                <h3 className="text-base font-semibold text-white mb-2">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-[#FFFFFF]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-16 py-8 md:py-12 lg:py-16 w-full max-w-[1280px] mx-auto">
                {/* Header */}
                <div className='mb-6'>
                    <SectionHeader
                        prefix="Our"
                        highlight="Services"
                    />
                </div>

                {/* Loading State */}
                {servicesLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : servicesData.length > 0 ? (
                    <>
                        {/* Services Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {servicesData.map((service) => (
                                <div key={service.id} className="relative group">
                                    <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 p-1">
                                        <div className="bg-white rounded-lg overflow-hidden">
                                            <div className="relative aspect-square overflow-hidden">
                                                <img
                                                    src={service.image}
                                                    alt={service.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center">
                                                    <div className="text-center px-4 pb-4">
                                                        <h3 className="text-white font-semibold text-lg mb-1">{service.title}</h3>
                                                        <p className="text-white/90 text-sm">{service.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-between items-center">
                                        <p className="text-gray-700 text-base font-bold">{service.category}</p>
                                        <p className="text-gray-500 text-sm cursor-pointer hover:text-orange-500 transition-colors">View All</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-500">No services available at the moment.</p>
                    </div>
                )}

                {/* View More Button */}
                <div className="flex justify-center mt-12">
                    <button className="bg-button-diagonal-gradient-orange text-white px-16 py-3 rounded-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                        View More
                    </button>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-16 py-8 w-full max-w-[1280px] mx-auto">
                {/* Header */}
                <div className='mb-6'>
                    <SectionHeader prefix="Our" highlight="Products" />
                </div>

                {/* Loading State */}
                {productsLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : productsData.length > 0 ? (
                    <>
                        {/* Products Grid - Left large card + Right 2x2 grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                            {/* LEFT LARGE CARD - First Product */}
                            <div className="lg:col-span-1">
                                {productsData[0] && (
                                    <Card
                                        product={productsData[0]}
                                        heightClass="h-full"
                                    />
                                )}
                            </div>

                            {/* RIGHT SIDE - 2x2 Grid */}
                            <div className="lg:col-span-2 grid grid-rows-2 gap-4">
                                {/* Top Row */}
                                <div className="grid grid-cols-5 gap-4">
                                    {productsData[1] && (
                                        <Card
                                            product={productsData[1]}
                                            heightClass="h-60"
                                            className="col-span-2"
                                        />
                                    )}
                                    {productsData[2] && (
                                        <Card
                                            product={productsData[2]}
                                            heightClass="h-60"
                                            className="col-span-3"
                                        />
                                    )}
                                </div>

                                {/* Bottom Row */}
                                <div className="grid grid-cols-5 gap-4">
                                    {productsData[3] && (
                                        <Card
                                            product={productsData[3]}
                                            heightClass="h-60"
                                            className="col-span-3"
                                        />
                                    )}
                                    {productsData[4] && (
                                        <Card
                                            product={productsData[4]}
                                            heightClass="h-60"
                                            className="col-span-2"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* View More Button */}
                        <div className="flex justify-center">
                            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-16 py-3 rounded-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                                View More
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-500">No products available at the moment.</p>
                    </div>
                )}
            </div>
            {/* Testmonials Section */}
            <div className="relative bg-[#F7E8D4] w-full pb-10 sm:pb-20">
                <img
                    src={Flowers}
                    alt="Flowers left"
                    className="absolute left-4 sm:left-16 md:left-28 top-0 w-16 sm:w-32 md:w-[15%] opacity-80"
                />
                <img
                    src={Flowers}
                    alt="Flowers right"
                    className="absolute right-4 sm:right-16 md:right-28 top-0 w-16 sm:w-32 md:w-[15%] opacity-80 scale-x-[-1]"
                />

                <div className="px-4 sm:px-6 lg:px-16 pt-16 pb-6 max-w-[1280px] mx-auto space-y-4 relative z-10">
                    <SectionHeader prefix="Our" highlight="Testimonials" />
                    <SectionHeader prefix="What" highlight="Our" suffix="Patients Say" showImage={false} />
                    <p className="w-11/12 md:w-6/12 mx-auto text-center text-sm sm:text-base text-slate-600 mb-10">
                        Read the testimonials by our patients find more about our clinic.
                    </p>
                </div>

                <div className="hidden sm:block absolute bottom-10 left-1/2 -translate-x-1/2 translate-y-2 w-40 sm:w-1/2 md:w-[50%] h-48 sm:h-64 md:h-80 bg-orange-light z-0 rounded-lg"></div>

                {/* Testimonial cards */}
                <div className="mt-2 px-6 flex flex-wrap justify-center gap-4 sm:gap-6 relative z-10">
                    {testimonialsData.map((item, index) => (
                        <div
                            key={index}
                            className="relative bg-white rounded-lg p-4 sm:p-6 shadow-md w-full sm:w-72 md:w-80 flex flex-col"
                        >
                            {/* Comment icon */}
                            <img
                                src={Comment}
                                alt="Comment"
                                className="absolute -top-3 -right-3 w-10 sm:w-10 h-10 sm:h-10"
                            />

                            {/* Top: User info */}
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-sm sm:text-sm font-semibold text-slate-800">{item.name}</h3>
                                    <p className="text-xs sm:text-xs text-slate-500">{item.location}</p>
                                </div>
                            </div>

                            {/* Category Tag */}
                            <span className="w-fit inline-block mb-3 px-2 sm:px-3 py-1 text-xs sm:text-xs font-medium text-white bg-primary-orange rounded-full">
                                {item.category}
                            </span>

                            {/* Description */}
                            <p className="text-sm sm:text-sm text-slate-600 mb-4 flex-1">{item.description}</p>

                            {/* Video/Image */}
                            <div className="rounded-md overflow-hidden mt-auto">
                                <img
                                    src={item.image2}
                                    alt="testimonial"
                                    className="w-full h-32 sm:h-40 object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative">
                <img
                    src={Flower}
                    className="absolute right-0 top-1/1 -translate-y-1/2 w-20 sm:w-28 md:w-32 z-0 rotate-270"
                />
                {/* Social Media */}
                <div className="px-4 sm:px-6 lg:px-16 py-8 sm:py-16 w-full max-w-[1280px] mx-auto">
                    {/* Header */}

                    <div className='flex items-center flex-col gap-5 px-4'>
                        <SectionHeader
                            prefix="Our"
                            highlight="Social Media"
                        />
                        <p className='w-11/12 md:w-6/12 text-center text-sm text-slate-600 mb-6 md:mb-10'>
                            Connect with us on social media and watch our educational content on astrology and spiritual guidance
                        </p>
                    </div>

                    <div className='flex flex-col md:flex-row gap-4'>
                        {/* Left Side - Video Section */}
                        <div className='w-full md:w-1/2 bg-white p-6 rounded-lg border-[#00000026] border-[1px]'>
                            <h2 className='text-lg text-slate-800'>Watch Our Introduction Video</h2>
                            <p className='text-sm text-slate-600 my-4'>
                                Get to know Pandit Prashant and understand how Vedic astrology can guide your life journey.
                            </p>
                            <div className='aspect-video'>
                                <iframe
                                    className='w-full h-full'
                                    src="https://www.youtube.com/embed/3ystrJLmjtI?si=lzydue0hRljRmqa6"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className='mt-4'>
                                <button className='bg-gradient-orange text-white px-4 py-2 rounded-md'>
                                    Watch Now
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Instagram Section */}
                        <div className='w-full md:w-1/2 flex flex-col gap-4'>
                            {/* Instagram Block */}
                            <div className='flex flex-row bg-white p-4 rounded-lg shadow-sm'>
                                <div className='mr-4'>
                                    {/* Add icon or image if needed */}
                                </div>
                                <div>
                                    <h2 className='text-lg text-slate-800 mb-1'>Instagram</h2>
                                    <p className='text-sm text-slate-600'>Daily astrology tips and spiritual guidance</p>
                                </div>
                            </div>

                            <div className='flex flex-row bg-white p-4 rounded-lg shadow-sm'>
                                <div className='mr-4'></div>
                                <div>
                                    <h2 className='text-lg text-slate-800 mb-1'>Instagram</h2>
                                    <p className='text-sm text-slate-600'>Daily astrology tips and spiritual guidance</p>
                                </div>
                            </div>

                            <div className='flex flex-row bg-white p-4 rounded-lg shadow-sm'>
                                <div className='mr-4'></div>
                                <div>
                                    <h2 className='text-lg text-slate-800 mb-1'>Instagram</h2>
                                    <p className='text-sm text-slate-600'>Daily astrology tips and spiritual guidance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <img
                    src={Flower}
                    className="absolute left-0 top-1/1 -translate-y-1/2 w-20 sm:w-28 md:w-32 z-0 rotate-180"
                />
                {/* Download app */}
                <div className="bg-custom-linear py-8 md:py-12 lg:py-20">
                    <div className="px-4 sm:px-6 lg:px-16 w-full max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10 h-full">
                        <div className="flex-1 flex flex-col items-center justify-center h-full text-center">
                            <div className="flex flex-col items-center justify-center">
                                <SectionHeader
                                    prefix="Our app will be available shortly"
                                    prefixClass="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-normal -mx-4 sm:-mx-6 lg:-mx-8"
                                    showImage={false}
                                />
                                <SectionHeader
                                    prefix="stay tuned."
                                    prefixClass="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-normal -mx-4 sm:-mx-6 lg:-mx-8 mt-2"
                                    showImage={false}
                                />
                            </div>
                            {/* <p className="mt-3 md:mt-4 w-full md:w-8/12 text-center text-xs sm:text-sm md:text-base text-slate-600">
                                For seamless experience, download our apps on your phone
                            </p> */}
                            {/* <div className="mt-3 md:mt-4 lg:mt-6">
                                <img src={GooglePlay} className="w-32 sm:w-36 md:w-40 lg:w-44" />
                            </div> */}
                        </div>
                        <div className="flex-1 flex justify-center md:justify-end relative mt-4 md:mt-6 lg:mt-0">
                            <div className="relative flex items-end">
                                <img
                                    src={Group}
                                    className="w-14 sm:w-16 md:w-20 lg:w-24 xl:w-26 absolute bottom-0 -left-4 sm:-left-6 md:-left-8 lg:-left-10 xl:-left-12 z-0"
                                />
                                <img
                                    src={Mobile}
                                    className="max-w-[180px] sm:max-w-[200px] md:max-w-xs lg:max-w-sm xl:max-w-md relative z-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
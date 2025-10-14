import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SectionHeader from '../../components/Titles/SectionHeader';
import HomeBanner from '../../components/HomeComponents/HomeBanner';
import Testimonials from '../../components/Testimonials/Testimonials';
import TestimonialModal from '../../components/Modals/TestimonialModal';
import aboutImg from '../../assets/user/home/about.png';
import certifiedExpert from '../../assets/user/home/certifiedExpert.png';
import clients from '../../assets/user/home/clients.png';
import multipleLanguage from '../../assets/user/home/multipleLanguage.png';
import Flowers from '../../assets/user/home/flowers.png';
import Flower from '../../assets/elements/flower.svg';
import GooglePlay from '../../assets/user/home/googleplay.png';
import Mobile from '../../assets/user/home/mobile.png';
import Group from '../../assets/user/home/Group.png';
import Service1 from '../../assets/user/home/services/service-homepage (1).png';
import Preloaders from '../../components/Loader/Preloaders';
import Service2 from '../../assets/user/home/services/service-homepage (2).png';
import Service3 from '../../assets/user/home/services/service-homepage (3).png';
import Service4 from '../../assets/user/home/services/service-homepage (4).png';
import { getActiveBanners, getOurProducts, getOurServiceCategories } from "../../api";
import { environment } from "../../env";
import { Medal06Icon, FavouriteIcon, FaceIdIcon } from 'hugeicons-react';
import { useSelector, useDispatch } from 'react-redux';
import { setServiceCategories } from '../../redux/Slices/rootSlice';
import InstagramImg from '../../assets/instagram.png'
import FacebookImg from '../../assets/facebook.png'
import YoutubeImg from '../../assets/youtube.png'
import YoutubeThumbnail from '../../assets/IntroductionVideo.png'
import aboutusElement from '../../assets/elements/aboutusEl.svg'
import omElement from '../../assets/elements/om.svg'
import whyChooseElement from '../../assets/elements/whychooseEl.svg'
import servicesElement from '../../assets/elements/servicesEl.svg'

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { servicesDropdown, productsDropdown } = useSelector(state => state.nav);
    const { isLogged } = useSelector(state => state.user);
    const [slidesData, setSlidesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productsData, setProductsData] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [servicesData, setServicesData] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [showExperienceModal, setShowExperienceModal] = useState(false);

    const handleShareExperience = () => {
        if (!isLogged) {
            toast.error('Please login to share your experience');
            return;
        }
        setShowExperienceModal(true);
    };

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
                    // Store original service categories in Redux for footer and other components
                    dispatch(setServiceCategories(response.data));
                } else {
                    setServicesData([]);
                    dispatch(setServiceCategories([]));
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
            title: 'Quick and Reliable Results',
            description:
                'Most of the clients got quick results and almost all of them are loyal with us',
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
                'Trusted by clients for life-changing guidance and solutions',
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

        const handleCardClick = () => {
            if (product._id) {
                navigate(`/products/${product._id}`);
            }
        };

        return (
            <div
                className={`relative rounded-xl overflow-hidden shadow-sm w-full ${heightClass} ${className} group cursor-pointer`}
                onClick={handleCardClick}
            >
                {/* Image */}
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />

                {/* Lightbox Overlay (applies to full card on hover) */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-500 z-10" />

                {/* Title (moves up on hover) */}
                <h3
                    className="absolute top-3 left-3 right-3 text-white font-semibold drop-shadow text-sm z-20
             transition-all duration-500 group-hover:translate-x-2 group-hover:translate-y-2"
                >
                    {title}
                </h3>


                {/* Highlights text - bottom right and moves in on hover */}
                {product?.additionalInfo && (
                    <p className="absolute bottom-10 left-3 max-w-[80%] text-white text-sm p-2 rounded-md z-20
      opacity-0 translate-y-4 -translate-x-4 group-hover:opacity-100 
      group-hover:translate-y-0 group-hover:translate-x-0 
      transition-all duration-500 ease-out   text-left">
                        {product.additionalInfo}
                    </p>
                )}


                {/* Price and Button */}
                <div className="absolute bottom-0 left-0 right-0 bg-button-gradient-orange px-3 py-1 flex items-center justify-between z-20">
                    <span className="px-2 py-1 text-white text-sm rounded-md">{price}</span>
                    <button className="px-3 py-1 text-sm font-semibold text-white rounded-md">
                        Book Now
                    </button>
                </div>
            </div>
        );
    }



    return (
        <div className='overflow-hidden'>
            <HomeBanner slidesData={slidesData} isLoading={isLoading} />
            {/* <HomeAboutUs /> */}

            <div className="bg-slate1 relative overflow-hidden">
                <div className="absolute top-[-10px] sm:top-[-15px] md:top-[-20px] right-[-10px] sm:right-[-15px] md:right-[-20px] z-0">
                    {/* Container for the rotating element */}
                    <div className="relative">
                        {/* Rotating aboutusElement */}
                        <img
                            src={aboutusElement}
                            alt="About Us"
                            className="w-16 sm:w-24 md:w-32 lg:w-40 xl:w-52 2xl:w-64 h-auto max-w-full animate-spin"
                            style={{
                                animation: 'spin 30s linear infinite'
                            }}
                        />

                        {/* Stationary omElement positioned at center */}
                        <img
                            src={omElement}
                            alt="OM"
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 sm:w-10 md:w-12 lg:w-16 xl:w-20 2xl:w-24 h-auto max-w-full z-10"
                        />
                    </div>
                </div>
                <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16 md:py-20'>
                    {/* Header */}
                    <SectionHeader
                        prefix="About"
                        highlight="Pandit Prashant Shastri"
                    />

                    {/* Content */}
                    <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 z-10 relative">
                        {/* Left: Image */}
                        <div className="w-full lg:w-1/2 order-2 lg:order-1">
                            <img
                                src={aboutImg}
                                alt="Home Banner"
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        </div>

                        {/* Right: Text & Cards */}
                        <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left order-1 lg:order-2">
                            <h2 className="text-lg sm:text-lg md:text-xl font-semibold text-slate-800">
                                16 Years of Spiritual Guidance
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base md:text-base leading-relaxed">
                                With over 16 years of dedicated practice in Vedic Astrology, I have guided thousands of souls
                                towards clarity, peace, and prosperity. My expertise spans across traditional Vedic sciences
                                including Kundli analysis, Vastu Shastra, and spiritual counseling.
                            </p>
                            <p className="text-slate-600 text-sm sm:text-base md:text-base leading-relaxed">
                                I believe in combining ancient wisdom with practical solutions, helping individuals navigate
                                life's challenges with confidence and spiritual awareness.
                            </p>

                            {/* Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 pt-2">
                                {aboutData.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-md border border-[#00000026] p-2 sm:p-3 md:p-2 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300"
                                    >
                                        {/* Image */}
                                        <div className="flex justify-center mb-2 sm:mb-3">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Text */}
                                        <div className="text-center">
                                            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-slate-800 mb-1 sm:mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-500 text-xs sm:text-sm md:text-[11px] leading-none">
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-[#FFBF12] via-[#FF8835] to-[#FF5858] py-8 sm:py-12 md:py-16 lg:py-20 w-full relative z-10">

                <div className="absolute top-[-3px] sm:top-[-5px] md:top-[-8px] lg:top-[-10px] xl:top-[-10px] z-0">
                    <img
                        src={whyChooseElement}
                        alt="OM"
                        className="w-full h-auto max-w-full"
                    />
                </div>

                {/* Header */}
                <div className='mt-2 sm:mt-3'>
                    <SectionHeader
                        prefix="Why Choose"
                        highlight="Pandit Prashant Shastri"
                        white={true}
                        highlightColor="text-white"
                    />
                </div>

                {/* Features Grid */}
                <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16'>
                    <div className="mt-8 sm:mt-12 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {whyData.map((item, index) => (
                            <div
                                key={index}
                                className="bg-[#0000000D] border-[#FFFFFF66] border-[1px] rounded-lg p-4 sm:p-5 md:p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 sm:hover:-translate-y-3 hover:bg-white/10 hover:backdrop-blur-sm hover:border-white/30 cursor-pointer"
                            >
                                {/* Icon */}
                                <div className="mb-3 sm:mb-4 bg-gradient-to-r from-[#FF8835] to-[#FF5858] rounded-md w-12 sm:w-14 p-2">
                                    {item.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



            <div className="relative">
                {/* Header */}
                <div className="absolute top-[-20%] sm:top-[-25%] left-[-20%] md:top-[-30%] -z-0 hidden lg:block">
                    <img
                        src={servicesElement}
                        alt="OM"
                        className="w-[60%] sm:w-[70%] md:w-[60%] lg:w-full h-auto max-w-full mx-auto animate-spin-slow"
                        style={{ transformOrigin: 'center center' }}
                    />
                </div>

                <div className='px-4 sm:px-6 lg:px-16 py-8 sm:py-12 md:py-16 lg:py-20 w-full max-w-[1280px] mx-auto'>
                    <div className='mb-6 sm:mb-8'>
                        <SectionHeader
                            prefix="Our"
                            highlight="Services"
                        />
                    </div>

                    {/* Loading State */}
                    {servicesLoading ? (
                        <Preloaders />
                    ) : servicesData.length > 0 ? (
                        <>
                            {/* Services Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                                {servicesData.map((service) => (
                                    <div key={service.id} className="relative group">
                                        <div
                                            className="relative overflow-hidden rounded-lg bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 p-1 cursor-pointer hover:scale-105 transition-transform duration-300"
                                            onClick={() => navigate(`/services?category=${encodeURIComponent(service.category)}`)}
                                        >
                                            <div className="bg-white rounded-lg overflow-hidden">
                                                <div className="relative aspect-square overflow-hidden">
                                                    <img
                                                        src={service.image}
                                                        alt={service.alt}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center">
                                                        <div className="text-center px-3 sm:px-4 pb-3 sm:pb-4">
                                                            <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg mb-1">{service.title}</h3>
                                                            <p className="text-white/90 text-xs sm:text-sm md:text-base">{service.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:mt-3 flex justify-between items-center">
                                            <p className="text-gray-700 text-sm sm:text-base font-bold">{service.category}</p>
                                            <p
                                                className="text-gray-500 text-xs sm:text-sm cursor-pointer hover:text-orange-500 transition-colors"
                                                onClick={() => navigate(`/services?category=${encodeURIComponent(service.category)}`)}
                                            >
                                                View All
                                            </p>
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
                    <div className="flex justify-center mt-8 sm:mt-12">
                        <button
                            onClick={() => navigate('/services')}
                            className="bg-button-diagonal-gradient-orange text-white px-12 sm:px-16 py-2 sm:py-3 rounded-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                            View More
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-16 w-full max-w-[1280px] mx-auto">
                {/* Header */}
                <div className='mb-6 sm:mb-8'>
                    <SectionHeader prefix="Our" highlight="Products" />
                </div>

                {/* Loading State */}
                {productsLoading ? (
                    <Preloaders />
                ) : productsData.length > 0 ? (
                    <>
                        {/* Products Grid - Responsive Layout */}
                        <div className="mb-8 sm:mb-12">
                            {/* Mobile: Single column, Desktop: 2-column layout with left vertical and right grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                {/* First Product - Vertical on left (1/3 width on desktop) */}
                                {productsData[0] && (
                                    <div className="lg:col-span-1">
                                        <Card
                                            product={productsData[0]}
                                            heightClass="h-64 sm:h-72 md:h-80 lg:h-full"
                                        />
                                    </div>
                                )}

                                {/* Right Section - 4 products in 2x2 grid (2/3 width on desktop) */}
                                <div className="lg:col-span-2">
                                    <div className="space-y-4 sm:space-y-6">
                                        {/* First Row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                            {/* Second Product - Narrow */}
                                            {productsData[1] && (
                                                <div className="sm:col-span-1">
                                                    <Card
                                                        product={productsData[1]}
                                                        heightClass="h-64 sm:h-72 md:h-80"
                                                    />
                                                </div>
                                            )}

                                            {/* Third Product - Wide */}
                                            {productsData[2] && (
                                                <div className="sm:col-span-2">
                                                    <Card
                                                        product={productsData[2]}
                                                        heightClass="h-64 sm:h-72 md:h-80"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Second Row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                            {/* Fourth Product - Wide */}
                                            {productsData[3] && (
                                                <div className="sm:col-span-2">
                                                    <Card
                                                        product={productsData[3]}
                                                        heightClass="h-64 sm:h-72 md:h-80"
                                                    />
                                                </div>
                                            )}

                                            {/* Fifth Product - Narrow */}
                                            {productsData[4] && (
                                                <div className="sm:col-span-1">
                                                    <Card
                                                        product={productsData[4]}
                                                        heightClass="h-64 sm:h-72 md:h-80"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* View More Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/products')}
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 sm:px-16 py-2 sm:py-3 rounded-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                            >
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
            {/* Testimonials Section */}
            <Testimonials />

            {/* Share Experience Section */}
            <div className="px-4 sm:px-6 lg:px-16 py-8 sm:py-12 md:py-16 w-full max-w-[1280px] mx-auto">
                <div className="text-center">
                    <SectionHeader
                        prefix="Share your experience"
                        highlight="with us"
                    />
                    <div className="mt-8 sm:mt-6">
                        <button
                            onClick={handleShareExperience}
                            className="bg-button-diagonal-gradient-orange text-white px-12 sm:px-16 py-2.5 md:py-3 rounded-full font-medium transition-opacity shadow-md text-sm md:text-base hover:opacity-90"
                        >
                            Share Your Experience
                        </button>
                    </div>
                </div>
            </div>

            {/* Share Experience Modal */}
            <TestimonialModal
                open={showExperienceModal}
                setOpen={setShowExperienceModal}
            />

            <section className="relative" id='social-media'>
                <img
                    src={Flower}
                    className="absolute right-[-10px] sm:right-[-15px] top-[-45px] xl:top-[-65px] w-12 sm:w-20 md:w-16 lg:w-28 xl:w-32 animate-spin-slow"
                    style={{ transformOrigin: 'center center' }}
                />

                {/* Social Media */}
                <div className="px-4 sm:px-6 lg:px-16 py-8 sm:py-12 md:py-16 w-full max-w-[1280px] mx-auto">
                    {/* Header */}
                    <div className='flex items-center flex-col gap-4 sm:gap-5 px-4'>
                        <SectionHeader
                            prefix="Our"
                            highlight="Social Media"
                        />
                        <p className='w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 text-center text-sm sm:text-base md:text-base text-slate-600 mb-6 sm:mb-8 md:mb-10'>
                            Connect with us on social media and watch our educational content on astrology and spiritual guidance
                        </p>
                    </div>

                    <div className='flex flex-col lg:flex-row gap-4 sm:gap-6'>
                        {/* Left Side - Video Section */}
                        <div className='w-full lg:w-1/2 bg-white p-4 sm:p-5 md:p-6 rounded-lg border-[#00000026] border-[1px] hover:shadow-lg transition-shadow duration-300 text-center'>
                            <h2 className='text-md sm:text-xl md:text-2xl text-slate-800 mb-2 sm:mb-3'>Watch Our Introduction Video</h2>
                            <p className='text-sm sm:text-base md:text-base text-slate-600 my-3 sm:my-4 leading-relaxed'>
                                Get to know Pandit Prashant and understand how Vedic astrology can guide your life journey.
                            </p>
                            <a
                                href="https://www.youtube.com/watch?v=3ystrJLmjtI"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={YoutubeThumbnail}
                                    alt="Video thumbnail"
                                    className="w-full object-cover cursor-pointer rounded-xl hover:scale-105 transition-transform duration-300"
                                />
                            </a>

                            <div className='mt-3 sm:mt-4 flex justify-center'>
                                <a
                                    href="https://www.youtube.com/watch?v=3ystrJLmjtI"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='bg-gradient-orange text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base hover:shadow-lg transition-all duration-300 inline-block'
                                >
                                    Watch Introduction Video
                                </a>
                            </div>
                        </div>

                        {/* Right Side - Social Media Links */}
                        <div className='w-full lg:w-1/2 flex flex-col justify-between gap-3 sm:gap-6'>
                            {/* Instagram Block */}
                            <a
                                href="https://www.instagram.com/pandit_prashant_shastri?igsh=dW40bnY2azljeWlw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='flex flex-row bg-white p-4 sm:p-5 md:p-6 py-6 sm:py-8 items-center rounded-lg border-[#00000026] border-[1px] hover:shadow-lg transition-shadow duration-300 flex-1 cursor-pointer'
                            >
                                <div className='w-12 sm:w-12 md:w-14 flex-shrink-0'>
                                    <img
                                        src={InstagramImg}
                                        alt="Instagram"
                                        className="w-10 h-10 sm:w-12 sm:h-12"
                                    />
                                </div>
                                <div>
                                    <h2 className='text-base sm:text-lg md:text-xl text-orange-500 mb-1'>Instagram</h2>
                                    <p className='text-xs sm:text-sm text-slate-500'>Daily astrology tips and spiritual guidance</p>
                                </div>
                            </a>

                            <a
                                href="https://www.facebook.com/share/19fmxP8B9f/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='flex flex-row bg-white p-4 sm:p-5 md:p-6 py-6 sm:py-8 items-center rounded-lg border-[#00000026] border-[1px] hover:shadow-lg transition-shadow duration-300 flex-1 cursor-pointer'
                            >
                                <div className='w-12 sm:w-12 md:w-14 flex-shrink-0'>
                                    <img
                                        src={FacebookImg}
                                        alt="Facebook"
                                        className="w-10 h-10 sm:w-12 sm:h-12"
                                    />
                                </div>
                                <div>
                                    <h2 className='text-base sm:text-lg md:text-xl text-orange-500 mb-1'>Facebook</h2>
                                    <p className='text-xs sm:text-sm text-slate-500'>Connect with our community and get updates</p>
                                </div>
                            </a>

                            <a
                                href="https://youtube.com/@pandit_prashant_shastri?si=mLcdUBeXyHIro4xq"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='flex flex-row bg-white p-4 sm:p-5 md:p-6 py-6 sm:py-8 items-center rounded-lg border-[#00000026] border-[1px] hover:shadow-lg transition-shadow duration-300 flex-1 cursor-pointer'
                            >
                                <div className='w-14 sm:w-14 md:w-16 flex-shrink-0'>
                                    <img
                                        src={YoutubeImg}
                                        alt="YouTube"
                                        className="w-12 h-10 sm:w-14 sm:h-9"
                                    />
                                </div>
                                <div>
                                    <h2 className='text-base sm:text-lg md:text-xl text-orange-500 mb-1'>YouTube</h2>
                                    <p className='text-xs sm:text-sm text-slate-500'>Educational videos and spiritual content</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Flower positioned between sections - mobile only */}
                <div className="relative">
                    <img
                        src={Flower}
                        className="absolute left-[-10px] sm:left-[-15px] top-[-45px] xl:top-[-65px] w-12 sm:w-16 md:w-16 lg:w-20 xl:w-32 animate-spin-slow"
                        style={{ transformOrigin: 'center center' }}
                    />
                </div>

                {/* Download app */}
                <div className="bg-custom-linear py-8 sm:py-12 md:py-16 lg:py-20 relative">
                    {/* Flower for larger screens */}
                    {/* <img
                        src={Flower}
                        className="hidden sm:block absolute left-[-10px] sm:left-[-15px] md:left-[-2px] top-[-30px] sm:top-[-35px] md:top-[-50px] w-12 sm:w-16 md:w-16 lg:w-20 xl:w-24 z-0 rotate-180"
                    /> */}
                    <div className="px-4 sm:px-6 lg:px-16 w-full max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 h-full">
                        <div className="flex-1 flex flex-col items-center justify-center h-full text-center order-2 lg:order-1">
                            <div className="flex flex-col items-center justify-center">
                                <SectionHeader
                                    prefix="Mobile app coming soon"
                                    prefixClass="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl whitespace-normal -mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8"
                                    showImage={false}
                                />
                                <SectionHeader
                                    prefix="stay tuned."
                                    prefixClass="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl whitespace-normal -mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8 mt-1 sm:mt-2"
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
                        <div className="flex-1 flex justify-center lg:justify-end relative mt-4 sm:mt-6 md:mt-8 lg:mt-0 order-1 lg:order-2">
                            <div className="relative flex items-end">
                                <img
                                    src={Group}
                                    className="w-12 sm:w-14 md:w-16 lg:w-20 xl:w-24 2xl:w-26 absolute bottom-0 -left-3 sm:-left-4 md:-left-6 lg:-left-8 xl:-left-10 2xl:-left-12 z-0"
                                />
                                <img
                                    src={Mobile}
                                    className="max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-xs 2xl:max-w-sm relative z-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
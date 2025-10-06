import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackgroundTitle from '../../components/Titles/BackgroundTitle'
import { ArrowRight02Icon, Saturn01Icon } from 'hugeicons-react';
import aboutImg from '../../assets/user/aboutus.png'
import SectionHeader from '../../components/Titles/SectionHeader';
import { FavouriteIcon, StarIcon, Calendar03Icon } from 'hugeicons-react';
import Testimonials from '../../components/Testimonials/Testimonials';
import { getAllAstrologer, getServicesList } from '../../api';
import Preloaders from '../../components/Loader/Preloaders';


// Static icons for services (keeping as requested)
const serviceIcons = [
    '/src/assets/user/about/core (1).svg',
    '/src/assets/user/about/core (2).svg',
    '/src/assets/user/about/core (3).svg',
    '/src/assets/user/about/core (4).svg',
    '/src/assets/user/about/core (5).svg',
    '/src/assets/user/about/core (6).svg'
];

const aboutData = [
    {
        title: "Compassionate Guidance",
        icon: <FavouriteIcon size={25} className="text-white" />,
        bg: '#0088FF',
        content: "Every soul deserves profound understanding and divine clarity. I approach consultation with deep empathy, ensuring you feel spiritually supported, and truly heard on your sacred journey.",
    },
    {
        title: "Compassionate Guidance",
        icon: <StarIcon size={25} className="text-white" />,
        bg: '#FF8D28',
        content: "Seamlessly blending time-honored Vedic traditions with contemporary spiritual understanding, I provide guidance that is both deeply rooted in ancient wisdom and practically applicable to modern life.",
    },
    {
        title: "Transformation Focus",
        icon: <Calendar03Icon size={25} className="text-white" />,
        bg: '#34C759',
        content: "Astrology is not merely prediction—it is divine transformation. I help you decode your cosmic blueprint to unlock your highest potential, heal past wounds, and create meaningful positive change.",
    },
];

const AboutPage = () => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);
    const [astrologers, setAstrologers] = useState([]);
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllAstrologer()
                if (response?.success) {
                    setAstrologers(response?.data)
                } else {
                    setAstrologers([])
                    console.log('error', response)
                }
            } catch (error) {
                console.log('error', error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchServices = async () => {
            setServicesLoading(true);
            try {
                const response = await getServicesList();

                if (response?.success && response?.data?.length > 0) {
                    // Extract and transform services in one operation
                    const transformedServices = response.data
                        .filter(category => category.services?.length > 0)
                        .flatMap(category => category.services)
                        .slice(0, 6)
                        .map((service, index) => ({
                            id: service._id,
                            title: service.name,
                            description: service.subTitle || service.title || 'Service description not available',
                            icon: service.image || serviceIcons[index % serviceIcons.length]
                        }));

                    setServices(transformedServices);
                } else {
                    setServices([]);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
                setServices([]);
            } finally {
                setServicesLoading(false);
            }
        };

        fetchServices();
    }, []);
    return (
        <div className='bg-slate1'>

            {/* == Page Header / Breadcrumb == */}
            <BackgroundTitle title="About Us"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "About Us", href: null }
                ]}
                backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                height="h-72" />

            <div>

                {/* == About Image & Intro Text == */}
                <div className="flex flex-col md:flex-row items-center md:items-start px-4 sm:px-6 lg:px-16 pt-16 w-full max-w-[1280px] mx-auto ">

                    {/* Left Side - Image */}
                    <div className="w-full md:w-1/2 mb-6 md:mb-0">
                        <img
                            src={aboutImg}
                            alt="About us"
                            className="w-full h-auto rounded-2xl shadow-md"
                        />
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full md:w-1/2 md:pl-10 text-center md:text-left">
                        <div className='flex flex-row gap-2'>
                            <Saturn01Icon size={30} className="text-slate-800" />
                            <h2 className="text-3xl mb-4 text-slate-800">About Pandit Prashant Shastri</h2>
                        </div>
                        <p className="text-base-font mb-4 text-sm">
                            Pandit Prashant Shastri—today often recognized as a 'celebrity priest'—yet beyond this public image, my truest identity is that of a trusted companion who walks beside you on the path of peace, happiness, and progress. My work is not limited to recognition or popularity; it is rooted in the timeless wisdom of our scriptures and the sincere desire to guide every seeker toward balance and fulfillment.
                        </p>
                        <p className="text-base-font mb-4 text-sm">
                            Be it the sacred conduct of traditional pujas, the application of vastu shastra for harmony in living and working spaces, or the resolution of personal challenges that life inevitably brings, my purpose remains constant: to provide authentic, scripture-based remedies with compassion and clarity. Every ritual, every suggestion, and every consultation is offered with the intent to uplift and empower those who place their trust in me.
                        </p>
                        <p className="text-base-font mb-4 text-sm">
                            My journey has been shaped by years of devotion, learning, and practice. While firmly grounded in tradition, I also carry a fresh perspective that bridges the gap between ancient practices and modern lifestyles. This unique blend allows me to make puja rituals, vastu principles, and astrological insights accessible and relevant to contemporary lives while never compromising on authenticity.
                        </p>
                        <p className="text-base-font mb-4 text-sm">
                            As an Astro and Vastu Consultant, I see my role as a bridge between tradition and transformation. For me, the sacred path is not just about rituals but about meaningful change. It is about weaving together scriptures, traditions, and a renewed outlook, creating a powerful synergy that guides you toward peace, prosperity, and spiritual growth.
                        </p>
                    </div>
                </div>

                {/* == Philosophy & Mission Section == */}
                <div className="px-4 sm:px-6 lg:px-16 w-full max-w-[1280px] mx-auto mt-12 md:mt-20 lg:mt-24">
                    <div className='flex items-center flex-col gap-5'>
                        <SectionHeader
                            prefix="Our"
                            highlight="Philosophy & Mission"
                        />
                        <p className='w-11/12 md:w-4/12 text-center text-sm text-slate-600 mb-10'>
                            Bridging timeless Vedic wisdom with contemporary understanding...
                        </p>
                    </div>

                    {/* Philosophy Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 place-items-center">
                        {aboutData.map((item, index) => (
                            <div key={index} className="bg-white rounded-md border hover:shadow-xl border-[#00000026] p-4 flex flex-col h-full shadow-sm items-center justify-center text-center">
                                <div className="mb-4 text-center w-fit p-3 rounded-full" style={{ backgroundColor: item.bg }}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg text-center text-slate-800 mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-center text-base leading-relaxed">
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* == Astrologer Section (Only if astrologers exist) == */}
                {astrologers?.length > 0 && (
                    <div className="px-4 sm:px-6 lg:px-16 w-full max-w-[1280px] mx-auto mt-12 md:mt-20 lg:mt-24">
                        <div className='flex items-center flex-col gap-5 mb-12'>
                            <SectionHeader
                                prefix="Our"
                                highlight="Astrologer"
                            />
                        </div>

                        {/* Astrologer Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {astrologers.map((astrologer) => (
                                <div
                                    key={astrologer?._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                                    onMouseEnter={() => setHoveredCard(astrologer?._id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div className="relative group">
                                        <div className="w-full overflow-hidden relative" style={{ aspectRatio: '3/4' }}>
                                            <img
                                                src={astrologer?.profileImage}
                                                alt={astrologer.fullName}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            {/* Astrologer Card Hover Content */}
                                            <div className={`absolute left-4 right-4 bg-black/40 backdrop-blur-sm rounded border border-white/20 cursor-pointer transition-all duration-500 ease-in-out ${hoveredCard === astrologer?._id ? 'bottom-4 p-2' : 'bottom-4 p-2'}`}>
                                                <div className="flex items-center justify-between w-full">
                                                    <h3 className="text-base font-medium text-white truncate pr-2">
                                                        {astrologer.fullName}
                                                    </h3>
                                                    <ArrowRight02Icon size={20} className='text-white group-hover:-rotate-45 transition-all duration-500 ease-in-out' />
                                                </div>

                                                {/* Expandable Details on Hover */}
                                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${hoveredCard === astrologer?._id ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                                                    <div className="space-y-2 text-white">
                                                        {/* Experience */}
                                                        <div className="flex items-center gap-2">
                                                            <Calendar03Icon size={14} className="text-blue-300" />
                                                            <span className="text-sm">
                                                                Experience: {astrologer?.experience} {astrologer?.experience === 1 ? 'Year' : 'Years'}
                                                            </span>
                                                        </div>

                                                        {/* Skills */}
                                                        <div className="text-sm">
                                                            <p className="font-medium mb-1">Skills:</p>
                                                            <p className="text-xs opacity-90">
                                                                {astrologer?.skills?.map(skill =>
                                                                    skill.charAt(0).toUpperCase() + skill.slice(1)
                                                                ).join(', ')}
                                                            </p>
                                                        </div>

                                                        {/* Languages */}
                                                        <div className="text-sm">
                                                            <p className="font-medium mb-1">Languages:</p>
                                                            <p className="text-xs opacity-90">
                                                                {astrologer?.languages?.map(language =>
                                                                    language.charAt(0).toUpperCase() + language.slice(1)
                                                                ).join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* == Core Services Section == */}
                <div className="px-6 md:px-12 mt-12 md:mt-20 lg:mt-24">
                    <div className='flex items-center flex-col gap-5'>
                        <SectionHeader
                            prefix="Our"
                            highlight="Core Services"
                        />
                        <p className='w-11/12 md:w-4/12 text-center text-base text-slate-600 mb-10'>
                            Comprehensive spiritual guidance tailored to illuminate your unique cosmic path
                        </p>
                    </div>

                    {/* Services Cards */}
                    {servicesLoading ? (
                        <Preloaders />
                    ) : services.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {services.map((service) => (
                                <div key={service.id} className="group bg-white p-6 rounded-lg shadow-md hover:-translate-y-3 transition-all duration-300 flex flex-col">
                                    <div className="w-20 h-20 flex items-center justify-start mb-4">
                                        <div className="w-16 h-16 rounded-full transition-all duration-300 group-hover:bg-button-diagonal-gradient-orange flex items-center justify-center overflow-hidden">
                                            <img
                                                src={service.icon}
                                                alt={service.title}
                                                className="w-16 h-16 object-cover transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-left mb-2">{service.title}</h3>
                                    <p className="text-sm text-gray-600 text-left mb-4 flex-grow">{service.description}</p>
                                    <button
                                        onClick={() => navigate(`/services/${service.id}`)}
                                        className="text-[#0088FF] hover:text-blue-700 text-sm font-medium text-left mt-auto cursor-pointer"
                                    >
                                        Read More →
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center py-12">
                            <p className="text-gray-500">No services available at the moment.</p>
                        </div>
                    )}
                </div>

                {/* == Testimonials Section == */}

                <Testimonials />

            </div>
        </div>
    )

}

export default AboutPage

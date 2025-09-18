import React, { useState } from 'react'
import BackgroundTitle from '../../components/Titles/BackgroundTitle'
import { Saturn01Icon } from 'hugeicons-react';
import aboutImg from '../../assets/user/aboutus.png'
import SectionHeader from '../../components/Titles/SectionHeader';
import { FavouriteIcon, StarIcon, Calendar03Icon } from 'hugeicons-react';
import Testimonials from '../../components/Testimonials/Testimonials';

const astrologers = [
    { id: 1, name: 'Suvigya Indusoot' },
    { id: 2, name: 'Ravi Kumar' },
    { id: 3, name: 'Suvigya Indusoot' },
    { id: 4, name: 'Suvigya Indusoot' },
    { id: 5, name: 'Priya Sharma' },
    { id: 6, name: 'Ravi Kumar' }
];

const services = [
    {
        id: 1,
        title: 'DOB Analysis',
        description: 'Detailed life guidance based on your birth date covering personality traits, career paths, love compatibility, and health patterns.',
        icon: '/src/assets/user/about/core (1).svg'
    },
    {
        id: 2,
        title: 'Personal Kundali Reading',
        description: 'Complete birth chart analysis revealing your personality, career potential, relationships, and life cycles with precise cosmic insights.',
        icon: '/src/assets/user/about/core (2).svg'
    },
    {
        id: 3,
        title: 'Kundli Matching',
        description: 'Traditional compatibility analysis for marriages and partnerships ensuring harmonious relationships and shared prosperity.',
        icon: '/src/assets/user/about/core (3).svg'
    },
    {
        id: 4,
        title: 'Numerology & Correction',
        description: 'Align your name vibrations with cosmic energies for enhanced success, prosperity, and life harmony.',
        icon: '/src/assets/user/about/core (4).svg'
    },
    {
        id: 5,
        title: 'Palmistry',
        description: 'Ancient hand reading techniques revealing your destiny, success patterns, and hidden life potentials.',
        icon: '/src/assets/user/about/core (5).svg'
    },
    {
        id: 6,
        title: 'Vastu Consultation',
        description: 'Balance your home and office spaces with cosmic energies for enhanced positivity, prosperity, and peace.',
        icon: '/src/assets/user/about/core (6).svg'
    }
];

const AboutPage = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const aboutData = [
        {
            title: "Compassionate Guidance",
            icon: <FavouriteIcon size={25} className="text-white" />,
            bg: '#0088FF',
            content:
                "Every soul deserves profound understanding and divine clarity. I app each consultation with deep empathy, ensuring you feel spiritually supported, and truly heard on your sacred journey.",
        },
        {
            title: "Compassionate Guidance",
            icon: <StarIcon size={25} className="text-white" />,
            bg: '#FF8D28',
            content:
                "Seamlessly blending time-honored Vedic traditions with contemporary spiritual understanding, I provide guidance that is both deeply rooted in ancient wisdom and practically applicable to modern life.",
        },
        {
            title: "Transformation Focus",
            icon: <Calendar03Icon size={25} className="text-white" />,
            bg: '#34C759',
            content:
                "Astrology is not merely prediction—it is divine transformation. I help you decode your cosmic blueprint to unlock your highest potential, heal past wounds, and create meaningful positive change.",
        },
    ];
    return (
        <div className='bg-slate1'>
            <BackgroundTitle title="About Us"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "About Us", href: null }
                ]}
                backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                height="h-72" />

            <div>
                <div className="flex flex-col md:flex-row items-center md:items-start px-4 sm:px-6 lg:px-16 py-16 w-full max-w-[1280px] mx-auto ">

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
                        <p className="text-slate-600 mb-4 text-sm">
                            Welcome to a sacred journey of self-discovery and cosmic understanding. I am Pandit Prashant Suryavanshi, also known as Pandit Prashant Shastri, a dedicated Vedic astrologer and spiritual guide with over 15 years of transformative experience in helping souls navigate their divine path.
                        </p>
                        <p className="text-slate-600 mb-4 text-sm">
                            My spiritual awakening began in my early years, blessed by an ancient lineage of Vedic scholars and guided by the timeless wisdom of our sacred scriptures. Through decades of devoted study, meditation, and practice, I have developed a unique approach that honors traditional Vedic principles while embracing the evolving consciousness of modern seekers.
                        </p>
                        <p className="text-slate-600 mb-4 text-sm">
                            What distinguishes my practice is the profound understanding that astrology transcends mere prediction—it is a divine science of transformation, empowerment, and soul awakening. Every consultation becomes a sacred dialogue between your inner wisdom, cosmic energies, and the eternal guidance that flows through us all.
                        </p>
                        <p className="text-slate-600 mb-4 text-sm">
                            Having served over 10,000+ clients worldwide, I am honored to be recognized as a trusted voice in the spiritual community, with a growing presence across digital platforms where ancient wisdom meets modern accessibility.
                        </p>
                    </div>
                </div>

                <div className="px-4 sm:px-6 lg:px-16 w-full max-w-[1280px] mx-auto">
                    <div className='flex items-center flex-col gap-5'>
                        <SectionHeader
                            prefix="Our"
                            highlight="Philosophy & Mission"
                        />
                        <p className='w-11/12 md:w-4/12 text-center text-sm text-slate-600 mb-10'>
                            Bridging timeless Vedic wisdom with contemporary understanding for profound healing and spiritual growth
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 place-items-center">
                        {aboutData.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-md border hover:shadow-xl border-[#00000026] p-4 flex flex-col h-full shadow-sm items-center justify-center text-center"
                            >
                                {/* Icon */}
                                <div
                                    className="mb-4 text-center w-fit p-3 rounded-full"
                                    style={{ backgroundColor: item.bg }}
                                >
                                    {item.icon}
                                </div>

                                {/* Text */}
                                <h3 className="text-sm text-center   text-slate-800 mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-center text-xs leading-relaxed">
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="px-4 sm:px-6 lg:px-16 py-16 w-full max-w-[1280px] mx-auto">
                    <div className='flex items-center flex-col gap-5 mb-12'>
                        <SectionHeader
                            prefix="Our"
                            highlight="Astrologer"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {astrologers.map((astrologer) => (
                            <div
                                key={astrologer.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                                onMouseEnter={() => setHoveredCard(astrologer.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="relative group">
                                    <div className="w-full overflow-hidden relative" style={{ aspectRatio: '3/4' }}>
                                        <img
                                            src={`/src/assets/user/about/pandit (${astrologer.id}).png`}
                                            alt={astrologer.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className={`absolute left-4 right-4 bg-black/40 backdrop-blur-sm rounded border border-white/20 cursor-pointer transition-all duration-500 ease-in-out ${hoveredCard === astrologer.id
                                            ? 'bottom-4 p-2'
                                            : 'bottom-4 p-2'
                                            }`}>
                                            <div className="flex items-center justify-between w-full">
                                                <h3 className="text-base font-medium text-white truncate pr-2">
                                                    {astrologer.name}
                                                </h3>
                                                <span className="text-white flex-shrink-0">→</span>
                                            </div>

                                            {/* Expandable content that appears on hover */}
                                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${hoveredCard === astrologer.id ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                                }`}>
                                                <div className="space-y-2 text-white">
                                                    <div className="flex items-center gap-2">
                                                        <StarIcon size={14} className="text-amber-400" />
                                                        <span className="text-sm">Rating: 4.8/5</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar03Icon size={14} className="text-blue-300" />
                                                        <span className="text-sm">Experience: 15+ years</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <p className="font-medium mb-1">Specializations:</p>
                                                        <p className="text-xs opacity-90">Vedic Astrology, Palmistry, Numerology</p>
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


                <div className="px-6 md:px-12">
                    <div className='flex items-center flex-col gap-5'>
                        <SectionHeader
                            prefix="Our"
                            highlight="Core Services"
                        />
                        <p className='w-11/12 md:w-4/12 text-center text-sm text-slate-600 mb-10'>
                            Comprehensive spiritual guidance tailored to illuminate your unique cosmic path
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white p-6 rounded-lg shadow-md hover:-translate-y-3  transition-all duration-300 flex flex-col ">
                                <div className="w-20 h-20 flex items-center justify-start mb-4">
                                    <img src={service.icon} alt={service.title} className="w-16 h-16" />
                                </div>
                                <h3 className="text-lg font-semibold text-left mb-2">{service.title}</h3>
                                <p className="text-sm text-gray-600 text-left mb-4 flex-grow">{service.description}</p>
                                <a href="#" className="text-[#0088FF] hover:text-blue-700 text-sm font-medium text-left mt-auto">
                                    Read More →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonials Section */}
                <Testimonials />

            </div>
        </div>
    )
}

export default AboutPage

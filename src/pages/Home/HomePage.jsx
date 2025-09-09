import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/Titles/SectionHeader';
import HomeBanner from '../../components/HomeComponents/HomeBanner';

import aboutImg from '../../assets/user/home/about.png';
import certifiedExpert from '../../assets/user/home/certifiedExpert.png';
import clients from '../../assets/user/home/clients.png';
import multipleLanguage from '../../assets/user/home/multipleLanguage.png';
import { Medal06Icon, FavouriteIcon } from 'hugeicons-react';

const HomePage = () => {

    const slidesData = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            title: "Guiding You Through Life with Vedic Wisdom",
            description: "Discover the ancient science of Vedic Astrology and unlock the secrets of your destiny. Our expert astrologers provide personalized readings, Kundli matching, and Vastu Shastra guidance to help you make informed decisions and live a harmonious life.",
            button: true,
            background: true,
            video: null, // Optional video URL
            onClick: () => console.log("Slide 1 button clicked")
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            title: "Unlock Your Life's Purpose Through Vedic Astrology",
            description: "Experience the profound wisdom of ancient Indian astrology. Get detailed birth chart analysis, planetary remedies, and spiritual guidance tailored to your unique cosmic blueprint. Transform your life with authentic Vedic insights.",
            button: true,
            background: true,
            video: null,
            onClick: () => console.log("Slide 2 button clicked")
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            title: "Harmonize Your Space with Vastu Shastra",
            description: "Create positive energy flow in your home and workplace with ancient Vastu principles. Our certified consultants provide comprehensive Vastu analysis and practical solutions to enhance prosperity, health, and happiness in your life.",
            button: true,
            background: true,
            video: null,
            onClick: () => console.log("Slide 3 button clicked")
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            title: "Perfect Kundli Matching for Harmonious Marriage",
            description: "Ensure a blissful and compatible marriage with detailed Kundli matching and astrological compatibility analysis. Our expert astrologers evaluate Guna Milan, Mangal Dosha, and other important factors for a successful union.",
            button: true,
            background: true,
            video: null,
            onClick: () => console.log("Slide 4 button clicked")
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2096&q=80",
            title: "Spiritual Guidance for Inner Peace",
            description: "Embark on a journey of self-discovery and spiritual growth. Our experienced spiritual guides help you find inner peace, overcome challenges, and align with your higher purpose through meditation, mantras, and sacred wisdom.",
            button: true,
            background: true,
            video: null,
            onClick: () => console.log("Slide 5 button clicked")
        }
    ];
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

    function Card({ img, title, price, className = "" }) {
        return (
            <div className={`relative rounded-xl overflow-hidden shadow-sm ${className}`}>
                <img
                    src={'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
                    alt={title}
                    className="w-full object-cover h-64"  // Fix height to 48 (adjust as needed)
                />
                {/* top fade for title */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent"></div>
                {/* <h3 className="absolute top-3 left-3 right-3 text-white font-semibold drop-shadow">
                    {title}
                </h3> */}

                {/* bottom bar with price + button */}
                {/* <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between">
                    <span className="px-2 py-1 text-white text-sm rounded-md bg-orange-500/95">
                        {price}
                    </span>
                    <button className="px-3 py-1 text-sm font-semibold text-white rounded-md bg-red-500/95">
                        Book Now
                    </button>
                </div> */}
            </div>
        );
    }


    return (
        <div>
            <HomeBanner slidesData={slidesData} />
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
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-16 h-16 object-contain mb-2"
                                        loading="lazy"
                                    />

                                    {/* Text */}
                                    <h3 className="text-sm text-left font-semibold text-slate-800 mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-left text-xs leading-relaxed">
                                        {item.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <div className="bg-gradient-orange py-16 w-full">
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
                                className="bg-[#0000000D] border-[1px] border-[#FFFFFF66] rounded-lg p-6 shadow  flex flex-col items-start hover:shadow-lg transition"
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

            <div className="px-4 sm:px-6 lg:px-16 py-16 ">
                {/* Header */}

                <div className='mb-6'>
                    <SectionHeader
                        prefix="Our"
                        highlight="Services"
                    />
                </div>

            </div>

            <div className="px-4 sm:px-6 lg:px-16 py-8 w-full max-w-[1280px] mx-auto">
                {/* Header */}
                <div className='mb-6'>
                    <SectionHeader prefix="Our" highlight="Products" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* LEFT BIG CARD */}
                    <Card
                        className="md:row-span-1 w-full h-auto"  // Ensure it takes full width on small screens
                        img="https://via.placeholder.com/600x900"
                        title="Shiv Shakti Murti"
                        price="Rs 3,500"
                    />

                    {/* RIGHT SIDE GRID */}
                    <div className="grid grid-rows-2 gap-4 col-span-2 h-auto">
                        {/* TOP ROW */}
                        <div className="grid grid-cols-5 gap-4">
                            <Card
                                className="col-span-3 h-auto"  // Reduce height by using h-auto
                                img="https://via.placeholder.com/600x400"
                                title="Tripple Protection Bracelet"
                                price="Rs 1,555"
                            />
                            <Card
                                className="col-span-2 h-auto"  // Reduce height by using h-auto
                                img="https://via.placeholder.com/400x400"
                                title="Shivling"
                                price="Rs 2,111"
                            />
                        </div>

                        {/* BOTTOM ROW */}
                        <div className="grid grid-cols-5 gap-4">
                            <Card
                                className="col-span-2 h-auto"  // Reduce height by using h-auto
                                img="https://via.placeholder.com/600x400"
                                title="Gemstone"
                                price="Rs 5,555"
                            />
                            <Card
                                className="col-span-3 h-auto"  // Reduce height by using h-auto
                                img="https://via.placeholder.com/400x400"
                                title="Nine Mukhi Rudraksha"
                                price="Rs 1,999"
                            />
                        </div>
                    </div>
                </div>
            </div>



            <div className="px-4 sm:px-6 lg:px-16 py-16 w-full max-w-[1280px] mx-auto">
                {/* Header */}

                <div className='flex items-center flex-col gap-5'>
                    <SectionHeader
                        prefix="Our"
                        highlight="Social Media"
                    />
                    <p className='w-11/12 md:w-6/12 text-center text-sm text-slate-600 mb-10'>
                        Connect with us on social media and watch our educational content on astrology and spiritual guidance
                    </p>
                </div>

                <div className='flex flex-row'>
                    <div className='bg-white p-6 rounded-lg border-[#00000026] border-[1px]'>
                        <h2 className='text-lg text-slate-800'>Watch Our Introduction Video</h2>
                        <p className='text-sm text-slate-600 my-4'>
                            Get to know Pandit Prashant and understand how Vedic astrology can guide your life journey.
                        </p>
                        <div>
                           <iframe width="560" height="315" src="https://www.youtube.com/embed/3ystrJLmjtI?si=lzydue0hRljRmqa6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                        <div>
                            <button className='bg-gradient-orange text-white px-4 py-2 rounded-md'>
                                Watch Now
                            </button>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    );
};

export default HomePage;

import React from 'react';
import SectionHeader from '../Titles/SectionHeader';
import aboutImg from '../../assets/user/home/about.png';
import certifiedExpert from '../../assets/user/home/certifiedExpert.png';
import clients from '../../assets/user/home/clients.png';
import multipleLanguage from '../../assets/user/home/multipleLanguage.png';

const HomeAboutUs = () => {
    const data = [
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

    return (
        <div className="bg-slate1 px-4 sm:px-6 lg:px-16 py-10">
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
                        {data.map((item, index) => (
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
    );
};

export default HomeAboutUs;

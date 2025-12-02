import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import AstrologerFilterSidebar from '../../components/Astrologer/AstrologerFilterSidebar';
import CallButton from '../../components/Common/CallButton';
import Tabs from '../../components/Common/Tabs';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import { getAllAstrologerCalls } from '../../api';
import astrologer1 from '../../assets/Astrologer/panditcall1.jpg';
import astrologer2 from '../../assets/Astrologer/panditcall2.jpg';
import astrologer3 from '../../assets/Astrologer/panditcall3.jpg';
import badge1 from '../../assets/Astrologer/Astrologerbadges (1).png';
import badge2 from '../../assets/Astrologer/Astrologerbadges (2).png';
import badge3 from '../../assets/Astrologer/Astrologerbadges (3).png';

const TalkWithAstrologer = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState([]);
    const [price, setPrice] = useState([500, 3000]);
    const [activeTab, setActiveTab] = useState('all');
    const [calls, setCalls] = useState([]);

    // Static data as requested
    const languages = ['Hindi', 'English', 'Telugu', 'Marathi'];
    const categories = ['Amulets', 'Candles', 'Divination', 'Gemstone', 'Uncategorized'];
    const experience = ['Up to 2 years', 'Up to 5 years', 'Above 5 years'];

    // Astrologer data
    const astrologersData = [
        {
            id: 1,
            name: 'Tarott Chandni',
            image: astrologer1,
            status: 'Online',
            skills: 'Vedic Astrology, Vastu Shastra, Tarot Reading, Yoga & Meditation...',
            languages: 'Hindi, Marathi, English, Telugu',
            experience: '10 Years Experience',
            rate: '₹10/Min'
        },
        {
            id: 2,
            name: 'Tarott Chandni',
            image: astrologer2,
            status: 'Busy',
            skills: 'Vedic Astrology, Vastu Shastra, Tarot Reading, Yoga & Meditation...',
            languages: 'Hindi, Marathi, English, Telugu',
            experience: '10 Years Experience',
            rate: '₹10/Min'
        },
        {
            id: 3,
            name: 'Tarott Chandni',
            image: astrologer3,
            status: 'Online',
            skills: 'Vedic Astrology, Vastu Shastra, Tarot Reading, Yoga & Meditation...',
            languages: 'Hindi, Marathi, English, Telugu',
            experience: '10 Years Experience',
            rate: '₹10/Min'
        }
    ];

    const astrologers = Array.from({ length: 12 }, (_, index) => ({
        ...astrologersData[index % 3],
        id: index + 1
    }));

    const statusColors = {
        'Online': 'text-green-500',
        'Busy': 'text-red-500'
    };

    const buttonColors = {
        'Online': 'bg-button-vertical-gradient-orange text-white hover:opacity-90',
        'Busy': 'bg-gradient-to-b from-gray-300 to-gray-500 text-white cursor-not-allowed'
    };

    const toggleLanguage = (language) => {
        setSelectedLanguages(prev =>
            prev.includes(language)
                ? prev.filter(l => l !== language)
                : [...prev, language]
        );
    };

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleExperience = (exp) => {
        setSelectedExperience(prev =>
            prev.includes(exp)
                ? prev.filter(e => e !== exp)
                : [...prev, exp]
        );
    };

    const resetFilters = () => {
        setSearch('');
        setSelectedLanguages([]);
        setSelectedCategories([]);
        setSelectedExperience([]);
        setPrice([500, 3000]);
    };

    const handleAstrologerClick = (astrologerId) => {
        navigate(`/astrologer/${astrologerId}`);
    };

    const fetchAstrologerCalls = async () => {
        try {
            const response = await getAllAstrologerCalls();
            console.log("response in astrologer calls api", response);

        } catch (error) {
        }

    };

    useEffect(() => {
        fetchAstrologerCalls();
    }, [])

    return (
        <div className='bg-slate1'>
            <BackgroundTitle
                title="Talk With Astrologer"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Talk With Astrologer", href: null }
                ]}
                backgroundImage={bannerImage}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />

            {/* Main Content */}
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-12 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                    {/* Filter Sidebar */}
                    <aside className="lg:col-span-3 order-1 lg:order-1">
                        <div className="sticky top-14">
                            <AstrologerFilterSidebar
                                search={search}
                                setSearch={setSearch}
                                languages={languages}
                                selectedLanguages={selectedLanguages}
                                toggleLanguage={toggleLanguage}
                                categories={categories}
                                selectedCategories={selectedCategories}
                                toggleCategory={toggleCategory}
                                experience={experience}
                                selectedExperience={selectedExperience}
                                toggleExperience={toggleExperience}
                                price={price}
                                setPrice={setPrice}
                                minPrice={500}
                                maxPrice={5000}
                                resetFilters={resetFilters}
                                isLoading={false}
                            />
                        </div>
                    </aside>

                    {/* Astrologers Grid */}
                    <div className="lg:col-span-9 order-2 lg:order-2">
                        {/* Top Filter Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-button-vertical-gradient-orange text-white rounded-lg hover:opacity-90 transition-all">
                                    <span className="font-normal mr-4">Add Balance</span> <span className="font-bold">₹50</span>
                                </button>
                                <Tabs
                                    tabs={[
                                        { id: 'all', label: 'All' },
                                        { id: 'online', label: 'Online' }
                                    ]}
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700 font-medium">Sort</span>
                                <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                    <option>Default</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Experience</option>
                                </select>
                            </div>
                        </div>

                        {/* Astrologers Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {astrologers.map((astrologer) => (
                                <div key={astrologer.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                                    {/* Requested Ribbon */}
                                    {astrologer.status === 'Call Requested' && (
                                        <div className="absolute -top-2 -left-8 bg-blue-500 text-white text-xs font-medium px-8 py-1 rotate-[-45deg] transform origin-center">
                                            Requested
                                        </div>
                                    )}
                                    {/* Header with centered profile and status */}
                                    <div className="relative mb-3">
                                        {/* Status - positioned absolute top right */}
                                        <span className={`absolute top-0 right-0 text-sm font-medium ${statusColors[astrologer.status]}`}>
                                            {astrologer.status}
                                        </span>

                                        {/* Profile Image and Name - Centered */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 rounded-full overflow-hidden mb-2">
                                                <img
                                                    src={astrologer.image}
                                                    alt={astrologer.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">{astrologer.name}</h3>
                                        </div>
                                    </div>

                                    {/* Skills with star icon */}
                                    <div className="flex items-start gap-2 mb-2">
                                        <img src={badge1} alt="Skills" className="w-4 h-4 mt-0.5" />
                                        <p className="text-[12px] text-[#62748E] leading-relaxed">
                                            {astrologer.skills}
                                        </p>
                                    </div>

                                    {/* Languages with icon */}
                                    <div className="flex items-start gap-2 mb-2">
                                        <img src={badge2} alt="Languages" className="w-4 h-4 mt-0.5" />
                                        <p className="text-[12px] text-[#62748E]">
                                            {astrologer.languages}
                                        </p>
                                    </div>

                                    {/* Experience with icon */}
                                    <div className="flex items-start gap-2 mb-4">
                                        <img src={badge3} alt="Experience" className="w-4 h-4 mt-0.5" />
                                        <p className="text-[12px] text-[#62748E]">
                                            {astrologer.experience}
                                        </p>
                                    </div>

                                    {/* Call button */}
                                    <CallButton
                                        status={astrologer.status}
                                        rate={astrologer.rate}
                                        onClick={() => handleAstrologerClick(astrologer.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TalkWithAstrologer;
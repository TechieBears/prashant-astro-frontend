import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import AstrologerFilterSidebar from '../../components/Astrologer/AstrologerFilterSidebar';
import CallButton from '../../components/Common/CallButton';
import Tabs from '../../components/Common/Tabs';
import WalletModal from '../../components/Modals/WalletModal';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import { getAllAstrologerCalls, getCallFilters } from '../../api';
import astrologer1 from '../../assets/Astrologer/panditcall1.jpg';
import astrologer2 from '../../assets/Astrologer/panditcall2.jpg';
import astrologer3 from '../../assets/Astrologer/panditcall3.jpg';
import badge1 from '../../assets/Astrologer/Astrologerbadges (1).png';
import badge2 from '../../assets/Astrologer/Astrologerbadges (2).png';
import badge3 from '../../assets/Astrologer/Astrologerbadges (3).png';

const CallAstrologer = () => {
    const navigate = useNavigate();
    const { loggedUserDetails } = useSelector(state => state.user);
    const [search, setSearch] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState([]);
    const [price, setPrice] = useState([500, 3000]);
    const [activeTab, setActiveTab] = useState('all');
    const [astrologers, setAstrologers] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [experience, setExperience] = useState([]);
    const [minPrice, setMinPrice] = useState(500);
    const [maxPrice, setMaxPrice] = useState(5000);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const userBalance = loggedUserDetails?.walletBalance || 50;

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
            setLoading(true);
            const params = {
                page,
                limit,
                languages: selectedLanguages,
                skills: selectedCategories,
                minPrice: price[0],
                maxPrice: price[1],
                experience: selectedExperience,
                search,
                sortBy
            };

            const response = await getAllAstrologerCalls(params);
            if (response?.success && response?.data) {
                const mappedData = response.data.map(astrologer => ({
                    id: astrologer._id,
                    name: astrologer.profile?.fullName || 'N/A',
                    image: astrologer.profileImage,
                    status: 'Online',
                    skills: astrologer.profile?.skills?.join(', ') || 'N/A',
                    languages: astrologer.profile?.languages?.join(', ') || 'N/A',
                    experience: `${astrologer.profile?.experience || 0} Years Experience`,
                    rate: `₹${astrologer.profile?.priceCharge || 0}/Min`
                }));
                setAstrologers(mappedData);
            }
        } catch (error) {
            console.error("Error fetching astrologer calls", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilters = async () => {
        try {
            const response = await getCallFilters();
            if (response?.success && response?.data) {
                setLanguages(response.data.languages || []);
                setCategories(response.data.skills || []);
                setExperience(response.data.experiences || []);
                setMinPrice(response.data.priceRange?.min || 500);
                setMaxPrice(response.data.priceRange?.max || 5000);
                setPrice([response.data.priceRange?.min || 500, response.data.priceRange?.max || 5000]);
            }
        } catch (error) {
            console.error("Error fetching filters", error);
        }
    };

    useEffect(() => {
        fetchFilters();
    }, [])

    useEffect(() => {
        fetchAstrologerCalls();
    }, [page, selectedLanguages, selectedCategories, selectedExperience, price, search, sortBy, activeTab])

    return (
        <div className='bg-slate1'>
            <BackgroundTitle
                title="Call Astrologer"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Call Astrologer", href: null }
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
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                resetFilters={resetFilters}
                                isLoading={false}
                            />
                        </div>
                    </aside>

                    {/* Astrologers Grid */}
                    <div className="lg:col-span-9 order-2 lg:order-2">
                        {/* Top Filter Bar */}
                        <div className="flex flex-col gap-4 mb-6">
                            {/* Search Bar - Mobile only */}
                            <div className="relative w-full lg:hidden">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filter Buttons and Sort - Stack on mobile, row on larger screens */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
                                {/* Left side: Add Balance and Tabs */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => setShowWalletModal(true)}
                                        className="w-full sm:w-auto px-4 py-2 bg-button-vertical-gradient-orange text-white rounded-lg hover:opacity-90 transition-all whitespace-nowrap text-sm sm:text-base"
                                    >
                                        <span className="font-normal mr-2 sm:mr-4">Add Balance</span> <span className="font-bold">₹{userBalance}</span>
                                    </button>
                                    <div className="w-full sm:w-auto">
                                        <Tabs
                                            tabs={[
                                                { id: 'all', label: 'All' },
                                                { id: 'online', label: 'Online' }
                                            ]}
                                            activeTab={activeTab}
                                            onTabChange={setActiveTab}
                                        />
                                    </div>
                                </div>

                                {/* Right side: Sort Dropdown */}
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <span className="text-gray-700 font-medium text-sm sm:text-base whitespace-nowrap">Sort</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="flex-1 sm:flex-none bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="">Default</option>
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                        <option value="price_low_to_high">Price: Low to High</option>
                                        <option value="price_high_to_low">Price: High to Low</option>
                                        <option value="experience_high_to_low">Experience: High to Low</option>
                                        <option value="experience_low_to_high">Experience: Low to High</option>
                                    </select>
                                    {sortBy && (
                                        <button
                                            onClick={() => setSortBy('')}
                                            className="px-3 py-2 bg-button-vertical-gradient-orange text-white text-sm rounded-lg hover:opacity-90 transition-all whitespace-nowrap"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Astrologers Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                            {loading ? (
                                <div className="col-span-full text-center py-10">
                                    <p className="text-gray-500">Loading astrologers...</p>
                                </div>
                            ) : astrologers.length === 0 ? (
                                <div className="col-span-full text-center py-10">
                                    <p className="text-gray-500">No astrologers found</p>
                                </div>
                            ) : astrologers.map((astrologer) => (
                                <div key={astrologer.id} className="bg-white rounded-lg p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
                                    {/* Requested Ribbon */}
                                    {astrologer.status === 'Call Requested' && (
                                        <div className="absolute -top-2 -left-8 bg-blue-500 text-white text-xs font-medium px-8 py-1 rotate-[-45deg] transform origin-center">
                                            Requested
                                        </div>
                                    )}
                                    {/* Header with centered profile and status */}
                                    <div className="relative mb-3 sm:mb-4">
                                        {/* Status - positioned absolute top right */}
                                        <span className={`absolute top-0 right-0 text-xs sm:text-sm font-medium ${statusColors[astrologer.status]}`}>
                                            {astrologer.status}
                                        </span>

                                        {/* Profile Image and Name - Centered */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2">
                                                <img
                                                    src={astrologer.image}
                                                    alt={astrologer.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-center">{astrologer.name}</h3>
                                        </div>
                                    </div>

                                    {/* Skills with star icon */}
                                    <div className="flex items-start gap-2 mb-2">
                                        <img src={badge1} alt="Skills" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs sm:text-[12px] text-[#62748E] leading-relaxed break-words">
                                            {astrologer.skills}
                                        </p>
                                    </div>

                                    {/* Languages with icon */}
                                    <div className="flex items-start gap-2 mb-2">
                                        <img src={badge2} alt="Languages" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs sm:text-[12px] text-[#62748E] break-words">
                                            {astrologer.languages}
                                        </p>
                                    </div>

                                    {/* Experience with icon */}
                                    <div className="flex items-start gap-2 mb-3 sm:mb-4">
                                        <img src={badge3} alt="Experience" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs sm:text-[12px] text-[#62748E]">
                                            {astrologer.experience}
                                        </p>
                                    </div>

                                    {/* Call button */}
                                    <div className="mt-auto">
                                        <CallButton
                                            status={astrologer.status}
                                            rate={astrologer.rate}
                                            onClick={() => handleAstrologerClick(astrologer.id)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Modal */}
            <WalletModal
                isOpen={showWalletModal}
                onClose={() => setShowWalletModal(false)}
            />
        </div>
    );
};

export default CallAstrologer;

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import UserReviews from '../../components/Common/UserReviews';
import CallButton from '../../components/Common/CallButton';
import WalletModal from '../../components/Modals/WalletModal';
import TalkSessionModal from '../../components/Modals/TalkSessionModal';
import { getFilteredReviews } from '../../api';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import astrologer1 from '../../assets/Astrologer/panditcall1.jpg';
import badge1 from '../../assets/Astrologer/Astrologerbadges (1).png';
import badge2 from '../../assets/Astrologer/Astrologerbadges (2).png';
import badge3 from '../../assets/Astrologer/Astrologerbadges (3).png';

const AstrologerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLogged, loggedUserDetails } = useSelector(state => state.user);
    const userId = loggedUserDetails?._id;

    const [phoneNumber, setPhoneNumber] = useState("");
    const [callTime, setCallTime] = useState(10);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [totalReviews, setTotalReviews] = useState(0);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [showLowBalance, setShowLowBalance] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [showTalkSessionModal, setShowTalkSessionModal] = useState(false);
    const [userBalance] = useState(200); // Mock balance - set lower to test modal

    const incrementTime = (amount) => {
        setCallTime((prev) => Math.max(5, prev + amount));
    };

    const decrementTime = () => {
        setCallTime((prev) => Math.max(5, prev - 1));
    };

    const handleCallRequired = () => {
        const requiredAmount = callTime * 10; // Assuming ₹10 per minute
        console.log('Button clicked! Balance:', userBalance, 'Required:', requiredAmount);
        if (userBalance < requiredAmount) {
            console.log('Opening wallet modal...');
            setShowWalletModal(true);
        } else {
            setShowTalkSessionModal(true);
        }
    };

    // Fetch reviews for the astrologer
    const fetchAstrologerReviews = useCallback(async () => {
        if (!id) return;
        try {
            setLoadingReviews(true);
            const response = await getFilteredReviews({
                astrologerId: id
            });
            if (response.success) {
                const activeReviews = response.data?.filter(review => review.isActive) || [];
                setReviews(activeReviews);
                setTotalReviews(activeReviews.length);
            }
        } catch (err) {
            console.error('Error fetching astrologer reviews:', err);
        } finally {
            setLoadingReviews(false);
        }
    }, [id]);

    // Fetch reviews when component mounts
    useEffect(() => {
        fetchAstrologerReviews();
    }, [fetchAstrologerReviews]);

    // Static astrologer data (in real app, fetch by ID)
    const astrologer = {
        id: id,
        name: 'Tarott Chandni',
        image: astrologer1,
        status: 'Online',
        skills: 'Vedic Astrology, Vastu Shastra, Tarot Reading, Yoga & Meditation, Numerology, Palmistry',
        languages: 'Hindi, Marathi, English, Telugu',
        experience: '10 Years Experience',
        rate: '₹10/Min',
        rating: 4.8,
        totalConsultations: 2500,
        description: 'I am a professional astrologer with over 10 years of experience in Vedic astrology, tarot reading, and spiritual guidance. I help people find clarity in their lives through ancient wisdom and modern insights.',
        specializations: [
            'Love & Relationships',
            'Career & Business',
            'Health & Wellness',
            'Marriage & Family',
            'Financial Growth',
            'Spiritual Guidance'
        ],
        availability: {
            today: '10:00 AM - 8:00 PM',
            tomorrow: '9:00 AM - 9:00 PM'
        }
    };

    const statusColors = {
        'Online': 'text-green-500',
        'Busy': 'text-red-500'
    };

    const buttonColors = {
        'Online': 'bg-button-vertical-gradient-orange text-white hover:opacity-90',
        'Busy': 'bg-gradient-to-b from-gray-300 to-gray-500 text-white cursor-not-allowed'
    };

    return (
        <div className='bg-slate1'>
            <BackgroundTitle
                title="Astrologer Details"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Talk With Astrologer", href: "/talk-with-astrologer" },
                    { label: astrologer.name, href: null }
                ]}
                backgroundImage={bannerImage}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />

            <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl py-10 sm:py-12 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Astrologer Info */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Profile Image */}
                                <div className="flex-shrink-0">
                                    <div className="w-[413px] h-[413px] rounded-lg overflow-hidden">
                                        <img
                                            src={astrologer.image}
                                            alt={astrologer.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{astrologer.name}</h1>

                                    {/* Skills with icon */}
                                    <div className="flex items-start gap-2 mb-4">
                                        <img src={badge1} alt="Skills" className="w-4 h-4 mt-0.5" />
                                        <p className="text-[14px] text-[#62748E] leading-relaxed">
                                            {astrologer.skills}
                                        </p>
                                    </div>

                                    {/* Languages with icon */}
                                    <div className="flex items-start gap-2 mb-4">
                                        <img src={badge2} alt="Languages" className="w-4 h-4 mt-0.5" />
                                        <p className="text-[14px] text-[#62748E]">
                                            {astrologer.languages}
                                        </p>
                                    </div>

                                    {/* Experience with icon */}
                                    <div className="flex items-start gap-2 mb-6">
                                        <img src={badge3} alt="Experience" className="w-4 h-4 mt-0.5" />
                                        <p className="text-[14px] text-[#62748E]">
                                            {astrologer.experience}
                                        </p>
                                    </div>

                                    {/* About Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                                        <p className="text-[14px] text-[#62748E] leading-relaxed">
                                            {astrologer.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Right Column - Call Setup Panel */}
                    <div className="lg:col-span-1">
                        <div className="w-full max-w-[305px] mx-auto">
                            <div className="bg-white rounded-[15px] border border-black/15 p-4 pb-[22px] shadow-sm">
                                <div className="flex flex-col gap-[14px]">
                                    {/* Phone Number Section */}
                                    <div className="flex flex-col gap-[4px]">
                                        <label
                                            htmlFor="phone"
                                            className="text-slate-700 font-poppins text-base font-medium"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="Enter phone number"
                                            className="h-10 px-5 rounded-[5px] border border-black/15 bg-white text-sm font-medium text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
                                        />
                                    </div>

                                    {/* Maximum Call Time Section */}
                                    <div className="flex flex-col gap-[4px]">
                                        <label className="text-slate-700 font-poppins text-base font-medium">
                                            Maximum Call Time
                                        </label>
                                        <div className="h-10 px-5 rounded-[5px] border border-black/15 bg-white flex items-center justify-between">
                                            <button
                                                onClick={decrementTime}
                                                className="text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
                                                aria-label="Decrease time"
                                            >
                                                <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
                                            </button>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[#1D293D] font-poppins text-sm font-medium">
                                                    {callTime}
                                                </span>
                                                <span className="text-slate-500 font-poppins text-sm font-medium">
                                                    Min
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => incrementTime(1)}
                                                className="text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
                                                aria-label="Increase time"
                                            >
                                                <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Time Increment Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => incrementTime(5)}
                                            className="flex-1 py-2.5 px-2 rounded-lg border border-black/15 bg-slate-50 text-slate-500 font-poppins text-sm font-medium text-center hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 whitespace-nowrap"
                                        >
                                            +5 Min
                                        </button>
                                        <button
                                            onClick={() => incrementTime(10)}
                                            className="flex-1 py-2.5 px-2 rounded-lg border border-black/15 bg-slate-50 text-slate-500 font-poppins text-sm font-medium text-center hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 whitespace-nowrap"
                                        >
                                            +10 Min
                                        </button>
                                        <button
                                            onClick={() => incrementTime(20)}
                                            className="flex-1 py-2.5 px-2 rounded-lg border border-black/15 bg-slate-50 text-slate-500 font-poppins text-sm font-medium text-center hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 whitespace-nowrap"
                                        >
                                            +20 Min
                                        </button>
                                    </div>

                                    {/* Balance and Price Display */}
                                    <div className="bg-gray-50 rounded-lg">
                                        <div className="text-xs flex justify-between items-center">
                                            <div>
                                                <span className="text-slate-600">Wallet Balance: </span>
                                                <span className={`font-semibold ${userBalance < callTime * 10 ? 'text-red-500' : 'text-green-600'}`}>₹{userBalance}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-600">Call Price: </span>
                                                <span className="font-semibold text-orange-600">₹{callTime * 10}</span>
                                            </div>
                                        </div>
                                        {userBalance < callTime * 10 && (
                                            <p className="text-red-500 text-xs font-medium text-center mt-2">
                                                You don't have enough balance
                                            </p>
                                        )}
                                    </div>

                                    {/* Low Balance Message and Recharge Section */}
                                    {showLowBalance && (
                                        <>
                                            <div className="text-left">
                                                <p className="text-red-500 font-poppins text-xs font-medium mb-1">
                                                    You don't have enough balance
                                                </p>
                                                <p className="text-[#1D293D] font-poppins text-md font-medium">
                                                    Need to add balance ₹{callTime * 10 - userBalance}
                                                </p>
                                            </div>

                                            {/* Amount and Recharge Button */}
                                            <div className="flex items-center gap-3 border border-black-500 rounded-lg p-1">
                                                <div className="flex-1 text-[#1D293D] font-poppins text-2xl font-medium">
                                                    ₹ {callTime * 10 - userBalance}
                                                </div>
                                                <button className="px-4 py-1 rounded-[10px] bg-gradient-to-b from-[#FFBF12] via-[#FF8835] to-[#FF5858] text-white font-poppins text-base font-medium hover:opacity-90 transition-opacity">
                                                    Recharger
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Call Required Button */}
                                    <CallButton
                                        status={userBalance < callTime * 10 ? 'Busy' : 'Online'}
                                        onClick={handleCallRequired}
                                        allowClickWhenBusy={true}
                                        className="py-[9px] font-poppins text-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    >
                                        {userBalance < callTime * 10 ? 'Recharge' : 'Call Required'}
                                    </CallButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Modal */}
            <WalletModal
                isOpen={showWalletModal}
                onClose={() => setShowWalletModal(false)}
                requiredAmount={callTime * 10 - userBalance}
                callTime={callTime}
                astrologerName={astrologer.name}
            />

            {/* Talk Session Modal */}
            <TalkSessionModal
                isOpen={showTalkSessionModal}
                onClose={() => setShowTalkSessionModal(false)}
                callTime={callTime}
                astrologerName={astrologer.name}
            />
        </div>
    );
};

export default AstrologerDetail;
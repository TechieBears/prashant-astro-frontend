import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import UserReviews from '../../components/Common/UserReviews';
import CallSetupPanel from '../../components/Common/CallSetupPanel';
import WalletModal from '../../components/Modals/WalletModal';
import TalkSessionModal from '../../components/Modals/TalkSessionModal';
import { getFilteredReviews, getSingleCallAstrologer, initiateCall, getWalletBalance } from '../../api';
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
    const [callTime, setCallTime] = useState(2);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [totalReviews, setTotalReviews] = useState(0);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [showLowBalance, setShowLowBalance] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [showTalkSessionModal, setShowTalkSessionModal] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [astrologer, setAstrologer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if balance is low whenever callTime or userBalance changes
    useEffect(() => {
        const requiredAmount = callTime * (astrologer?.pricePerMin || 10);
        setShowLowBalance(userBalance < requiredAmount);
    }, [callTime, userBalance, astrologer?.pricePerMin]);

    const handleCallRequired = async () => {
        const pricePerMin = astrologer?.pricePerMin || 10;
        const requiredAmount = callTime * pricePerMin;

        if (!phoneNumber || phoneNumber.trim() === '') {
            toast.error('Please enter a phone number');
            return;
        }

        if (userBalance < requiredAmount) {
            setShowWalletModal(true);
            return;
        }

        try {
            setLoading(true);
            const payload = {
                astrologerId: id,
                agentId: astrologer?.agentId || '9999999999999',
                phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`,
                callDuration: callTime * 60
            };

            const response = await initiateCall(payload);

            if (response?.success) {
                toast.success('Call initiated successfully!');
                // Store the astrologer ID in localStorage to show requested badge
                localStorage.setItem('requestedAstrologerId', id);
                navigate('/call-astrologer');
            } else {
                toast.error(response?.message || 'Failed to initiate call');
            }
        } catch (error) {
            console.error('Error initiating call:', error);
            toast.error('Failed to initiate call');
        } finally {
            setLoading(false);
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

    // Helper function to parse stringified arrays
    const parseArrayField = (field) => {
        if (!field || !Array.isArray(field) || field.length === 0) return 'N/A';
        try {
            const parsed = typeof field[0] === 'string' ? JSON.parse(field[0]) : field;
            return Array.isArray(parsed) ? parsed.join(', ') : 'N/A';
        } catch {
            return Array.isArray(field) ? field.join(', ') : 'N/A';
        }
    };

    // Fetch astrologer data
    const fetchAstrologerData = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const response = await getSingleCallAstrologer(id);
            if (response?.success && response?.data) {
                const data = response.data;
                console.log('API Response - priceCharge:', data.priceCharge);

                setAstrologer({
                    id: data._id,
                    agentId: data.agentId || '9999999999999',
                    name: data.fullName || 'N/A',
                    image: data.profileImage || astrologer1,
                    status: 'Online',
                    skills: parseArrayField(data.skills),
                    languages: parseArrayField(data.languages),
                    experience: `${data.experience || 0} Years Experience`,
                    rate: `₹${data.priceCharge || 0}/Min`,
                    pricePerMin: data.priceCharge || 10,
                    description: data.about || 'No description available',
                });
            }
        } catch (error) {
            console.error("Error fetching astrologer data", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Fetch wallet balance
    const fetchWalletBalance = useCallback(async () => {
        try {
            const res = await getWalletBalance();
            if (res?.success) {
                setUserBalance(res?.data?.balance || 0);
            }
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    }, []);

    // Fetch reviews when component mounts
    useEffect(() => {
        fetchAstrologerData();
        fetchAstrologerReviews();
        fetchWalletBalance();
    }, [fetchAstrologerData, fetchAstrologerReviews, fetchWalletBalance]);

    if (loading) {
        return (
            <div className='bg-slate1 min-h-screen flex items-center justify-center'>
                <p className="text-gray-500">Loading astrologer details...</p>
            </div>
        );
    }

    if (!astrologer) {
        return (
            <div className='bg-slate1 min-h-screen flex items-center justify-center'>
                <p className="text-gray-500">Astrologer not found</p>
            </div>
        );
    }

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
                    { label: "Call Astrologer", href: "/talk-with-astrologer" },
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
                    <CallSetupPanel
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        callTime={callTime}
                        setCallTime={setCallTime}
                        astrologer={astrologer}
                        userBalance={userBalance}
                        onCallRequired={handleCallRequired}
                        onRecharge={() => setShowWalletModal(true)}
                    />
                </div>
            </div>

            {/* Wallet Modal */}
            <WalletModal
                isOpen={showWalletModal}
                onClose={() => setShowWalletModal(false)}
                requiredAmount={callTime * (astrologer?.pricePerMin || 10) - userBalance}
                callTime={callTime}
                astrologerName={astrologer?.name}
            />

            {/* Talk Session Modal */}
            <TalkSessionModal
                isOpen={showTalkSessionModal}
                onClose={() => setShowTalkSessionModal(false)}
                callTime={callTime}
                astrologerName={astrologer?.name}
            />
        </div>
    );
};

export default AstrologerDetail;
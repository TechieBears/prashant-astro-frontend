import { useEffect, useState } from "react";
import { FaWhatsapp, FaLink, FaCopy, FaCheck } from "react-icons/fa";
import { Info } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { getWalletBalance } from "../../../api";


const ReferAndEarn = () => {
    const [copied, setCopied] = useState(false);
    const user = useSelector((state) => state.user.userDetails);
    const referralCode = user?.referralCode || "----- -----";
    const [walletBalance, setWalletBalance] = useState(0);

    useEffect(() => {
        const fetchWalletBalance = async () => {
            const res = await getWalletBalance();
            if (res?.success) {
                setWalletBalance(res?.data?.balance || 0);
            }
        }
        fetchWalletBalance();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const sendWhatsappMessage = () => {
        const message = `🌟 Hey! I found this amazing astrology app that's life-changing!

✨ They offer personalized astrological services, expert consultations, and spiritual guidance.

📱 Join now using my referral code: ${referralCode}

💰 You'll get amazing rewards, and so will I!

🔗 Explore the magic of astrology! ✨`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const shareLink = () => {
        const link = `https://soulplan.net/register?referralCode=${referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white pb-8">
            {/* Header Section */}
            <div className="px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-6">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-tbLex  font-bold text-[#1a1a1a] mb-1">
                        Refer & Earn
                    </h1>
                    <p className="text-gray-500 text-xs sm:text-sm">
                        Share the magic and earn rewards with your friends
                    </p>
                </div>

                {/* Main Reward Card */}
                <div className="relative mb-6 group">
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-lg opacity-20 group-hover:opacity-35 transition-all duration-500"></div>
                    <div className="relative bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 hover:border-slate-200 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                            <div className="w-full sm:w-auto">
                                <p className="text-xs sm:text-sm font-tbPop  font-medium text-gray-500 mb-1">Your Total Rewards</p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-tbLex  font-black text-p bg-clip-text text-transparent">
                                        ₹{walletBalance || 0}
                                    </h2>
                                </div>
                            </div>
                            <div className="w-full sm:w-auto">
                                <div className="bg-gradient-to-r from-[#FBBF24] to-[#FB923C] rounded-full px-4 sm:px-6 py-2 sm:py-3 text-white font-tbLex  font-semibold text-center text-xs sm:text-sm">
                                    {walletBalance ? `${((walletBalance / 10000) * 100).toFixed(2)}% Progress` : "0% Progress"}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#FBBF24] to-[#FB923C] h-full rounded-full transition-all duration-500" style={{ width: "5%" }}></div>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Referral Code Card */}
                    <div className="group bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 hover:border-blue-200 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h3 className="text-base sm:text-lg font-tbPop  font-bold text-[#1a1a1a]">Your Referral Code</h3>
                            <div className="bg-blue-100 p-2.5 sm:p-3 rounded-full group-hover:scale-110 transition-transform">
                                <FaLink className="text-blue-600 text-sm sm:text-base" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3">Share this code with your friends</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 flex items-center justify-center sm:justify-start">
                                <code className="text-base sm:text-lg font-tbPop  font-bold text-blue-600 text-center sm:text-left">{referralCode}</code>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 sm:px-5 py-3 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-tbPop  font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                {copied ? <FaCheck size={16} /> : <FaCopy size={16} />}
                                <span>{copied ? "Copied!" : "Copy"}</span>
                            </button>
                        </div>
                    </div>

                    {/* How It Works Card */}
                    <div className="group bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 hover:border-purple-200 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h3 className="text-base sm:text-lg font-tbPop  font-bold text-[#1a1a1a]">How It Works</h3>
                            <div className="bg-yellow-100 p-2 rounded-full group-hover:scale-110 transition-transform">
                                <span className="text-yellow-500 font-tbPop  font-bold text-sm sm:text-base"><Info size={24} /></span>
                            </div>
                        </div>
                        <ol className="space-y-2 text-xs sm:text-sm text-gray-600">
                            <li className="flex gap-2">
                                <span className="font-tbPop  font-bold text-yellow-600 flex-shrink-0">1.</span>
                                <span>Share your referral code</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-tbPop  font-bold text-yellow-600 flex-shrink-0">2.</span>
                                <span>They sign up & purchase</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-tbPop  font-bold text-yellow-600 flex-shrink-0">3.</span>
                                <span>Get ₹100 rewards</span>
                            </li>
                        </ol>
                    </div>
                </div>


                {/* Invite Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="flex flex-col justify-center">
                            <h3 className="text-xl sm:text-2xl font-tbPop  font-bold text-[#1a1a1a] mb-2 sm:mb-3">Ready to Share?</h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                                Invite your friends through WhatsApp or share your referral code directly. Every successful referral brings rewards to both of you!
                            </p>
                            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-gray-600 mb-4">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500 font-tbPop  font-bold">✓</span> Unlimited referrals
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500 font-tbPop  font-bold">✓</span> Instant rewards
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500 font-tbPop  font-bold">✓</span> No earning limit
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-3 justify-center">
                            <button onClick={sendWhatsappMessage} className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#25D366] to-[#1ebe5b] text-white font-tbPop  font-bold px-5 sm:px-6 py-3 sm:py-4 rounded-xl hover:from-[#20b85a] hover:to-[#18ab50] transition-all duration-300 text-sm sm:text-base active:scale-95">
                                <FaWhatsapp size={18} className="sm:w-6 sm:h-6" />
                                Invite on WhatsApp
                            </button>
                            <button onClick={shareLink} className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-tbPop  font-bold px-5 sm:px-6 py-3 sm:py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm sm:text-base active:scale-95">
                                <FaLink size={18} className="sm:w-5 sm:h-5" />
                                Share Link
                            </button>
                        </div>
                    </div>
                </div>

                {/* Terms Card */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-6 text-xs sm:text-sm text-gray-700">
                    <p className="font-tbPop  font-semibold text-[#1a1a1a] mb-2">Terms & Conditions</p>
                    <ul className="space-y-1 text-xs">
                        <li>• Rewards credited after referral's first purchase</li>
                        <li>• Each referral must be unique</li>
                        <li>• Rewards usable for services & products</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ReferAndEarn;

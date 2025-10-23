import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const ReferAndEarn = () => {
    return (
        <div className="min-h-screen bg-[#fffdfb]">
            {/* Top Section with Title and Amount */}
            <div className="flex justify-start items-start px-4 sm:px-0">
                <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:w-[650px] xl:w-[700px] bg-white rounded-2xl p-4 sm:p-6 mx-auto sm:mx-0">
                    {/* Title */}
                    <h2 className="text-sm sm:text-base font-semibold text-[#1a1a1a] mb-3 sm:mb-4">
                        Refer & Earn
                    </h2>

                    {/* Reward Amount */}
                    <div className="flex items-end mb-6 sm:mb-8">
                        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[120px] leading-none font-extrabold bg-gradient-to-b from-[#FBBF24] via-[#FB923C] to-[#F43F5E] bg-clip-text text-transparent">
                            ₹50
                        </h1>
                        <p className="text-gray-500 text-sm sm:text-base font-medium mt-2 ml-2 sm:ml-3">
                            Total Rewards Points
                        </p>
                    </div>
                </div>
            </div>

            {/* Full Width Referral Info Box */}
            <div className="w-full px-4 sm:px-4 lg:px-4 pb-3 sm:pb-6 md:pb-8">
                <div className="max-w-full mx-auto">
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-5 bg-[#fffdfa]">
                        <p className="text-sm sm:text-md font-semibold text-[#1a1a1a] mb-1">
                            Earn Up to ₹200 in your Rewards Points For Every Referral
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mb-4">
                            Earn up to ₹200 in reward points for each friend you refer who joins
                            and completes their first activity or purchase.
                        </p>

                        {/* WhatsApp Button */}
                        <button className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-md hover:bg-[#1ebe5b] transition-all w-full sm:w-auto">
                            <FaWhatsapp size={16} sm:size={18} />
                            Invite on Whatsapp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferAndEarn;

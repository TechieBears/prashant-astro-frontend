import React from "react";
import { FaCheckCircle, FaClock, FaCalendarAlt, FaDesktop, FaVideo } from "react-icons/fa";

const ServiceSuccessSection = ({
    serviceType,
    sessionDuration,
    date,
    time,
    mode,
    zoomLink,
    orderId,
    onViewDetails
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-xl">
            {/* Header */}
            <div className="flex items-center justify-center space-x-2 mb-6">
                <FaCheckCircle className="text-green-500 text-2xl" />
                <h1 className="text-lg font-semibold text-gray-800">
                    Booking Confirmed
                </h1>
            </div>

            {/* Service Details */}
            <div className="space-y-4 mb-6">
                <div className="rounded-lg p-4 space-y-4">
                    {/* Service Type */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap">
                            Service Type:
                        </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#FBBF24] via-[#FB923C] to-[#F43F5E] text-sm sm:text-base font-semibold break-words">
                            {serviceType}
                        </span>
                    </div>

                    {/* Session Duration */}
                    <div className="flex items-start sm:items-center gap-2">
                        <FaClock className="w-4 h-4 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                            Session Duration: <span className="font-medium text-gray-800">{sessionDuration}</span>
                        </span>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-start sm:items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                            Date: <span className="font-medium text-gray-800">{date} / {time}</span>
                        </span>
                    </div>

                    {/* Mode */}
                    <div className="flex items-start sm:items-center gap-2">
                        <FaDesktop className="w-4 h-4 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                            Mode: <span className="font-medium text-gray-800">{mode}</span>
                        </span>
                    </div>

                    {/* Zoom Link */}
                    <div className="flex items-start sm:items-center gap-2">
                        <FaVideo className="w-4 h-4 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                        <span className="text-sm text-gray-600 break-all">
                            {zoomLink}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={onViewDetails}
                className="w-full bg-button-diagonal-gradient-orange text-white py-3 rounded-[0.2rem] font-medium hover:opacity-90 transition"
            >
                View Order Details
            </button>
        </div>
    );
};

export default ServiceSuccessSection;

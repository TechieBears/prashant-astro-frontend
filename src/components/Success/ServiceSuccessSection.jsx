import React from "react";
import { FaCheckCircle, FaClock, FaCalendarAlt, FaDesktop, FaVideo, FaPlus } from "react-icons/fa";

const ServiceSuccessSection = ({
    services, // Array of services
    orderId,
    totalAmount,
    onViewDetails
}) => {
    // Handle backward compatibility - if single service props are passed
    const serviceList = services || [{
        serviceType: arguments[0]?.serviceType || "Service",
        sessionDuration: arguments[0]?.sessionDuration || "30-60 minutes",
        date: arguments[0]?.date || "Date will be confirmed",
        time: arguments[0]?.time || "Time will be confirmed",
        mode: arguments[0]?.mode || "Online",
        zoomLink: arguments[0]?.zoomLink || "Link will be provided"
    }];

    const primaryService = serviceList[0];
    const additionalServicesCount = serviceList.length - 1;
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
                <FaCheckCircle className="text-green-500 text-xl sm:text-2xl" />
                <h1 className="text-base sm:text-lg font-semibold text-gray-800">
                    Booking Confirmed
                </h1>
            </div>

            {/* Service Details */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Service Type with Multiple Services Indicator */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                            Service Type:
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#FBBF24] via-[#FB923C] to-[#F43F5E] text-xs sm:text-sm font-semibold break-words">
                                {primaryService.serviceType}
                            </span>
                            {additionalServicesCount > 0 && (
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                    <FaPlus className="w-2 h-2" />
                                    +{additionalServicesCount} more
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Session Duration */}
                    <div className="flex items-start gap-2">
                        <FaClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
                            Session Duration: <span className="font-medium text-gray-800">{primaryService.sessionDuration}</span>
                        </span>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-start gap-2">
                        <FaCalendarAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
                            Date: <span className="font-medium text-gray-800">{primaryService.date} / {primaryService.time}</span>
                        </span>
                    </div>

                    {/* Mode */}
                    <div className="flex items-start gap-2">
                        <FaDesktop className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
                            Mode: <span className="font-medium text-gray-800">{primaryService.mode}</span>
                        </span>
                    </div>

                    {/* Zoom Link */}
                    <div className="flex items-start gap-2">
                        <FaVideo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600 break-all">
                            {primaryService.zoomLink}
                        </span>
                    </div>

                    {/* Order Summary */}
                    {orderId && (
                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-gray-600">Order ID:</span>
                                <span className="text-xs sm:text-sm font-medium text-gray-800">{orderId}</span>
                            </div>
                            {totalAmount && (
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs sm:text-sm text-gray-600">Total Amount:</span>
                                    <span className="text-xs sm:text-sm font-semibold text-gray-800">₹{totalAmount}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={onViewDetails}
                className="w-full bg-button-diagonal-gradient-orange text-white py-2.5 sm:py-3 rounded-[0.2rem] font-medium hover:opacity-90 transition text-sm sm:text-base"
            >
                View Order Details
            </button>
        </div>
    );
};

export default ServiceSuccessSection;

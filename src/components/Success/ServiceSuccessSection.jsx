import React from "react";
import { FaCheckCircle, FaClock, FaCalendarAlt, FaDesktop } from "react-icons/fa";
import OrderIdCopy from '../Common/OrderIdCopy';
import '../../css/ServiceSuccess.css';

const ServiceSuccessSection = ({
    services,
    orderId,
    totalAmount,
    onViewDetails
}) => {

    const serviceList = services || [{
        serviceType: arguments[0]?.serviceType || "Service",
        sessionDuration: arguments[0]?.sessionDuration || "30 minutes",
        date: arguments[0]?.date || "2025-10-11",
        time: arguments[0]?.time || "11:00 - 11:30",
        mode: arguments[0]?.mode || "online",
        zoomLink: arguments[0]?.zoomLink || "Link will be provided"
    }];

    const primaryService = serviceList[0];

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center justify-left space-x-2 mb-3 sm:mb-4">
                <FaCheckCircle className="text-green-500 text-xl sm:text-2xl" />
                <h1 className="text-base sm:text-lg font-semibold text-gray-800">
                    Booking Confirmed
                </h1>
            </div>

            {/* Confirmation Message */}
            <p className="text-xs sm:text-sm text-gray-500 text-left mb-3 sm:mb-4">
                Thank you for your order! Your total amount has been successfully processed.
            </p>

            {/* Order ID */}
            {orderId && (
                <div className="mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm text-gray-600">Order ID:</span>
                        <OrderIdCopy
                            orderId={orderId}
                            displayLength={8}
                            showHash={false}
                            textClassName="text-xs sm:text-sm text-gray-800"
                        />
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 mb-3 sm:mb-4"></div>

            {/* Service Type Section */}
            <div className="bg-[#F8F8FF] rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 sm:h-64 overflow-y-auto sleek-scrollbar">
                <div className="space-y-6 sm:space-y-8">
                    {serviceList.map((service, index) => (
                        <div key={index} className="space-y-2 sm:space-y-3 rounded-lg">
                            {/* Service Type Header */}
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                                Service Type: <span className="font-medium text-gray-800">{service.serviceType}</span>
                            </h3>

                            {/* Grid Layout for Service Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm pb-3 sm:pb-4 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <FaClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600">
                                        Duration: <span className="font-medium text-gray-800">{service.sessionDuration}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600">
                                        Date: <span className="font-medium text-gray-800">{service.date}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaDesktop className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600">
                                        Mode: <span className="font-medium text-gray-800">{service.mode}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600">
                                        Time: <span className="font-medium text-gray-800">{service.time}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Price and Tags */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                <span className="text-sm sm:text-base font-semibold text-green-600">
                                    Price: ₹{totalAmount || 800}
                                </span>
                                <div className="flex gap-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        online
                                    </span>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                        Pending
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    onClick={() => window.location.href = '/'}
                    className="w-full py-2.5 md:py-3 px-4 md:px-6 rounded-sm font-medium transition-opacity shadow-md text-sm md:text-base bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                    Back To Home
                </button>
                <button
                    onClick={onViewDetails}
                    className="w-full py-2.5 md:py-3 px-4 md:px-6 rounded-sm font-medium transition-opacity shadow-md text-sm md:text-base bg-button-diagonal-gradient-orange text-white hover:opacity-90"
                >
                    View My Orders
                </button>
            </div>
        </div>
    );
};

export default ServiceSuccessSection;

import React from 'react';
import { FaRegTrashAlt, FaClock, FaCalendarAlt, FaLink } from 'react-icons/fa';
import PaymentSummary from './PaymentSummary';

const ServicesSection = ({
    services,
    onRemoveService,
    onCheckout,
    subtotal,
    gstAmount,
    total,
    isRemoving = null
}) => {
    return (
        <div className="bg-[#FFF9F2] min-h-screen py-4 sm:py-6 md:py-8">
            <div className="container mx-auto max-w-7xl px-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-5 md:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
                            {/* Services List - Takes 7/12 on large screens */}
                            <div className="lg:col-span-7">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-5 md:mb-6">Your Services</h2>
                                <div className="space-y-3 sm:space-y-4">
                                    {services.map((service) => (
                                        <div key={service.id} className="bg-light-pg border border-gray-100 rounded-lg p-3 sm:p-4">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                                        <span className="text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap">
                                                            Service Type:
                                                        </span>
                                                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#FBBF24] via-[#FB923C] to-[#F43F5E] text-sm sm:text-base font-semibold break-words">
                                                            {service.type}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                                                        <div className="flex items-start sm:items-center gap-2">
                                                            <FaClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                                                            <span className="break-words">Session: {service.duration}</span>
                                                        </div>
                                                        <div className="flex items-start sm:items-center gap-2">
                                                            <FaCalendarAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                                                            <span className="break-words">{service.date}</span>
                                                        </div>
                                                        <div className="flex items-start sm:items-center gap-2">
                                                            <FaLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                                                            <span className="break-words">{service.mode}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    className={`text-red-500 hover:text-red-600 transition-colors self-end sm:self-start mt-1 sm:mt-0 ${isRemoving === service.id ? 'opacity-50 cursor-not-allowed' : ''
                                                        }`}
                                                    onClick={() => onRemoveService(service.id)}
                                                    disabled={isRemoving === service.id}
                                                    aria-label="Remove service"
                                                >
                                                    {isRemoving === service.id ? (
                                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <FaRegTrashAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Summary - Takes 5/12 on large screens */}
                            <div className="lg:col-span-5">
                                <PaymentSummary
                                    itemCount={services.length}
                                    subtotal={subtotal}
                                    gstAmount={gstAmount}
                                    total={total}
                                    onCheckout={onCheckout}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesSection;

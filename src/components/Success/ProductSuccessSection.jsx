import React from "react";
import { FaCheckCircle, FaShoppingBag, FaRupeeSign, FaTag } from "react-icons/fa";
import ProductImage from "../Common/ProductImage";
import OrderIdCopy from '../Common/OrderIdCopy';
import '../../css/ServiceSuccess.css';

const ProductSuccessSection = ({ orderItems, subtotal, totalDiscount, total, orderId, onViewDetails }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center justify-left space-x-2 mb-3 sm:mb-4">
                <FaCheckCircle className="text-green-500 text-xl sm:text-2xl" />
                <h1 className="text-base sm:text-lg font-semibold text-gray-800">
                    Order Confirmed
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

            {/* Product Items Section */}
            <div className="bg-[#F8F8FF] rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 sm:h-64 overflow-y-auto sleek-scrollbar">
                <div className="space-y-6 sm:space-y-8">
                    {orderItems.map((item, index) => (
                        <div key={index} className="space-y-2 sm:space-y-3 rounded-lg">
                            {/* Product Type Header */}
                            <div className="rounded-lg p-2 mb-2">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center">
                                    <span className="font-medium text-gray-800">{item.title}</span>
                                </h3>
                            </div>

                            {/* Product Image and Details Layout */}
                            <div className="flex flex-col sm:flex-row sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
                                {/* Image */}
                                <div className="flex justify-center sm:justify-start mb-3 sm:mb-0">
                                    <ProductImage
                                        images={item.image}
                                        name={item.title}
                                        containerClassName="w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center"
                                        imgClassName="w-full h-full object-cover"
                                        fallbackClassName="w-full h-full flex items-center justify-center"
                                        fallbackContent={<span className="text-gray-400 text-xs">No Image</span>}
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex flex-col justify-center space-y-2 sm:space-y-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <FaRupeeSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span className="text-sm text-gray-600">
                                            Price: <span className="font-medium text-gray-800">₹{item.price.toLocaleString()}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaTag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span className="text-sm text-gray-600">
                                            MRP: <span className="font-medium text-gray-800 line-through">₹{item.oldPrice.toLocaleString()}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaShoppingBag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span className="text-sm text-gray-600">
                                            Qty: <span className="font-medium text-gray-800">{item.quantity}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Price and Tags */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                <span className="text-sm sm:text-base font-semibold text-green-600">
                                    Total: ₹{(item.price * item.quantity).toLocaleString()}
                                </span>
                                <div className="flex gap-2">
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

export default ProductSuccessSection;

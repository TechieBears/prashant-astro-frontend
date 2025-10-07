import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import ProductImage from "../Common/ProductImage";

const ProductSuccessSection = ({ orderItems, subtotal, totalDiscount, total, onViewDetails }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
                <FaCheckCircle className="text-green-500 text-xl sm:text-2xl" />
                <h1 className="text-base sm:text-lg font-semibold text-gray-800">
                    Order Confirmed
                </h1>
            </div>

            {/* Order Items */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center bg-light-pg rounded-lg p-3 sm:p-4">
                        <ProductImage
                            images={item.image}
                            name={item.title}
                            containerClassName="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center"
                            imgClassName="w-full h-full object-cover"
                            fallbackClassName="w-full h-full flex items-center justify-center"
                            fallbackContent={<span className="text-gray-400 text-xs">No Image</span>}
                        />
                        <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                            <h2 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                                {item.title}
                            </h2>
                            <p className="bg-gradient-orange bg-clip-text text-transparent text-red-500 font-bold text-xs sm:text-sm">₹{item.price.toLocaleString()}</p>
                            <p className="text-xs text-black">
                                MRP <span className="line-through">₹{item.oldPrice.toLocaleString()}</span> (incl. of all taxes)
                            </p>
                        </div>
                        <span className="text-xs sm:text-sm text-black flex-shrink-0">QTY: {item.quantity}</span>
                    </div>
                ))}
            </div>

            {/* Button */}
            <button
                onClick={onViewDetails}
                className="w-full bg-button-diagonal-gradient-orange text-white py-2.5 sm:py-3 rounded-[0.2rem] font-medium hover:opacity-90 transition text-sm sm:text-base"
            >
                View Order Details
            </button>
        </div>
    );
};

export default ProductSuccessSection;

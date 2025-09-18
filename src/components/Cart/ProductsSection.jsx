import React from 'react';
import { FaRegTrashAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PaymentSummary from './PaymentSummary';

const ProductsSection = ({
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
    subtotal = 0,
    gstAmount = 0,
    total = 0,
    isUpdating = false,
    isRemoving = null
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg">
            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-button-gradient-orange text-white rounded-md hover:opacity-90 transition-opacity"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-7 space-y-3 md:space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-light-pg rounded-lg p-3 md:p-4 flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 relative">
                                {/* Product Image */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <span className="text-gray-400">No Image</span>
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1 sm:pr-6">
                                        {item.name}
                                    </h3>
                                    <div className="space-y-1">
                                        <div className="font-bold text-base md:text-lg bg-gradient-orange bg-clip-text text-transparent">
                                            ₹{item.totalPrice?.toLocaleString()}
                                        </div>
                                        <div className="text-black text-xs md:text-sm">
                                            <span>Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Controls */}
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start space-x-4 sm:space-x-0 sm:space-y-2">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs md:text-sm text-gray-600 font-medium">QTY:</span>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min={1}
                                            disabled={isUpdating}
                                            onChange={(e) => onUpdateQuantity(item._id, Number(e.target.value))}
                                            onBlur={(e) => {
                                                const value = Number(e.target.value);
                                                if (!value || value < 1) {
                                                    onUpdateQuantity(item._id, 1);
                                                }
                                            }}
                                            className={`w-12 md:w-16 border border-gray-300 rounded-md px-1 md:px-2 py-1 text-center text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm md:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:appearance-auto ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        />
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => onRemoveItem(item._id)}
                                        disabled={isRemoving === item._id}
                                        className={`p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors ${isRemoving === item._id ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {isRemoving === item._id ? (
                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <FaRegTrashAlt className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Summary */}
                    <div className="lg:col-span-5">
                        <PaymentSummary
                            itemCount={cartItems.reduce((total, item) => total + (item.quantity || 0), 0)}
                            subtotal={subtotal}
                            gstAmount={gstAmount}
                            total={total}
                            onCheckout={onCheckout}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsSection;

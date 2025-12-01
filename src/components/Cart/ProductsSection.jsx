import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PaymentSummary from './PaymentSummary';
import QuantityCounter from '../Common/QuantityCounter';
import ProductImage from '../Common/ProductImage';

const ProductsSection = ({
    cartItems,
    localQuantities = {},
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
    subtotal = 0,
    total = 0,
    isUpdating = false,
    isRemoving = null,
    isCreatingOrder = false,
    activeTab,
    appliedCoupon,
    onApplyCoupon
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
                                <ProductImage images={item.images} name={item.name} />

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
                                            <span>Qty: {localQuantities[item._id] || item.quantity}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Controls */}
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start space-x-4 sm:space-x-0 sm:space-y-2">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs md:text-sm text-gray-600 font-medium">QTY:</span>
                                        <QuantityCounter
                                            value={localQuantities[item._id] || item.quantity}
                                            onChange={(newQuantity) => onUpdateQuantity(item._id, newQuantity)}
                                            min={1}
                                            max={999}
                                            size="default"
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
                            total={total}
                            buttonText="Proceed to Checkout"
                            onCheckout={onCheckout}
                            isCreatingOrder={isCreatingOrder}
                            activeTab={activeTab}
                            appliedCoupon={appliedCoupon}
                            onApplyCoupon={onApplyCoupon}
                            cartItems={cartItems}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsSection;
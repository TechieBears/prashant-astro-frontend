import React from 'react';
import PaymentSummary from './PaymentSummary';

const BuyNowSection = ({
    product,
    quantity,
    onCheckout,
    isCreatingOrder = false
}) => {
    if (!product) {
        return (
            <div className="bg-white p-4 md:p-6 rounded-lg">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Product Selected</h3>
                    <p className="text-gray-500">Please select a product to buy now.</p>
                </div>
            </div>
        );
    }

    // Calculate totals
    const subtotal = (product.sellingPrice || 0) * quantity;
    const gstAmount = subtotal * 0.18;
    const total = subtotal + gstAmount;


    return (
        <div className="bg-white p-4 md:p-6 rounded-lg">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Product Section */}
                <div className="lg:col-span-7">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>

                    <div className="space-y-4">
                        <div className="flex items-center bg-light-pg rounded-lg p-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                                    alt={product.name}
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                    }}
                                />
                            </div>

                            {/* Product Details */}
                            <div className="ml-4 flex-1">
                                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                                    {product.name}
                                </h3>

                                {product.category && (
                                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                                        {product.category.name}
                                        {product.subcategory && ` > ${product.subcategory.name}`}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="font-bold text-base md:text-lg bg-gradient-orange bg-clip-text text-transparent">
                                            ₹{subtotal.toLocaleString()}
                                        </div>
                                        <div className="text-black text-xs md:text-sm">
                                            <span>Qty: {quantity}</span>
                                        </div>
                                    </div>

                                    {/* Price Details */}
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">
                                            ₹{product.sellingPrice?.toLocaleString()} × {quantity}
                                        </div>
                                        {product.mrpPrice > product.sellingPrice && (
                                            <div className="text-xs text-gray-500 line-through">
                                                MRP: ₹{product.mrpPrice?.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="lg:col-span-5">
                    <PaymentSummary
                        itemCount={quantity}
                        subtotal={subtotal}
                        gstAmount={gstAmount}
                        total={total}
                        buttonText="Continue to Pay"
                        onCheckout={onCheckout}
                        isCreatingOrder={isCreatingOrder}
                    />
                </div>
            </div>
        </div>
    );
};

export default BuyNowSection;

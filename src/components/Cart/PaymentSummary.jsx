import React from 'react';

const PaymentSummary = ({ 
    itemCount, 
    subtotal, 
    gstAmount, 
    total,
    buttonText = 'Continue to pay',
    onCheckout = () => {}
}) => {
    return (
        <div className="lg:col-span-5">
            <div className="rounded-lg lg:sticky lg:top-8">
                <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2">
                    Amount Payable
                </h3>

                <div className="space-y-3 mb-4 md:mb-6 bg-light-pg p-3 md:p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm md:text-base">
                            Product {itemCount}x (inclu. GST)
                        </span>
                        <span className="font-medium text-sm md:text-base">
                            ₹ {subtotal.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm md:text-base">
                            GST (18%)
                        </span>
                        <span className="font-medium text-sm md:text-base">
                            ₹ {gstAmount.toFixed(2)}
                        </span>
                    </div>

                    <div className="border-t border-separator my-2"></div>

                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-base md:text-lg">
                            Total
                        </span>
                        <span className="font-bold text-gray-900 text-base md:text-lg">
                            ₹ {total.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Continue to Pay Button */}
                <button 
                    onClick={onCheckout}
                    className="w-full bg-button-diagonal-gradient-orange text-white py-2.5 md:py-3 px-4 md:px-6 rounded-sm font-medium hover:opacity-90 transition-opacity shadow-md text-sm md:text-base"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default PaymentSummary;

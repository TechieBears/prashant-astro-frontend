import React from 'react';
import AddressSelector from '../Address/AddressSelector';
import { useAddress } from '../../context/AddressContext';

const PaymentSummary = ({
    itemCount,
    subtotal,
    gstAmount,
    total,
    buttonText = 'Continue to pay',
    onCheckout = () => { },
    isCreatingOrder = false
}) => {
    const { defaultAddress } = useAddress();

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

                {/* Address Selection */}
                <div className="mb-4">
                    <h4 className="font-medium text-gray-900 text-sm md:text-base mb-2">Delivery Address</h4>
                    <AddressSelector />
                </div>

                {/* Continue to Pay Button */}
                <button
                    onClick={onCheckout}
                    disabled={isCreatingOrder || !defaultAddress}
                    className={`w-full py-2.5 md:py-3 px-4 md:px-6 rounded-sm font-medium transition-opacity shadow-md text-sm md:text-base ${isCreatingOrder || !defaultAddress
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-button-diagonal-gradient-orange text-white hover:opacity-90'
                        }`}
                >
                    {isCreatingOrder ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Order...</span>
                        </div>
                    ) : (
                        buttonText
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaymentSummary;

import React, { useState, useEffect } from 'react';
import AddressSelector from '../Address/AddressSelector';
import { useAddress } from '../../context/AddressContext';
import UserCouponModal from '../Modals/CouponModal/UserCouponModal';
import { getUserCoupons } from '../../api';
const PaymentSummary = ({
    itemCount = 0,
    subtotal = 0,
    gstAmount = 0,
    total = 0,
    buttonText = 'Continue to pay',
    onCheckout = () => { },
    isCreatingOrder = false,
    activeTab,
    serviceIds = []
}) => {
    const { defaultAddress } = useAddress();

    const [showCouponModal, setShowCouponModal] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        const fetchCoupons = async () => {
            const data = await getUserCoupons(activeTab);
            if (data?.success) {
                setCoupons(data?.data);
                console.log('Fetched Coupons:', data);
            } else {
                console.log('Fetched Coupons false:', data);
            }
        };
        fetchCoupons();
    }, [activeTab]);

    console.log('subtotal:', subtotal);

    // Calculate discount
    let discountAmount = 0;

    if (appliedCoupon) {
        if (appliedCoupon.discountIn === 'percent') {
            discountAmount = (subtotal * appliedCoupon.discount) / 100;
        } else {
            discountAmount = appliedCoupon.discount;
        }
    }

    const finalTotal = Math.max(total - discountAmount, 0).toFixed(2);

    return (
        <div className="lg:col-span-5">
            <div className="rounded-lg lg:sticky lg:top-8">
                {/* Coupon Section */}
                <div className="space-y-3 mb-4 md:mb-6 bg-light-pg p-3 md:p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-900 text-sm md:text-base">Apply Coupon</h4>
                        <button
                            onClick={() => setShowCouponModal(true)}
                            className="text-primary text-sm hover:underline"
                        >
                            {appliedCoupon ? 'Change Coupon' : 'Select Coupon'}
                        </button>
                    </div>
                    {appliedCoupon && (
                        <div className="text-sm text-green-700">
                            Applied: <strong>{appliedCoupon.couponName}</strong> - {appliedCoupon.couponCode}
                            <button
                                onClick={() => setAppliedCoupon(null)}
                                className="ml-2 text-red-500 underline text-xs"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2">
                    Amount Payable
                </h3>

                <div className="space-y-3 mb-4 md:mb-6 bg-light-pg p-3 md:p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm md:text-base">
                            Product {itemCount}x (inclu. GST)
                        </span>
                        <span className="font-medium text-sm md:text-base">
                            ₹ {(subtotal || 0).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm md:text-base">GST (18%)</span>
                        <span className="font-medium text-sm md:text-base">
                            ₹ {(gstAmount || 0).toFixed(2)}
                        </span>
                    </div>

                    {appliedCoupon && (
                        <div className="flex justify-between items-center text-green-700">
                            <span className="text-sm md:text-base">Discount</span>
                            <span className="text-sm md:text-base">
                                - ₹ {discountAmount.toFixed(2)}
                            </span>
                        </div>
                    )}

                    <div className="border-t border-separator my-2"></div>

                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-base md:text-lg">Total</span>
                        <span className="font-bold text-gray-900 text-base md:text-lg">
                            ₹ {finalTotal}
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

            {/* Coupon Modal */}
            {showCouponModal && (
                <UserCouponModal
                    onClose={() => setShowCouponModal(false)}
                    onApply={setAppliedCoupon}
                    coupons={coupons}
                    amount={subtotal}
                    serviceIds={serviceIds}
                />
            )}
        </div>
    );
};

export default PaymentSummary;

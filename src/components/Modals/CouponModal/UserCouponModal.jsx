import React, { useState } from 'react';
import { X } from 'lucide-react';

const CouponModal = ({ onClose, onApply, coupons = [], amount }) => {
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [couponCode, setCouponCode] = useState('');

    const handleApply = () => {
        if (selectedCoupon) {
            onApply(selectedCoupon);
            onClose();
        }
    };
    const calculateMaxSavings = () => {
        if (!selectedCoupon) return 0;

        if (selectedCoupon.discountIn === 'percent') {
            return Math.floor((amount * selectedCoupon.discount) / 100);
        }

        return selectedCoupon.discount || 0;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-semibold">Available Coupons</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Coupon Code Input */}
                <div className="p-4 border-b">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button className="px-4 py-2 text-black font-medium hover:text-primary">
                            Check
                        </button>
                    </div>
                </div>

                {/* Coupons List */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-3">
                        {coupons.length === 0 ? (
                            <div className="text-center text-gray-500 text-sm py-8">
                                No coupons available
                            </div>
                        ) : (
                            coupons.map((coupon) => {
                                const discountAmount =
                                    coupon.discountIn === 'percent'
                                        ? Math.floor((amount * coupon.discount) / 100)
                                        : coupon.discount;

                                return (
                                    <div
                                        key={coupon._id}
                                        className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary transition"
                                        onClick={() => setSelectedCoupon(coupon)}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Custom Checkbox */}
                                            <div className="mt-1">
                                                <div
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedCoupon?._id === coupon._id
                                                            ? 'bg-blue-600 border-blue-600'
                                                            : 'border-gray-300'
                                                        }`}
                                                >
                                                    {selectedCoupon?._id === coupon._id && (
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path
                                                                d="M2 6L5 9L10 3"
                                                                stroke="white"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Coupon Details */}
                                            <div className="flex-1">
                                                <div className="inline-block px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono mb-2">
                                                    {coupon.couponCode}
                                                </div>
                                                <p className="text-green-600 font-semibold mb-1">
                                                    Save ₹{discountAmount}
                                                </p>
                                                <p className="text-sm text-gray-600 mb-1">
                                                    {coupon.description ||
                                                        (coupon.discountIn === 'percent'
                                                            ? `${coupon.discount}% Off (₹${discountAmount})`
                                                            : `Flat ₹${coupon.discount} Off`)}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Expires on:{' '}
                                                    {new Date(coupon?.expiryDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Maximum Savings:</span>
                        <span className="text-lg font-bold">₹{calculateMaxSavings()}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!selectedCoupon}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${selectedCoupon
                                ? 'bg-primary text-white hover:bg-gray-800'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponModal;

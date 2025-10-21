import React, { useState } from 'react';
import { X } from 'lucide-react';
import { applyCoupon } from '../../../api';
import toast from 'react-hot-toast';

const CouponModal = ({ onClose, onApply, coupons = [], amount, serviceIds = [] }) => {
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = async () => {
        if (!selectedCoupon) return;
        
        try {
            setIsApplying(true);
            const response = await applyCoupon(selectedCoupon.couponCode, serviceIds);
            
            if (response.success) {
                onApply({
                    ...selectedCoupon,
                    ...response.data // Include any additional data from the API response
                });
                onClose();
            } else {
                toast.error(response.message || 'Failed to apply coupon', { position: 'top-right' });
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            toast.error(error.response?.data?.message || 'An error occurred while applying the coupon', { position: 'top-right' });
        } finally {
            setIsApplying(false);
        }
    };

    const handleCheckCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code', { position: 'top-right' });
            return;
        }

        try {
            setIsApplying(true);
            const response = await applyCoupon(couponCode, serviceIds);
            
            if (response.success) {
                const couponDetails = response.data;
                setSelectedCoupon({
                    ...couponDetails,
                    couponCode: couponCode
                });
            } else {
                toast.error(response.message || 'Invalid coupon code', { position: 'top-right' });
            }
        } catch (error) {
            console.error('Error checking coupon:', error);
            toast.error(error.response?.data?.message || 'An error occurred while checking the coupon', { position: 'top-right' });
        } finally {
            setIsApplying(false);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1020] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col overflow-hidden">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-[#FB923C] via-[#FB923C] to-[#F43F5E] p-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="text-white hover:text-orange-100 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-sm font-semibold text-white">Available Coupons</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-orange-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Coupon Code Input */}
                <div className="p-2.5 bg-base-bg border-b border-orange-light">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white text-xs"
                        />
                        <button 
                            onClick={handleCheckCoupon}
                            disabled={isApplying || !couponCode.trim()}
                            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors text-xs ${isApplying || !couponCode.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'}`}
                        >
                            {isApplying ? 'Checking...' : 'Check'}
                        </button>
                    </div>
                </div>

                {/* Coupons List */}
                <div className="flex-1 overflow-y-auto p-3 bg-slate1">
                    <div className="space-y-2.5">
                        {coupons.length === 0 ? (
                            <div className="text-center text-base-font py-8">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-light flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                                        <rect x="3" y="7" width="18" height="12" rx="2" />
                                        <path d="M3 11h18M7 15h.01M11 15h2" />
                                    </svg>
                                </div>
                                <p className="font-medium text-xs">No coupons available</p>
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
                                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 bg-white ${selectedCoupon?._id === coupon._id
                                            ? 'border-primary shadow-lg scale-[1.02]'
                                            : 'border-primary-light hover:border-primary hover:shadow-md'
                                            }`}
                                        onClick={() => setSelectedCoupon(coupon)}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Custom Checkbox */}
                                            <div className="mt-1">
                                                <div
                                                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedCoupon?._id === coupon._id
                                                        ? 'bg-primary border-primary'
                                                        : 'border-orange-light'
                                                        }`}
                                                >
                                                    {selectedCoupon?._id === coupon._id && (
                                                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
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
                                                <div className="inline-block px-3 py-1.5 bg-primary-light border-2 border-primary rounded-lg text-sm font-semibold text-primary mb-2">
                                                    {coupon.couponCode}
                                                </div>
                                                <p className="text-green-700 font-bold text-md mb-1">
                                                    Save ₹{discountAmount}
                                                </p>
                                                <p className="text-sm text-base-font mb-2">
                                                    {coupon.description ||
                                                        (coupon.discountIn === 'percent'
                                                            ? `${coupon.discount}% Off (₹${discountAmount})`
                                                            : `Flat ₹${coupon.discount} Off`)}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-base-font">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                        <line x1="16" y1="2" x2="16" y2="6" />
                                                        <line x1="8" y1="2" x2="8" y2="6" />
                                                        <line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                    <span>
                                                        Expires on:{' '}
                                                        {new Date(coupon?.expiryDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-primary-light p-2.5 bg-white">
                    <div className="flex items-center justify-between mb-2.5 p-2 bg-base-bg rounded-lg">
                        <span className="text-xs font-medium text-base-font">Maximum Savings:</span>
                        <span className="text-sm font-bold text-primary">₹{calculateMaxSavings()}</span>
                    </div>
                    <div className="flex gap-2.5">
                        <button
                            onClick={onClose}
                            className="flex-1 px-3 py-2 border-2 border-primary-light rounded-lg font-semibold text-base-font hover:bg-primary-light transition-colors text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!selectedCoupon || isApplying}
                            className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm ${!selectedCoupon || isApplying ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'}`}
                        >
                            {isApplying ? 'Applying...' : 'Apply Coupon'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponModal;
import React, { useEffect, useState, useCallback } from 'react';
import { FaTimes, FaStar, FaShare, FaDownload } from 'react-icons/fa';
import ReviewForm from '../Common/ReviewForm';
import { getSingleProductOrder } from '../../api';
import Preloaders from '../Loader/Preloaders';
// Import assets
import deliveredIcon from '../../assets/user/orders/delivered.svg';
import downloadIcon from '../../assets/user/orders/download.svg';
import shareIcon from '../../assets/user/orders/share.svg';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageErrorHandled, setImageErrorHandled] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const fetchOrderDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setImageLoading(true);
            setImageErrorHandled(false);
            const response = await getSingleProductOrder(product.orderId);
            if (response.success) {
                setOrderData(response.data);
            } else {
                setError(response.message || 'Failed to fetch order details');
            }
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    }, [product?.orderId]);

    useEffect(() => {
        if (isOpen && product?.orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, product?.orderId, fetchOrderDetails]);

    const handleReviewSuccess = () => {
        setShowReviewForm(false);
    };

    if (!isOpen) return null;

    // Get product data from order
    const productData = orderData?.items?.[0]?.product;
    const thumbnails = productData?.images || [];

    // Get status info for the badge
    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
            case 'completed':
                return {
                    text: 'Delivered',
                    shortText: 'Delivered',
                    textColor: 'text-green-800',
                    bgColor: '#00A63E1A',
                    icon: deliveredIcon
                };
            case 'pending':
                return {
                    text: 'Order Pending',
                    shortText: 'Pending',
                    textColor: 'text-yellow-800',
                    bgColor: '#F59E0B1A',
                    icon: deliveredIcon
                };
            case 'cancelled':
                return {
                    text: 'Order Cancelled',
                    shortText: 'Cancelled',
                    textColor: 'text-red-800',
                    bgColor: '#EF44441A',
                    icon: deliveredIcon
                };
            case 'shipped':
            case 'dispatched':
                return {
                    text: 'Shipped',
                    shortText: 'Shipped',
                    textColor: 'text-blue-800',
                    bgColor: '#3B82F61A',
                    icon: deliveredIcon
                };
            case 'processing':
                return {
                    text: 'Processing',
                    shortText: 'Processing',
                    textColor: 'text-purple-800',
                    bgColor: '#8B5CF61A',
                    icon: deliveredIcon
                };
            default:
                return {
                    text: 'Order Status',
                    shortText: 'Status',
                    textColor: 'text-gray-800',
                    bgColor: '#6B72801A',
                    icon: deliveredIcon
                };
        }
    };

    const statusInfo = getStatusInfo(orderData?.orderStatus);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" style={{ paddingTop: '6rem' }}>
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mx-2 sm:mx-0">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 relative">
                    {/* Close button - always top extreme right */}
                    <button onClick={onClose} className="absolute top-4 right-4 sm:right-6 text-gray-500 hover:text-gray-700 transition-colors p-1">
                        <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Main content */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 pr-8 sm:pr-12">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Order Details</h2>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className={`${statusInfo.textColor} px-2 sm:px-3 py-1.5 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium`} style={{ backgroundColor: statusInfo.bgColor }}>
                                <img src={statusInfo.icon} alt="Status" className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">{statusInfo.text}</span>
                                <span className="sm:hidden">{statusInfo.shortText}</span>
                            </div>
                            <button className="text-purple-800 px-2 sm:px-3 py-1.5 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium" style={{ backgroundColor: '#4200981A' }}>
                                <img src={downloadIcon} alt="Download" className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Download Invoice</span>
                                <span className="sm:hidden">Invoice</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-8 lg:px-20 py-4 sm:py-6">
                    {loading ? (
                        <Preloaders />
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={fetchOrderDetails}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : orderData && productData ? (
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                            {/* Left Column - Images */}
                            <div className="lg:w-1/2">
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    {/* Thumbnails */}
                                    <div className="flex sm:flex-col gap-2 order-2 sm:order-1">
                                        {thumbnails.map((thumb, i) => (
                                            <div key={i} className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${i === 0 ? 'border-gradient-to-b from-pink-400 to-purple-500' : 'border-gray-200'}`}>
                                                <img
                                                    src={thumb}
                                                    alt={`Thumbnail ${i + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Main Image */}
                                    <div className="flex-1 order-1 sm:order-2 relative">
                                        {imageLoading && !imageErrorHandled && (
                                            <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                                                <div className="w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        {imageErrorHandled && (
                                            <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <div className="text-center text-gray-500">
                                                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                                                        <span className="text-2xl">📷</span>
                                                    </div>
                                                    <p className="text-sm">Image not available</p>
                                                </div>
                                            </div>
                                        )}
                                        <img
                                            src={productData.images?.[0]}
                                            alt={productData.name || 'Product'}
                                            className={`w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'} ${imageErrorHandled ? 'hidden' : ''}`}
                                            onLoad={() => setImageLoading(false)}
                                            onError={(e) => {
                                                if (!imageErrorHandled) {
                                                    setImageErrorHandled(true);
                                                    setImageLoading(false);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Details */}
                            <div className="lg:w-1/2 space-y-3 sm:space-y-4">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex-1">
                                        {productData.name || 'Product'}
                                    </h3>
                                    <button className="text-gray-500 hover:text-gray-700 transition-colors p-1 sm:p-2 flex-shrink-0">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 border border-gray-400 rounded-full flex items-center justify-center">
                                            <img src={shareIcon} alt="Share" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                        </div>
                                    </button>
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-button-gradient-orange">
                                            ₹{productData.sellingPrice || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs sm:text-sm text-black line-through">
                                            MRP ₹{productData.mrpPrice || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-3 sm:pt-4 md:pt-6 mt-3 sm:mt-4 md:mt-6">
                                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">Reviews</h4>
                                    <div className="w-full">
                                        {!showReviewForm ? (
                                            <button
                                                onClick={() => setShowReviewForm(true)}
                                                className="bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-xs sm:text-sm font-medium w-full"
                                            >
                                                Write a Review
                                            </button>
                                        ) : (
                                            <ReviewForm
                                                isOpen={showReviewForm}
                                                onClose={() => setShowReviewForm(false)}
                                                onSubmitSuccess={handleReviewSuccess}
                                                serviceId={null}
                                                productId={productData._id || null}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                            <p className="text-gray-600">No order data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;

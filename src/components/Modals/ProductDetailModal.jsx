import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import UserReviews from '../Common/UserReviews';
import { getSingleProductOrder, getFilteredTestimonials } from '../../api';
import Preloaders from '../Loader/Preloaders';
// Import assets
import deliveredIcon from '../../assets/user/orders/delivered.svg';
import downloadIcon from '../../assets/user/orders/download.svg';
import shareIcon from '../../assets/user/orders/share.svg';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
        day === 2 || day === 22 ? 'nd' :
            day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${suffix} ${month}, ${year}`;
};

const formatAddress = (address) => {
    if (!address) return null;
    if (typeof address === 'string') return address;
    const { street = '', city = '', state = '', pincode = '' } = address;
    return `${street}, ${city}, ${state} ${pincode}`.trim();
};

const STATUS_CONFIG = {
    delivered: { text: 'Delivered', textColor: 'text-green-800', bgColor: '#00A63E1A' },
    completed: { text: 'Delivered', textColor: 'text-green-800', bgColor: '#00A63E1A' },
    pending: { text: 'Order Pending', shortText: 'Pending', textColor: 'text-yellow-800', bgColor: '#F59E0B1A' },
    cancelled: { text: 'Order Cancelled', shortText: 'Cancelled', textColor: 'text-red-800', bgColor: '#EF44441A' },
    shipped: { text: 'Shipped', textColor: 'text-blue-800', bgColor: '#3B82F61A' },
    dispatched: { text: 'Shipped', textColor: 'text-blue-800', bgColor: '#3B82F61A' },
    processing: { text: 'Processing', textColor: 'text-purple-800', bgColor: '#8B5CF61A' }
};

const getStatusInfo = (status) => {
    const config = STATUS_CONFIG[status?.toLowerCase()] || {
        text: 'Order Status', shortText: 'Status', textColor: 'text-gray-800', bgColor: '#6B72801A'
    };
    return { ...config, shortText: config.shortText || config.text, icon: deliveredIcon };
};

const getPaymentStatusColor = (status) => {
    if (status === 'completed' || status === 'paid') return 'text-green-600';
    if (status === 'pending') return 'text-yellow-600';
    return 'text-red-600';
};

const ProductItem = ({ item, index, handleReviewSuccess, reviews, loadingReviews }) => {
    const productData = item.product;
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [imageLoadingStates, setImageLoadingStates] = useState({});
    const [imageErrorStates, setImageErrorStates] = useState({});

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Product Image - Small */}
            <div className="relative h-32 bg-gray-100">
                {imageLoadingStates[productData?._id] !== false && !imageErrorStates[productData?._id] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="w-6 h-6 border-3 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                    </div>
                )}
                {imageErrorStates[productData?._id] && (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <span className="text-2xl">📷</span>
                            <p className="text-xs mt-1">No image</p>
                        </div>
                    </div>
                )}
                <img
                    src={productData?.images?.[0]}
                    alt={productData?.name || 'Product'}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoadingStates[productData?._id] !== false ? 'opacity-0' : 'opacity-100'} ${imageErrorStates[productData?._id] ? 'hidden' : ''}`}
                    onLoad={() => setImageLoadingStates(prev => ({ ...prev, [productData?._id]: false }))}
                    onError={() => {
                        if (!imageErrorStates[productData?._id]) {
                            setImageErrorStates(prev => ({ ...prev, [productData?._id]: true }));
                            setImageLoadingStates(prev => ({ ...prev, [productData?._id]: false }));
                        }
                    }}
                />
            </div>

            {/* Product Details */}
            <div className="p-3">
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[2.5rem]">
                        {productData?.name || 'Product'}
                    </h4>

                    <div className="space-y-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold bg-clip-text text-transparent bg-button-gradient-orange">
                                ₹{productData?.sellingPrice || 0}
                            </span>
                            {item.quantity > 1 && (
                                <span className="text-xs text-gray-600">× {item.quantity}</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-600">
                            MRP <span className="line-through">₹{productData?.mrpPrice || 0}</span>
                        </p>
                        {item.quantity > 1 && (
                            <p className="text-xs text-gray-700 font-medium">
                                Subtotal: ₹{(productData?.sellingPrice || 0) * item.quantity}
                            </p>
                        )}
                    </div>
                </div>

                {/* Consolidated Review Section */}
                <UserReviews
                    reviews={reviews}
                    loadingReviews={loadingReviews}
                    onReviewUpdate={() => handleReviewSuccess(productData?._id)}
                    editingReviewId={editingReviewId}
                    setEditingReviewId={setEditingReviewId}
                    variant="compact"
                    showWriteReview={true}
                    productId={productData?._id || null}
                    serviceId={null}
                />
            </div>
        </div>
    );
};

const ProductDetailModal = ({ isOpen, onClose, product }) => {
    const loggedUserDetails = useSelector(state => state.user.loggedUserDetails);
    const userId = loggedUserDetails?._id;

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productReviews, setProductReviews] = useState({});
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const fetchProductReviews = useCallback(async (productId) => {
        if (!userId || !productId) return;
        try {
            setLoadingReviews(true);
            const response = await getFilteredTestimonials({
                userId,
                productId
            });
            if (response.success) {
                setProductReviews(prev => ({
                    ...prev,
                    [productId]: response.data || []
                }));
            }
        } catch (err) {
            console.error('Error fetching product reviews:', err);
        } finally {
            setLoadingReviews(false);
        }
    }, [userId]);

    const fetchOrderDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getSingleProductOrder(product.orderId);
            if (response.success) {
                setOrderData(response.data);
                // Fetch reviews for all products in the order
                if (response.data?.items && userId) {
                    response.data.items.forEach(item => {
                        if (item.product?._id) {
                            fetchProductReviews(item.product._id);
                        }
                    });
                }
            } else {
                setError(response.message || 'Failed to fetch order details');
            }
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    }, [product?.orderId, userId, fetchProductReviews]);

    useEffect(() => {
        if (isOpen && product?.orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, product?.orderId, fetchOrderDetails]);


    // Memoized calculations
    const orderItems = useMemo(() => orderData?.items || [], [orderData?.items]);

    const totalItems = useMemo(() =>
        orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
        [orderItems]
    );

    const statusInfo = useMemo(() =>
        getStatusInfo(orderData?.orderStatus),
        [orderData?.orderStatus]
    );

    const formattedAddress = useMemo(() =>
        formatAddress(orderData?.shippingAddress),
        [orderData?.shippingAddress]
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6 pt-20 sm:pt-24" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)] overflow-y-auto mx-2 sm:mx-0">
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
                    ) : orderData && orderItems.length > 0 ? (
                        <div className="space-y-6">
                            {/* Order Summary Section */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-button-gradient-orange px-4 py-2.5">
                                    <h3 className="text-base sm:text-lg font-semibold text-white">Order Summary</h3>
                                </div>
                                <div className="bg-white p-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
                                            <p className="text-sm font-medium text-gray-800 truncate" title={orderData.orderId}>
                                                #{orderData.orderId?.slice(-8)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Order Date</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {formatDate(orderData.createdAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Total Items</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Subtotal</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                ₹{orderData.totalAmount || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Payment Status</p>
                                            <p className={`text-sm font-semibold ${getPaymentStatusColor(orderData.paymentStatus)}`}>
                                                {orderData.paymentStatus?.toUpperCase() || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
                                            <p className="text-base font-bold text-gray-900">
                                                ₹{orderData.finalAmount || orderData.totalAmount || 0}
                                            </p>
                                        </div>
                                    </div>
                                    {(orderData.paymentId || formattedAddress) && (
                                        <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                                            {orderData.paymentId && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-0.5">Payment ID</p>
                                                    <p className="text-sm font-medium text-gray-800 break-all">
                                                        {orderData.paymentId}
                                                    </p>
                                                </div>
                                            )}
                                            {formattedAddress && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-0.5">Shipping Address</p>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {formattedAddress}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Products Section */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                                    Products ({orderItems.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {orderItems.map((item, index) => (
                                        <ProductItem
                                            key={item._id || index}
                                            item={item}
                                            index={index}
                                            handleReviewSuccess={fetchProductReviews}
                                            reviews={productReviews[item.product?._id] || []}
                                            loadingReviews={loadingReviews}
                                        />
                                    ))}
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

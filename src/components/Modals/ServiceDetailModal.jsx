import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FaClock, FaCalendarAlt, FaDesktop, FaVideo, FaTimes } from 'react-icons/fa';
import { getSingleServiceOrder, getFilteredReviews } from '../../api';
import { getServiceModeLabel } from '../../utils/serviceConfig';
import UserReviews from '../Common/UserReviews';
import OrderIdCopy from '../Common/OrderIdCopy';
import Preloaders from '../Loader/Preloaders';
import downloadIcon from '../../assets/user/orders/download.svg';

const formatDate = (dateString) => {
    if (!dateString) return 'Date will be confirmed';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
        day === 2 || day === 22 ? 'nd' :
            day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${suffix} ${month}, ${year}`;
};

const formatTime = (timeString) => {
    if (!timeString) return 'Time will be confirmed';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes}${ampm}`;
};

const getStatusInfo = (status) => {
    const statusMap = {
        completed: { text: 'Session Completed', shortText: 'Completed', textColor: 'text-green-800', bgColor: '#00A63E1A' },
        delivered: { text: 'Session Completed', shortText: 'Completed', textColor: 'text-green-800', bgColor: '#00A63E1A' },
        pending: { text: 'Session Pending', shortText: 'Pending', textColor: 'text-yellow-800', bgColor: '#F59E0B1A' },
        cancelled: { text: 'Session Cancelled', shortText: 'Cancelled', textColor: 'text-red-800', bgColor: '#EF44441A' },
        in_progress: { text: 'Session Ongoing', shortText: 'Ongoing', textColor: 'text-blue-800', bgColor: '#3B82F61A' },
        ongoing: { text: 'Session Ongoing', shortText: 'Ongoing', textColor: 'text-blue-800', bgColor: '#3B82F61A' }
    };
    return statusMap[status?.toLowerCase()] || { text: 'Session Status', shortText: 'Status', textColor: 'text-gray-800', bgColor: '#6B72801A' };
};

const ServiceItem = ({ serviceData, index, handleReviewSuccess, reviews, loadingReviews }) => {
    const [editingReviewId, setEditingReviewId] = useState(null);
    const details = [
        { icon: FaClock, text: 'Duration:', value: `${serviceData.durationInMinutes || 30} min` },
        { icon: FaCalendarAlt, text: 'Date:', value: formatDate(serviceData.bookingDate) },
        { icon: FaDesktop, text: 'Mode:', value: getServiceModeLabel(serviceData.serviceType) }
    ];
    const statusInfo = getStatusInfo(serviceData?.bookingStatus);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Service Image - Small */}
            <div className="relative h-28 sm:h-32 bg-gray-100">
                <img
                    src={serviceData.serviceImage || "/src/assets/user/services/palmistry.png"}
                    alt={serviceData.serviceName || "Service"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "/src/assets/user/services/palmistry.png";
                    }}
                />
                <div className={`absolute top-2 right-2 ${statusInfo.textColor} px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium`} style={{ backgroundColor: statusInfo.bgColor }}>
                    {statusInfo.shortText}
                </div>
            </div>

            {/* Service Details */}
            <div className="p-2.5 sm:p-3">
                <div className="space-y-2 mb-3">
                    <h4 className="font-semibold text-gray-800 text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                        {serviceData.serviceName || 'Service'}
                    </h4>

                    <div className="text-sm sm:text-base font-bold bg-clip-text text-transparent bg-button-gradient-orange">
                        ₹{(serviceData.total || serviceData.servicePrice)?.toLocaleString()}
                    </div>

                    {/* Service Info */}
                    <div className="space-y-1.5 text-xs">
                        {details.map(({ icon: Icon, text, value }, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                                <Icon className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">
                                    <span className="text-gray-600">{text} </span>
                                    <span className="font-medium text-gray-900">{value}</span>
                                </span>
                            </div>
                        ))}
                        {serviceData.zoomLink && (
                            <div className="flex items-start gap-1.5">
                                <FaVideo className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 break-all text-xs">
                                    {serviceData.zoomLink}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Consolidated Review Section */}
                <UserReviews
                    reviews={reviews}
                    loadingReviews={loadingReviews}
                    onReviewUpdate={() => handleReviewSuccess(serviceData.serviceId)}
                    editingReviewId={editingReviewId}
                    setEditingReviewId={setEditingReviewId}
                    variant="compact"
                    showWriteReview={true}
                    productId={null}
                    serviceId={serviceData?.serviceId || null}
                />
            </div>
        </div>
    );
};

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
    const loggedUserDetails = useSelector(state => state.user.loggedUserDetails);
    const userId = loggedUserDetails?._id;

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [serviceReviews, setServiceReviews] = useState({});
    const [loadingReviews, setLoadingReviews] = useState(false);

    const fetchServiceReviews = useCallback(async (serviceId) => {
        if (!userId || !serviceId) return;
        try {
            setLoadingReviews(true);
            const response = await getFilteredReviews({
                userId,
                serviceId
            });
            if (response.success) {
                setServiceReviews(prev => ({
                    ...prev,
                    [serviceId]: response.data || []
                }));
            }
        } catch (err) {
            console.error('Error fetching service reviews:', err);
        } finally {
            setLoadingReviews(false);
        }
    }, [userId]);

    const fetchOrderDetails = useCallback(async () => {
        if (!service?.orderId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await getSingleServiceOrder(service.orderId);
            if (response.success) {
                setOrderData(response.data[0]);
                // Fetch reviews for all services in the order
                if (response.data[0]?.services && userId) {
                    response.data[0].services.forEach(serviceData => {
                        if (serviceData.serviceId) {
                            fetchServiceReviews(serviceData.serviceId);
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
    }, [service?.orderId, userId, fetchServiceReviews]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen && service?.orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, service?.orderId, fetchOrderDetails]);


    const handleDownloadInvoice = useCallback(() => {
        console.log('Downloading invoice for order:', orderData?.orderId);
    }, [orderData?.orderId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 md:p-6 pt-16 sm:pt-20 md:pt-24" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)] overflow-y-auto">
                <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 relative sticky top-0 bg-white z-10">
                    <button onClick={onClose} className="absolute top-3 sm:top-4 right-3 sm:right-4 md:right-6 text-gray-500 hover:text-gray-700 transition-colors p-1">
                        <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 pr-8 sm:pr-10 md:pr-12">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">Order Details</h2>
                        {orderData && (
                            <button
                                onClick={handleDownloadInvoice}
                                className="text-purple-800 px-2 sm:px-3 py-1.5 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium w-fit"
                                style={{ backgroundColor: '#4200981A' }}
                            >
                                <img src={downloadIcon} alt="Download" className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Download Invoice</span>
                                <span className="sm:hidden">Invoice</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-3 sm:px-4 md:px-8 lg:px-20 py-3 sm:py-4 md:py-6">
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
                    ) : orderData && orderData.services?.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-button-gradient-orange px-3 sm:px-4 py-2 sm:py-2.5">
                                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">Order Summary</h3>
                                </div>
                                <div className="bg-white p-3 sm:p-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 sm:gap-x-4 gap-y-2.5 sm:gap-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
                                            <OrderIdCopy
                                                orderId={orderData.orderId}
                                                displayLength={8}
                                                showHash={true}
                                                textClassName="text-xs sm:text-sm text-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Order Date</p>
                                            <p className="text-xs sm:text-sm font-medium text-gray-800">
                                                {formatDate(orderData.createdAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Total Services</p>
                                            <p className="text-xs sm:text-sm font-medium text-gray-800">
                                                {orderData.services.length} {orderData.services.length === 1 ? 'Service' : 'Services'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Subtotal</p>
                                            <p className="text-xs sm:text-sm font-medium text-gray-800">
                                                ₹{(orderData.totalAmount || 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Payment Status</p>
                                            <p className={`text-xs sm:text-sm font-semibold ${orderData.paymentStatus === 'completed' || orderData.paymentStatus === 'paid'
                                                ? 'text-green-600'
                                                : orderData.paymentStatus === 'pending'
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                                }`}>
                                                {orderData.paymentStatus?.toUpperCase() || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
                                            <p className="text-sm sm:text-base font-bold text-gray-900">
                                                ₹{(orderData.finalAmount || orderData.totalAmount || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    {(orderData.paymentId || orderData.address) && (
                                        <div className="border-t border-gray-100 mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 space-y-2">
                                            {orderData.paymentId && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-0.5">Payment ID</p>
                                                    <p className="text-xs sm:text-sm font-medium text-gray-800 break-all">
                                                        {orderData.paymentId}
                                                    </p>
                                                </div>
                                            )}
                                            {orderData.address && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-0.5">Address</p>
                                                    <p className="text-xs sm:text-sm font-medium text-gray-800">
                                                        {orderData.address}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Services Section */}
                            <div>
                                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2.5 sm:mb-3">
                                    Services ({orderData.services.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {orderData.services.map((serviceData, index) => (
                                        <ServiceItem
                                            key={serviceData.serviceId || index}
                                            serviceData={serviceData}
                                            index={index}
                                            handleReviewSuccess={fetchServiceReviews}
                                            reviews={serviceReviews[serviceData.serviceId] || []}
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

export default ServiceDetailModal;
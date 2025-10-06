import React, { useEffect, useState } from 'react';
import { FaClock, FaCalendarAlt, FaDesktop, FaVideo, FaTimes, FaStar } from 'react-icons/fa';
import { getSingleServiceOrder } from '../../api';
import { getServiceModeLabel } from '../../utils/serviceConfig';
import ReviewForm from '../Common/ReviewForm';
import Preloaders from '../Loader/Preloaders';

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

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
    }, [isOpen, service?.orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getSingleServiceOrder(service.orderId);
            if (response.success) {
                setOrderData(response.data[0]);
            } else {
                setError(response.message || 'Failed to fetch order details');
            }
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSuccess = () => {
        setShowReviewForm(false);
    };

    if (!isOpen) return null;

    // Format date and time
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


    // Get service data from order
    const serviceData = orderData?.services?.[0];
    const details = serviceData ? [
        { icon: FaClock, text: 'Session Duration:', value: `${serviceData.durationInMinutes || 30} minutes` },
        { icon: FaCalendarAlt, text: 'Date:', value: `${formatDate(serviceData.bookingDate)} / ${formatTime(serviceData.startTime)} - ${formatTime(serviceData.endTime)}` },
        { icon: FaDesktop, text: 'Mode:', value: getServiceModeLabel(serviceData.serviceType) },
        { icon: FaVideo, text: '', value: serviceData.zoomLink || 'Meeting link will be provided', breakAll: true }
    ] : [];

    // Get status info for the badge
    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return {
                    text: 'Session Completed',
                    shortText: 'Completed',
                    textColor: 'text-green-800',
                    bgColor: '#00A63E1A'
                };
            case 'pending':
                return {
                    text: 'Session Pending',
                    shortText: 'Pending',
                    textColor: 'text-yellow-800',
                    bgColor: '#F59E0B1A'
                };
            case 'cancelled':
                return {
                    text: 'Session Cancelled',
                    shortText: 'Cancelled',
                    textColor: 'text-red-800',
                    bgColor: '#EF44441A'
                };
            case 'in_progress':
            case 'ongoing':
                return {
                    text: 'Session Ongoing',
                    textColor: 'text-blue-800',
                    bgColor: '#3B82F61A'
                };
            default:
                return {
                    text: 'Session Status',
                    shortText: 'Status',
                    textColor: 'text-gray-800',
                    bgColor: '#6B72801A'
                };
        }
    };

    const statusInfo = getStatusInfo(serviceData?.bookingStatus || orderData?.orderStatus);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" style={{ paddingTop: '6rem' }}>
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mx-2 sm:mx-0">
                <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Order Details</h2>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className={`${statusInfo.textColor} px-2 sm:px-3 py-1.5 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium`} style={{ backgroundColor: statusInfo.bgColor }}>
                            <img src="/src/assets/user/orders/badge.svg" alt="Badge" className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{statusInfo.text}</span>
                            <span className="sm:hidden">{statusInfo.shortText}</span>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors p-1">
                            <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

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
                    ) : orderData && serviceData ? (
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                            <div className="lg:w-1/2">
                                <img
                                    src={serviceData.serviceImage || "/src/assets/user/services/palmistry.png"}
                                    alt={serviceData.serviceName || "Service"}
                                    className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                                    onError={(e) => {
                                        e.target.src = "/src/assets/user/services/palmistry.png";
                                    }}
                                />
                            </div>

                            <div className="lg:w-1/2 space-y-3 sm:space-y-4">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                                        {serviceData.serviceName || 'Service'}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                        {[...Array(5)].map((_, i) => <FaStar key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-primary-orange" />)}
                                        <span className="text-xs sm:text-sm text-gray-600">(150 Reviews)</span>
                                    </div>
                                </div>

                                <div className="space-y-2 sm:space-y-3">
                                    {details.map(({ icon: Icon, text, value, breakAll }, i) => (
                                        <div key={i} className="flex items-start gap-2 sm:gap-3">
                                            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mt-1 flex-shrink-0" />
                                            <span className={`text-xs sm:text-sm text-gray-600 ${breakAll ? 'break-all' : ''}`}>
                                                {text && <span>{text} </span>}
                                                {text && <span className="font-medium text-gray-800">{value}</span>}
                                                {!text && value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-4 sm:mt-6">
                                    <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Reviews</h4>

                                    {!showReviewForm ? (
                                        <button
                                            onClick={() => setShowReviewForm(true)}
                                            className="bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
                                        >
                                            Write a Review
                                        </button>
                                    ) : (
                                        <ReviewForm
                                            isOpen={showReviewForm}
                                            onClose={() => setShowReviewForm(false)}
                                            onSubmitSuccess={handleReviewSuccess}
                                            serviceId={serviceData?.serviceId || null}
                                            productId={null}
                                        />
                                    )}
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
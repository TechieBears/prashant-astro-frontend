import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FaClock, FaCalendarAlt, FaDesktop, FaTimes } from 'react-icons/fa';
import { getSingleServiceOrder, getFilteredReviews } from '../../api';
import { getServiceModeLabel } from '../../utils/serviceConfig';
import UserReviews from '../Common/UserReviews';
import OrderIdCopy from '../Common/OrderIdCopy';
import Preloaders from '../Loader/Preloaders';
import downloadIcon from '../../assets/user/orders/download.svg';
import fallbackServiceImage from '../../assets/user/home/services/service-homepage (1).png';
import ProductImage from '../Common/ProductImage';

const formatDate = (d) => !d ? 'Date will be confirmed' : (() => { const dt = new Date(d), day = dt.getDate(), sfx = [1,21,31].includes(day) ? 'st' : [2,22].includes(day) ? 'nd' : [3,23].includes(day) ? 'rd' : 'th'; return `${day}${sfx} ${dt.toLocaleString('default', { month: 'short' })}, ${dt.getFullYear()}`; })();
const formatTime = (t) => !t ? 'Time will be confirmed' : (() => { const [h, m] = t.split(':'), hr = parseInt(h), dh = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr; return `${dh}:${m}${hr >= 12 ? 'PM' : 'AM'}`; })();
const getStatusInfo = (s) => ({ completed: { shortText: 'Completed', textColor: 'text-white', bgColor: 'bg-green-600' }, delivered: { shortText: 'Completed', textColor: 'text-white', bgColor: 'bg-green-600' }, pending: { shortText: 'Pending', textColor: 'text-yellow-900', bgColor: 'bg-yellow-400' }, cancelled: { shortText: 'Cancelled', textColor: 'text-white', bgColor: 'bg-red-600' }, in_progress: { shortText: 'Ongoing', textColor: 'text-white', bgColor: 'bg-blue-600' }, ongoing: { shortText: 'Ongoing', textColor: 'text-white', bgColor: 'bg-blue-600' } }[s?.toLowerCase()] || { shortText: 'Status', textColor: 'text-gray-800', bgColor: 'bg-gray-300' });
const getPaymentColor = (s) => s === 'completed' || s === 'paid' ? 'text-green-600' : s === 'pending' ? 'text-yellow-600' : 'text-red-600';

const DetailBox = ({ title, children }) => <div className="bg-gray-50 p-2 rounded-md mb-2"><h5 className="font-medium text-gray-800 mb-1">{title}</h5><div className="space-y-1">{children}</div></div>;
const DetailRow = ({ label, value }) => <div className="flex items-start gap-1.5"><span className="text-gray-600">{label}: </span><span className="font-medium text-gray-900">{value}</span></div>;
const InfoRow = ({ label, value, className = "" }) => <div><p className="text-xs text-gray-500 mb-0.5">{label}</p><p className={`text-xs sm:text-sm font-medium text-gray-800 ${className}`}>{value}</p></div>;
const PriceRow = ({ label, value, className = "text-gray-800" }) => <div className="flex justify-between items-center"><span className="text-xs sm:text-sm text-gray-600">{label}</span><span className={`text-xs sm:text-sm font-medium ${className}`}>{value}</span></div>;

const ServiceItem = ({ serviceData, handleReviewSuccess, reviews, loadingReviews }) => {
    const [editingReviewId, setEditingReviewId] = useState(null);
    const details = [{ icon: FaClock, text: 'Duration:', value: `${serviceData.serviceDuration || serviceData.durationInMinutes || 30} min` }, { icon: FaCalendarAlt, text: 'Date:', value: formatDate(serviceData.bookingDate) }, { icon: FaClock, text: 'Time:', value: `${formatTime(serviceData.startTime)} - ${formatTime(serviceData.endTime)}` }, { icon: FaDesktop, text: 'Mode:', value: getServiceModeLabel(serviceData.serviceType) }];
    const statusInfo = getStatusInfo(serviceData?.bookingStatus);
    const astrologerName = serviceData.astrologerName || `${serviceData.astrologerFirstName || ''} ${serviceData.astrologerLastName || ''}`.trim();

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="relative h-28 sm:h-32 bg-gray-100">
                <ProductImage images={serviceData.serviceImage} name={serviceData.serviceName || "Service"} containerClassName="w-full h-full" imgClassName="w-full h-full object-cover" fallbackClassName="w-full h-full flex items-center justify-center bg-gray-100" fallbackContent={<img src={fallbackServiceImage} alt="Fallback Service" className="w-full h-full object-cover" />} />
                <div className={`absolute top-2 right-2 ${statusInfo.textColor} ${statusInfo.bgColor} px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium`}>{statusInfo.shortText}</div>
            </div>
            <div className="p-2.5 sm:p-3">
                <div className="space-y-2 mb-3">
                    <h4 className="font-semibold text-gray-800 text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">{serviceData.serviceName || 'Service'}</h4>
                    <div className="text-sm sm:text-base font-bold bg-clip-text text-transparent bg-button-gradient-orange">₹{(serviceData.total || serviceData.servicePrice)?.toLocaleString()}</div>
                    <div className="space-y-1.5 text-xs">
                        {serviceData.cust && <DetailBox title="Customer Details"><DetailRow label="Name" value={`${serviceData.cust.firstName} ${serviceData.cust.lastName}`.trim()} /><DetailRow label="Email" value={serviceData.cust.email} /><DetailRow label="Phone" value={serviceData.cust.phone} /></DetailBox>}
                        {astrologerName && <DetailBox title="Astrologer Details"><DetailRow label="Name" value={astrologerName} /></DetailBox>}
                        <div className="space-y-1">{details.map(({ icon: Icon, text, value }, i) => <div key={i} className="flex items-start gap-1.5"><Icon className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" /><span className="text-gray-700"><span className="text-gray-600">{text} </span><span className="font-medium text-gray-900">{value}</span></span></div>)}</div>
                    </div>
                </div>
                <UserReviews reviews={reviews} loadingReviews={loadingReviews} onReviewUpdate={() => handleReviewSuccess(serviceData.serviceId || serviceData._id)} editingReviewId={editingReviewId} setEditingReviewId={setEditingReviewId} variant="compact" showWriteReview={true} productId={null} serviceId={serviceData?.serviceId || serviceData?._id || null} />
            </div>
        </div>
    );
};

const OrderSummary = ({ orderData }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-button-gradient-orange px-3 sm:px-4 py-2 sm:py-2.5"><h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">Order Summary</h3></div>
        <div className="bg-white p-3 sm:p-4">
            <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 sm:gap-x-4 gap-y-2.5 sm:gap-y-3">
                    <InfoRow label="Order ID" value={<OrderIdCopy orderId={orderData.orderId} displayLength={8} showHash={true} textClassName="text-xs sm:text-sm text-gray-800" />} />
                    <InfoRow label="Order Date" value={formatDate(orderData.createdAt)} />
                    <InfoRow label="Total Services" value={`${orderData.services.length} ${orderData.services.length === 1 ? 'Service' : 'Services'}`} />
                    <InfoRow label="Payment Status" value={orderData.paymentStatus?.toUpperCase() || 'N/A'} className={getPaymentColor(orderData.paymentStatus)} />
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-end">
                    <div className="space-y-2 min-w-[280px] sm:min-w-[320px]">
                        <PriceRow label="Subtotal" value={`₹${(orderData.totalAmount || 0).toLocaleString()}`} />
                        {orderData.discountPercent > 0 && <PriceRow label={`Discount (${orderData.discountPercent}%)`} value={`- ₹${((orderData.totalAmount || 0) - (orderData.payingAmount || orderData.totalAmount || 0)).toLocaleString()}`} className="text-green-600" />}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100"><span className="text-sm sm:text-base font-semibold text-gray-800">Total Amount</span><span className="text-sm sm:text-base font-bold text-gray-900">₹{(orderData.discountPercent > 0 ? orderData.payingAmount : (orderData.finalAmount || orderData.totalAmount) || 0).toLocaleString()}</span></div>
                    </div>
                </div>
            </div>
            {(orderData.paymentId || orderData.address) && (
                <div className="border-t border-gray-100 mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 space-y-2">
                    {orderData.paymentId && <InfoRow label="Payment ID" value={orderData.paymentId} className="break-all" />}
                    {orderData.address && <InfoRow label="Address" value={orderData.address} />}
                </div>
            )}
        </div>
    </div>
);

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
    const userId = useSelector(state => state.user.loggedUserDetails?._id);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [serviceReviews, setServiceReviews] = useState({});
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => { if (!isOpen) return; const handleEsc = (e) => e.key === 'Escape' && onClose(); document.addEventListener('keydown', handleEsc); return () => document.removeEventListener('keydown', handleEsc); }, [isOpen, onClose]);

    const fetchServiceReviews = useCallback(async (serviceId) => {
        if (!userId || !serviceId) return;
        setLoadingReviews(true);
        try { const res = await getFilteredReviews({ userId, serviceId }); if (res.success) setServiceReviews(prev => ({ ...prev, [serviceId]: res.data || [] })); } catch (err) { console.error('Error fetching reviews:', err); } finally { setLoadingReviews(false); }
    }, [userId]);

    const fetchOrderDetails = useCallback(async () => {
        if (!service?.orderId) return;
        setLoading(true); setError(null);
        try { const res = await getSingleServiceOrder(service.orderId); if (res.success && res.data?.[0]?.services?.length > 0) { const od = res.data[0]; setOrderData(od); od.services?.forEach(sd => sd.serviceId && userId && fetchServiceReviews(sd.serviceId)); } else setError(res.message || 'Failed to fetch order details'); } catch (err) { console.error('Error:', err); setError('Failed to fetch order details'); } finally { setLoading(false); }
    }, [service?.orderId, userId, fetchServiceReviews]);

    useEffect(() => { if (isOpen && service?.orderId) fetchOrderDetails(); }, [isOpen, service?.orderId, fetchOrderDetails]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 md:p-6 pt-16 sm:pt-20 md:pt-24" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)] overflow-y-auto">
                <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 relative sticky top-0 bg-white z-10">
                    <button onClick={onClose} className="absolute top-3 sm:top-4 right-3 sm:right-4 md:right-6 text-gray-500 hover:text-gray-700 transition-colors p-1"><FaTimes className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 pr-8 sm:pr-10 md:pr-12">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">Order Details</h2>
                        {orderData && <button onClick={() => console.log('Downloading invoice:', orderData?.orderId)} className="text-purple-800 px-2 sm:px-3 py-1.5 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium w-fit" style={{ backgroundColor: '#4200981A' }}><img src={downloadIcon} alt="Download" className="w-3 h-3 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Download Invoice</span><span className="sm:hidden">Invoice</span></button>}
                    </div>
                </div>
                <div className="px-3 sm:px-4 md:px-8 lg:px-20 py-3 sm:py-4 md:py-6">
                    {loading ? <Preloaders /> : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <p className="text-red-600">{error}</p>
                            <button onClick={fetchOrderDetails} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Retry</button>
                        </div>
                    ) : orderData && orderData.services?.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                            <OrderSummary orderData={orderData} />
                            <div>
                                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2.5 sm:mb-3">Services ({orderData.services.length})</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {orderData.services.map((sd, idx) => <ServiceItem key={sd.serviceId || idx} serviceData={sd} handleReviewSuccess={fetchServiceReviews} reviews={serviceReviews[sd.serviceId] || []} loadingReviews={loadingReviews} />)}
                                </div>
                            </div>
                        </div>
                    ) : <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center"><p className="text-gray-600">No order data available</p></div>}
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailModal;

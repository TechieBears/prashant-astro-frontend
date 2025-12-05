import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import UserReviews from '../Common/UserReviews';
import OrderIdCopy from '../Common/OrderIdCopy';
import { getSingleProductOrder, getFilteredReviews } from '../../api';
import Preloaders from '../Loader/Preloaders';
import OrderStatusBar from '../Common/OrderStatusBar';
import downloadIcon from '../../assets/user/orders/download.svg';

const formatDate = (d) => !d ? 'N/A' : (() => { const dt = new Date(d), day = dt.getDate(), sfx = [1,21,31].includes(day) ? 'st' : [2,22].includes(day) ? 'nd' : [3,23].includes(day) ? 'rd' : 'th'; return `${day}${sfx} ${dt.toLocaleString('default', { month: 'short' })}, ${dt.getFullYear()}`; })();
const formatAddress = (a) => !a ? null : typeof a === 'string' ? a : [a.street, a.city, a.state, a.pincode].filter(Boolean).join(', ');
const getPaymentColor = (s) => s === 'completed' || s === 'paid' ? 'text-green-600' : s === 'pending' ? 'text-yellow-600' : 'text-red-600';

const ProductImage = ({ src, alt, productId }) => {
    const [state, setState] = useState({ loading: true, error: false });
    return (
        <div className="relative h-28 sm:h-32 bg-gray-100">
            {state.loading && !state.error && <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"><div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div></div>}
            {state.error && <div className="absolute inset-0 bg-gray-200 flex items-center justify-center"><div className="text-center text-gray-500"><span className="text-xl sm:text-2xl">📷</span><p className="text-xs mt-1">No image</p></div></div>}
            <img src={src} alt={alt} className={`w-full h-full object-cover transition-opacity duration-300 ${state.loading ? 'opacity-0' : 'opacity-100'} ${state.error ? 'hidden' : ''}`} onLoad={() => setState({ loading: false, error: false })} onError={() => setState({ loading: false, error: true })} />
        </div>
    );
};

const ProductItem = ({ item, handleReviewSuccess, reviews, loadingReviews }) => {
    const [editingReviewId, setEditingReviewId] = useState(null);
    const p = item.product;
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <ProductImage src={p?.images?.[0]} alt={p?.name || 'Product'} productId={p?._id} />
            <div className="p-2.5 sm:p-3">
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">{p?.name || 'Product'}</h4>
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-sm sm:text-base font-bold bg-clip-text text-transparent bg-button-gradient-orange">₹{(p?.sellingPrice || 0).toLocaleString()}</span>
                            {item.quantity > 1 && <span className="text-xs text-gray-600">× {item.quantity}</span>}
                        </div>
                        <p className="text-xs text-gray-600">MRP <span className="line-through">₹{(p?.mrpPrice || 0).toLocaleString()}</span></p>
                        {item.quantity > 1 && <p className="text-xs text-gray-700 font-medium">Subtotal: ₹{((p?.sellingPrice || 0) * item.quantity).toLocaleString()}</p>}
                    </div>
                </div>
                <UserReviews reviews={reviews} loadingReviews={loadingReviews} onReviewUpdate={() => handleReviewSuccess(p?._id)} editingReviewId={editingReviewId} setEditingReviewId={setEditingReviewId} variant="compact" showWriteReview={true} productId={p?._id || null} serviceId={null} />
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, className = "" }) => <div><p className="text-xs text-gray-500 mb-0.5">{label}</p><p className={`text-xs sm:text-sm font-medium text-gray-800 ${className}`}>{value}</p></div>;
const PriceRow = ({ label, value, className = "text-gray-800" }) => <div className="flex justify-between items-center"><span className="text-xs sm:text-sm text-gray-600">{label}</span><span className={`text-xs sm:text-sm font-medium ${className}`}>{value}</span></div>;

const OrderSummary = ({ orderData, totalItems, formattedAddress }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-button-gradient-orange px-3 sm:px-4 py-2 sm:py-2.5"><h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">Order Summary</h3></div>
        <div className="bg-white p-3 sm:p-4">
            <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 sm:gap-x-4 gap-y-2.5 sm:gap-y-3">
                    <InfoRow label="Order ID" value={<OrderIdCopy orderId={orderData._id || orderData.orderId} displayLength={8} showHash={true} textClassName="text-xs sm:text-sm text-gray-800" />} />
                    <InfoRow label="Order Date" value={formatDate(orderData.createdAt)} />
                    <InfoRow label="Total Items" value={`${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}`} />
                    <InfoRow label="Payment Status" value={orderData.paymentStatus?.toUpperCase() || 'N/A'} className={getPaymentColor(orderData.paymentStatus)} />
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-end">
                    <div className="space-y-2 min-w-[280px] sm:min-w-[320px]">
                        <PriceRow label="Subtotal" value={`₹${(orderData.totalAmount || 0).toLocaleString()}`} />
                        {orderData.amount?.gst > 0 && <PriceRow label="GST (18%)" value={`+ ₹${(orderData.amount.gst || 0).toLocaleString()}`} />}
                        {orderData.discountPercent > 0 && <PriceRow label={`Discount (${orderData.discountPercent}%)`} value={`- ₹${((orderData.totalAmount || 0) - (orderData.payingAmount || orderData.totalAmount || 0)).toLocaleString()}`} className="text-green-600" />}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100"><span className="text-sm sm:text-base font-semibold text-gray-800">Total Amount</span><span className="text-sm sm:text-base font-bold text-gray-900">₹{(orderData.discountPercent > 0 ? orderData.payingAmount : (orderData.finalAmount || orderData.totalAmount) || 0).toLocaleString()}</span></div>
                    </div>
                </div>
            </div>
            {((orderData.paymentId || orderData.paymentDetails?.transactionId) || formattedAddress) && (
                <div className="border-t border-gray-100 mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 space-y-2">
                    {(orderData?.paymentId || orderData?.paymentDetails?.transactionId) && <InfoRow label="Transaction ID" value={orderData.paymentId || orderData.paymentDetails?.transactionId} className="break-all" />}
                    {formattedAddress && <InfoRow label="Shipping Address" value={formattedAddress} />}
                </div>
            )}
        </div>
    </div>
);

const ProductDetailModal = ({ isOpen, onClose, product }) => {
    const userId = useSelector(state => state.user.loggedUserDetails?._id);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productReviews, setProductReviews] = useState({});
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => { if (!isOpen) return; const handleEsc = (e) => e.key === 'Escape' && onClose(); document.addEventListener('keydown', handleEsc); return () => document.removeEventListener('keydown', handleEsc); }, [isOpen, onClose]);

    const fetchProductReviews = useCallback(async (productId) => {
        if (!userId || !productId) return;
        setLoadingReviews(true);
        try { const res = await getFilteredReviews({ userId, productId }); if (res.success) setProductReviews(prev => ({ ...prev, [productId]: res.data || [] })); } catch (err) { console.error('Error fetching reviews:', err); } finally { setLoadingReviews(false); }
    }, [userId]);

    const fetchOrderDetails = useCallback(async () => {
        setLoading(true); setError(null);
        try { const res = await getSingleProductOrder(product.orderId); if (res.success) { setOrderData(res.data); res.data?.items?.forEach(item => item.product?._id && userId && fetchProductReviews(item.product._id)); } else setError(res.message || 'Failed to fetch order details'); } catch (err) { console.error('Error:', err); setError('Failed to fetch order details'); } finally { setLoading(false); }
    }, [product?.orderId, userId, fetchProductReviews]);

    useEffect(() => { if (isOpen && product?.orderId) fetchOrderDetails(); }, [isOpen, product?.orderId, fetchOrderDetails]);

    const orderItems = orderData?.items || [];
    const totalItems = useMemo(() => orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0), [orderItems]);
    const formattedAddress = useMemo(() => formatAddress(orderData?.shippingAddress), [orderData?.shippingAddress]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 md:p-6 pt-16 sm:pt-20 md:pt-24" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)] overflow-y-auto">
                <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 relative sticky top-0 bg-white z-10">
                    <button onClick={onClose} className="absolute top-3 sm:top-4 right-3 sm:right-4 md:right-6 text-gray-500 hover:text-gray-700 transition-colors p-1"><FaTimes className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 pr-8 sm:pr-10 md:pr-12">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">Order Details</h2>
                        <button className="text-purple-800 px-2 sm:px-3 py-1.5 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium" style={{ backgroundColor: '#4200981A' }}>
                            <img src={downloadIcon} alt="Download" className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Download Invoice</span>
                            <span className="sm:hidden">Invoice</span>
                        </button>
                    </div>
                </div>
                <div className="px-3 sm:px-4 md:px-8 lg:px-20 py-3 sm:py-4 md:py-6">
                    {loading ? <Preloaders /> : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <p className="text-red-600">{error}</p>
                            <button onClick={fetchOrderDetails} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Retry</button>
                        </div>
                    ) : orderData && orderItems.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                            <OrderStatusBar currentStatus={orderData?.orderStatus} />
                            <OrderSummary orderData={orderData} totalItems={totalItems} formattedAddress={formattedAddress} />
                            <div>
                                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2.5 sm:mb-3">Products ({orderItems.length})</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {orderItems.map((item, idx) => <ProductItem key={item._id || idx} item={item} handleReviewSuccess={fetchProductReviews} reviews={productReviews[item.product?._id] || []} loadingReviews={loadingReviews} />)}
                                </div>
                            </div>
                        </div>
                    ) : <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center"><p className="text-gray-600">No order data available</p></div>}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;

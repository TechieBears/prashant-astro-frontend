import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Tabs from '../../../components/Common/Tabs';
import Pagination from '../../../components/Common/Pagination';
import OrderIdCopy from '../../../components/Common/OrderIdCopy';
import { getAllServiceOrders } from '../../../api';
import { FaClock, FaCalendarAlt, FaDesktop, FaVideo } from 'react-icons/fa';
import axios from 'axios';
import { environment } from '../../../env';
import { getServiceModeLabel } from '../../../utils/serviceConfig';
import ServiceDetailModal from '../../../components/Modals/ServiceDetailModal';
import ProductDetailModal from '../../../components/Modals/ProductDetailModal';
import Preloaders from '../../../components/Loader/Preloaders';
import ProductImage from '../../../components/Common/ProductImage';

const Orders = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [orders, setOrders] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const tabs = [
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
  ];

  const PAGINATION_CONFIG = {
    services: 4,
    products: 6
  };

  // Set active tab based on navigation state
  useEffect(() => {
    const navigationTab = location.state?.activeTab;
    if (navigationTab && (navigationTab === 'products' || navigationTab === 'services')) {
      setActiveTab(navigationTab);
    }
  }, [location.state]);

  // API functions
  const getAllProductOrders = async () => {
    try {
      const response = await axios.get(`${environment.baseUrl}product-order/public/get-all`);
      return response.data;
    } catch (err) {
      console.error('Error fetching product orders:', err);
      return { success: false, message: 'Failed to fetch product orders' };
    }
  };

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        setOrders([]);
        setServiceOrders([]);

        const [productResponse, serviceResponse] = await Promise.all([
          getAllProductOrders(),
          getAllServiceOrders()
        ]);

        if (productResponse.success) setOrders(productResponse.data || []);
        if (serviceResponse.success) setServiceOrders(serviceResponse.data || []);
        if (!productResponse.success && !serviceResponse.success) {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Utility functions
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

  const getServiceMode = (serviceType) => getServiceModeLabel(serviceType);

  // Data transformations - Keep orders grouped
  const productOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders.map(order => ({
      id: order._id || `order-${Date.now()}`,
      orderId: order._id || `order-${Date.now()}`,
      items: order.items?.map(item => ({
        _id: item._id,
        name: item.product?.name || 'Unknown Product',
        currentPrice: item.product?.sellingPrice || 0,
        mrp: item.product?.mrpPrice || 0,
        quantity: item.product?.quantity || 1,
        image: item.product?.images?.[0] || '/src/assets/user/products/amber-crystal.png',
        subtotal: item.product?.subtotal || 0
      })) || [],
      orderStatus: order.orderStatus || 'PENDING',
      paymentStatus: order.paymentStatus || 'PENDING',
      createdAt: order.createdAt || new Date().toISOString(),
      totalAmount: order.totalAmount || 0,
      finalAmount: order.finalAmount || 0,
      itemCount: order.items?.length || 0
    }));
  }, [orders]);

  const transformedServiceOrders = useMemo(() => {
    if (!Array.isArray(serviceOrders)) return [];

    const transformedOrders = [];
    serviceOrders.forEach(order => {
      if (order.services?.length) {
        const service = order.services[0];
        transformedOrders.push({
          id: order.orderId || `order-${Date.now()}`,
          serviceType: service.serviceName || 'Service',
          sessionDuration: `${service.durationInMinutes || 30} minutes`,
          date: formatDate(service.bookingDate),
          time: `${formatTime(service.startTime)} - ${formatTime(service.endTime)}`,
          mode: getServiceMode(service.serviceType),
          zoomLink: service.zoomLink || 'Meeting link will be provided',
          orderId: order.orderId || `order-${Date.now()}`,
          paymentStatus: order.paymentStatus || 'PENDING',
          totalAmount: order.totalAmount || 0,
          finalAmount: order.finalAmount || 0,
          createdAt: order.createdAt || new Date().toISOString(),
          astrologerName: service.astrologerName,
          bookingStatus: service.bookingStatus,
          astrologerStatus: service.astrologerStatus,
          serviceCount: order.services.length
        });
      }
    });
    return transformedOrders;
  }, [serviceOrders]);

  // Pagination logic
  const currentOrdersData = activeTab === 'services' ? transformedServiceOrders : productOrders;
  const itemsPerPage = PAGINATION_CONFIG[activeTab];
  const totalPages = Math.ceil(currentOrdersData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = currentOrdersData.slice(startIndex, startIndex + itemsPerPage);

  // Event handlers
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Modal handlers
  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  const handleProductClick = (order) => {
    // Pass the first item with orderId for modal
    setSelectedProduct({ ...order.items[0], orderId: order.orderId });
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  // Loading component
  const LoadingSpinner = () => <Preloaders />;

  // Error component
  const ErrorMessage = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p className="text-red-600">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = ({ message }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
      <p className="text-gray-600">{message}</p>
    </div>
  );

  // Product card component
  const ProductCard = ({ order }) => (
    <div
      className="bg-form-bg rounded-lg shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleProductClick(order)}
    >
      {/* Order Header */}
      <div className="bg-button-gradient-orange px-3 sm:px-4 py-2 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold text-xs sm:text-sm">Order</span>
            <OrderIdCopy
              orderId={order.orderId}
              displayLength={8}
              showHash={true}
              textClassName="text-white font-semibold text-xs sm:text-sm"
              iconClassName="text-white/80 hover:text-white"
            />
          </div>
          {order.itemCount > 1 && (
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
              {order.itemCount} Items
            </span>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
          order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
          {order.paymentStatus}
        </span>
      </div>

      {/* Products List */}
      <div className="p-3 sm:p-4 space-y-3">
        {order.items.map((item, index) => (
          <div key={item._id} className={`flex gap-3 sm:gap-4 ${index > 0 ? 'pt-3 border-t border-gray-200' : ''}`}>
            <div className="flex-shrink-0">
              <ProductImage
                images={item.image}
                name={item.name}
                containerClassName="w-16 h-16 sm:w-20 sm:h-20 bg-white flex items-center justify-center shadow-sm rounded"
                imgClassName="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded"
                fallbackClassName="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded"
                fallbackContent="Image"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="leading-tight">
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 leading-tight line-clamp-2">{item.name}</h4>
                <p className="text-sm sm:text-base font-bold text-gray-800 mb-1 leading-tight">₹{item.currentPrice?.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mb-1 leading-tight">
                  MRP <span className="line-through">₹{item.mrp?.toLocaleString()}</span>
                </p>
                <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs text-gray-600">
                  <span className="whitespace-nowrap">QTY: {item.quantity}</span>
                  {item.subtotal > 0 && <span className="font-medium whitespace-nowrap">Subtotal: ₹{item.subtotal?.toLocaleString()}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Footer */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="text-xs sm:text-sm">
          <span className="text-gray-600">Total Amount: </span>
          <span className="font-bold text-gray-900">₹{(order.finalAmount || order.totalAmount)?.toLocaleString()}</span>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${order.orderStatus === 'DELIVERED' || order.orderStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              order.orderStatus === 'SHIPPED' || order.orderStatus === 'DISPATCHED' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
          }`}>
          {order.orderStatus}
        </span>
      </div>
    </div>
  );

  // Service card component
  const ServiceCard = ({ service }) => (
    <div
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleServiceClick(service)}
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-4">
        <span className="text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap">Service Type:</span>
        <div className="flex items-center gap-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#FBBF24] via-[#FB923C] to-[#F43F5E] text-sm sm:text-base font-semibold break-words">
            {service.serviceType}
          </span>
          {service.serviceCount > 1 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              +{service.serviceCount - 1} more
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <FaClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-600">
            Session Duration: <span className="font-medium text-gray-800">{service.sessionDuration}</span>
          </span>
        </div>
        <div className="flex items-start gap-2">
          <FaCalendarAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-600">
            Date: <span className="font-medium text-gray-800">{service.date} / {service.time}</span>
          </span>
        </div>
        <div className="flex items-start gap-2">
          <FaDesktop className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-600">
            Mode: <span className="font-medium text-gray-800">{service.mode}</span>
          </span>
        </div>
        {service.mode === 'Online' && (
          <div className="flex items-start gap-2">
            <FaVideo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600 break-all">{service.zoomLink}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">Order ID:</span>
            <OrderIdCopy
              orderId={service.orderId}
              displayLength={8}
              showHash={false}
              textClassName="text-xs sm:text-sm text-gray-800"
            />
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
            service.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
            {service.paymentStatus || 'Unknown'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {service.astrologerStatus && (
            <span className={`px-2 py-1 rounded-full ${service.astrologerStatus === 'accepted' ? 'bg-blue-100 text-blue-800' :
              service.astrologerStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
              Astrologer: {service.astrologerStatus}
            </span>
          )}
          {service.bookingStatus && (
            <span className={`px-2 py-1 rounded-full ${service.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
              service.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
              Booking: {service.bookingStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white rounded-lg min-h-screen">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Orders</h1>
          <div className="flex justify-center lg:justify-end w-full lg:w-auto">
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} className="w-fit" />
          </div>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : (
        <>
          {activeTab === 'products' && (
            <>
              {productOrders.length === 0 ? (
                <EmptyState message="No product orders found." />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentOrders.map((order) => <ProductCard key={order.id} order={order} />)}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        maxVisiblePages={5}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'services' && (
            <>
              {transformedServiceOrders.length === 0 ? (
                <EmptyState message="No service orders found." />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentOrders.map((service) => <ServiceCard key={service.id} service={service} />)}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        maxVisiblePages={5}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Service Detail Modal */}
      <ServiceDetailModal
        isOpen={isServiceModalOpen}
        onClose={handleCloseServiceModal}
        service={selectedService}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Orders;
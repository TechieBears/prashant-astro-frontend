import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Tabs from '../../../components/Common/Tabs';
import Pagination from '../../../components/Common/Pagination';
import { getAllServiceOrders } from '../../../api';
import { FaClock, FaCalendarAlt, FaDesktop, FaVideo } from 'react-icons/fa';
import axios from 'axios';
import { environment } from '../../../env';
import { getServiceModeLabel } from '../../../utils/serviceConfig';

const Orders = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [orders, setOrders] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Data transformations
  const productOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    const transformedOrders = [];
    orders.forEach(order => {
      if (order.items?.length) {
        order.items.forEach(item => {
          transformedOrders.push({
            id: item._id || `item-${Date.now()}`,
            orderId: order._id || `order-${Date.now()}`,
            name: item.product?.name || 'Unknown Product',
            currentPrice: item.product?.sellingPrice || 0,
            mrp: item.product?.mrpPrice || 0,
            quantity: item.product?.quantity || 1,
            image: item.product?.images?.[0] || '/src/assets/user/products/amber-crystal.png',
            orderStatus: order.orderStatus || 'PENDING',
            paymentStatus: order.paymentStatus || 'PENDING',
            createdAt: order.createdAt || new Date().toISOString(),
            totalAmount: order.totalAmount || 0,
            finalAmount: order.finalAmount || 0
          });
        });
      }
    });
    return transformedOrders;
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

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

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
  const ProductCard = ({ product }) => (
    <div className="bg-form-bg rounded-lg p-4 shadow-sm border border-gray-300">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-white flex items-center justify-center shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-500 text-xs" style={{ display: 'none' }}>
              Image
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="leading-tight">
            <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{product.name}</h3>
            <p className="text-lg font-bold text-gray-800 mb-1 leading-tight">₹{product.currentPrice}</p>
            <p className="text-sm text-gray-600 mb-1 leading-tight">
              MRP <span className="line-through">₹{product.mrp}</span> (incl. of all taxes)
            </p>
            <p className="text-sm text-gray-600 leading-tight">QTY : {product.quantity}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Service card component
  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
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
          <span className="text-gray-600">Order ID: {service.orderId?.slice(-8) || 'N/A'}</span>
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
    <div className="p-4 bg-white rounded-lg min-h-screen">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <div className="hidden lg:block">
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} className="w-fit" />
          </div>
          <div className="lg:hidden">
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} className="w-full" />
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
                    {currentOrders.map((product) => <ProductCard key={product.id} product={product} />)}
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
    </div>
  );
};

export default Orders;
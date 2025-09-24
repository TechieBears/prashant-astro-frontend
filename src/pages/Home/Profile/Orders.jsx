import React, { useState, useEffect } from 'react';
import Tabs from '../../../components/Common/Tabs';
import Pagination from '../../../components/Common/Pagination';
import { getAllProductOrders } from '../../../api';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const tabs = [
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
  ];

  // Fetch orders data from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllProductOrders();

        if (response.success) {
          setOrders(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch orders');
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

  // Transform API data to match UI structure
  const transformOrdersData = (ordersData) => {
    const transformedOrders = [];

    ordersData.forEach(order => {
      order.items.forEach(item => {
        transformedOrders.push({
          id: item._id,
          orderId: order._id,
          name: item.product.name,
          currentPrice: item.product.sellingPrice,
          mrp: item.product.mrpPrice,
          quantity: item.product.quantity,
          image: item.product.images?.[0] || '/src/assets/user/products/amber-crystal.png',
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          totalAmount: order.totalAmount,
          finalAmount: order.finalAmount
        });
      });
    });

    return transformedOrders;
  };

  const productOrders = transformOrdersData(orders);

  // Pagination logic
  const totalPages = Math.ceil(productOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = productOrders.slice(startIndex, endIndex);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset to first page when switching tabs
    // You can add logic here to fetch orders based on the selected category
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg min-h-screen">
      <div className="mb-8">
        {/* Header with title and tabs in same row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>

          {/* Desktop Tabs */}
          <div className="hidden lg:block">
            <Tabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tabs={tabs}
              className="w-fit"
            />
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <Tabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tabs={tabs}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Product Orders Grid */}
      {activeTab === 'products' && (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : productOrders.length === 0 ? (
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <p className="text-gray-600">No product orders found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentOrders.map((product) => (
                  <div key={product.id} className="bg-form-bg rounded-lg p-4 shadow-sm border border-gray-300">
                    <div className="flex gap-4">
                      {/* Product Image */}
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

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="leading-tight">
                          <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{product.name}</h3>
                          <p className="text-lg font-bold text-gray-800 mb-1 leading-tight">₹{product.currentPrice}</p>
                          <p className="text-sm text-gray-600 mb-1 leading-tight">
                            MRP <span className="line-through">₹{product.mrp}</span> (incl. of all taxes)
                          </p>
                          <p className="text-sm text-gray-600 leading-tight">QTY : {product.quantity}</p>
                        </div>

                        {/* Status badges on the right */}
                        {/* <div className="mt-2 flex gap-2 justify-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          product.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                            product.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                          }`}>
                          {product.orderStatus}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                          }`}>
                          {product.paymentStatus}
                        </span>
                      </div> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
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
            </>
          )}
        </>
      )}

      {/* Services content - placeholder for when services tab is selected */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Services</h2>
          <p>No services found in your orders.</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
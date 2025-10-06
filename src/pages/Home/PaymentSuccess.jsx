import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductSuccessSection from '../../components/Success/ProductSuccessSection';
import ServiceSuccessSection from '../../components/Success/ServiceSuccessSection';
import { transformProductOrderData, transformServiceOrderData } from '../../utils/orderUtils';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get order data from navigation state (passed from checkout pages)
  const { orderData, orderType } = location.state || {};

  // Transform data based on order type
  const getProductData = () => {
    if (orderType === 'products' && orderData) {
      return transformProductOrderData(orderData);
    }
    return null;
  };

  const getServiceData = () => {
    if (orderType === 'services' && orderData) {
      const transformed = transformServiceOrderData(orderData);
      return transformed;
    }
    return null;
  };

  const handleProductViewDetails = () => {
    navigate('/profile/orders', { state: { activeTab: 'products' } });
  };

  const handleServiceViewDetails = () => {
    navigate('/profile/orders', { state: { activeTab: 'services' } });
  };

  const transformedProductData = getProductData();
  const transformedServiceData = getServiceData();

  // Show error if no order data is available
  if (!orderType || (!transformedProductData && !transformedServiceData)) {
    return (
      <div className="bg-[#FFF7F0] flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-16 lg:pt-20 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full max-w-xl text-center">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">No Order Data Found</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Unable to display order details. Please try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-center">
            <button
              onClick={() => navigate('/cart')}
              className="bg-button-diagonal-gradient-orange text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-[0.2rem] font-medium hover:opacity-90 transition text-sm sm:text-base"
            >
              Go to Cart
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-[0.2rem] font-medium hover:opacity-90 transition text-sm sm:text-base"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF7F0] flex flex-col items-center pt-20 sm:pt-24 md:pt-16 lg:pt-20 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8">
      {/* Product Success Section - Only show for product orders */}
      {orderType === 'products' && transformedProductData && (
        <div className="w-full max-w-4xl flex justify-center">
          <ProductSuccessSection
            orderItems={transformedProductData.orderItems}
            subtotal={transformedProductData.subtotal}
            totalDiscount={transformedProductData.totalDiscount}
            total={transformedProductData.total}
            onViewDetails={handleProductViewDetails}
          />
        </div>
      )}

      {/* Service Success Section - Only show for service orders */}
      {orderType === 'services' && transformedServiceData && (
        <div className="w-full max-w-4xl flex justify-center">
          <ServiceSuccessSection
            services={transformedServiceData.services}
            orderId={transformedServiceData.orderId}
            totalAmount={transformedServiceData.totalAmount}
            onViewDetails={handleServiceViewDetails}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;

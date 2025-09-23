import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductSuccessSection from '../../components/Success/ProductSuccessSection';
import ServiceSuccessSection from '../../components/Success/ServiceSuccessSection';
import { clearCurrentOrder } from '../../redux/Slices/orderSlice';
import { transformProductOrderData } from '../../utils/orderUtils';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { currentOrder, orderType, serviceBooking, error } = useSelector(state => state.order);

  // Transform data based on order type
  const getProductData = () => {
    if (orderType === 'products' && currentOrder) {
      return transformProductOrderData(currentOrder);
    }
    return null;
  };

  const getServiceData = () => {
    if (orderType === 'services' && serviceBooking) {
      return serviceBooking;
    }
    return null;
  };

  // Clear order data when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      // Optional: Clear order data after a delay to allow for navigation
      // dispatch(clearCurrentOrder());
    };
  }, [dispatch]);

  // Event handlers
  const handleProductViewDetails = () => {
    console.log('View product order details');
    // TODO: Navigate to order details page
  };

  const handleServiceViewDetails = () => {
    console.log('View service booking details');
    // TODO: Navigate to service booking details page
  };

  const transformedProductData = getProductData();
  const transformedServiceData = getServiceData();

  // Debug logging
  console.log('PaymentSuccess - Order Type:', orderType);
  console.log('PaymentSuccess - Product Data:', transformedProductData);
  console.log('PaymentSuccess - Service Data:', transformedServiceData);
  console.log('PaymentSuccess - Redux State:', { currentOrder, orderType, serviceBooking, error });

  // Show error if no order data is available
  if (!orderType || (!transformedProductData && !transformedServiceData)) {
    return (
      <div className="min-h-[80vh] bg-[#FFF7F0] flex flex-col items-center justify-center pt-4 md:pt-6 lg:pt-10 pb-10 px-4">
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-xl text-center">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">No Order Data Found</h1>
          <p className="text-gray-600 mb-4">
            {error ? error : 'Unable to display order details. Please try again.'}
          </p>
          <div className="space-x-2">
            <button
              onClick={() => navigate('/cart')}
              className="bg-button-diagonal-gradient-orange text-white py-3 px-6 rounded-[0.2rem] font-medium hover:opacity-90 transition"
            >
              Go to Cart
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-500 text-white py-3 px-6 rounded-[0.2rem] font-medium hover:opacity-90 transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#FFF7F0] flex flex-col items-center pt-4 md:pt-6 lg:pt-10 pb-10 px-4 space-y-8">
      {/* Product Success Section - Only show for product orders */}
      {orderType === 'products' && transformedProductData && (
        <div className="w-full flex justify-center">
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
        <div className="w-full flex justify-center">
          <ServiceSuccessSection
            serviceType={transformedServiceData.serviceType}
            sessionDuration={transformedServiceData.sessionDuration}
            date={transformedServiceData.date}
            time={transformedServiceData.time}
            mode={transformedServiceData.mode}
            zoomLink={transformedServiceData.zoomLink}
            orderId={transformedServiceData.orderId}
            onViewDetails={handleServiceViewDetails}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;

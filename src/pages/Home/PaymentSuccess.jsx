import React from "react";
import img1 from '../../assets/user/products/productImages (1).png';
import img2 from '../../assets/user/products/productImages (2).png';
import ProductSuccessSection from '../../components/Success/ProductSuccessSection';
import ServiceSuccessSection from '../../components/Success/ServiceSuccessSection';

const PaymentSuccess = () => {

  // Mock data for products
  const productData = {
    orderItems: [
      {
        id: 'P4000',
        title: 'Rudraksha',
        price: 3520,
        oldPrice: 4000,
        image: img1,
        quantity: 1
      },
      {
        id: 'P4001',
        title: 'James stone',
        price: 3520,
        oldPrice: 4000,
        image: img2,
        quantity: 1
      }
    ],
    subtotal: 7040,
    totalDiscount: 960,
    total: 7040
  };

  // Mock data for services
  const serviceData = {
    serviceType: "Palmistry",
    sessionDuration: "30-60 minutes",
    date: "15th Sep, 2025",
    time: "12:00PM - 01:00PM",
    mode: "In-person / Online",
    zoomLink: "zoommtg://zoom.us/join?confno=8529015944&pwd=123456&uname=John%20Doe",
    orderId: "SRV-1234567890"
  };

  // Event handlers
  const handleProductViewDetails = () => {
    console.log('View product order details');
  };

  const handleServiceViewDetails = () => {
    console.log('View service booking details');
  };

  const showProductSuccess = true;
  const showServiceSuccess = true;

  return (
    <div className="min-h-[80vh] bg-[#FFF7F0] flex flex-col items-center pt-4 md:pt-6 lg:pt-10 pb-10 px-4 space-y-8">
      {/* Product Success Section */}
      {showProductSuccess && (
        <div className="w-full flex justify-center">
          <ProductSuccessSection
            orderItems={productData.orderItems}
            subtotal={productData.subtotal}
            totalDiscount={productData.totalDiscount}
            total={productData.total}
            onViewDetails={handleProductViewDetails}
          />
        </div>
      )}

      {/* Service Success Section */}
      {showServiceSuccess && (
        <div className="w-full flex justify-center">
          <ServiceSuccessSection
            serviceType={serviceData.serviceType}
            sessionDuration={serviceData.sessionDuration}
            date={serviceData.date}
            time={serviceData.time}
            mode={serviceData.mode}
            zoomLink={serviceData.zoomLink}
            orderId={serviceData.orderId}
            onViewDetails={handleServiceViewDetails}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;

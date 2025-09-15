import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import img1 from '../../assets/user/products/productImages (1).png';
import img2 from '../../assets/user/products/productImages (2).png';

const PaymentSuccess = () => {
  const orderItems = [
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
  ];

  // Calculate total
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = orderItems.reduce((sum, item) => sum + ((item.oldPrice - item.price) * item.quantity), 0);
  const total = subtotal;

  return (
    <div className="min-h-[80vh] bg-[#FFF7F0] flex items-start py-10 justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <FaCheckCircle className="text-green-500 text-2xl" />
          <h1 className="text-lg font-semibold text-gray-800">
            Booking Confirmed
          </h1>
        </div>
        {/* Order Items */}
        <div className="space-y-4 mb-6">
          {orderItems.map((item) => (
            <div key={item.id} className="flex items-center bg-light-pg rounded-lg p-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-sm font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="bg-gradient-orange bg-clip-text text-transparent text-red-500 font-bold text-sm">₹{item.price.toLocaleString()}</p>
                <p className="text-xs text-black">
                  MRP <span className="line-through">₹{item.oldPrice.toLocaleString()}</span> (incl. of all taxes)
                </p>
              </div>
              <span className="text-sm text-black">QTY: {item.quantity}</span>
            </div>
          ))}

          {/* Order Summary */}
          {/* <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2 text-green-600">
              <span>Discount:</span>
              <span>-₹{totalDiscount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200 mt-2">
              <span>Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div> */}
        </div>

        {/* Button */}
        <button className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition">
          View Order Details
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';

// Import product images
import product1 from '../../assets/user/products/productImages (1).png';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([
        {
            id: 'P4000',
            name: 'Sacred Rudraksha Bead',
            price: 3520,
            mrp: 4000,
            quantity: 1,
            image: product1,
            gst: 18
        },
        {
            id: 'P4001',
            name: 'Sacred Rudraksha Bead',
            price: 3520,
            mrp: 4000,
            quantity: 1,
            image: product1,
            gst: 18
        }
    ]);

    const updateQuantity = (id, increment) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateGST = () => {
        return cartItems.reduce((total, item) => {
            const itemTotal = item.price * item.quantity;
            return total + (itemTotal * item.gst / 100);
        }, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateGST();
    };

    const subtotal = calculateSubtotal();
    const gstAmount = calculateGST();
    const total = calculateTotal();

    return (
        <div className="min-h-screen bg-slate1">
            {/* Header Section with Background */}
            <BackgroundTitle
                title="Cart"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Products", href: "/products" },
                    { label: "Rudraksha", href: null }
                ]}
                backgroundImage={bannerImage}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />

            {/* Main Content */}
            <div className="container mx-auto px-8 max-w-7xl py-8">
                {/* Navigation Bar */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <BsArrowLeft className="mr-2" />
                        Go Back
                    </button>

                    <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                        <button className="px-6 py-2 text-gray-600 rounded-full hover:bg-gray-50 transition-colors">
                            Services
                        </button>
                        <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:opacity-90 transition-opacity">
                            Products
                        </button>
                    </div>
                </div>

                {/* Cart Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-gray-50 rounded-lg p-6 flex items-center space-x-4">
                                {/* Product Image */}
                                <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-orange-500 font-bold text-lg">
                                            ₹{item.price.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 text-sm line-through">
                                            MRP ₹{item.mrp.toLocaleString()} (incl. of all taxes)
                                        </span>
                                    </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600 font-medium">QTY</span>
                                    <div className="flex items-center border border-gray-200 rounded-md">
                                        <button
                                            onClick={() => updateQuantity(item.id, false)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <FaMinus className="w-3 h-3 text-gray-600" />
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            readOnly
                                            className="w-12 text-center border-0 focus:ring-0 bg-transparent"
                                        />
                                        <button
                                            onClick={() => updateQuantity(item.id, true)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <FaPlus className="w-3 h-3 text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Amount Payable Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                            <h3 className="font-bold text-gray-900 text-lg mb-4">
                                Amount Payable
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Product {cartItems.reduce((total, item) => total + item.quantity, 0)}x (inclu. GST)
                                    </span>
                                    <span className="font-medium">
                                        ₹ {subtotal.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        GST (18%)
                                    </span>
                                    <span className="font-medium">
                                        ₹ {gstAmount.toFixed(1)}
                                    </span>
                                </div>

                                <hr className="border-gray-200" />

                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        ₹ {total.toFixed(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Continue to Pay Button */}
                            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-md font-medium hover:opacity-90 transition-opacity shadow-md">
                                Continue to pay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

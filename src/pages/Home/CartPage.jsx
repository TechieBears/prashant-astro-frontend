import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt, FaMinus, FaPlus } from 'react-icons/fa';
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
                {/* Navigation Bar with Centered Title */}
                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute left-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <BsArrowLeft className="mr-2" />
                            Go Back
                        </button>
                    </div>
                    
                    <h1 className="text-2xl font-normal text-gray-900">Cart</h1>
                    
                    <div className="absolute right-0">
                        <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                            <button className="px-6 py-2 text-gray-600 rounded-full hover:bg-gray-50 transition-colors">
                                Services
                            </button>
                            <button className="px-6 py-2 bg-button-gradient-orange text-white rounded-full hover:opacity-90 transition-opacity">
                                Products
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cart Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-lg">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-7 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-light-pg rounded-lg p-4 flex items-start space-x-4 relative">
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
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 pr-6">
                                        {item.name}
                                    </h3>
                                    <div className="space-y-1">
                                        <div className="font-bold text-lg bg-gradient-orange bg-clip-text text-transparent">
                                            ₹{item.price.toLocaleString()}
                                        </div>
                                        <div className="text-black text-sm">
                                            <span>MRP <span className="line-through">₹{item.mrp.toLocaleString()}</span></span>
                                            <span className="ml-1">(incl. of all taxes)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Controls */}
                                <div className="flex flex-col items-end space-y-2">
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors self-end"
                                    >
                                        <FaRegTrashAlt className="w-4 h-4" />
                                    </button>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600 font-medium">QTY:</span>

                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min={1}
                                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                            className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 
                                            [appearance:textfield] 
                                            [&::-webkit-outer-spin-button]:appearance-auto 
                                            [&::-webkit-inner-spin-button]:appearance-auto"
                                        />
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Amount Payable Section */}
                    <div className="lg:col-span-5">
                        <div className="rounded-lg sticky top-8">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                                Amount Payable
                            </h3>

                            <div className="space-y-3 mb-6 bg-light-pg p-4 rounded-lg">
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

                                <div className="border-t border-separator my-2"></div>

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
                            <button className="w-full bg-button-diagonal-gradient-orange text-white py-3 px-6 rounded-sm font-medium hover:opacity-90 transition-opacity shadow-md">
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

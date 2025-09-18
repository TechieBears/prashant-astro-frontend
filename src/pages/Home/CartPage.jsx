import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import { getCartItems, updateCartItem, removeCartItem } from '../../api';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                const response = await getCartItems();
                if (response.success) {
                    setCartItems(response.data.items || []);
                } else {
                    setError(response.message || 'Failed to load cart items');
                }
            } catch (err) {
                console.error('Error fetching cart items:', err);
                setError('An error occurred while fetching your cart');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const updateQuantity = async (id, newQuantity) => {
        const quantity = Math.max(1, newQuantity);

        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === id
                    ? { ...item, quantity, totalPrice: (item.totalPrice / item.quantity) * quantity }
                    : item
            )
        );

        try {
            const response = await updateCartItem(id, quantity);
            if (!response.success) {
                throw new Error(response.message);
            }
            setCartItems(response.data.items);
        } catch (err) {
            console.error('Error updating quantity:', err);
            const response = await getCartItems();
            if (response.success) {
                setCartItems(response.data.items || []);
            }
        }
    };

    const removeItem = async (id) => {
        const previousItems = [...cartItems];

        // Optimistic update
        setCartItems(prevItems => prevItems.filter(item => item._id !== id));

        try {
            const response = await removeCartItem(id);
            if (!response.success) {
                throw new Error(response.message);
            }
            // Update with server response to ensure sync
            setCartItems(response.data.items);
        } catch (err) {
            console.error('Error removing item:', err);
            // Revert on error
            setCartItems(previousItems);
            // TODO: Show error toast to user
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.totalPrice, 0);
    };

    const calculateGST = () => {
        // Assuming 18% GST for all items
        return calculateSubtotal() * 0.18;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateGST();
    };

    const subtotal = calculateSubtotal();
    const gstAmount = calculateGST();
    const total = calculateTotal();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate1 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate1 flex items-center justify-center">
                <div className="text-center p-6 max-w-md mx-4 bg-white rounded-lg shadow">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading cart</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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
            <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8">
                {/* Navigation Bar with Centered Title */}
                <div className="relative flex items-center justify-center mb-6 md:mb-8">
                    <div className="absolute left-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
                        >
                            <BsArrowLeft className="mr-1 md:mr-2" />
                            <span className="hidden sm:inline">Go Back</span>
                            <span className="sm:hidden">Back</span>
                        </button>
                    </div>

                    <h1 className="text-xl md:text-2xl font-normal text-gray-900">Cart</h1>

                    {/* Desktop Tabs */}
                    <div className="absolute right-0 hidden lg:block">
                        <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                            <button className="px-6 py-2 text-gray-600 rounded-full hover:bg-gray-50 transition-colors text-sm">
                                Services
                            </button>
                            <button className="px-6 py-2 bg-button-gradient-orange text-white rounded-full hover:opacity-90 transition-opacity text-sm">
                                Products
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Tabs - Above Cart Summary */}
                <div className="lg:hidden mb-4">
                    <div className="flex justify-center">
                        <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                            <button className="px-6 py-2 text-gray-600 rounded-full hover:bg-gray-50 transition-colors text-sm">
                                Services
                            </button>
                            <button className="px-6 py-2 bg-button-gradient-orange text-white rounded-full hover:opacity-90 transition-opacity text-sm">
                                Products
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cart Content */}
                <div className="bg-white p-4 md:p-6 rounded-lg">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                            <button
                                onClick={() => navigate('/products')}
                                className="px-6 py-2 bg-button-gradient-orange text-white rounded-md hover:opacity-90 transition-opacity"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                            {/* Cart Items Section */}
                            <div className="lg:col-span-7 space-y-3 md:space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="bg-light-pg rounded-lg p-3 md:p-4 flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 relative">
                                        {/* Product Image */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1 sm:pr-6">
                                                {item.name}
                                            </h3>
                                            <div className="space-y-1">
                                                <div className="font-bold text-base md:text-lg bg-gradient-orange bg-clip-text text-transparent">
                                                    ₹{item.totalPrice.toLocaleString()}
                                                </div>
                                                <div className="text-black text-xs md:text-sm">
                                                    <span>Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side Controls */}
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start space-x-4 sm:space-x-0 sm:space-y-2">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs md:text-sm text-gray-600 font-medium">QTY:</span>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    min={1}
                                                    onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                                                    onBlur={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (!value || value < 1) {
                                                            updateQuantity(item._id, 1);
                                                        }
                                                    }}
                                                    className="w-12 md:w-16 border border-gray-300 rounded-md px-1 md:px-2 py-1 text-center text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm md:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:appearance-auto"
                                                />
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => removeItem(item._id)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <FaRegTrashAlt className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Amount Payable Section */}
                            <div className="lg:col-span-5">
                                <div className="rounded-lg lg:sticky lg:top-8">
                                    <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2">
                                        Amount Payable
                                    </h3>

                                    <div className="space-y-3 mb-4 md:mb-6 bg-light-pg p-3 md:p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm md:text-base">
                                                Product {cartItems.reduce((total, item) => total + item.quantity, 0)}x (inclu. GST)
                                            </span>
                                            <span className="font-medium text-sm md:text-base">
                                                ₹ {subtotal.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm md:text-base">
                                                GST (18%)
                                            </span>
                                            <span className="font-medium text-sm md:text-base">
                                                ₹ {gstAmount.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="border-t border-separator my-2"></div>

                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-900 text-base md:text-lg">
                                                Total
                                            </span>
                                            <span className="font-bold text-gray-900 text-base md:text-lg">
                                                ₹ {total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Continue to Pay Button */}
                                    <button className="w-full bg-button-diagonal-gradient-orange text-white py-2.5 md:py-3 px-4 md:px-6 rounded-sm font-medium hover:opacity-90 transition-opacity shadow-md text-sm md:text-base">
                                        Continue to pay
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;
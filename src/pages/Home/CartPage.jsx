import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import { getCartItems, updateCartItem, removeCartItem, getServiceCartItems, removeServiceCartItem } from '../../api';
import ServicesSection from '../../components/Cart/ServicesSection';
import ProductsSection from '../../components/Cart/ProductsSection';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [serviceCartItems, setServiceCartItems] = useState([]);
    const [activeTab, setActiveTab] = useState('services'); // 'services' or 'products'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRemoving, setIsRemoving] = useState(null);

    // Memoized data transformation for services
    const transformedServices = useMemo(() => {
        return serviceCartItems.map(service => ({
            id: service._id,
            type: service.name,
            duration: 'To be scheduled',
            date: 'Date and time will be confirmed',
            mode: 'Online',
            price: service.originalPrice,
            quantity: service.quantity,
            totalPrice: service.totalPrice
        }));
    }, [serviceCartItems]);

    // Memoized fetch cart data function
    const fetchCartData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch product cart items
            const [productsResponse, servicesResponse] = await Promise.all([
                getCartItems(),
                getServiceCartItems()
            ]);

            if (productsResponse.success) {
                setCartItems(productsResponse.data.items || []);
            } else {
                console.error('Failed to load product cart items:', productsResponse.message);
            }

            if (servicesResponse.success) {
                setServiceCartItems(servicesResponse.data.items || []);
            } else {
                console.error('Failed to load service cart items:', servicesResponse.message);
            }
        } catch (err) {
            console.error('Error fetching cart data:', err);
            setError('An error occurred while fetching your cart');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCartData();
    }, [fetchCartData]);

    // Optimized update quantity with loading state
    const updateQuantity = useCallback(async (id, newQuantity) => {
        const quantity = Math.max(1, newQuantity);
        setIsUpdating(true);

        // Store previous state for rollback
        const previousItems = [...cartItems];

        // Optimistic update
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
            // Only update if the response has different data
            if (JSON.stringify(response.data.items) !== JSON.stringify(cartItems)) {
                setCartItems(response.data.items);
            }
        } catch (err) {
            console.error('Error updating quantity:', err);
            // Revert optimistic update
            setCartItems(previousItems);
            // Refetch to ensure sync
            const response = await getCartItems();
            if (response.success) {
                setCartItems(response.data.items || []);
            }
        } finally {
            setIsUpdating(false);
        }
    }, [cartItems]);

    // Optimized remove item with loading state
    const removeItem = useCallback(async (id) => {
        setIsRemoving(id);
        const previousItems = [...cartItems];

        // Optimistic update
        setCartItems(prevItems => prevItems.filter(item => item._id !== id));

        try {
            const response = await removeCartItem(id);
            if (!response.success) {
                throw new Error(response.message);
            }
            setCartItems(response.data.items);
        } catch (err) {
            console.error('Error removing item:', err);
            // Revert optimistic update
            setCartItems(previousItems);
        } finally {
            setIsRemoving(null);
        }
    }, [cartItems]);

    // Optimized remove service item with loading state
    const removeServiceItem = useCallback(async (id) => {
        setIsRemoving(id);
        const previousServices = [...serviceCartItems];

        // Optimistic update
        setServiceCartItems(prevItems => prevItems.filter(item => item._id !== id));

        try {
            const response = await removeServiceCartItem(id);
            if (!response.success) {
                throw new Error(response.message);
            }
            // Update with server response to ensure sync
            const servicesResponse = await getServiceCartItems();
            if (servicesResponse.success) {
                setServiceCartItems(servicesResponse.data.items || []);
            }
        } catch (err) {
            console.error('Error removing service item:', err);
            // Revert on error
            setServiceCartItems(previousServices);
        } finally {
            setIsRemoving(null);
        }
    }, [serviceCartItems]);

    // Memoized calculations for products
    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.totalPrice, 0);
    }, [cartItems]);

    const gstAmount = useMemo(() => {
        return subtotal * 0.18;
    }, [subtotal]);

    const total = useMemo(() => {
        return subtotal + gstAmount;
    }, [subtotal, gstAmount]);

    // Memoized calculations for services
    const serviceCalculations = useMemo(() => {
        const serviceSubtotal = serviceCartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const serviceGST = serviceSubtotal * 0.18;
        const serviceTotal = serviceSubtotal + serviceGST;

        return {
            subtotal: serviceSubtotal,
            gstAmount: serviceGST,
            total: serviceTotal
        };
    }, [serviceCartItems]);

    // Memoized tab handler
    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    // Memoized checkout handlers
    const handleServicesCheckout = useCallback(() => {
        console.log('Proceeding to checkout from services section');
        // TODO: Implement payment gateway integration
        // After successful payment, navigate to success page
        navigate('/payment-success', {
            state: {
                orderType: 'services', // This will be used by API response logic
                serviceData: {
                    serviceType: transformedServices[0]?.type || "Service",
                    sessionDuration: "30-60 minutes",
                    date: "15th Sep, 2025",
                    time: "12:00PM - 01:00PM",
                    mode: "In-person / Online",
                    zoomLink: "zoommtg://zoom.us/join?confno=8529015944&pwd=123456&uname=John%20Doe",
                    orderId: `SRV-${Date.now()}`
                }
            }
        });
    }, [navigate, transformedServices]);

    const handleProductsCheckout = useCallback(() => {
        console.log('Proceeding to checkout');
        // TODO: Implement payment gateway integration
        // After successful payment, navigate to success page
        navigate('/payment-success', {
            state: {
                orderType: 'products', // This will be used by API response logic
                productData: {
                    items: cartItems,
                    total: total,
                    orderId: `PRD-${Date.now()}`
                }
            }
        });
    }, [navigate, cartItems, total]);


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
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-12 md:py-14">
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
                            <button
                                className={`px-6 py-2 rounded-full transition-colors text-sm ${activeTab === 'services'
                                    ? 'bg-button-gradient-orange text-white hover:opacity-90'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => handleTabChange('services')}
                            >
                                Services
                            </button>
                            <button
                                className={`px-6 py-2 rounded-full transition-colors text-sm ${activeTab === 'products'
                                    ? 'bg-button-gradient-orange text-white hover:opacity-90'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => handleTabChange('products')}
                            >
                                Products
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Tabs - Above Cart Summary */}
                <div className="lg:hidden mb-6">
                    <div className="flex justify-center">
                        <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                            <button
                                className={`px-6 py-2 rounded-full text-sm ${activeTab === 'services'
                                    ? 'bg-button-gradient-orange text-white hover:opacity-90'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => handleTabChange('services')}
                            >
                                Services
                            </button>
                            <button
                                className={`px-6 py-2 rounded-full text-sm ${activeTab === 'products'
                                    ? 'bg-button-gradient-orange text-white hover:opacity-90'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => handleTabChange('products')}
                            >
                                Products
                            </button>
                        </div>
                    </div>
                </div>

                {activeTab === 'services' ? (
                    /* Services Section with Payment Summary */
                    serviceCartItems.length > 0 ? (
                        <ServicesSection
                            services={transformedServices}
                            onRemoveService={removeServiceItem}
                            onCheckout={handleServicesCheckout}
                            subtotal={serviceCalculations.subtotal}
                            gstAmount={serviceCalculations.gstAmount}
                            total={serviceCalculations.total}
                            isRemoving={isRemoving}
                        />
                    ) : (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Services in Cart</h3>
                            <p className="text-gray-500">Add services to see them here</p>
                        </div>
                    )
                ) : (
                    /* Products Section with Payment Summary */
                    <ProductsSection
                        cartItems={cartItems}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeItem}
                        onCheckout={handleProductsCheckout}
                        subtotal={subtotal}
                        gstAmount={gstAmount}
                        total={total}
                        isUpdating={isUpdating}
                        isRemoving={isRemoving}
                    />
                )}
            </div>
        </div>
    );
};

export default CartPage;
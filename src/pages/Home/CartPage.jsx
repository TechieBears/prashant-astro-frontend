import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import ServicesSection from '../../components/Cart/ServicesSection';
import ProductsSection from '../../components/Cart/ProductsSection';
import { createOrder, setServiceBooking, clearError as clearOrderError } from '../../redux/Slices/orderSlice';
import { createOrderData } from '../../utils/orderUtils';
import {
    fetchCartData,
    updateProductQuantity,
    removeProductItem,
    removeServiceItem,
    clearError as clearCartError,
    selectProductCalculations,
    selectServiceCalculations,
    selectCartLoadingStates,
    selectCartErrors,
    optimisticUpdateQuantity,
    optimisticRemoveItem
} from '../../redux/Slices/cartSlice';
import { useAddress } from '../../context/AddressContext';
import { transformServiceData } from '../../utils/orderUtils';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const { isCreatingOrder, error: orderError } = useSelector(state => state.order);
    const {
        productItems: cartItems,
        serviceItems: serviceCartItems
    } = useSelector(state => state.cart);

    // Optimized selectors
    const productCalculations = useSelector(selectProductCalculations);
    const serviceCalculations = useSelector(selectServiceCalculations);
    const { isLoading, isUpdatingQuantity, isRemovingItem } = useSelector(selectCartLoadingStates);
    const { error: cartError } = useSelector(selectCartErrors);

    // Local state
    const [activeTab, setActiveTab] = useState('services'); // 'services' or 'products'
    const [localQuantities, setLocalQuantities] = useState({});

    // Refs for debouncing
    const debounceTimeouts = useRef({});

    const { defaultAddress } = useAddress();

    // Use utility function for service transformation
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

    // Fetch cart data on component mount
    useEffect(() => {
        dispatch(fetchCartData());
    }, [dispatch]);

    // Debounced API update function
    const debouncedApiUpdate = useCallback(async (id, quantity) => {
        try {
            await dispatch(updateProductQuantity({ id, quantity })).unwrap();
        } catch (err) {
            toast.error('Failed to update quantity');
            // Revert local state on error
            const originalItem = cartItems.find(item => item._id === id);
            if (originalItem) {
                setLocalQuantities(prev => ({
                    ...prev,
                    [id]: originalItem.quantity
                }));
            }
        }
    }, [dispatch, cartItems]);

    // Optimized quantity update with debouncing
    const updateQuantity = useCallback((id, newQuantity) => {
        const quantity = Math.max(1, newQuantity);

        // Immediate local state update for instant UI feedback
        setLocalQuantities(prev => ({
            ...prev,
            [id]: quantity
        }));

        // Clear existing timeout for this item
        if (debounceTimeouts.current[id]) {
            clearTimeout(debounceTimeouts.current[id]);
        }

        // Set new timeout for API call (debounced)
        debounceTimeouts.current[id] = setTimeout(() => {
            debouncedApiUpdate(id, quantity);
        }, 500);
    }, [debouncedApiUpdate]);

    // Sync local quantities with Redux state when cart data changes
    useEffect(() => {
        const newLocalQuantities = {};
        cartItems.forEach(item => {
            newLocalQuantities[item._id] = item.quantity;
        });
        setLocalQuantities(newLocalQuantities);
    }, [cartItems]);

    // Cleanup debounce timeouts on unmount
    useEffect(() => {
        return () => {
            Object.values(debounceTimeouts.current).forEach(timeout => {
                if (timeout) clearTimeout(timeout);
            });
        };
    }, []);

    // Remove item using Redux with optimistic updates
    const removeItem = useCallback(async (id) => {
        // Optimistic update for immediate UI feedback
        dispatch(optimisticRemoveItem(id));

        try {
            await dispatch(removeProductItem(id)).unwrap();
            toast.success('Item removed from cart');
        } catch (err) {
            toast.error('Failed to remove item');
        }
    }, [dispatch]);

    // Remove service item using Redux
    const removeServiceItem = useCallback(async (id) => {
        try {
            await dispatch(removeServiceItem(id)).unwrap();
            toast.success('Service removed from cart');
        } catch (err) {
            toast.error('Failed to remove service');
        }
    }, [dispatch]);

    // Use Redux selectors for calculations
    const { subtotal, gstAmount, total } = productCalculations;


    // Memoized tab handler
    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    // Memoized checkout handlers
    const handleServicesCheckout = useCallback(() => {
        // Clear any previous errors
        dispatch(clearOrderError());
        dispatch(clearCartError());

        if (!serviceCartItems || serviceCartItems.length === 0) {
            toast.error('No services in cart to checkout');
            return;
        }

        // Transform service data and set in Redux
        const serviceData = transformServiceData(serviceCartItems);
        if (serviceData) {
            dispatch(setServiceBooking(serviceData));
            navigate('/payment-success');
        } else {
            toast.error('Failed to process services');
        }
    }, [navigate, serviceCartItems, dispatch]);

    const handleProductsCheckout = useCallback(async () => {
        try {
            // Validate required data
            if (!cartItems || cartItems.length === 0) {
                toast.error('Your cart is empty');
                return;
            }

            if (!defaultAddress) {
                toast.error('Please select a delivery address');
                return;
            }

            // Clear any previous errors
            dispatch(clearOrderError());
            dispatch(clearCartError());

            const orderData = createOrderData({
                cartItems,
                addressId: defaultAddress._id,
                paymentDetails: {
                    status: 'SUCCESS',
                    paidAt: new Date().toISOString()
                }
            });

            console.log('Creating order with data:', orderData);

            // Dispatch the createOrder action
            const result = await dispatch(createOrder(orderData)).unwrap();

            console.log('Order created successfully:', result);
            // Navigate to success page - Redux will handle the data
            navigate('/payment-success');
        } catch (err) {
            console.error('Error during checkout:', err);
        }
    }, [dispatch, cartItems, defaultAddress, navigate]);



    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate1 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    // Use Redux errors
    const displayError = orderError || cartError;

    if (displayError) {
        return (
            <div className="min-h-screen bg-slate1 flex items-center justify-center">
                <div className="text-center p-6 max-w-md mx-4 bg-white rounded-lg shadow">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading cart</h3>
                    <p className="text-gray-600 mb-4">{displayError}</p>
                    <div className="space-x-2">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                        >
                            Try Again
                        </button>
                        {orderError && (
                            <button
                                onClick={() => dispatch(clearOrderError())}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Clear Error
                            </button>
                        )}
                        {cartError && (
                            <button
                                onClick={() => dispatch(clearCartError())}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Clear Cart Error
                            </button>
                        )}
                    </div>
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
                            isRemoving={isRemovingItem}
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
                        localQuantities={localQuantities}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeItem}
                        onCheckout={handleProductsCheckout}
                        subtotal={subtotal}
                        gstAmount={gstAmount}
                        total={total}
                        isUpdating={isUpdatingQuantity}
                        isRemoving={isRemovingItem}
                        isCreatingOrder={isCreatingOrder}
                    />
                )}
            </div>
        </div>
    );
};
export default CartPage;
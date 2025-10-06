import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import ServicesSection from '../../components/Cart/ServicesSection';
import ProductsSection from '../../components/Cart/ProductsSection';
import EditServiceModal from '../../components/Modals/EditServiceModal';
import Preloaders from '../../components/Loader/Preloaders';
import { createOrderData, transformServiceCartToOrderData } from '../../utils/orderUtils';
import { getServiceModeLabel } from '../../utils/serviceConfig';
import {
    updateProductQuantitySuccess,
    removeProductItemSuccess,
    removeServiceItemSuccess,
    updateServiceItemSuccess,
    clearError as clearCartError,
    optimisticUpdateQuantity,
    optimisticRemoveItem,
    clearCart
} from '../../redux/Slices/cartSlice';
import {
    getCartItems,
    updateCartItem,
    removeCartItem,
    removeServiceCartItem,
    updateServiceCartItem,
    createProductOrder,
    createServiceOrder,
    clearProductCart
} from '../../api';
import { useCart } from '../../hooks/useCart';
import { useAddress } from '../../context/AddressContext';

const CartPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { defaultAddress } = useAddress();
    const { fetchCartData } = useCart();

    // Local state for order creation (replacing Redux)
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const { productItems: cartItems, serviceItems: serviceCartItems } = useSelector(state => state.cart);
    const { isLoading, isUpdatingQuantity, isRemovingItem, error: cartError } = useSelector(state => state.cart);

    // Calculate totals manually since we removed the complex selectors
    const productCalculations = useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const gstAmount = subtotal * 0.18; // 18% GST
        const total = subtotal + gstAmount;
        return { subtotal, gstAmount, total };
    }, [cartItems]);

    const serviceCalculations = useMemo(() => {
        const subtotal = serviceCartItems.reduce((sum, item) => sum + item.price, 0);
        const gstAmount = subtotal * 0.18; // 18% GST
        const total = subtotal + gstAmount;
        return { subtotal, gstAmount, total };
    }, [serviceCartItems]);

    // Local state
    const [activeTab, setActiveTab] = useState('products');
    const [localQuantities, setLocalQuantities] = useState({});
    const [pendingUpdates, setPendingUpdates] = useState({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedServiceForEdit, setSelectedServiceForEdit] = useState(null);

    const debounceTimeouts = useRef({});

    // Set active tab based on navigation state
    useEffect(() => {
        const navigationTab = location.state?.activeTab;
        if (navigationTab) {
            setActiveTab(navigationTab);
        }
    }, [location.state]);

    // Fetch cart data on mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                await fetchCartData();
            } catch (error) {
                toast.error('Failed to load cart data');
            }
        };

        loadCart();
    }, [fetchCartData]);

    // Error handling effects
    useEffect(() => {
        if (orderError) {
            toast.dismiss();
            toast.error(orderError);
            setOrderError(null); // Clear error after showing toast
        }
    }, [orderError]);

    useEffect(() => {
        if (cartError) {
            toast.dismiss();
            toast.error(cartError);
            dispatch(clearCartError());
        }
    }, [cartError, dispatch]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            Object.values(debounceTimeouts.current).forEach(timeout => {
                if (timeout) clearTimeout(timeout);
            });
        };
    }, []);

    // Utility functions
    const calculateDuration = useCallback((startTime, endTime) => {
        if (!startTime || !endTime) return 'To be scheduled';
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const diffInMinutes = (end - start) / (1000 * 60);
        return `${Math.round(diffInMinutes)} mins`;
    }, []);

    // Memoized service transformation
    const transformedServices = useMemo(() => {
        return serviceCartItems.map(service => ({
            id: service._id,
            type: service.name,
            duration: calculateDuration(service.startTime, service.endTime),
            mode: getServiceModeLabel(service.serviceMode),
            price: service.originalPrice,
            quantity: service.quantity,
            totalPrice: service.totalPrice,
            serviceId: service.serviceId,
            serviceMode: service.serviceMode,
            astrologer: service.astrologer,
            timeSlot: service.timeSlot,
            startTime: service.startTime,
            endTime: service.endTime,
            date: service.date || 'Date and time will be confirmed'
        }));
    }, [serviceCartItems, calculateDuration]);

    // Update local quantities when cart items change
    useEffect(() => {
        const newLocalQuantities = {};
        cartItems.forEach(item => {
            if (!pendingUpdates[item._id]) {
                newLocalQuantities[item._id] = item.quantity;
            } else {
                newLocalQuantities[item._id] = localQuantities[item._id] || item.quantity;
            }
        });
        setLocalQuantities(newLocalQuantities);
    }, [cartItems, pendingUpdates]); // Removed localQuantities from dependencies

    // Event handlers
    const updateQuantity = useCallback((id, newQuantity) => {
        const quantity = Math.max(1, newQuantity);

        setLocalQuantities(prev => ({ ...prev, [id]: quantity }));
        setPendingUpdates(prev => ({ ...prev, [id]: true }));

        if (debounceTimeouts.current[id]) {
            clearTimeout(debounceTimeouts.current[id]);
        }

        debounceTimeouts.current[id] = setTimeout(async () => {
            try {
                dispatch(optimisticUpdateQuantity({ id, quantity }));

                const response = await updateCartItem(id, quantity);

                if (response.success) {
                    dispatch(updateProductQuantitySuccess({
                        products: response.data.items || cartItems
                    }));
                    setPendingUpdates(prev => {
                        const newPending = { ...prev };
                        delete newPending[id];
                        return newPending;
                    });
                } else {
                    toast.error('Failed to update quantity');
                    const originalItem = cartItems.find(item => item._id === id);
                    if (originalItem) {
                        setLocalQuantities(prev => ({ ...prev, [id]: originalItem.quantity }));
                    }
                }
            } catch (err) {
                toast.dismiss();
                toast.error('Failed to update quantity');
                const originalItem = cartItems.find(item => item._id === id);
                if (originalItem) {
                    setLocalQuantities(prev => ({ ...prev, [id]: originalItem.quantity }));
                }
                setPendingUpdates(prev => {
                    const newPending = { ...prev };
                    delete newPending[id];
                    return newPending;
                });
            }
        }, 500);
    }, [dispatch, cartItems]);

    const removeItem = useCallback(async (id) => {
        try {
            dispatch(optimisticRemoveItem(id));

            const response = await removeCartItem(id);

            if (response.success) {
                dispatch(removeProductItemSuccess(id));
                toast.dismiss();
                toast.success('Item removed from cart');
            } else {
                toast.error('Failed to remove item');
                // Revert optimistic update by refetching cart
                try {
                    await fetchCartData();
                } catch (fetchError) {
                    console.error('Failed to refetch cart data:', fetchError);
                }
            }
        } catch (err) {
            toast.dismiss();
            toast.error('Failed to remove item');
        }
    }, [dispatch, fetchCartData]);

    const removeServiceItem = useCallback(async (id) => {
        try {
            const response = await removeServiceCartItem(id);

            if (response.success) {
                dispatch(removeServiceItemSuccess(id));
                toast.dismiss();
                toast.success('Service removed from cart');
            } else {
                toast.error('Failed to remove service');
            }
        } catch (err) {
            toast.dismiss();
            toast.error('Failed to remove service');
        }
    }, [dispatch]);

    const handleEditService = useCallback((service) => {
        setSelectedServiceForEdit(service);
        setIsEditModalOpen(true);
    }, []);

    const handleUpdateService = useCallback(async (updatedServiceData) => {
        try {
            const response = await updateServiceCartItem(selectedServiceForEdit.id, updatedServiceData);

            if (response.success) {
                dispatch(updateServiceItemSuccess({
                    id: selectedServiceForEdit.id,
                    updateData: updatedServiceData
                }));
                toast.dismiss();
                toast.success('Service updated successfully');
                setIsEditModalOpen(false);
                setSelectedServiceForEdit(null);
            } else {
                toast.error('Failed to update service');
            }
        } catch (err) {
            toast.dismiss();
            toast.error('Failed to update service');
        }
    }, [dispatch, selectedServiceForEdit]);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    const handleServicesCheckout = useCallback(async () => {
        try {
            if (!serviceCartItems?.length) {
                toast.dismiss();
                toast.error('No services in cart to checkout');
                return;
            }

            const requiresAddress = serviceCartItems.some(service => service.serviceMode !== 'online');
            if (requiresAddress && !defaultAddress) {
                toast.dismiss();
                toast.error('Please select a delivery address for this service');
                return;
            }

            const serviceOrderData = transformServiceCartToOrderData(
                serviceCartItems,
                requiresAddress ? defaultAddress._id : null
            );

            // Set loading state
            setIsCreatingOrder(true);
            setOrderError(null);

            // Call API directly
            const response = await createServiceOrder(serviceOrderData);

            if (response.success) {
                toast.dismiss();
                toast.success('Service order created successfully!');

                // Navigate immediately without delay
                try {
                    navigate('/payment-success', {
                        state: {
                            orderData: response.order,
                            orderType: 'services'
                        }
                    });
                } catch (navError) {
                    console.error('Navigation failed:', navError);
                    // Fallback: force navigation
                    window.location.href = '/payment-success';
                }
            } else {
                setOrderError(response.message || 'Failed to create service order');
                toast.dismiss();
                toast.error(response.message || 'Failed to create service order');
            }

        } catch (err) {
            console.error('Service checkout error:', err);
            setOrderError(err?.message || 'Network error occurred');
            toast.dismiss();
            const errorMessage = err?.message || err?.error || 'Failed to create service order';
            toast.error(errorMessage);
        } finally {
            setIsCreatingOrder(false);
        }
    }, [serviceCartItems, defaultAddress, navigate]);

    const handleProductsCheckout = useCallback(async () => {
        try {
            if (!cartItems?.length) {
                toast.dismiss();
                toast.error('Your cart is empty');
                return;
            }

            if (!defaultAddress) {
                toast.dismiss();
                toast.error('Please select a delivery address');
                return;
            }

            const orderData = createOrderData({
                cartItems,
                addressId: defaultAddress._id,
                paymentDetails: {
                    status: 'SUCCESS',
                    paidAt: new Date().toISOString()
                }
            });

            // Set loading state
            setIsCreatingOrder(true);
            setOrderError(null);

            // Call API directly
            const response = await createProductOrder(orderData);

            if (response.success) {
                toast.dismiss();
                toast.success('Product order created successfully!');

                // Clear product cart
                try {
                    await clearProductCart();
                    dispatch(clearCart());
                    console.log('Product cart cleared successfully');
                } catch (clearError) {
                    console.error('Error clearing product cart:', clearError);
                }

                setTimeout(() => {
                    navigate('/payment-success', {
                        state: {
                            orderData: response.data,
                            orderType: 'products'
                        }
                    });
                }, 100);
            } else {
                setOrderError(response.message || 'Failed to create order');
                toast.dismiss();
                toast.error(response.message || 'Failed to create order');
            }
        } catch (err) {
            console.error('Error during checkout:', err);
            setOrderError(err?.message || 'Network error occurred');
            toast.dismiss();
            toast.error('Failed to create order');
        } finally {
            setIsCreatingOrder(false);
        }
    }, [cartItems, defaultAddress, navigate]);

    // Memoized tab component
    const TabComponent = useMemo(() => {
        const tabProps = {
            activeTab,
            onTabChange: handleTabChange,
            tabs: [
                { id: 'services', label: 'Services' },
                { id: 'products', label: 'Products' }
            ]
        };

        return (
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
        );
    }, [activeTab, handleTabChange]);

    // Loading state
    if (isLoading) {
        return <Preloaders />;
    }

    return (
        <div className="min-h-screen bg-slate1">
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

            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-12 md:py-14">
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

                    <div className="absolute right-0 hidden lg:block">
                        {TabComponent}
                    </div>
                </div>

                <div className="lg:hidden mb-6">
                    <div className="flex justify-center">
                        {TabComponent}
                    </div>
                </div>

                {activeTab === 'services' ? (
                    serviceCartItems.length > 0 ? (
                        <ServicesSection
                            services={transformedServices}
                            onRemoveService={removeServiceItem}
                            onEditService={handleEditService}
                            onCheckout={handleServicesCheckout}
                            subtotal={serviceCalculations.subtotal}
                            gstAmount={serviceCalculations.gstAmount}
                            total={serviceCalculations.total}
                            isRemoving={isRemovingItem}
                            isCreatingOrder={isCreatingOrder}
                        />
                    ) : (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Services in Cart</h3>
                            <p className="text-gray-500">Add services to see them here</p>
                        </div>
                    )
                ) : (
                    <ProductsSection
                        cartItems={cartItems}
                        localQuantities={localQuantities}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeItem}
                        onCheckout={handleProductsCheckout}
                        subtotal={productCalculations.subtotal}
                        gstAmount={productCalculations.gstAmount}
                        total={productCalculations.total}
                        isUpdating={isUpdatingQuantity}
                        isRemoving={isRemovingItem}
                        isCreatingOrder={isCreatingOrder}
                    />
                )}
            </div>
            <EditServiceModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedServiceForEdit(null);
                }}
                serviceData={selectedServiceForEdit}
                onUpdateService={handleUpdateService}
            />
        </div>
    );
};

export default CartPage;
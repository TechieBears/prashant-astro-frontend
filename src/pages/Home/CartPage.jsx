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
import { createOrder, createServiceOrderThunk, clearError as clearOrderError, clearCurrentOrder } from '../../redux/Slices/orderSlice';
import { createOrderData, transformServiceCartToOrderData } from '../../utils/orderUtils';
import { getServiceModeLabel } from '../../utils/serviceConfig';
import {
    fetchCartData,
    updateProductQuantity,
    removeProductItem,
    removeServiceItem as removeServiceItemAction,
    updateServiceItem,
    clearError as clearCartError,
    selectProductCalculations,
    selectServiceCalculations,
    selectCartLoadingStates,
    selectCartErrors
} from '../../redux/Slices/cartSlice';
import { useAddress } from '../../context/AddressContext';

const CartPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { defaultAddress } = useAddress();

    // Redux selectors
    const { isCreatingOrder, error: orderError } = useSelector(state => state.order);
    const { productItems: cartItems, serviceItems: serviceCartItems } = useSelector(state => state.cart);
    const { isLoading, isUpdatingQuantity, isRemovingItem } = useSelector(selectCartLoadingStates);
    const { error: cartError } = useSelector(selectCartErrors);
    const productCalculations = useSelector(selectProductCalculations);
    const serviceCalculations = useSelector(selectServiceCalculations);

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
        dispatch(fetchCartData());
    }, [dispatch]);

    // Error handling effects
    useEffect(() => {
        if (orderError) {
            toast.dismiss();
            toast.error(orderError);
            dispatch(clearOrderError());
        }
    }, [orderError, dispatch]);

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
                await dispatch(updateProductQuantity({ id, quantity })).unwrap();
                setPendingUpdates(prev => {
                    const newPending = { ...prev };
                    delete newPending[id];
                    return newPending;
                });
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
            await dispatch(removeProductItem(id)).unwrap();
            toast.dismiss();
            toast.success('Item removed from cart');
        } catch (err) {
            toast.dismiss();
            toast.error('Failed to remove item');
        }
    }, [dispatch]);

    const removeServiceItem = useCallback(async (id) => {
        try {
            await dispatch(removeServiceItemAction(id)).unwrap();
            toast.dismiss();
            toast.success('Service removed from cart');
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
            await dispatch(updateServiceItem({
                id: selectedServiceForEdit.id,
                updateData: updatedServiceData
            })).unwrap();
            toast.dismiss();
            toast.success('Service updated successfully');
            setIsEditModalOpen(false);
            setSelectedServiceForEdit(null);
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

            await dispatch(createServiceOrderThunk(serviceOrderData)).unwrap();

            toast.dismiss();
            toast.success('Service order created successfully!');

            // Clear only error state, keep currentOrder for PaymentSuccess page
            dispatch(clearOrderError());

            // Navigate immediately without delay
            try {
                navigate('/payment-success');
            } catch (navError) {
                console.error('Navigation failed:', navError);
                // Fallback: force navigation
                window.location.href = '/payment-success';
            }

        } catch (err) {
            console.error('Service checkout error:', err);
            toast.dismiss();
            const errorMessage = err?.message || err?.error || 'Failed to create service order';
            toast.error(errorMessage);
        }
    }, [serviceCartItems, defaultAddress, dispatch, navigate]);

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

            await dispatch(createOrder(orderData)).unwrap();

            toast.dismiss();
            toast.success('Product order created successfully!');

            // Navigate after a short delay to ensure toast is visible
            setTimeout(() => {
                navigate('/payment-success');
            }, 100);
        } catch (err) {
            console.error('Error during checkout:', err);
            toast.dismiss();
            toast.error('Failed to create order');
        }
    }, [cartItems, defaultAddress, dispatch, navigate]);

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
        return (
            <div className="min-h-screen bg-slate1 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
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
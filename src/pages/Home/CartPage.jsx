import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import ServicesSection from '../../components/Cart/ServicesSection';
import ProductsSection from '../../components/Cart/ProductsSection';
import { createOrder, setServiceBooking, clearError as clearOrderError } from '../../redux/Slices/orderSlice';
import { createOrderData, transformServiceData } from '../../utils/orderUtils';
import {
    fetchCartData,
    updateProductQuantity,
    removeProductItem,
    removeServiceItem as removeServiceItemAction,
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

    const { isCreatingOrder, error: orderError } = useSelector(state => state.order);
    const { productItems: cartItems, serviceItems: serviceCartItems } = useSelector(state => state.cart);
    const { isLoading, isUpdatingQuantity, isRemovingItem } = useSelector(selectCartLoadingStates);
    const { error: cartError } = useSelector(selectCartErrors);
    const productCalculations = useSelector(selectProductCalculations);
    const serviceCalculations = useSelector(selectServiceCalculations);

    const [activeTab, setActiveTab] = useState('products');
    const [localQuantities, setLocalQuantities] = useState({});
    const [pendingUpdates, setPendingUpdates] = useState({});
    const debounceTimeouts = useRef({});
    const { defaultAddress } = useAddress();

    // Set active tab based on navigation state
    useEffect(() => {
        const navigationTab = location.state?.activeTab;
        if (navigationTab) {
            setActiveTab(navigationTab);
        }
    }, [location.state]);

    const transformedServices = serviceCartItems.map(service => ({
        id: service._id,
        type: service.name,
        duration: 'To be scheduled',
        date: 'Date and time will be confirmed',
        mode: 'Online',
        price: service.originalPrice,
        quantity: service.quantity,
        totalPrice: service.totalPrice
    }));

    useEffect(() => {
        dispatch(fetchCartData());
    }, [dispatch]);

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
    }, [cartItems, pendingUpdates]);

    useEffect(() => {
        return () => {
            Object.values(debounceTimeouts.current).forEach(timeout => {
                if (timeout) clearTimeout(timeout);
            });
        };
    }, []);

    // Show error toasts when errors occur
    useEffect(() => {
        if (orderError) {
            toast.error(orderError);
            dispatch(clearOrderError());
        }
    }, [orderError, dispatch]);

    useEffect(() => {
        if (cartError) {
            toast.error(cartError);
            dispatch(clearCartError());
        }
    }, [cartError, dispatch]);

    const updateQuantity = (id, newQuantity) => {
        const quantity = Math.max(1, newQuantity);

        setLocalQuantities(prev => ({
            ...prev,
            [id]: quantity
        }));

        setPendingUpdates(prev => ({
            ...prev,
            [id]: true
        }));

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
                toast.error('Failed to update quantity');
                const originalItem = cartItems.find(item => item._id === id);
                if (originalItem) {
                    setLocalQuantities(prev => ({
                        ...prev,
                        [id]: originalItem.quantity
                    }));
                }
                setPendingUpdates(prev => {
                    const newPending = { ...prev };
                    delete newPending[id];
                    return newPending;
                });
            }
        }, 500);
    };

    const removeItem = async (id) => {
        try {
            await dispatch(removeProductItem(id)).unwrap();
            toast.success('Item removed from cart');
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    const removeServiceItem = async (id) => {
        try {
            await dispatch(removeServiceItemAction(id)).unwrap();
            toast.success('Service removed from cart');
        } catch (err) {
            toast.error('Failed to remove service');
        }
    };

    const { subtotal, gstAmount, total } = productCalculations;

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleServicesCheckout = () => {
        if (!serviceCartItems || serviceCartItems.length === 0) {
            toast.error('No services in cart to checkout');
            return;
        }

        const serviceData = transformServiceData(serviceCartItems);
        if (serviceData) {
            dispatch(setServiceBooking(serviceData));
            navigate('/payment-success');
        } else {
            toast.error('Failed to process services');
        }
    };

    const handleProductsCheckout = async () => {
        try {
            if (!cartItems || cartItems.length === 0) {
                toast.error('Your cart is empty');
                return;
            }

            if (!defaultAddress) {
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
            navigate('/payment-success');
        } catch (err) {
            console.error('Error during checkout:', err);
            toast.error('Failed to create order');
        }
    };



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
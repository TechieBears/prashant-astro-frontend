import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import BuyNowSection from '../../components/Cart/BuyNowSection';
import { createOrderData } from '../../utils/orderUtils';
import { useAddress } from '../../context/AddressContext';
import { createProductOrder, clearProductCart } from '../../api';
import { clearCart } from '../../redux/Slices/cartSlice';

const BuyNowPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // Get product data from navigation state
    const { product, quantity = 1 } = location.state || {};

    // Local state for order creation (replacing Redux)
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const { defaultAddress } = useAddress();

    // Redirect if no product data
    useEffect(() => {
        if (!product) {
            navigate('/products');
        }
    }, [product, navigate]);

    // Handle checkout
    const handleCheckout = useCallback(async () => {
        if (!product || !defaultAddress) return;

        try {
            setOrderError(null);

            const orderData = createOrderData({
                productId: product._id,
                quantity,
                addressId: defaultAddress._id,
                paymentDetails: {
                    status: 'SUCCESS',
                    paidAt: new Date().toISOString()
                }
            });
            setIsCreatingOrder(true);
            const response = await createProductOrder(orderData);

            if (response.success) {
                try {
                    await clearProductCart();
                    dispatch(clearCart());
                    console.log('Product cart cleared successfully');
                } catch (clearError) {
                    console.error('Error clearing product cart:', clearError);
                }

                navigate('/payment-success', {
                    state: {
                        orderData: response.data,
                        orderType: 'products'
                    }
                });
            } else {
                setOrderError(response.message || 'Failed to create order');
                toast.error(response.message || 'Failed to create order');
            }
        } catch (err) {
            console.error('Error during buy now checkout:', err);
            setOrderError(err?.message || 'Network error occurred');
            toast.error('Failed to create order');
        } finally {
            setIsCreatingOrder(false);
        }
    }, [product, quantity, defaultAddress, navigate]);

    // Early returns for error states
    if (!product) {
        toast.error('Please select a product to buy now');
        navigate('/products');
        return null;
    }

    return (
        <div className="min-h-screen bg-slate1">
            <BackgroundTitle
                title="Buy Now"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Products", href: "/products" },
                    { label: product.name, href: `/product/${product._id}` },
                    { label: "Buy Now", href: null }
                ]}
                backgroundImage={bannerImage}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />

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

                    <h1 className="text-xl md:text-2xl font-normal text-gray-900">Buy Now</h1>
                </div>

                {/* Buy Now Section */}
                <BuyNowSection
                    product={product}
                    quantity={quantity}
                    onCheckout={handleCheckout}
                    isCreatingOrder={isCreatingOrder}
                />
            </div>
        </div>
    );
};

export default BuyNowPage;

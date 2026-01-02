import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import BuyNowSection from '../../components/Cart/BuyNowSection';
import { createOrderData } from '../../utils/orderUtils';
import { useAddress } from '../../context/AddressContext';
import { createProductOrder, clearProductCart, getWalletBalance } from '../../api';
import { clearCart } from '../../redux/Slices/cartSlice';
import { openRazorpay } from '../../utils/paymentGetway';

const BuyNowPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { defaultAddress } = useAddress();

    // Get product data from navigation state
    const { product, quantity: initialQuantity = 1 } = location.state || {};

    // Local state (UI only - no API calls for quantity changes)
    const [quantity, setQuantity] = useState(initialQuantity);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [useCredits, setUseCredits] = useState(false);
    const [availableCredits, setAvailableCredits] = useState(0);

    // Redirect if no product data and fetch wallet balance
    useEffect(() => {
        if (!product) {
            toast.error('Please select a product to buy now');
            navigate('/products');
        } else {
            const fetchWalletBalance = async () => {
                const walletResponse = await getWalletBalance();
                if (walletResponse?.success) {
                    setAvailableCredits(walletResponse.data.balance || 0);
                }
            };
            fetchWalletBalance();
        }
    }, [product, navigate]);

    // Handle quantity change
    const handleQuantityChange = useCallback((newQuantity) => {
        setQuantity(Math.max(1, newQuantity));
    }, []);

    // Handle checkout
    const handleCheckout = useCallback(async () => {
        if (!defaultAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        setIsCreatingOrder(true);

        try {
            const orderData = createOrderData({
                productId: product._id,
                quantity,
                addressId: defaultAddress._id,
                couponId: appliedCoupon ? (appliedCoupon._id || appliedCoupon.id) : null,
                useCredits
            });

            const response = await createProductOrder(orderData);

            if (response.success) {
                openRazorpay(
                    response.data,
                    async (paymentResponse) => {
                        setAppliedCoupon(null);
                        // Clear cart on payment success
                        try {
                            await clearProductCart();
                            dispatch(clearCart());
                        } catch (clearError) {
                            console.error('Error clearing cart:', clearError);
                        }

                        navigate('/payment-success', {
                            state: {
                                orderData: response.data,
                                orderType: 'products',
                                paymentResponse
                            }
                        });
                    },
                    (error) => {
                        toast.error('Payment cancelled or failed');
                        setIsCreatingOrder(false);
                    }
                );
            } else {
                toast.error(response.message || 'Failed to create order');
            }
        } catch (err) {
            console.error('Error during buy now checkout:', err);
            toast.error('Failed to create order');
        } finally {
            setIsCreatingOrder(false);
        }
    }, [product, quantity, defaultAddress, navigate, dispatch]);

    // Early return if no product
    if (!product) return null;

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
                    onQuantityChange={handleQuantityChange}
                    onCheckout={handleCheckout}
                    isCreatingOrder={isCreatingOrder}
                    appliedCoupon={appliedCoupon}
                    onApplyCoupon={setAppliedCoupon}
                    useCredits={useCredits}
                    onToggleCredits={() => setUseCredits(!useCredits)}
                    availableCredits={availableCredits}
                />
            </div>
        </div>
    );
};

export default BuyNowPage;

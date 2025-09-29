import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../api';
import { updateProductQuantity, fetchCartData } from '../../redux/Slices/cartSlice';
import toast from 'react-hot-toast';

const AddToCartButton = ({
    productId,
    stock = true,
    className = '',
    size = 'default',
    variant = 'default',
    isInCart = false,
    cartItemId = null
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleAddToCart = async () => {
        if (!productId) return toast.error('Product ID is missing');

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to add items to cart');
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        setIsAddingToCart(true);
        const toastId = toast.loading(isInCart ? 'Updating cart...' : 'Adding to cart...');

        try {
            if (isInCart && cartItemId) {
                // For existing cart items, we'll update the quantity by +1
                const resultAction = await dispatch(updateProductQuantity({
                    id: cartItemId,
                    quantity: 1, // Always add 1 more
                    increment: true // Indicate this is an increment operation
                }));

                if (updateProductQuantity.fulfilled.match(resultAction)) {
                    toast.success('Added one more to cart', { id: toastId });
                    // Wait a moment for the state to update
                    await new Promise(resolve => setTimeout(resolve, 500));
                    // Navigate to cart page after successful update
                    navigate('/cart', { state: { activeTab: 'products' } });
                } else {
                    throw new Error(resultAction.payload || 'Failed to update cart');
                }
            } else {
                // For new items, add with quantity 1
                const response = await addToCart(productId, 1);
                const message = response?.message || (response?.success ? 'Product added to cart' : 'Failed to add product');

                if (response?.success) {
                    // Refresh cart data after adding
                    await dispatch(fetchCartData());

                    toast.success(message, { id: toastId });
                    // Navigate to cart page after successful add
                    setTimeout(() => {
                        navigate('/cart', { state: { activeTab: 'products' } });
                    }, 1000);
                } else {
                    throw new Error(message);
                }
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update cart';
            console.error('Cart update error:', error);
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Button size classes
    const buttonSizeClasses = {
        small: 'py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 text-xs sm:text-sm md:text-base',
        default: 'py-2 px-4 text-sm',
        large: 'py-3 px-6 text-base'
    };

    // Variant styles
    const variantClasses = {
        default: 'text-orange-500 border-orange-400 hover:bg-orange-50',
        gradient: 'bg-button-diagonal-gradient-orange text-white hover:opacity-90 border-0 shadow-md hover:shadow-lg transition-all duration-200',
        outline: 'text-gray-700 border-gray-300 hover:bg-gray-50'
    };

    const baseButtonClasses = `rounded-[0.2rem] font-medium border flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonSizeClasses[size]} ${variantClasses[variant]}`;
    const disabledButtonClasses = !stock ? 'text-gray-300 border-gray-300 cursor-not-allowed' :
        isAddingToCart ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-wait' : '';

    return (
        <div className={className}>
            <button
                onClick={handleAddToCart}
                disabled={!stock || isAddingToCart}
                className={`${baseButtonClasses} ${disabledButtonClasses} w-full`}
            >
                {isAddingToCart ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-orange-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {isInCart ? 'Adding...' : 'Adding...'}
                    </>
                ) : stock ? (isInCart ? 'Update Cart' : 'Add to Cart') : 'Out of Stock'}
            </button>
        </div>
    );
};

export default AddToCartButton;

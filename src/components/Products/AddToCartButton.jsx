import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../api';
import { updateProductQuantity } from '../../redux/Slices/cartSlice';
import toast from 'react-hot-toast';

const AddToCartButton = ({
    productId,
    quantity = 1,
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
        if (!token) return toast.error('Please login to add items to cart');

        setIsAddingToCart(true);
        const toastId = toast.loading(isInCart ? 'Updating cart...' : 'Adding to cart...');

        try {
            if (isInCart && cartItemId) {
                // Product is already in cart - update quantity via Redux
                await dispatch(updateProductQuantity({
                    id: cartItemId,
                    quantity: quantity
                })).unwrap();

                toast.success('Cart updated successfully', { id: toastId });
                // Navigate to cart page after successful update
                setTimeout(() => {
                    navigate('/cart');
                }, 1000);
            } else {
                // Product not in cart - add to cart via API
                const response = await addToCart(productId, quantity);
                const message = response?.message || (response?.success ? 'Product added to cart' : 'Failed to add product');

                if (response?.success) {
                    toast.success(message, { id: toastId });
                    // Navigate to cart page after successful add
                    setTimeout(() => {
                        navigate('/cart');
                    }, 1000);
                } else {
                    toast.error(message, { id: toastId });
                }
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update cart';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Size variants
    const sizeClasses = {
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

    const baseClasses = `rounded-[0.2rem] font-medium border flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]}`;

    const disabledClasses = !stock ? 'text-gray-300 border-gray-300 cursor-not-allowed' :
        isAddingToCart ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-wait' : '';

    return (
        <button
            onClick={handleAddToCart}
            disabled={!stock || isAddingToCart}
            className={`${baseClasses} ${disabledClasses} ${className}`}
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
                    Adding...
                </>
            ) : stock ? (isInCart ? 'Update Cart' : 'Add to Cart') : 'Out of Stock'}
        </button>
    );
};

export default AddToCartButton;

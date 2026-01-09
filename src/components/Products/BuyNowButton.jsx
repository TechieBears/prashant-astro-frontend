import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const BuyNowButton = ({ 
    productId, 
    product, 
    quantity = 1, 
    stock = true, 
    className = '', 
    size = 'default',
    variant = 'default'
}) => {
    const navigate = useNavigate();
    const { isLogged } = useSelector(state => state.user);

    const handleBuyNow = () => {
        if (!isLogged) {
            toast.error('Please login to continue with your purchase');
            return;
        }

        if (!stock) {
            toast.error('Product is out of stock');
            return;
        }

        navigate('/buy-now', {
            state: {
                product: product,
                quantity: quantity
            }
        });
    };

    const sizeClasses = {
        small: 'px-3 py-1.5 text-xs',
        default: 'px-6 py-2 text-sm',
        large: 'px-8 py-3 text-base'
    };

    const variantClasses = {
        default: 'bg-button-diagonal-gradient-orange hover:opacity-90',
        gradient: 'bg-button-diagonal-gradient-orange hover:opacity-90',
        outline: 'border border-orange-500 text-orange-500 hover:bg-orange-50'
    };

    return (
        <button
            onClick={handleBuyNow}
            disabled={!stock}
            className={`
                ${sizeClasses[size]} 
                ${variantClasses[variant]}
                rounded-[0.2rem] font-medium text-white transition-all hover:shadow-lg
                ${!stock ? 'bg-gray-400 cursor-not-allowed opacity-50' : ''}
                ${className}
            `}
        >
            Buy Now
        </button>
    );
};

export default BuyNowButton;
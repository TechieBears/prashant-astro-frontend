import { useDispatch } from 'react-redux';
import { fetchCartDataSuccess, setLoading, setError } from '../redux/Slices/cartSlice';
import { getCartItems, getServiceCartItems } from '../api';

export const useCart = () => {
    const dispatch = useDispatch();

    const fetchCartData = async () => {
        try {
            dispatch(setLoading(true));

            const [productsResponse, servicesResponse] = await Promise.all([
                getCartItems(),
                getServiceCartItems()
            ]);

            const cartData = {
                products: productsResponse.success ? (productsResponse.data.items || []) : [],
                services: servicesResponse.success ? (servicesResponse.data.items || []) : [],
                productsError: productsResponse.success ? null : productsResponse.message,
                servicesError: servicesResponse.success ? null : servicesResponse.message
            };

            dispatch(fetchCartDataSuccess(cartData));
            return cartData;
        } catch (error) {
            dispatch(setError(error.message || 'Failed to fetch cart data'));
            throw error;
        }
    };

    return {
        fetchCartData
    };
};


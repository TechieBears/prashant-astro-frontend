import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAllCustomerAddresses, updateCustomerAddress, createCustomerAddress, deleteCustomerAddress } from '../api';

const AddressContext = createContext();

export const useAddress = () => {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error('useAddress must be used within an AddressProvider');
    }
    return context;
};

export const AddressProvider = ({ children }) => {
    const [addresses, setAddresses] = useState([]);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAddresses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllCustomerAddresses();

            if (response?.data && response.data.length > 0) {
                setAddresses(response.data);
                const defaultUserAddress = response.data.find(addr => addr.isDefault);
                setDefaultAddress(defaultUserAddress);
            } else {
                setError("No addresses found");
            }
        } catch (err) {
            console.error('Error fetching addresses:', err);
            setError("An error occurred while fetching addresses");
        } finally {
            setLoading(false);
        }
    }, []);

    const changeDefaultAddress = useCallback(async (newAddress) => {
        try {
            setError(null);

            // Update the selected address to be default
            const updateData = {
                ...newAddress,
                isDefault: true
            };

            const response = await updateCustomerAddress(newAddress._id, updateData);

            if (response.success) {
                setDefaultAddress(newAddress);
                // Update the addresses list to reflect the new default
                setAddresses(prevAddresses =>
                    prevAddresses.map(addr => ({
                        ...addr,
                        isDefault: addr._id === newAddress._id
                    }))
                );
                return { success: true };
            } else {
                setError(response.message || 'Failed to update address');
                return { success: false, error: response.message };
            }
        } catch (err) {
            console.error('Error updating address:', err);
            setError('An error occurred while updating the address');
            return { success: false, error: 'An error occurred while updating the address' };
        }
    }, []);

    const addAddress = useCallback(async (addressData) => {
        try {
            setError(null);
            const response = await createCustomerAddress(addressData);

            if (response.success) {
                // Refresh addresses to get the updated list
                await fetchAddresses();
                return { success: true, data: response.data };
            } else {
                setError(response.message || 'Failed to add address');
                return { success: false, error: response.message };
            }
        } catch (err) {
            console.error('Error adding address:', err);
            setError('An error occurred while adding the address');
            return { success: false, error: 'An error occurred while adding the address' };
        }
    }, [fetchAddresses]);

    const updateAddress = useCallback(async (addressId, addressData) => {
        try {
            setError(null);
            const response = await updateCustomerAddress(addressId, addressData);

            if (response.success) {
                // Refresh addresses to get the updated list
                await fetchAddresses();
                return { success: true, data: response.data };
            } else {
                setError(response.message || 'Failed to update address');
                return { success: false, error: response.message };
            }
        } catch (err) {
            console.error('Error updating address:', err);
            setError('An error occurred while updating the address');
            return { success: false, error: 'An error occurred while updating the address' };
        }
    }, [fetchAddresses]);

    const removeAddress = useCallback(async (addressId) => {
        try {
            setError(null);
            const response = await deleteCustomerAddress(addressId);

            if (response.success) {
                // Refresh addresses to get the updated list
                await fetchAddresses();
                return { success: true };
            } else {
                setError(response.message || 'Failed to delete address');
                return { success: false, error: response.message };
            }
        } catch (err) {
            console.error('Error deleting address:', err);
            setError('An error occurred while deleting the address');
            return { success: false, error: 'An error occurred while deleting the address' };
        }
    }, [fetchAddresses]);

    // Auto-fetch addresses when the provider mounts
    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const value = {
        addresses,
        defaultAddress,
        loading,
        error,
        fetchAddresses,
        changeDefaultAddress,
        addAddress,
        updateAddress,
        removeAddress,
        setError,
        refreshAddresses: fetchAddresses // Alias for consistency
    };

    return (
        <AddressContext.Provider value={value}>
            {children}
        </AddressContext.Provider>
    );
};

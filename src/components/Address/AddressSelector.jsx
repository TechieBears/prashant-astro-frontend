import React, { useState } from 'react';
import { useAddress } from '../../context/AddressContext';

const AddressSelector = () => {
    const [showSelector, setShowSelector] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { addresses, defaultAddress, changeDefaultAddress, error } = useAddress();

    const handleAddressSelect = async (selectedAddress) => {
        if (selectedAddress._id === defaultAddress?._id) {
            setShowSelector(false);
            return;
        }

        try {
            setIsUpdating(true);
            const result = await changeDefaultAddress(selectedAddress);

            if (result.success) {
                setShowSelector(false);
            }
        } catch (err) {
            console.error('Error updating address:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!defaultAddress) {
        return (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <p className="text-red-600 text-sm">No delivery address selected</p>
                <p className="text-red-500 text-xs mt-1">Please add an address to continue</p>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                            {defaultAddress.firstName} {defaultAddress.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{defaultAddress.phoneNumber}</p>
                        <p className="text-xs text-gray-600 mt-1">
                            {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postalCode}
                        </p>
                    </div>
                    {addresses.length > 1 && (
                        <button
                            onClick={() => setShowSelector(!showSelector)}
                            disabled={isUpdating}
                            className="text-orange-500 text-xs hover:underline disabled:opacity-50"
                        >
                            {isUpdating ? 'Updating...' : 'Change'}
                        </button>
                    )}
                </div>
            </div>

            {/* Address Selector Dropdown */}
            {showSelector && addresses.length > 1 && (
                <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-sm">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className={`p-3 cursor-pointer hover:bg-gray-50 ${address._id === defaultAddress?._id
                                ? 'bg-orange-50 border-l-4 border-orange-500'
                                : ''
                                }`}
                            onClick={() => handleAddressSelect(address)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-gray-900">
                                        {address.firstName} {address.lastName}
                                    </p>
                                    <p className="text-xs text-gray-600">{address.phoneNumber}</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {address.address}, {address.city}, {address.state} - {address.postalCode}
                                    </p>
                                </div>
                                {address._id === defaultAddress?._id && (
                                    <div className="ml-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-xs">{error}</p>
                </div>
            )}
        </div>
    );
};

export default AddressSelector;

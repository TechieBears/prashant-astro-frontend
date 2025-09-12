"use client";
import { useState, useEffect } from "react";
import { createCustomerAddress, updateCustomerAddress } from "../../api";

const AddressForm = ({ mode = "add", addressData = null, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        addressType: 'home',
        country: '',
        state: '',
        city: '',
        postalCode: '',
        isDefault: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Populate form with existing address data for edit mode
    useEffect(() => {
        if (mode === "edit" && addressData) {
            setFormData({
                firstName: addressData.firstName || '',
                lastName: addressData.lastName || '',
                phoneNumber: addressData.phoneNumber || '',
                address: addressData.address || '',
                addressType: addressData.addressType || 'home',
                country: addressData.country || '',
                state: addressData.state || '',
                city: addressData.city || '',
                postalCode: addressData.postalCode || '',
                isDefault: addressData.isDefault || false
            });
        }
    }, [mode, addressData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            // Prepare data for API (remove any empty fields and ensure proper format)
            const apiData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                address: formData.address.trim(),
                addressType: formData.addressType,
                country: formData.country.trim(),
                state: formData.state.trim(),
                city: formData.city.trim(),
                postalCode: formData.postalCode.trim(),
                isDefault: formData.isDefault
            };

            let response;
            if (mode === "add") {
                response = await createCustomerAddress(apiData);
            } else {
                response = await updateCustomerAddress(addressData._id, apiData);
            }

            if (response.success) {
                // Call success callback with the created/updated address data
                if (onSuccess) {
                    onSuccess(response.data);
                }

                // Reset form and close
                if (mode === "add") {
                    setFormData({
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                        address: '',
                        addressType: 'home',
                        country: '',
                        state: '',
                        city: '',
                        postalCode: '',
                        isDefault: false
                    });
                }
                onClose();
            } else {
                setError(response.message || `Failed to ${mode} address`);
            }
        } catch (err) {
            setError(`An error occurred while ${mode === "add" ? "creating" : "updating"} the address`);
            console.error(`Error ${mode === "add" ? "creating" : "updating"} address:`, err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data for add mode
        if (mode === "add") {
            setFormData({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                addressType: 'home',
                country: '',
                state: '',
                city: '',
                postalCode: '',
                isDefault: false
            });
        }
        onClose();
    };

    const isEditMode = mode === "edit";
    const submitButtonText = isEditMode ? "Update Changes" : "Save Changes";
    const loadingText = isEditMode ? "Updating..." : "Saving...";

    return (
        <div className="bg-white p-6 rounded-lg mb-6">
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-red-700 text-sm">{error}</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                                className="w-full px-3 py-4 bg-form-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                className="w-full px-3 py-4 bg-form-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                                className="w-full px-3 py-4 bg-form-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                            </label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full px-3 py-4 bg-form-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                                required
                            >
                                <option value="">Select state</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Western Australia">Western Australia</option>
                                <option value="New South Wales">New South Wales</option>
                                <option value="California">California</option>
                                <option value="Texas">Texas</option>
                            </select>
                        </div>

                        {/* Zip Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Zip code / Postal Code
                            </label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                placeholder="Enter zip code"
                                className="w-full px-3 py-4 bg-form-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                                className="w-full px-3 py-4 bg-form-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Address Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address Type
                            </label>
                            <div className="flex gap-2">
                                {['home', 'office', 'friend', 'other'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, addressType: type }))}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.addressType === type
                                            ? 'bg-button-vertical-gradient-orange text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full px-3 py-4 bg-form-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                                required
                            >
                                <option value="">Select country</option>
                                <option value="India">India</option>
                                <option value="Australia">Australia</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                            </select>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full px-3 py-4 bg-form-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                                required
                            >
                                <option value="">Select city</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Perth">Perth</option>
                                <option value="Sydney">Sydney</option>
                                <option value="Los Angeles">Los Angeles</option>
                                <option value="New York">New York</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Default Address Checkbox */}
                <div className="mt-6 mb-6">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Set as default address</span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                {loadingText}
                            </>
                        ) : (
                            submitButtonText
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;

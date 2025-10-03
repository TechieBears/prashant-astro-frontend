"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAddress } from "../../context/AddressContext";
import toast from "react-hot-toast";

const AddressForm = ({ mode = "add", addressData = null, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use AddressContext methods
    const { addAddress, updateAddress } = useAddress();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty, isValid }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            addressType: 'home',
            country: 'India',
            state: '',
            city: '',
            postalCode: '',
            isDefault: false
        }
    });

    const watchedAddressType = watch("addressType");

    // Populate form with existing address data for edit mode
    useEffect(() => {
        if (mode === "edit" && addressData) {
            reset({
                firstName: addressData.firstName || '',
                lastName: addressData.lastName || '',
                phoneNumber: addressData.phoneNumber || '',
                address: addressData.address || '',
                addressType: addressData.addressType || 'home',
                country: 'India',
                state: addressData.state || '',
                city: addressData.city || '',
                postalCode: addressData.postalCode || '',
                isDefault: addressData.isDefault || false
            });
        }
    }, [mode, addressData, reset]);

    const onSubmit = useCallback(async (data) => {
        try {
            setLoading(true);
            setError(null);

            // Prepare data for API (remove any empty fields and ensure proper format)
            const apiData = {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                phoneNumber: data.phoneNumber.trim(),
                address: data.address.trim(),
                addressType: data.addressType,
                country: data.country.trim(),
                state: data.state.trim(),
                city: data.city.trim(),
                postalCode: data.postalCode.trim(),
                isDefault: data.isDefault
            };

            let response;
            // Use context methods for both add and edit operations
            if (mode === "add") {
                response = await addAddress(apiData);
            } else {
                response = await updateAddress(addressData._id, apiData);
            }

            if (response.success) {
                // Show success toast
                if (mode === "add") {
                    toast.success('Address added successfully!');
                } else {
                    toast.success('Address updated successfully!');
                }

                // Call success callback with the created/updated address data
                if (onSuccess) {
                    onSuccess(response.data);
                }

                // Reset form and close
                if (mode === "add") {
                    reset();
                }
                onClose();
            } else {
                const errorMessage = response.error || `Failed to ${mode} address`;
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (err) {
            const errorMessage = `An error occurred while ${mode === "add" ? "creating" : "updating"} the address`;
            setError(errorMessage);
            toast.error(errorMessage);
            console.error(`Error ${mode === "add" ? "creating" : "updating"} address:`, err);
        } finally {
            setLoading(false);
        }
    }, [mode, addressData, onSuccess, onClose, reset, addAddress, updateAddress]);

    const handleCancel = useCallback(() => {
        // Reset form data for add mode
        if (mode === "add") {
            reset();
        }
        onClose();
    }, [mode, reset, onClose]);

    const isEditMode = mode === "edit";
    const submitButtonText = isEditMode ? "Update Changes" : "Save Changes";
    const loadingText = isEditMode ? "Updating..." : "Saving...";

    return (
        <div className="p-4">
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

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                {...register("firstName", {
                                    required: "First name is required",
                                    minLength: {
                                        value: 2,
                                        message: "First name must be at least 2 characters"
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: "First name can only contain letters and spaces"
                                    }
                                })}
                                placeholder="Enter first name"
                                className={`w-full px-3 py-2 bg-form-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.firstName ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                {...register("phoneNumber", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[\+]?[1-9][\d]{0,15}$/,
                                        message: "Please enter a valid phone number"
                                    },
                                    minLength: {
                                        value: 10,
                                        message: "Phone number must be at least 10 digits"
                                    }
                                })}
                                placeholder="Enter phone number"
                                className={`w-full px-3 py-2 bg-form-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.phoneNumber ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                {...register("address", {
                                    required: "Address is required",
                                    minLength: {
                                        value: 10,
                                        message: "Address must be at least 10 characters"
                                    }
                                })}
                                placeholder="Enter address"
                                className={`w-full px-3 py-2 bg-form-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.address ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                            )}
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                State
                            </label>
                            <select
                                {...register("state", {
                                    required: "Please select a state"
                                })}
                                className={`w-full px-3 py-2 bg-form-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-sm ${errors.state ? 'border-red-500' : ''
                                    }`}
                            >
                                <option value="">Select state</option>
                                <option value="Maharashtra">Maharashtra</option>
                                {/* <option value="Gujarat">Gujarat</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Western Australia">Western Australia</option>
                                <option value="New South Wales">New South Wales</option>
                                <option value="California">California</option>
                                <option value="Texas">Texas</option> */}
                            </select>
                            {errors.state && (
                                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                            )}
                        </div>

                        {/* Zip Code */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Zip code / Postal Code
                            </label>
                            <input
                                type="text"
                                {...register("postalCode", {
                                    required: "Postal code is required",
                                    pattern: {
                                        value: /^[0-9]{4,6}$/,
                                        message: "Please enter a valid postal code (4-6 digits)"
                                    }
                                })}
                                placeholder="Enter zip code"
                                className={`w-full px-3 py-2 bg-form-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.postalCode ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.postalCode && (
                                <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Last Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                {...register("lastName", {
                                    required: "Last name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Last name must be at least 2 characters"
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: "Last name can only contain letters and spaces"
                                    }
                                })}
                                placeholder="Enter last name"
                                className={`w-full px-3 py-2 bg-form-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.lastName ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                            )}
                        </div>

                        {/* Address Type */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Address Type
                            </label>
                            <div className="flex gap-1 flex-wrap">
                                {['home', 'office', 'friend', 'other'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setValue("addressType", type, { shouldValidate: true })}
                                        className={`px-2 py-1 rounded-md font-medium transition-colors text-xs ${watchedAddressType === type
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
                        {/* <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Country
                            </label>
                            <select
                                {...register("country", {
                                    required: "Please select a country"
                                })}
                                className={`w-full px-3 py-2 bg-form-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-sm ${errors.country ? 'border-red-500' : ''
                                    }`}
                            >
                                <option value="">Select country</option>
                                <option value="India">India</option>
                                <option value="Australia">Australia</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                            </select>
                            {errors.country && (
                                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                            )}
                        </div>  */}

                        {/* City */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <select
                                {...register("city", {
                                    required: "Please select a city"
                                })}
                                className={`w-full px-3 py-2 bg-form-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-sm ${errors.city ? 'border-red-500' : ''
                                    }`}
                            >
                                <option value="">Select city</option>
                                <option value="Mumbai">Mumbai</option>
                                {/* <option value="Delhi">Delhi</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Chennai">Chennai</option> */}
                                {/* <option value="Perth">Perth</option>
                                <option value="Sydney">Sydney</option>
                                <option value="Los Angeles">Los Angeles</option>
                                <option value="New York">New York</option> */}
                            </select>
                            {errors.city && (
                                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Default Address Checkbox */}
                <div className="mt-6 mb-6">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            {...register("isDefault")}
                            className="w-5 h-5 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <span className="text-xs font-medium text-gray-700">Set as default address</span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !isValid}
                        className="px-3 py-1.5 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
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
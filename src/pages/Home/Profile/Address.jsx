"use client";
import { useState, useEffect } from "react";
import ProfileSidebar from "../../../components/Sidebar/ProfileSidebar";
import AddressForm from "../../../components/Modals/AddressForm";
import { getAllCustomerAddresses, deleteCustomerAddress } from "../../../api";

export default function Address() {
    const [addressData, setAddressData] = useState([]);
    const [originalAddressData, setOriginalAddressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("add"); // "add" or "edit"
    const [editingAddress, setEditingAddress] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingAddress, setDeletingAddress] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllCustomerAddresses();

            if (response.success) {
                setOriginalAddressData(response.data);

                // Map API response to component format
                const mappedAddresses = response.data.map(address => ({
                    id: address._id,
                    name: `${address.firstName} ${address.lastName}`,
                    phone: address.phoneNumber,
                    address: `${address.address}, ${address.city}, ${address.state}, ${address.country} - ${address.postalCode}`,
                    isDefault: address.isDefault,
                    type: address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1)
                }));
                setAddressData(mappedAddresses);
            } else {
                setError(response.message || "Failed to fetch addresses");
            }
        } catch (err) {
            setError("An error occurred while fetching addresses");
            console.error("Error fetching addresses:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = () => {
        setFormMode("add");
        setEditingAddress(null);
        setShowForm(true);
    };

    const handleEditAddress = (mappedAddress) => {
        // Find the original address data from the API response
        const originalAddress = originalAddressData.find(addr => addr._id === mappedAddress.id);
        if (originalAddress) {
            setEditingAddress(originalAddress);
            setFormMode("edit");
            setShowForm(true);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingAddress(null);
        setFormMode("add");
    };

    const handleFormSuccess = (addressData) => {
        console.log(`Address ${formMode === "add" ? "added" : "updated"} successfully:`, addressData);
        // Refresh addresses after successful operation
        fetchAddresses();
    };

    const handleDeleteAddress = (mappedAddress) => {
        // Find the original address data from the API response
        const originalAddress = originalAddressData.find(addr => addr._id === mappedAddress.id);
        if (originalAddress) {
            setDeletingAddress(originalAddress);
            setShowDeleteModal(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingAddress) return;

        try {
            setDeleteLoading(true);
            const response = await deleteCustomerAddress(deletingAddress._id);

            if (response.success) {
                console.log('Address deleted successfully');
                fetchAddresses();
                setShowDeleteModal(false);
                setDeletingAddress(null);
            } else {
                console.error('Failed to delete address:', response.message);
            }
        } catch (err) {
            console.error('Error deleting address:', err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingAddress(null);
    };

    return (
        <>
            <div className="flex px-40 py-12">
                <ProfileSidebar />
                <div className="flex-1 ml-6 rounded-lg bg-white p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-lg">My Address</h2>
                        <button
                            onClick={handleAddAddress}
                            className="bg-button-vertical-gradient-orange text-white px-4 py-2 font-medium hover:opacity-90 transition-all duration-200"
                        >
                            Add New Address
                        </button>
                    </div>

                    {/* Address Form (Add/Edit) */}
                    {showForm && (
                        <AddressForm
                            mode={formMode}
                            addressData={editingAddress}
                            onClose={handleCloseForm}
                            onSuccess={handleFormSuccess}
                        />
                    )}


                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-500 mb-4">
                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={fetchAddresses}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : addressData.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 mb-4">No addresses found</p>
                            <p className="text-gray-500 text-sm">Add your first address to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addressData.map((address) => (
                                <div key={address.id} className="bg-gray-100 p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg mb-1">{address.name}</h3>
                                            <p className="text-gray-700 mb-1">{address.phone}</p>
                                            <p className="text-gray-700">{address.address}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleEditAddress(address)}
                                                className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(address)}
                                                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-3">
                                        {address.isDefault && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                                <span className="text-sm text-gray-600">Default Address</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-black rounded-full"></div>
                                            <span className="text-sm text-gray-600">{address.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deletingAddress && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Address</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-2">
                                Are you sure you want to delete this address?
                            </p>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="font-medium text-gray-900">
                                    {deletingAddress.firstName} {deletingAddress.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{deletingAddress.phoneNumber}</p>
                                <p className="text-sm text-gray-600">
                                    {deletingAddress.address}, {deletingAddress.city}, {deletingAddress.state}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {deleteLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Address'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

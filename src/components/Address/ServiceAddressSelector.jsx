import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import { useAddress } from '../../context/AddressContext';
import AddressForm from '../Modals/AddressForm';
import toast from 'react-hot-toast';

// Memoized components to prevent unnecessary re-renders
const AddButton = memo(({ onClick, className = "" }) => (
    <button
        type="button"
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(e);
        }}
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-all duration-150 text-sm font-medium ${className}`}
    >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add New Address
    </button>
));

const ActionButton = memo(({ onClick, disabled, className, title, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1 transition-all duration-150 ${disabled
            ? 'text-gray-300 cursor-not-allowed'
            : className
            }`}
        title={title}
    >
        {children}
    </button>
));

const AddressItem = memo(({ address, isDefault, isSelecting, onSelect, onEdit, onDelete }) => (
    <div
        className={`p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer ${isSelecting ? 'bg-orange-50' : ''}`}
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(address);
        }}
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
    >
        <div className="flex items-start justify-between">
            <div className={`flex-1 ${isSelecting ? 'pointer-events-none' : ''}`}>
                <p className="font-medium text-sm text-gray-900">
                    {address.firstName} {address.lastName}
                </p>
                <p className="text-xs text-gray-600">{address.phoneNumber}</p>
                <p className="text-xs text-gray-600 mt-1">
                    {address.address}, {address.city}, {address.state} - {address.postalCode}
                </p>
                {isSelecting && (
                    <div className="flex items-center gap-2 mt-1">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-500"></div>
                        <p className="text-xs text-orange-600 font-medium">Setting as default...</p>
                    </div>
                )}
            </div>

            <div className="flex gap-1 ml-3">
                <ActionButton
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(address);
                    }}
                    disabled={isSelecting}
                    className="text-gray-500 hover:text-orange-500 hover:bg-orange-50 active:bg-orange-100"
                    title="Edit address"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </ActionButton>
                <ActionButton
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(address);
                    }}
                    disabled={isSelecting}
                    className="text-gray-500 hover:text-red-500 hover:bg-red-50 active:bg-red-100"
                    title="Delete address"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </ActionButton>
            </div>
        </div>
    </div>
));

// Add display names for better debugging
AddButton.displayName = 'AddButton';
ActionButton.displayName = 'ActionButton';
AddressItem.displayName = 'AddressItem';

const ServiceAddressSelector = () => {
    const [showSelector, setShowSelector] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("add");
    const [editingAddress, setEditingAddress] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingAddress, setDeletingAddress] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectingAddress, setSelectingAddress] = useState(null);

    const { addresses, defaultAddress, changeDefaultAddress, removeAddress, error } = useAddress();

    // Memoize expensive computations
    const hasAddresses = useMemo(() => addresses.length > 0, [addresses.length]);
    const isModalOpen = useMemo(() => showForm || showDeleteModal, [showForm, showDeleteModal]);

    // Optimized handlers
    const openForm = useCallback((mode, address = null) => {
        setFormMode(mode);
        setEditingAddress(address);
        setShowForm(true);
        setShowSelector(false);

        // Ensure the modal is properly mounted
        requestAnimationFrame(() => {
            document.body.style.overflow = 'hidden';
        });
    }, []);

    const closeForm = useCallback(() => {
        setShowForm(false);
        setEditingAddress(null);
        setFormMode("add");
        document.body.style.overflow = 'unset';
    }, []);

    const openDeleteModal = useCallback((address) => {
        setDeletingAddress(address);
        setShowDeleteModal(true);
        setShowSelector(false);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
        setDeletingAddress(null);
    }, []);

    const handleAddressSelect = useCallback(async (selectedAddress) => {
        if (selectedAddress._id === defaultAddress?._id) {
            setShowSelector(false);
            return;
        }

        try {
            setSelectingAddress(selectedAddress._id);
            setIsUpdating(true);
            const result = await changeDefaultAddress(selectedAddress);

            if (result.success) {
                toast.success('Default address updated successfully!');
                setShowSelector(false);
            } else {
                toast.error(result.error || 'Failed to update default address');
            }
        } catch (err) {
            console.error('Error updating address:', err);
            toast.error('An error occurred while updating the address');
        } finally {
            setIsUpdating(false);
            setSelectingAddress(null);
        }
    }, [defaultAddress?._id, changeDefaultAddress]);

    const handleConfirmDelete = useCallback(async () => {
        if (!deletingAddress) return;

        try {
            setDeleteLoading(true);
            const response = await removeAddress(deletingAddress._id);

            if (response.success) {
                toast.success('Address deleted successfully!');
                closeDeleteModal();
            } else {
                toast.error(response.error || 'Failed to delete address');
            }
        } catch (err) {
            console.error('Error deleting address:', err);
            toast.error('An error occurred while deleting the address');
        } finally {
            setDeleteLoading(false);
        }
    }, [deletingAddress, removeAddress, closeDeleteModal]);

    const handleBackdropClick = useCallback((e, modalType) => {
        if (e.target === e.currentTarget) {
            if (modalType === 'form') closeForm();
            else if (modalType === 'delete') closeDeleteModal();
        }
    }, [closeForm, closeDeleteModal]);

    // Handle escape key to close modals - optimized with memoized condition
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                if (showForm) closeForm();
                else if (showDeleteModal) closeDeleteModal();
            }
        };

        if (showForm || showDeleteModal) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            if (!showForm && !showDeleteModal) {
                document.body.style.overflow = 'unset';
            }
        };
    }, [showForm, showDeleteModal, closeForm, closeDeleteModal]);


    const renderContent = () => (
        <div 
            className="bg-red-50 border border-red-200 p-3 rounded-lg"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex flex-col">
                <div className="mb-2">
                    <p className="text-red-600 text-sm font-medium">No delivery address selected</p>
                    <p className="text-red-500 text-xs mt-1">
                        {hasAddresses
                            ? 'Please select or add an address to continue'
                            : 'Please add a delivery address to continue'}
                    </p>
                </div>

                {/* Show add button directly when no addresses exist */}
                {!hasAddresses && (
                    <div className="mt-2">
                        <AddButton
                            onClick={() => openForm("add")}
                            className="w-full"
                        />
                    </div>
                )}
            </div>

            {/* Show address selector dropdown when addresses exist */}
            {hasAddresses && (
                <div 
                    className="mt-3 border border-gray-200 rounded-lg bg-white shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-3 border-b border-gray-100">
                        <AddButton
                            onClick={() => openForm("add")}
                        />
                    </div>
                    {addresses.map((address) => (
                        <AddressItem
                            key={address._id}
                            address={address}
                            isSelecting={selectingAddress === address._id}
                            onSelect={handleAddressSelect}
                            onEdit={(address) => openForm("edit", address)}
                            onDelete={openDeleteModal}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    if (!defaultAddress) {
        return (
            <>
                {renderContent()}
                {showForm && createPortal(
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
                        onClick={(e) => handleBackdropClick(e, 'form')}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <div
                            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg z-10">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {formMode === "add" ? "Add New Address" : "Edit Address"}
                                    </h3>
                                    <button
                                        onClick={closeForm}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <AddressForm
                                    key={`${formMode}-${editingAddress?._id || 'new'}`}
                                    mode={formMode}
                                    addressData={editingAddress}
                                    onClose={closeForm}
                                    onSuccess={closeForm}
                                />
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </>
        );
    }

    return (
        <div>
            <div 
                className="bg-gray-50 p-3 rounded-lg"
                onClick={(e) => e.stopPropagation()}
            >
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
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowSelector(!showSelector);
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        disabled={isUpdating}
                        className="text-orange-500 text-xs hover:underline disabled:opacity-50"
                    >
                        {isUpdating ? 'Updating...' : 'Change'}
                    </button>
                </div>
            </div>

            {/* Address Selector Dropdown */}
            {showSelector && (
                <div 
                    className="mt-2 border border-gray-200 rounded-lg bg-white shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-3 border-b border-gray-100">
                        <AddButton onClick={() => openForm("add")} />
                    </div>
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className={`${address._id === defaultAddress?._id
                                ? 'bg-orange-50 border-l-4 border-orange-500'
                                : ''
                                }`}
                        >
                            <AddressItem
                                address={address}
                                isDefault={address._id === defaultAddress?._id}
                                isSelecting={selectingAddress === address._id}
                                onSelect={handleAddressSelect}
                                onEdit={(address) => openForm("edit", address)}
                                onDelete={openDeleteModal}
                            />
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-xs">{error}</p>
                </div>
            )}


            {/* Address Form Modal */}
            {showForm && createPortal(
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
                    onClick={(e) => handleBackdropClick(e, 'form')}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <div
                        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col"
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: '42rem',
                            maxHeight: '90vh',
                            backgroundColor: 'white',
                            borderRadius: '0.5rem',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg z-10">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {formMode === "add" ? "Add New Address" : "Edit Address"}
                                </h3>
                                <button
                                    onClick={closeForm}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <AddressForm
                                key={`${formMode}-${editingAddress?._id || 'new'}`}
                                mode={formMode}
                                addressData={editingAddress}
                                onClose={closeForm}
                                onSuccess={() => {
                                    console.log('Address form submitted successfully');
                                    closeForm();
                                }}
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deletingAddress && createPortal(
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
                    onClick={(e) => handleBackdropClick(e, 'delete')}
                >
                    <div className="bg-white rounded-lg max-w-md w-full shadow-2xl transform transition-all">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">Delete Address</h3>
                                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-700 mb-3">
                                    Are you sure you want to delete this address?
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <p className="font-medium text-gray-900">
                                        {deletingAddress.firstName} {deletingAddress.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{deletingAddress.phoneNumber}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {deletingAddress.address}, {deletingAddress.city}, {deletingAddress.state}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={closeDeleteModal}
                                    disabled={deleteLoading}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={deleteLoading}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
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
                </div>,
                document.body
            )}
        </div>
    );
};

export default ServiceAddressSelector;

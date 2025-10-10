import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Eye, CloseCircle, Calendar, Tag, Box, InfoCircle, MoneyRecive, Edit2, Trash, ToggleOn, ToggleOff, Star1 } from 'iconsax-reactjs';
import { X } from '@phosphor-icons/react';

function ProductViewModal({ product, isOpen, onClose }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate discount percentage
    const calculateDiscount = (mrp, selling) => {
        if (!mrp || !selling) return 0;
        return Math.round(((mrp - selling) / mrp) * 100);
    };

    // Get stock status
    const getStockStatus = (stock) => {
        if (stock > 50) return { label: 'In Stock', color: 'text-green-600 bg-green-50', icon: '●' };
        if (stock > 10) return { label: 'Low Stock', color: 'text-yellow-600 bg-yellow-50', icon: '●' };
        if (stock > 0) return { label: 'Very Low', color: 'text-orange-600 bg-orange-50', icon: '●' };
        return { label: 'Out of Stock', color: 'text-red-600 bg-red-50', icon: '●' };
    };

    if (!product) return null;

    const discount = calculateDiscount(product.mrpPrice, product.sellingPrice);
    const savings = product.mrpPrice - product.sellingPrice;
    const stockStatus = getStockStatus(product.stock || 0);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 backdrop-blur-[2.3px] bg-black/20" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                                {/* Enhanced Header */}
                                <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 px-6 py-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h2 className="text-xl font-tbLex text-gray-900">Product Overview</h2>
                                                <p className="text-sm text-gray-600 mt-1">Complete product information and management</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${product.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                                                {product.isActive ? <ToggleOn size={20} className="text-green-600" /> : <ToggleOff size={20} className="text-red-600" />}
                                                <span className={`text-sm font-medium ${product.isActive ? 'text-green-700' : 'text-red-700'}`}>
                                                    {product.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={onClose}
                                                className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 cursor-pointer"
                                            >
                                                <X size={24} className="text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="max-h-[80vh] overflow-y-auto">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                                        {/* Left Column - Images */}
                                        <div className="space-y-4">
                                            {/* Main Image */}
                                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                                                {product.images && product.images.length > 0 ? (
                                                    <>
                                                        <img
                                                            src={product.images[selectedImageIndex]}
                                                            alt={product.name}
                                                            className={`w-full h-full object-cover transition-opacity duration-300 aspect-square ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                                                            onLoad={() => setIsImageLoading(false)}
                                                        />
                                                        {isImageLoading && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                                            </div>
                                                        )}
                                                        {discount > 0 && (
                                                            <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-sm">
                                                                {discount}% OFF
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <Box size={64} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Thumbnail Images */}
                                            {product.images && product.images.length > 1 && (
                                                <div className="flex space-x-3 overflow-x-auto pb-2">
                                                    {product.images.map((image, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                setSelectedImageIndex(index);
                                                                setIsImageLoading(true);
                                                            }}
                                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index
                                                                ? 'border-gray-900 shadow-md scale-105'
                                                                : 'border-gray-200 hover:border-gray-400'
                                                                }`}
                                                        >
                                                            <img
                                                                src={image}
                                                                alt={`${product.name} ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Column - Product Info */}
                                        <div className="space-y-6">
                                            {/* Product Title & Category */}
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                                        {product.category?.name || 'Uncategorized'}
                                                    </span>
                                                    {product.subcategory?.name && (
                                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                                            {product.subcategory.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <h1 className="text-xl font-tbLex text-gray-900 leading-tight">
                                                    {product.name || 'Unnamed Product'}
                                                </h1>
                                            </div>

                                            {/* Pricing */}
                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                <div className="flex items-baseline space-x-3">
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        ₹{product.sellingPrice?.toLocaleString('en-IN') || '0'}
                                                    </span>
                                                    {product.mrpPrice && product.mrpPrice > product.sellingPrice && (
                                                        <>
                                                            <span className="text-lg text-gray-500 line-through">
                                                                ₹{product.mrpPrice.toLocaleString('en-IN')}
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded">
                                                                Save ₹{savings?.toLocaleString('en-IN')}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quick Info Grid */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <Box size={16} className="text-gray-600" />
                                                        <span className="text-sm font-medium text-gray-600">Stock</span>
                                                    </div>
                                                    <span className={`text-lg font-semibold ${(product.stock || 0) > 0 ? 'text-gray-900' : 'text-gray-600'
                                                        }`}>
                                                        {product.stock || 0} units
                                                    </span>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <Calendar size={16} className="text-gray-600" />
                                                        <span className="text-sm font-medium text-gray-600">Created</span>
                                                    </div>
                                                    <span className="text-sm text-gray-800">
                                                        {formatDate(product.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            {product.description && (
                                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                                    <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-3">
                                                        <InfoCircle size={20} className="text-gray-600" />
                                                        <span>Description</span>
                                                    </h3>
                                                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    {/* Additional Information Tabs */}
                                    <div className="px-6 pb-6">
                                        <div className="border-t border-gray-200 pt-6">
                                            <div className="space-y-6">
                                                {/* Highlights */}
                                                {product.highlights && product.highlights.trim() && (
                                                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                                                        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
                                                            <Star1 size={20} className="text-gray-600" />
                                                            <span>Highlights</span>
                                                        </h3>
                                                        <p className="text-gray-700 leading-relaxed">{product.highlights}</p>
                                                    </div>
                                                )}

                                                {/* Additional Info */}
                                                {product.additionalInfo && product.additionalInfo.trim() && (
                                                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                                                        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
                                                            <InfoCircle size={20} className="text-gray-600" />
                                                            <span>Additional Information</span>
                                                        </h3>
                                                        <p className="text-gray-700 leading-relaxed">{product.additionalInfo}</p>
                                                    </div>
                                                )}

                                                {/* Specifications */}
                                                {product.specification && (
                                                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                                                        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
                                                            <Tag size={20} className="text-gray-600" />
                                                            <span>Specifications</span>
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {Array.isArray(product.specification) ?
                                                                product.specification.map((spec, index) => (
                                                                    <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                                                                        <span className="font-medium text-gray-700">{spec?.key}</span>
                                                                        <span className="text-gray-900 font-medium">{spec?.value}</span>
                                                                    </div>
                                                                )) :
                                                                Object.entries(product.specification).map(([key, value], index) => (
                                                                    <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                                                                        <span className="font-medium text-gray-700">{key}</span>
                                                                        <span className="text-gray-900 font-medium">{value}</span>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

// Trigger Button Component
export function ProductViewButton({ product, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors ${className}`}
                title="View Product Details"
            >
                <Eye size={16} />
            </button>
            <ProductViewModal
                product={product}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}

export default ProductViewModal

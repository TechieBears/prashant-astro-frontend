import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Star1, User, Location, Calendar, VideoPlay } from 'iconsax-reactjs';
import { X } from '@phosphor-icons/react';
import moment from 'moment';

function ViewTestimonialModal({ testimonial, isOpen, onClose }) {
    if (!testimonial) return null;

    const renderMedia = (mediaItem, index) => {
        if (typeof mediaItem === 'string') {
            const isVideo = mediaItem.includes('.mp4') || mediaItem.includes('.webm');
            return isVideo ? (
                <video key={index} controls className="w-full rounded-lg">
                    <source src={mediaItem} type="video/mp4" />
                </video>
            ) : (
                <img key={index} src={mediaItem} alt="Testimonial" className="w-full rounded-lg object-cover" />
            );
        }
        return mediaItem.type === 'video' ? (
            <video key={mediaItem._id} controls className="w-full rounded-lg">
                <source src={mediaItem.url} type="video/mp4" />
            </video>
        ) : (
            <img key={mediaItem._id} src={mediaItem.url} alt={mediaItem.originalname} className="w-full rounded-lg object-cover" />
        );
    };

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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                                {/* Header */}
                                <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 px-6 py-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-tbLex text-gray-900">Testimonial Details</h2>
                                            <p className="text-sm text-gray-600 mt-1">Complete testimonial information</p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
                                        >
                                            <X size={24} className="text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
                                    {/* User Info */}
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={testimonial.user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                                alt={`${testimonial.user?.firstName} ${testimonial.user?.lastName}`}
                                                className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-300"
                                            />
                                            <div>
                                                <p className="font-semibold text-lg capitalize text-gray-900">
                                                    {testimonial.user?.firstName} {testimonial.user?.lastName}
                                                </p>
                                                <p className="text-sm text-gray-600">{testimonial.user?.email}</p>
                                                <p className="text-sm text-gray-600">{testimonial.user?.mobileNo}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Service/Product */}
                                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-600 mb-2">Service/Product</h3>
                                            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium">
                                                {testimonial.product?.name || testimonial.service?.title || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        {testimonial.rating && (
                                            <div className="bg-white rounded-xl p-5 border border-gray-200">
                                                <h3 className="text-sm font-medium text-gray-600 mb-2">Rating</h3>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, index) => (
                                                        <Star1
                                                            key={index}
                                                            size={20}
                                                            variant={index < testimonial.rating ? 'Bold' : 'Outline'}
                                                            color={index < testimonial.rating ? '#FFD700' : '#E5E7EB'}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm font-medium text-gray-700">({testimonial.rating}/5)</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-600 mb-3">Message</h3>
                                        <p className="text-gray-800 leading-relaxed">{testimonial.message}</p>
                                    </div>

                                    {/* Location */}
                                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                                        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                                            <Location size={18} />
                                            Location
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">City</p>
                                                <p className="text-gray-900 font-medium capitalize">{testimonial.city || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">State</p>
                                                <p className="text-gray-900 font-medium capitalize">{testimonial.state || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Country</p>
                                                <p className="text-gray-900 font-medium capitalize">{testimonial.country || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Media */}
                                    {testimonial.media && testimonial.media.length > 0 && (
                                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                                            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                                                <VideoPlay size={18} />
                                                Media
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {testimonial.media.map((item, index) => renderMedia(item, index))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Status & Date */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-600 mb-2">Status</h3>
                                            <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {testimonial.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                                            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                                                <Calendar size={18} />
                                                Created At
                                            </h3>
                                            <p className="text-gray-900 font-medium">
                                                {moment(testimonial.createdAt).format('DD-MM-YYYY hh:mm A')}
                                            </p>
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

export default ViewTestimonialModal;

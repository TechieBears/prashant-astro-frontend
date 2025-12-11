import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Star1, Location, Calendar, VideoPlay } from 'iconsax-reactjs';
import { X } from '@phosphor-icons/react';
import moment from 'moment';

function ViewTestimonialModal({ testimonial, isOpen, onClose }) {
    if (!testimonial) return null;

    const renderMedia = (mediaItem, index) => {
        const isString = typeof mediaItem === 'string';
        const isVideo = isString ? mediaItem.includes('.mp4') || mediaItem.includes('.webm') : mediaItem.type === 'video';
        const src = isString ? mediaItem : mediaItem.url;
        const key = isString ? index : mediaItem._id;

        return isVideo ? (
            <video key={key} controls className="w-full rounded-lg">
                <source src={src} type="video/mp4" />
            </video>
        ) : (
            <img key={key} src={src} alt="Testimonial" className="w-full rounded-lg object-cover" />
        );
    };

    const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
        <div className={`bg-white rounded-xl p-5 border border-gray-200 ${className}`}>
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                {Icon && <Icon size={18} />}
                {title}
            </h3>
            {children}
        </div>
    );

    const LocationItem = ({ label, value }) => (
        <div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-gray-900 font-medium capitalize">{value || 'N/A'}</p>
        </div>
    );

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
                                        <InfoCard title="Service/Product">
                                            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium">
                                                {testimonial.product?.name || testimonial.service?.title || 'N/A'}
                                            </span>
                                        </InfoCard>

                                        {testimonial.rating && (
                                            <InfoCard title="Rating">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star1 key={i} size={20} variant={i < testimonial.rating ? 'Bold' : 'Outline'} color={i < testimonial.rating ? '#FFD700' : '#E5E7EB'} />
                                                    ))}
                                                    <span className="ml-2 text-sm font-medium text-gray-700">({testimonial.rating}/5)</span>
                                                </div>
                                            </InfoCard>
                                        )}
                                    </div>

                                    <InfoCard title="Message" className="mb-3">
                                        <p className="text-gray-800 leading-relaxed">{testimonial.message}</p>
                                    </InfoCard>

                                    <InfoCard title="Location" icon={Location} className="mb-3">
                                        <div className="grid grid-cols-3 gap-4">
                                            <LocationItem label="City" value={testimonial.city} />
                                            <LocationItem label="State" value={testimonial.state} />
                                            <LocationItem label="Country" value={testimonial.country} />
                                        </div>
                                    </InfoCard>

                                    {testimonial.media?.length > 0 && (
                                        <InfoCard title="Media" icon={VideoPlay} className="mb-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {testimonial.media.map(renderMedia)}
                                            </div>
                                        </InfoCard>
                                    )}

                                    <div className="grid grid-cols-2 gap-6">
                                        <InfoCard title="Status">
                                            <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {testimonial.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </InfoCard>
                                        <InfoCard title="Created At" icon={Calendar}>
                                            <p className="text-gray-900 font-medium">
                                                {moment(testimonial.createdAt).format('DD-MM-YYYY hh:mm A')}
                                            </p>
                                        </InfoCard>
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

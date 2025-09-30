import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { TableTitle } from '../../../helper/Helper';
import PriceFormater from '../../../utils/PriceFormater';
import { CreditCard, Calendar, MapPin, User, Package, Eye, Clock } from 'lucide-react';

function ServiceBookingViewModal({ bookingData }) {

    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    // Helper functions for formatting
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return timeString;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
            case 'success':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getServiceTypeLabel = (type) => {
        switch (type) {
            case 'pandit_center':
                return 'At Pandit Center';
            case 'online':
                return 'Online Session';
            case 'home_visit':
                return 'Home Visit';
            default:
                return type;
        }
    };

    return (
        <>
            <button onClick={toggle}>
                <Eye className='text-blue-500' size={20} />
            </button>
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-[1000]" onClose={() => toggle()}>
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
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                                    <TableTitle
                                        title={`Service Booking - #${bookingData.orderId?.slice(-8)}`}
                                        toggle={toggle}
                                    />

                                    <div className="bg-white p-6 max-h-[80vh] overflow-y-auto">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Left Column */}
                                            <div className="space-y-6">
                                                {/* Customer Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-blue-50 rounded-lg">
                                                            <User className="text-blue-600" size={20} />
                                                        </div>
                                                        <h3 className="text-base font-medium font-tbLex text-black">
                                                            Customer Information
                                                        </h3>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Name:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                {bookingData?.address?.firstName} {bookingData?.address?.lastName}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Phone:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                {bookingData?.address?.phoneNumber}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Order ID:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                #{bookingData?.orderId}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Service Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-purple-50 rounded-lg">
                                                            <Package className="text-purple-600" size={20} />
                                                        </div>
                                                        <h3 className="text-base font-medium font-tbLex text-black">
                                                            Service Details
                                                        </h3>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                                        {bookingData?.services?.map((service, index) => (
                                                            <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Service:</span>
                                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                        {service?.serviceName}
                                                                    </span>
                                                                </div>

                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Price:</span>
                                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                        <PriceFormater price={service?.servicePrice} />
                                                                    </span>
                                                                </div>

                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Duration:</span>
                                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                        {service?.durationInMinutes} minutes
                                                                    </span>
                                                                </div>

                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Service Type:</span>
                                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                        {getServiceTypeLabel(service?.serviceType)}
                                                                    </span>
                                                                </div>

                                                                {service?.astrologerName && (
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm font-medium text-gray-600 font-tbLex">Astrologer:</span>
                                                                        <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                            {service?.astrologerName}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Address Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-green-50 rounded-lg">
                                                            <MapPin className="text-green-600" size={20} />
                                                        </div>
                                                        <h3 className="text-base font-medium font-tbLex text-black">
                                                            Address Information
                                                        </h3>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Address Type:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop capitalize">
                                                                {bookingData?.address?.addressType}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between items-start">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Address:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop text-right max-w-[60%]">
                                                                {bookingData?.address?.address}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">City:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                {bookingData?.address?.city}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">State:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                {bookingData?.address?.state}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Postal Code:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                {bookingData?.address?.postalCode}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Country:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                {bookingData?.address?.country}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="space-y-6">
                                                {/* Booking Schedule */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-orange-50 rounded-lg">
                                                            <Calendar className="text-orange-600" size={20} />
                                                        </div>
                                                        <h3 className="text-base font-medium font-tbLex text-black">
                                                            Booking Schedule
                                                        </h3>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                                        {bookingData?.services?.map((service, index) => (
                                                            <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Date:</span>
                                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                        {formatDate(service?.bookingDate)}
                                                                    </span>
                                                                </div>

                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Time:</span>
                                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                        {service?.startTime} - {service?.endTime}
                                                                    </span>
                                                                </div>

                                                                {service?.zoomLink && (
                                                                    <div className="flex justify-between items-center mt-2">
                                                                        <span className="text-sm font-medium text-gray-600 font-tbLex">Zoom Link:</span>
                                                                        <a
                                                                            href={service?.zoomLink}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="text-sm font-semibold text-blue-600 font-tbPop hover:text-blue-800"
                                                                        >
                                                                            Join Session
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Payment Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                                            <CreditCard className="text-indigo-600" size={20} />
                                                        </div>
                                                        <h3 className="text-base font-medium font-tbLex text-black">
                                                            Payment Details
                                                        </h3>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Payment ID:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                {bookingData?.paymentId}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Total Amount:</span>
                                                            <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                                <PriceFormater price={bookingData?.totalAmount} />
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Final Amount:</span>
                                                            <span className="text-lg font-bold text-gray-900 font-tbPop">
                                                                <PriceFormater price={bookingData?.finalAmount} />
                                                            </span>
                                                        </div>

                                                        {bookingData?.paymentDetails?.note && (
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-sm font-medium text-gray-600 font-tbLex">Note:</span>
                                                                <span className="text-sm font-semibold text-gray-800 font-tbPop text-right max-w-[60%]">
                                                                    {bookingData?.paymentDetails?.note}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Information */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-2 bg-teal-50 rounded-lg">
                                                            <Clock className="text-teal-600" size={20} />
                                                        </div>
                                                        <h3 className="text-base font-medium font-tbLex text-black">
                                                            Status Information
                                                        </h3>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                                                        {bookingData?.services?.map((service, index) => (
                                                            <div key={index} className="space-y-3 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                                                                <div className="text-sm font-medium text-gray-700 font-tbPop mb-2">
                                                                    {service?.serviceName}:
                                                                </div>

                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Astrologer Status:</span>
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-tbPop ${getStatusColor(service?.astrologerStatus)}`}>
                                                                        {service?.astrologerStatus}
                                                                    </span>
                                                                </div>

                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Booking Status:</span>
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-tbPop ${getStatusColor(service?.bookingStatus)}`}>
                                                                        {service?.bookingStatus}
                                                                    </span>
                                                                </div>

                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Payment Status:</span>
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-tbPop ${getStatusColor(service?.paymentStatus)}`}>
                                                                        {service?.paymentStatus}
                                                                    </span>
                                                                </div>

                                                                {service?.rejectReason && (
                                                                    <div className="flex justify-between items-start">
                                                                        <span className="text-sm font-medium text-gray-600 font-tbLex">Reject Reason:</span>
                                                                        <span className="text-sm font-semibold text-red-600 font-tbPop text-right max-w-[60%]">
                                                                            {service?.rejectReason}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}

                                                        <div className="flex justify-between items-center pt-2">
                                                            <span className="text-sm font-medium text-gray-600 font-tbLex">Overall Payment:</span>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-tbPop ${getStatusColor(bookingData?.paymentStatus)}`}>
                                                                {bookingData?.paymentStatus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Booking Created */}
                                                <div className="text-center pt-4">
                                                    <div className="text-xs text-gray-500 font-tbLex">
                                                        Booking created on {formatDate(bookingData?.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </>
    )
}

export default ServiceBookingViewModal

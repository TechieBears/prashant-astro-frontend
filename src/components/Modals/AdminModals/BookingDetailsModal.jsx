import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { TableTitle } from '../../../helper/Helper';
import { Video, TickCircle, CloseCircle } from 'iconsax-reactjs';
import moment from 'moment';
import { checkAvailabilityById, updateServiceOrderStatus } from '../../../api';
import toast from 'react-hot-toast';
import { formBtn1 } from '../../../utils/CustomClass';
import Preloaders from '../../Loader/Preloaders';

function BookingDetailsModal({ open, toggle, bookingDatas, refetch }) {

    const [bookingData, setBookingData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [Loading, setLoading] = useState(true);
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const formatTime = (time) => {
        return moment(time, "HH:mm").format("hh:mm A");
    };

    const formatDate = (date) => {
        return moment(date).format("dddd, MMMM Do YYYY");
    };

    const formatCurrency = (amount) => {
        return `₹${amount?.toLocaleString('en-IN')}`;
    };

    const getStatusBadge = (status, type = 'default') => {
        const statusConfig = {
            pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
            confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
            accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
            rejected: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-400' },
            paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
            unpaid: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-400' },
            online: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
            offline: { bg: 'bg-slate-50', text: 'text-slate-700', dot: 'bg-slate-400' },
        };

        const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text} font-tbPop`}>
                <div className={`w-1.5 h-1.5 ${config.dot} rounded-full mr-1.5`}></div>
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
        );
    };

    const handleAccept = async () => {
        setIsLoading(true);
        try {
            const payload = {
                serviceItemId: bookingData?.item?.serviceItemId,
                astrologerStatus: "accepted",
                rejectReason: ""
            }
            const response = await updateServiceOrderStatus(payload);
            if (response.success) {
                toast.success("Booking accepted successfully");
                refetch();
                setLoading(false);
                setIsLoading(false);
                toggle();
            } else {
                toast.error(response.message);
                setIsLoading(false);
                toggle();
            }
        } catch (error) {
            toast.error("Failed to accept booking");
            setIsLoading(false);
            toggle();
        } finally {
            setIsLoading(false);
        }
    };

    const handleRejectClick = () => {
        setShowRejectInput(true);
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                serviceItemId: bookingData?.item?.serviceItemId,
                astrologerStatus: "rejected",
                rejectReason: rejectReason.trim()
            }
            const response = await updateServiceOrderStatus(payload);
            if (response.success) {
                toast.success("Booking rejected successfully");
                setShowRejectInput(false);
                setRejectReason('');
                refetch();
                setIsLoading(false);
                toggle();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to reject booking");
            setIsLoading(false);
            toggle();
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelReject = () => {
        setShowRejectInput(false);
        setRejectReason('');
        setIsLoading(false);
        toggle();
    };


    useEffect(() => {
        const getBookingData = async () => {
            try {
                const response = await checkAvailabilityById(bookingDatas?._id);
                setBookingData({ item: response?.item, itemData: response?.itemData });
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch booking details");
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        if (open && bookingDatas?._id) {
            getBookingData();
            setShowRejectInput(false);
            setRejectReason('');
        }
    }, [open, bookingDatas]);

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[1000]" onClose={toggle}>
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

                <div className="fixed inset-0 overflow-y-auto scrollbars">
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
                                    title="Service Booking Details"
                                    toggle={toggle}
                                />

                                {!Loading ? (
                                    <div className="bg-white">
                                        {/* Status Overview */}
                                        <div className="bg-white p-4">
                                            <div className="flex flex-wrap gap-2 justify-evenly items-center">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-medium text-gray-600 font-tbLex">Booking:</span>
                                                    {getStatusBadge(bookingData?.item?.bookingStatus)}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-medium text-gray-600 font-tbLex">Payment:</span>
                                                    {getStatusBadge(bookingData?.item?.paymentStatus)}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-medium text-gray-600 font-tbLex">Astrologer:</span>
                                                    {getStatusBadge(bookingData?.item?.astrologerStatus)}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-medium text-gray-600 font-tbLex">Type:</span>
                                                    {getStatusBadge(bookingData?.item?.serviceType)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 max-h-[70vh] overflow-y-auto scrollbars">
                                            {/* Service Information */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div>
                                                        <h3 className="text-base font-semibold font-tbPop text-gray-900">
                                                            {bookingData?.itemData?.[0]?.service?.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 font-tbLex">
                                                            {bookingData?.itemData?.[0]?.service?.subTitle}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-100/80 p-3 rounded-lg">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div>
                                                                <span className="text-xs font-medium text-gray-600 font-tbLex">Service Price</span>
                                                                <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                    {formatCurrency(bookingData?.item?.servicePrice)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div>
                                                                <span className="text-xs font-medium text-gray-600 font-tbLex">Duration</span>
                                                                <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                    {bookingData?.item?.durationInMinutes} minutes
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <h3 className="text-base font-semibold font-tbPop text-gray-900">
                                                        Customer Information
                                                    </h3>
                                                </div>

                                                <div className="bg-slate-100/80 p-3 rounded-lg">
                                                    <div className="flex items-start gap-3">
                                                        {bookingData?.itemData?.[0]?.user?.profileImage && (
                                                            <img
                                                                src={bookingData?.itemData?.[0]?.user?.profileImage}
                                                                alt="Customer"
                                                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                                            />
                                                        )}
                                                        <div className="flex-1 space-y-2">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <span className="text-xs font-medium text-gray-600 font-tbLex">Name</span>
                                                                    <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                        {bookingData?.itemData?.[0]?.customer?.title} {bookingData?.itemData?.[0]?.customer?.firstName} {bookingData?.itemData?.[0]?.customer?.lastName}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-medium text-gray-600 font-tbLex">Email</span>
                                                                    <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                        {bookingData?.itemData?.[0]?.user?.email}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-medium text-gray-600 font-tbLex">Mobile Number</span>
                                                                    <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                        {bookingData?.itemData?.[0]?.user?.mobileNo}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-medium text-gray-600 font-tbLex">Customer ID</span>
                                                                    <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                        #{bookingData?.itemData?.[0]?.customer?._id?.slice(-8)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Astrologer Information */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <h3 className="text-base font-semibold font-tbPop text-gray-900">
                                                        Astrologer Information
                                                    </h3>
                                                </div>

                                                <div className="bg-slate-100/80 p-3 rounded-lg">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Astrologer Name</span>
                                                            <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                {bookingData?.itemData?.[0]?.astrologer?.firstName} {bookingData?.itemData?.[0]?.astrologer?.lastName}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Experience</span>
                                                            <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                {bookingData?.itemData?.[0]?.astrologer?.experience} years
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Skills</span>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {bookingData?.itemData?.[0]?.astrologer?.skills?.map((skill, index) => (
                                                                    <span key={index} className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-tbPop">
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Languages</span>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {bookingData?.itemData?.[0]?.astrologer?.languages?.map((language, index) => (
                                                                    <span key={index} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-tbPop">
                                                                        {language}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Booking Schedule */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <h3 className="text-base font-semibold font-tbPop text-gray-900">
                                                        Booking Schedule
                                                    </h3>
                                                </div>

                                                <div className="bg-slate-100/80 p-3 rounded-lg">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Booking Date</span>
                                                            <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                {formatDate(bookingData?.item?.bookingDate)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Time Slot</span>
                                                            <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                {formatTime(bookingData?.item?.startTime)} - {formatTime(bookingData?.item?.endTime)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Order ID</span>
                                                            <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                #{bookingData?.item?.orderId?.slice(-8)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Service Item ID</span>
                                                            <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                #{bookingData?.item?.serviceItemId?.slice(-8)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {bookingData?.item?.zoomLink && (
                                                        <div className="mt-3 p-2 bg-white rounded-md border border-gray-200">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Video className="text-emerald-600" size={14} />
                                                                <span className="text-xs font-medium text-gray-600 font-tbLex">Zoom Meeting Link</span>
                                                            </div>
                                                            <a
                                                                href={bookingData?.item?.zoomLink}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-sm text-emerald-600 hover:text-emerald-700 underline font-tbPop"
                                                            >
                                                                Join Session
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Payment Information */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <h3 className="text-base font-semibold font-tbPop text-gray-900">
                                                        Payment Information
                                                    </h3>
                                                </div>

                                                <div className="bg-slate-100/80 p-3 rounded-lg">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Payment ID</span>
                                                            <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                {bookingData?.item?.parent?.paymentId}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Total Amount</span>
                                                            <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                {formatCurrency(bookingData?.item?.total)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Final Amount</span>
                                                            <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                {formatCurrency(bookingData?.item?.parent?.finalAmount)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Created Date</span>
                                                            <p className="text-sm font-semibold text-gray-900 font-tbPop">
                                                                {formatDate(bookingData?.item?.parent?.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {bookingData?.item?.parent?.paymentDetails?.note && (
                                                        <div className="mt-3 p-2 bg-white rounded-md border border-gray-200">
                                                            <span className="text-xs font-medium text-gray-600 font-tbLex">Payment Note:</span>
                                                            <p className="text-sm text-gray-900 mt-1 font-tbPop">
                                                                {bookingData?.item?.parent?.paymentDetails?.note}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {bookingData?.item?.astrologerStatus === 'pending' && (
                                            <div className="bg-slate-50 px-4 py-3 border-t">
                                                {/* Reject Reason Input */}
                                                {showRejectInput && (
                                                    <div className="mb-4 p-4 bg-white rounded-lg">
                                                        <h4 className="text-sm font-semibold text-gray-900 mb-2 font-tbPop">
                                                            Reason for Rejection
                                                        </h4>
                                                        <textarea
                                                            value={rejectReason}
                                                            onChange={(e) => setRejectReason(e.target.value)}
                                                            placeholder="Please provide a reason for rejecting this booking..."
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none resize-none font-tbLex"
                                                            rows={3}
                                                            disabled={isLoading}
                                                        />
                                                        <div className="flex gap-2 mt-3 justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={handleCancelReject}
                                                                disabled={isLoading}
                                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 font-tbPop"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleReject}
                                                                disabled={isLoading || !rejectReason.trim()}
                                                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 font-tbPop"
                                                            >
                                                                {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex flex-col sm:flex-row gap-2 justify-end items-center">
                                                    <div className="flex gap-3">
                                                        {!showRejectInput && (
                                                            <button
                                                                type="button"
                                                                onClick={handleRejectClick}
                                                                disabled={isLoading}
                                                                className={`${formBtn1} !bg-red-500 hover:!bg-red-600 flex items-center justify-center`}
                                                            >
                                                                <CloseCircle size={16} className="mr-1" />
                                                                Reject Booking
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={handleAccept}
                                                            disabled={isLoading}
                                                            className={`${formBtn1} !bg-green-500 hover:!bg-green-600 flex items-center justify-center`}
                                                        >
                                                            <TickCircle size={16} className="mr-1" />
                                                            Accept Booking
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-[70vh] flex bg-slate1 justify-center items-center">
                                        <Preloaders />
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default BookingDetailsModal;

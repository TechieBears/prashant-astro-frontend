import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { TableTitle } from '../../../helper/Helper';
import { Calendar, User, Star } from 'iconsax-reactjs';
import moment from 'moment';

function BookingDetailsModal({ open, toggle, bookingData }) {
    if (!bookingData) return null;

    const formatTime = (time) => {
        return moment(time, "HH:mm").format("hh:mm A");
    };

    const formatDate = (date) => {
        return moment(date).format("dddd, MMMM Do YYYY");
    };

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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                                <TableTitle
                                    title="Booking Details"
                                    toggle={toggle}
                                />

                                <div className="bg-white p-6">
                                    {/* Customer Information */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <User className="text-blue-600" size={20} />
                                            </div>
                                            <h3 className="text-lg font-semibold font-tbPop text-gray-800">
                                                Customer Information
                                            </h3>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600 font-tbLex">Name:</span>
                                                <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                    {bookingData?.customer?.first_name} {bookingData?.customer?.last_name}
                                                </span>
                                            </div>
                                            {bookingData?.customer?.email && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Email:</span>
                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                        {bookingData?.customer?.email}
                                                    </span>
                                                </div>
                                            )}

                                            {bookingData?.customer?.phone && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Phone:</span>
                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                        {bookingData?.customer?.phone}
                                                    </span>
                                                </div>
                                            )}
                                            {bookingData?.zoom_link && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Zoom Link:</span>
                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                        <a href={bookingData?.zoom_link} target="_blank" rel="noreferrer">Join Session</a>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Astrologer Information */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-purple-50 rounded-lg">
                                                <Star className="text-purple-600" size={20} />
                                            </div>
                                            <h3 className="text-lg font-semibold font-tbPop text-gray-800">
                                                Astrologer Information
                                            </h3>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600 font-tbLex">Astrologer:</span>
                                                <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                    {bookingData.astrologerName}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600 font-tbLex">Astrologer ID:</span>
                                                <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                    #{bookingData.astrologerId}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Information */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-green-50 rounded-lg">
                                                <Calendar className="text-green-600" size={20} />
                                            </div>
                                            <h3 className="text-lg font-semibold font-tbPop text-gray-800">
                                                Booking Information
                                            </h3>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600 font-tbLex">Date:</span>
                                                <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                    {formatDate(bookingData.date)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600 font-tbLex">Time:</span>
                                                <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                    {formatTime(bookingData.start_time)} - {formatTime(bookingData.end_time)}
                                                </span>
                                            </div>

                                            {bookingData.service && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Service:</span>
                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                        {bookingData.service}
                                                    </span>
                                                </div>
                                            )}

                                            {bookingData.bookingId && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-600 font-tbLex">Booking ID:</span>
                                                    <span className="text-sm font-semibold text-gray-800 font-tbPop">
                                                        #{bookingData.bookingId}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex justify-center">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 font-tbPop">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            Confirmed Booking
                                        </span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <footer className="py-4 flex bg-slate1 justify-end px-6">
                                    <button
                                        type="button"
                                        onClick={toggle}
                                        className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-tbPop"
                                    >
                                        Close
                                    </button>
                                </footer>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default BookingDetailsModal;

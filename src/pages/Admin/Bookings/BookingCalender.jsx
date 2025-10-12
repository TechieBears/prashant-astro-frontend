import React, { useMemo, useEffect, useState } from "react";
import moment from "moment";
import BookingDetailsModal from "../../../components/Modals/AdminModals/BookingDetailsModal";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import { astrologerSlots } from "../../../api";
import BlockCalenderSlotsModal from "../../../components/Modals/AdminModals/BlockCalenderSlotsModal";
import BlockedMessageShowModal from "../../../components/Modals/AdminModals/BlockedMessageShowModal";
import { useSelector } from "react-redux";

// Generate full-day slots (09:00 to 21:00, every 30 mins)
const generateFullDaySlots = (time) => {
    const slots = [];
    let start = moment(time?.start, "HH:mm");
    const end = moment(time?.end, "HH:mm");

    while (start.isBefore(end)) {
        const slotStart = start.format("HH:mm");
        const slotEnd = start.add(30, "minutes").format("HH:mm");
        slots.push({ slots_start_time: slotStart, slots_end_time: slotEnd });
    }
    return slots;
};

// Generate a range of consecutive days
const generateDaysRange = (startDate, daysCount = 6) => {
    const days = [];
    for (let i = 0; i < daysCount; i++) {
        const date = moment(startDate).add(i, "day");
        days.push({
            id: date.format("YYYY-MM-DD"),
            name: date.format("DD MMM"),
            fullDate: date.toDate(),
        });
    }
    return days;
};

// Format time for display
const slotTimeFormatter = (start, end) =>
    `${moment(start, "HH:mm").format("hh:mm A")} - ${moment(
        end,
        "HH:mm"
    ).format("hh:mm A")}`;

// Skeleton Loader
const SkeletonTimeSlot = () => (
    <div className="py-3">
        <div className="w-40 h-6 bg-slate-300 rounded animate-pulse mx-auto"></div>
    </div>
);

const SkeletonSlot = () => (
    <div className="h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse shadow-sm">
        <div className="h-full flex items-center justify-center">
            <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
    </div>
);

// Slot Card
const SlotCard = ({ status, booking, onClick, isLoading }) => {
    if (isLoading) return <SkeletonSlot />;
    // status = booking?.paymentStatus ? "booked" : status;
    const getSlotConfig = () => {
        switch (status) {
            case 'blocked':
                return {
                    bg: 'bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100',
                    text: 'text-gray-600',
                    title: 'Unavailable',
                    border: 'border-gray-300/80'
                };
            case 'adminBlocked':
                return {
                    bg: 'bg-gradient-to-br from-red-50 via-red-50 to-red-100',
                    text: 'text-red-600',
                    title: 'Admin Blocked',
                    border: 'border-red-300/80'
                };
            case 'booked':
                return {
                    bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100',
                    text: 'text-orange-600',
                    title: `${booking?.customer || "---- No title ----"}`,
                    border: 'border-orange-300/80'
                };
            case 'available':
            default:
                return {
                    bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100',
                    text: 'text-green-600',
                    title: 'Available',
                    border: 'border-green-300/80'
                };
        }
    };

    const config = getSlotConfig();
    const isClickable = status === 'available' || status === 'booked' || status === 'adminBlocked';

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            className={`
                py-5 ${config.bg} ${config.text}
                rounded-md
                flex flex-col items-center justify-center
                font-semibold text-sm capitalize
                transition-all duration-300 ease-in-out
                ${isClickable ? 'cursor-pointer transform ' : 'cursor-default'}
                border-[1.2px] border-dashed ${config.border}
            `}
        >
            <div className="text-center leading-tight">
                {status === 'booked' ? (
                    <h4 className="text-sm text-center font-tbPop font-semibold line-clamp-1 px-5 text-nowrap">
                        {config.title}
                    </h4>
                ) : (
                    <div className="text-sm font-bold text-center px-5 line-clamp-1 text-nowrap">
                        {config.title}
                    </div>
                )}

            </div>
        </div>
    );
};

const BookingCalendar = () => {
    const user = useSelector(state => state.user.userDetails);
    const [isLoading, setIsLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showBlockSlotsModal, setShowBlockSlotsModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showBlockedMessageModal, setShowBlockedMessageModal] = useState(false);
    const [selectedBlockedMessage, setSelectedBlockedMessage] = useState(null);
    const [slots, setSlots] = useState({
        bookings: [],
        date: {},
        time: { start: "09:00", end: "21:00" },
    });

    const fullDaySlots = useMemo(() => generateFullDaySlots(slots?.time), [slots]);

    const [startDate, setStartDate] = useState(moment().startOf("day"));
    const daysRange = useMemo(() => generateDaysRange(startDate, 6), [startDate]);

    const getSlots = async () => {
        setIsLoading(true);
        try {
            const response = await astrologerSlots(moment(startDate).format("YYYY-MM-DD"), moment(startDate).add(5, 'days').format("YYYY-MM-DD"), "68d3df7c6de359385735d513");
            setSlots(response?.data || { bookings: [], astrologers: [], time: { start: "09:00", end: "21:00" } });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getSlots();
    }, [startDate]);

    const handleSlotClick = (day, timeSlot, booking, status) => {
        if (status === "booked" && booking) {
            const endTime = moment(timeSlot.slots_start_time, "HH:mm")
                .add(30, "minutes")
                .format("HH:mm");

            const bookingData = {
                ...booking,
                date: day.fullDate,
                start_time: timeSlot.slots_start_time,
                end_time: endTime,
            };

            setSelectedBooking(bookingData);
            setShowBookingModal(true);
        } else if (status === 'adminBlocked') {
            setShowBlockedMessageModal(true);
            setSelectedBlockedMessage(booking?.rejectReason);
        } else if (status === 'available') {
            const endTime = moment(timeSlot.slots_start_time, "HH:mm").add(30, 'minutes').format("HH:mm");
            const slotData = {
                astrologer_id: user?._id,
                date: moment(day.fullDate).format("YYYY-MM-DD"),
                start_time: timeSlot.slots_start_time,
                end_time: endTime
            };

            setSelectedSlot(slotData);
            setShowBlockSlotsModal(true);
        }
        else {
            console.log(
                `Clicked slot: ${day.name} at ${timeSlot.slots_start_time} - Status: ${status}`
            );
        }
    };

    return (
        <div className="bg-white rounded-2xl m-4 sm:m-6 p-4 md:p-6">
            <div className="mb-6 flex flex-wrap gap-4 justify-between px-2">
                <h6 className="text-xl font-semibold text-black">All Days Slots</h6>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-600 rounded"></div>
                        <span className="text-sm text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded"></div>
                        <span className="text-sm text-gray-600">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded"></div>
                        <span className="text-sm text-gray-600">Blocked</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <button
                    className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"
                    onClick={() => setStartDate((prev) => moment(prev).subtract(6, "days"))}
                >
                    <ArrowLeft2 size={22} color="#000" />
                </button>
                <h6 className="text-lg font-semibold">
                    {moment(startDate).format("DD MMM")} -{" "}
                    {moment(startDate).add(5, "days").format("DD MMM YYYY")}
                </h6>
                <button
                    className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"
                    onClick={() => setStartDate((prev) => moment(prev).add(6, "days"))}
                >
                    <ArrowRight2 size={22} color="#000" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-slate-100 text-gray-800 border-b border-gray-200">
                        <div className="grid grid-cols-[200px_repeat(auto-fit,_minmax(120px,_1fr))] gap-4 p-3">
                            <div className="font-bold text-center py-2 text-black">
                                Time Slots
                            </div>
                            {daysRange.map((day) => (
                                <div key={day.id} className="font-semibold font-tbLex text-center py-2 text-black">
                                    {day.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="divide-y divide-slate-200/60">
                        {fullDaySlots.map((timeSlot) => (
                            <div
                                key={timeSlot.slots_start_time}
                                className="grid grid-cols-[200px_repeat(auto-fit,_minmax(120px,_1fr))] gap-4 p-2.5 hover:bg-slate-50 transition-colors duration-200"
                            >
                                <div className="flex items-center justify-center">
                                    {isLoading ? (
                                        <SkeletonTimeSlot />
                                    ) : (
                                        <div className="font-semibold text-sm text-center text-slate-700">
                                            {slotTimeFormatter(
                                                timeSlot.slots_start_time,
                                                timeSlot.slots_end_time
                                            )}
                                        </div>
                                    )}
                                </div>

                                {daysRange.map((day) => {
                                    function toMinutes(timeStr) {
                                        timeStr = timeStr || "00:00";
                                        const [h, m] = timeStr.split(":").map(Number);
                                        return h * 60 + m;
                                    }
                                    const booking = slots?.bookings.find((booking) => {
                                        const bookingStart = toMinutes(booking.startTime);
                                        const bookingEnd = toMinutes(booking.endTime);
                                        const slotStart = toMinutes(timeSlot.slots_start_time);
                                        const slotEnd = toMinutes(timeSlot.slots_end_time);

                                        return ((moment(booking.date).isSame(day.fullDate, "day")) &&
                                            (booking.blocked
                                                ? booking.startTime === timeSlot.slots_start_time
                                                : bookingStart < slotEnd && bookingEnd > slotStart))
                                    });
                                    let status = "available";
                                    if (booking?.blocked && booking?.status === "blocked") {
                                        status = "adminBlocked";
                                    } else if (booking?.blocked) {
                                        status = "blocked";
                                    } else if (booking?.paymentStatus) {
                                        status = "booked";
                                    }
                                    return (
                                        <div key={day.id}>
                                            <SlotCard
                                                status={status}
                                                booking={booking}
                                                isLoading={isLoading}
                                                onClick={() =>
                                                    handleSlotClick(day, timeSlot, booking, status)
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BookingDetailsModal
                open={showBookingModal}
                refetch={getSlots}
                toggle={() => setShowBookingModal(false)}
                bookingDatas={selectedBooking}
            />


            <BlockCalenderSlotsModal
                slotData={selectedSlot}
                setRefreshTrigger={() => {
                    getSlots();
                    setShowBlockSlotsModal(false);
                    setSelectedSlot(null);
                }}
            />

            <BlockedMessageShowModal
                open={showBlockedMessageModal}
                toggle={() => setShowBlockedMessageModal(false)}
                message={selectedBlockedMessage}
            />
        </div>
    );
};

export default BookingCalendar;

import React, { useState, useMemo, useEffect } from "react";
import moment from "moment";
import BookingDetailsModal from '../../../components/Modals/AdminModals/BookingDetailsModal';
import HorizontalSlotCalendar from "../../../components/Calendar/HorizontalSlotCalendar";
import { adminSlots } from "../../../api";

const dummyVenueList = [
    { id: 1, name: "Astro Club A" },
    { id: 2, name: "Astro Club B" },
];

const dummyCalendarData = {
    court: [
        { id: 101, name: "Astrologer 1" },
        { id: 102, name: "Astrologer 2" },
        { id: 103, name: "Astrologer 3" },
    ],
    bookings: [
        {
            bookingId: "BK001",
            astrologer: 101,
            serviceId: "SRV001",
            start_time: "09:00",
            slot_booked: true,
            customer: {
                first_name: "Ravi",
                last_name: "Sharma",
                email: "ravi.sharma@example.com",
                phone: "+91 9876543210"
            },
            zoom_link: "https://zoom.us/j/1234567890"
        },
        {
            bookingId: "BK_BLOCK_102_1030",
            astrologer: 102,
            start_time: "10:30",
            blocked: true
        },
        {
            bookingId: "BK002",
            astrologer: 103,
            serviceId: "SRV002",
            start_time: "12:00",
            slot_booked: true,
            customer: {
                first_name: "Raj",
                last_name: "Kumar",
                email: "raj.kumar@example.com",
                phone: "+91 9876543211"
            },
            zoom_link: "https://zoom.us/j/9876543210"
        }
    ]
};


// Generate full-day slots (09:00 to 21:00, every 30 mins)
const generateFullDaySlots = (data) => {
    const slots = [];
    let start = moment(data?.time?.start || "09:00", "HH:mm");
    const end = moment(data?.time?.end || "21:00", "HH:mm");

    while (start.isBefore(end)) {
        const slotStart = start.format("HH:mm");
        const slotEnd = start.add(30, "minutes").format("HH:mm");
        slots.push({ slots_start_time: slotStart, slots_end_time: slotEnd });
    }
    return slots;
};

// Format time for display
const slotTimeFormatter = (start, end) =>
    `${moment(start, "HH:mm").format("hh:mm A")} - ${moment(end, "HH:mm").format("hh:mm A")}`;

// Skeleton Loader Components
const SkeletonSlot = () => (
    <div className="h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse shadow-sm">
        <div className="h-full flex items-center justify-center">
            <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
    </div>
);

const SkeletonHeader = () => (
    <div className="py-4 px-2">
        <div className="w-20 h-4 bg-slate-300 rounded animate-pulse mx-auto"></div>
    </div>
);

const SkeletonTimeSlot = () => (
    <div className="py-3">
        <div className="w-40 h-6 bg-slate-300 rounded animate-pulse mx-auto"></div>
    </div>
);

// Slot Status Component
const SlotCard = ({ status, booking, onClick, isLoading }) => {
    if (isLoading) return <SkeletonSlot />;

    const getSlotConfig = () => {
        console.log(status);
        switch (status) {
            case 'blocked':
                return {
                    bg: 'bg-gradient-to-br from-red-50 via-red-50 to-red-100',
                    text: 'text-red-600',
                    title: 'Blocked',
                    border: 'border-red-300/80'
                };
            case 'booked':
                return {
                    bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100',
                    text: 'text-orange-600',
                    title: `${booking?.customer?.first_name} ${booking?.customer?.last_name}`,
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
    const isClickable = status === 'available' || status === 'booked';

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            className={`
                py-5 ${config.bg} ${config.text}
                rounded-md
                flex flex-col items-center justify-center
                font-semibold text-sm
                transition-all duration-300 ease-in-out
                ${isClickable ? 'cursor-pointer transform ' : 'cursor-default'}
                border ${config.border}
            `}
        >
            <div className="text-center leading-tight">
                {status === 'booked' ? (
                    <h4 className="text-sm text-center font-tbPop font-semibold line-clamp-1 px-5 text-nowrap">
                        {booking?.customer?.first_name} {booking?.customer?.last_name}
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

const VenueCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [selectedVenue, setSelectedVenue] = useState(dummyVenueList[0]?.id);
    const [isLoading, setIsLoading] = useState(true);
    const [inLoading, setInLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [slots, setSlots] = useState({
        bookings: [],
        astrologers: [],
        time: {
            start: "09:00",
            end: "21:00"
        }
    });

    let fullDaySlots = useMemo(() => generateFullDaySlots(slots), [inLoading]);

    const getSlots = async () => {
        const response = await adminSlots(moment(selectedDate).format("YYYY-MM-DD"));
        console.log("response", response);
        setSlots(response?.data);
        setInLoading(!inLoading);
    }

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => {
            getSlots();
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [selectedDate, selectedVenue]);

    const handleSearch = () => {
        setIsLoading(true);
    };

    const handleSlotClick = (court, timeSlot, booking, status) => {
        if (status === 'booked' && booking) {
            // Calculate end time (30 minutes after start time)
            const endTime = moment(timeSlot.slots_start_time, "HH:mm").add(30, 'minutes').format("HH:mm");

            const bookingData = {
                ...booking,
                astrologerId: court.id,
                astrologerName: court.name,
                date: selectedDate,
                start_time: timeSlot.slots_start_time,
                end_time: endTime
            };

            setSelectedBooking(bookingData);
            setShowBookingModal(true);
        } else {
            console.log(`Clicked slot: ${court.name} at ${timeSlot.slots_start_time} - Status: ${status}`);
        }
    };

    return (
        <div className="bg-white rounded-2xl m-4 sm:m-6 p-4 md:p-6">
            <div className="mb-6">
                <HorizontalSlotCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            </div>

            {/* Legend */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-4 justify-between px-2">
                    <div className="">
                        <h6 className="text-xl font-tbPop font-semibold text-black">All Booked Slots</h6>
                    </div>
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
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-slate-100 text-gray-800 border-b border-gray-200">
                        <div className="grid grid-cols-[200px_repeat(auto-fit,_minmax(200px,_1fr))] gap-4 p-3">
                            <div className="font-bold text-center py-2 text-black font-tbLex">
                                Time Slots
                            </div>
                            {slots?.astrologers.map((court) => (
                                <div key={court.id} className="font-semibold font-tbLex text-center py-2 text-black">
                                    {court.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="divide-y divide-slate-200/60">
                        {fullDaySlots.map((timeSlot) => (
                            <div
                                key={timeSlot.slots_start_time}
                                className="grid grid-cols-[200px_repeat(auto-fit,_minmax(200px,_1fr))] gap-4 p-2.5 hover:bg-slate-50 transition-colors duration-200"
                            >
                                <div className="flex items-center justify-center">
                                    {isLoading ? (
                                        <SkeletonTimeSlot />
                                    ) : (
                                        <div className="font-semibold font-tbLex text-sm text-center text-slate-700">
                                            {slotTimeFormatter(timeSlot.slots_start_time, timeSlot.slots_end_time)}
                                        </div>
                                    )}
                                </div>

                                {slots?.astrologers.map((court) => {
                                    const booking = slots?.bookings.find(
                                        (b) => b.astrologer === court.astrologer_id && b.startTime === timeSlot.slots_start_time
                                    );

                                    let status = 'available';
                                    if (booking?.blocked) status = 'blocked'
                                    else if (booking?.status === 'paid') status = 'booked';

                                    return (
                                        <div key={court.id} className="">
                                            <SlotCard
                                                status={status}
                                                booking={booking}
                                                isLoading={isLoading}
                                                onClick={() => handleSlotClick(court, timeSlot, booking, status)}
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
                toggle={() => setShowBookingModal(false)}
                bookingData={selectedBooking}
            />
        </div>
    );
};

export default VenueCalendar;

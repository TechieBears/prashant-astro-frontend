import { useState, useMemo, useEffect } from "react";
import moment from "moment";
import BookingDetailsModal from '../../../components/Modals/AdminModals/BookingDetailsModal';
import Preloaders from '../../../components/Loader/Preloaders';
import HorizontalSlotCalendar from "../../../components/Calendar/HorizontalSlotCalendar";
import { adminSlots } from "../../../api";


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
    status = booking?.paymentStatus ? "booked" : status;
    const getSlotConfig = () => {
        switch (status) {
            case 'blocked':
                return {
                    bg: 'bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100',
                    text: 'text-gray-600',
                    title: 'Unavailable',
                    border: 'border-gray-300/80'
                };
            case 'booked':
                return {
                    bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100',
                    text: 'text-orange-600',
                    title: `${booking?.customer}`,
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

const VenueCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [isLoading, setIsLoading] = useState(true);
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

    let fullDaySlots = useMemo(() => generateFullDaySlots(slots), [slots]);

    const getSlots = async () => {
        setIsLoading(true);
        try {
            const response = await adminSlots(moment(selectedDate).format("YYYY-MM-DD"));
            setSlots(response?.data || { bookings: [], astrologers: [], time: { start: "09:00", end: "21:00" } });
        } finally {
            setIsLoading(false);
        }
    }

    // Load slots on date change
    useEffect(() => {
        getSlots();
    }, [selectedDate]);

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

            <div className="overflow-x-auto w-full">
                <div className={isLoading ? "block w-full min-h-[60vh]" : "block w-full"}>
                    {isLoading ? (
                        <Preloaders />
                    ) : (
                        // ⬇️ min-w-max ensures table can grow beyond viewport width
                        <table className="min-w-max  table-fixed w-full border-separate border border-slate-100 rounded-lg">
                            <colgroup>
                                <col style={{ width: "200px" }} />
                                {slots?.astrologers.map((_, idx) => (
                                    <col key={`col-${idx}`} style={{ width: "200px" }} />
                                ))}
                            </colgroup>

                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="sticky left-0 z-30 bg-slate-100 w-[200px] px-3 py-4 text-center font-medium font-tbLex">
                                        Time Slots
                                    </th>

                                    {slots?.astrologers.map((court) => (
                                        <th
                                            key={court.id}
                                            className="px-3 py-2 text-center font-medium font-tbLex capitalize"
                                        >
                                            {court.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {fullDaySlots.map((timeSlot) => (
                                    <tr key={timeSlot.slots_start_time} className="hover:bg-slate-50">
                                        {/* Sticky first column */}
                                        <td className="sticky left-0 z-20 bg-white w-[200px] px-3 py-2 text-center">
                                            <div className="font-semibold text-sm text-slate-700">
                                                {slotTimeFormatter(
                                                    timeSlot.slots_start_time,
                                                    timeSlot.slots_end_time
                                                )}
                                            </div>
                                        </td>

                                        {slots?.astrologers.map((astrologer) => {
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

                                                return (
                                                    (booking.astrologer === astrologer.astrologer_id ||
                                                        booking.astrologer === astrologer._id) &&
                                                    (booking.blocked
                                                        ? booking.startTime === timeSlot.slots_start_time
                                                        : bookingStart < slotEnd && bookingEnd > slotStart)
                                                );
                                            });
                                            let status = "available";
                                            if (booking?.blocked) status = "blocked";
                                            else if (booking?.paymentStatus) status = "booked";

                                            return (
                                                <td key={astrologer.id} className="w-[200px] px-2 py-2">
                                                    <div className="w-full">
                                                        <SlotCard
                                                            status={status}
                                                            booking={booking}
                                                            isLoading={isLoading}
                                                            onClick={() =>
                                                                handleSlotClick(astrologer, timeSlot, booking, status)
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>



            <BookingDetailsModal
                open={showBookingModal}
                refetch={getSlots}
                toggle={() => setShowBookingModal(false)}
                bookingDatas={selectedBooking}
            />
        </div>
    );
};

export default VenueCalendar;

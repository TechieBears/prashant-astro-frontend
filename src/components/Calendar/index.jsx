import React from 'react';

const Calendar = ({
    currentMonth,
    selectedDate,
    onDateSelect,
    onMonthChange,
    className = ''
}) => {
    // Generate calendar days for the current month view
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay() + (firstDay.getDay() === 0 ? -6 : 1));

        if (startDate.getDay() === 0) {
            startDate.setDate(startDate.getDate() - 7);
        }

        const days = [];
        const currentDate = new Date(startDate);

        // Always show 6 weeks (42 days) to keep the calendar height consistent
        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    // Check if a date is today
    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Check if a date is selected
    const isSelected = (date) => {
        return selectedDate && date.toDateString() === selectedDate.toDateString();
    };

    // Check if a date is in the current month
    const isCurrentMonth = (date) => {
        return date.getMonth() === currentMonth.getMonth();
    };

    const calendarDays = generateCalendarDays();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    return (
        <div className={`bg-light-pg rounded-2xl shadow-lg p-4 sm:p-6 ${className}`}>
            {/* Calendar Header */}
            <div className="flex justify-center items-center mb-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => onMonthChange('prev-year')}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Previous year"
                    >
                        &laquo;
                    </button>
                    <button
                        onClick={() => onMonthChange('prev')}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Previous month"
                    >
                        &lsaquo;
                    </button>
                    <h3 className="text-lg font-semibold text-gray-800 min-w-[120px] text-center bg-white px-10 py-1 rounded-full">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <button
                        onClick={() => onMonthChange('next')}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Next month"
                    >
                        &rsaquo;
                    </button>
                    <button
                        onClick={() => onMonthChange('next-year')}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Next year"
                    >
                        &raquo;
                    </button>
                </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-xs sm:text-sm">
                {dayNames.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 rounded-lg">
                {calendarDays.map((date, index) => {
                    const day = date.getDate();
                    const today = isToday(date);
                    const selected = isSelected(date);
                    const currentMonth = isCurrentMonth(date);
                    const isDisabled = !currentMonth;

                    return (
                        <button
                            key={index}
                            onClick={() => !isDisabled && onDateSelect(date)}
                            className={`
                                h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium
                                transition-colors duration-200
                                ${selected
                                    ? 'bg-orange-500 text-white'
                                    : today
                                        ? 'bg-separator text-black'
                                        : isCurrentMonth(date)
                                            ? 'text-gray-700 hover:bg-gray-100'
                                            : 'text-gray-400 hover:bg-gray-50'
                                }
                                ${isDisabled ? 'text-gray-300 cursor-default' : 'cursor-pointer'}
                            `}
                            disabled={isDisabled}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;

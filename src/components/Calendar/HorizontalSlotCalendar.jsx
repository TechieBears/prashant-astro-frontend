import React, { useState, useMemo, useCallback } from 'react';
import moment from 'moment';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';


export default function HorizontalSlotCalendar({
    selectedDate, setSelectedDate }) {
    const [startDate, setStartDate] = useState(moment().startOf('day'));

    const { datesByMonth, allDates } = useMemo(() => {
        const endDate = moment(startDate).add(16, 'days').endOf('day');
        const dateArray = [];
        const monthGroups = {};

        for (let date = moment(startDate); date <= endDate; date.add(1, 'day')) {
            const monthKey = date.format('YYYY-MM');
            const monthName = date.format('MMMM YYYY');

            if (!monthGroups[monthKey]) {
                monthGroups[monthKey] = {
                    monthName,
                    dates: []
                };
            }

            const dateObj = {
                date: date.toDate(),
                formattedDate: date.format('DD'),
                formattedDay: date.format('ddd'),
                monthKey
            };

            monthGroups[monthKey].dates.push(dateObj);
            dateArray.push(dateObj);
        }

        return { datesByMonth: monthGroups, allDates: dateArray };
    }, [startDate]);

    const handlePress = useCallback((date) => setSelectedDate(date), [setSelectedDate]);

    const handlePrev = useCallback(() => {
        setStartDate((prev) => moment(prev).subtract(16, 'days').startOf('day'));
    }, []);

    const handleNext = useCallback(() => {
        setStartDate((prev) => moment(prev).add(16, 'days').startOf('day'));
    }, []);

    return (
        <div className="">
            <div className="flex justify-between items-center">
                <button className="p-2 bg-slate1 rounded-full hover:bg-slate-200 transition-colors duration-300" onClick={handlePrev}>
                    <ArrowLeft2 size={22} color='#000' />
                </button>
                <div className="flex-1 overflow-hidden px-3">
                    <div className="flex flex-col py-3.5 pb-5">
                        {/* Month labels row */}
                        <div className="flex space-x-2 mb-3">
                            {Object.entries(datesByMonth).map(([monthKey, { monthName, dates }]) => (
                                <div
                                    key={monthKey}
                                    className="text-center font-tbLex text-sm font-semibold text-primary uppercase tracking-wide bg-primary/10 backdrop-blur-sm rounded-t-lg border-b-2 border-primary/30 py-2"
                                    style={{ width: `${dates.length * 6.5}rem` }}
                                >
                                    {monthName}
                                </div>
                            ))}
                        </div>
                        {/* Date cards row */}
                        <div className="flex space-x-2">
                            {allDates.map((item) => {
                                const isSelected = moment(selectedDate).isSame(item.date, 'day');
                                const isCurrentDate = moment().isSame(item.date, 'day');
                                return (
                                    <RenderItem
                                        key={item.date.toString()}
                                        item={item}
                                        isSelected={isSelected}
                                        isCurrentDate={isCurrentDate}
                                        onPress={handlePress}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <button className="p-2 bg-slate1 rounded-full hover:bg-slate-200 transition-colors duration-300" onClick={handleNext}>
                    <ArrowRight2 size={22} color='#000' />
                </button>
            </div>
        </div>
    );
}

export const RenderItem = React.memo(({ item, isSelected, isCurrentDate, onPress }) => {
    return <button
        className={`w-24 py-2 space-y-0.5 rounded-lg shadow-lg  flex flex-col justify-center   items-center group ${isSelected ? 'bg-primary shadow-primary/50 text-white' : ' shadow-gray-200 text-black'} `}
        onClick={() => onPress(item.date)}
    >
        <h6 className={`text-center transition-colors duration-300 uppercase  tracking-wider font-tbLex text-sm  font-normal  ${isSelected ? 'text-white' : isCurrentDate ? 'text-primary group-hover:text-black' : 'text-slate-500 group-hover:text-primary'}`} >
            {item.formattedDay}
        </h6>
        <div className={`text-center h-[1px]  w-5 ${isSelected && isCurrentDate ? 'bg-white' : 'bg-slate-200'}`} />
        <div className={`text-center uppercase transition-colors duration-300 tracking-tight font-tbLex text-xl  font-semibold ${isSelected ? 'text-white' : isCurrentDate ? 'text-primary group-hover:text-black' : 'text-black group-hover:text-primary'}`} >
            {item.formattedDate}
        </div>
    </button>
});

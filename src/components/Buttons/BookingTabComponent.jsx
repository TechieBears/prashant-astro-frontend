const BookingTabComponent = ({ currentIndex, setCurrentIndex }) => {
    return (
        <div className="self-center justify-end flex items-center">
            <div className='w-full lg:w-[20rem]' >
                <div className='bg-white w-full rounded-full p-1 flex items-center justify-between border border-gray-200 shadow-sm' >
                    <button
                        onClick={() => setCurrentIndex("forSelf")}
                        className={currentIndex === "forSelf" ? 'bg-button-gradient-orange flex-1 rounded-full transition-colors duration-500' : 'bg-white transition-colors duration-500 flex-1 rounded-full'}
                    >
                        <h4 className={`font-medium tracking-tight text-xs md:text-sm lg:text-base ${currentIndex === "forSelf" ? "text-white" : "text-gray-600"} text-center p-2 md:p-3 transition-colors duration-500`}>
                            For Self
                        </h4>
                    </button>
                    <button
                        onClick={() => setCurrentIndex("forOthers")}
                        className={currentIndex === "forOthers" ? 'bg-button-gradient-orange flex-1 rounded-full transition-colors duration-500' : 'bg-white transition-colors duration-500 flex-1 rounded-full'}
                    >
                        <h4 className={`font-medium tracking-tight text-xs md:text-sm lg:text-base ${currentIndex === "forOthers" ? "text-white" : "text-gray-600"} text-center p-2 md:p-3 transition-colors duration-500`}>
                            For Others
                        </h4>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookingTabComponent

const TabComponent = ({ currentIndex, setCurrentIndex }) => {
    return (
        <div className="self-center justify-end flex items-center">
            <div className='w-full lg:w-[35rem]' >
                <div className='bg-white w-full rounded-full p-1 flex  items-center justify-between' >
                    <button onClick={() => setCurrentIndex("known")} className={currentIndex === "known" ? 'bg-primary flex-1 rounded-full transition-colors duration-500' : 'bg-white transition-colors duration-500 flex-1 rounded-full'} >
                        <h4 className={`font-tbPop font-medium tracking-tight text-xs md:text-sm lg:text-base ${currentIndex == "known" ? "text-white" : "text-black"}  text-center p-1 md:p-2.5 transition-colors duration-500`}>Known Actors</h4>
                    </button>
                    <button onClick={() => setCurrentIndex("semiKnown")} className={currentIndex === "semiKnown" ? 'bg-primary flex-1 rounded-full transition-colors duration-500' : 'bg-white transition-colors duration-500 flex-1 rounded-full'} >
                        <h4 className={`font-tbPop font-medium tracking-tight text-xs md:text-sm lg:text-base ${currentIndex == "semiKnown" ? "text-white" : "text-black"}  text-center p-1 md:p-2.5 transition-colors duration-500`}>Semi Known Actor</h4>
                    </button>
                    <button onClick={() => setCurrentIndex("secondary")} className={currentIndex === "secondary" ? 'bg-primary flex-1 rounded-full transition-colors duration-500' : 'bg-white transition-colors duration-500 flex-1 rounded-full'} >
                        <h4 className={`font-tbPop font-medium tracking-tight text-xs md:text-sm lg:text-base ${currentIndex == "secondary" ? "text-white" : "text-black"}  text-center p-1 md:p-2.5 transition-colors duration-500`}>Supporting Actor</h4>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TabComponent

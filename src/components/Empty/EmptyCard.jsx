

const EmptyCard = () => {
    return (
        <div className='animate-pulse space-y-2' >
            <div className='h-[8rem] w-[7.8rem] md:h-[11rem] md:w-[10.50rem] self-center border-2 border-white rounded-xl overflow-hidden bg-gradient-to-r from-slate-300 to-slate-200' />
            <div className='md:space-y-1.5 px-1' >
                <h6 className='font-tbPop font-semibold h-3.5 w-[7.6rem] md:w-[9rem] rounded bg-gradient-to-r from-slate-300 to-slate-200 capitalize text-sm md:text-base truncate ' />
                <h6 className='font-tbPop font-normal h-2.5 w-[4rem] md:w-[7rem] rounded bg-gradient-to-r from-slate-300 to-slate-200 capitalize text-[10px] md:text-sm truncate ' />
                <h6 className='font-tbPop font-normal h-3 w-[7.6rem] md:w-[4rem] rounded bg-gradient-to-r from-slate-300 to-slate-200 capitalize text-[10px] md:text-sm truncate ' />
                <h6 className='font-tbPop font-normal h-3.5 w-[7.6rem] md:w-[9rem] rounded bg-gradient-to-r from-slate-300 to-slate-200 capitalize text-[10px] md:text-sm truncate ' />
            </div>
        </div>
    )
}

export default EmptyCard

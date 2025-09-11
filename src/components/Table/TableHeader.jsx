const TableHeader = ({ title, subtitle, component }) => {
    return (
        <div className="flex justify-between flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 mb-4 lg:mb-5">
            <div className="lg:space-y-[1px]">
                <h2 className='font-tbPop text-base md:text-lg lg:text-xl font-semibold text-black'>{title}</h2>
                <h6 className='text-slate-500 font-tbLex font-normal text-xs lg:text-sm'>{subtitle}</h6>
            </div>
            {component}
        </div>
    )
}

export default TableHeader

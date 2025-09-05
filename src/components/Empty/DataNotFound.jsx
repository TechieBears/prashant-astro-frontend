
import noData from '../../assets/noData.svg';
const DataNotFound = ({ title }) => {
    return (
        <div className="w-full h-full flex items-center justify-center flex-col space-y-20 py-10">
            <img src={noData} alt='no data found!' className='w-full h-[40vh] object-contain' />
            <h4 className='font-tbPop font-semibold text-base text-black'>{title || "No more data found!"}</h4>
        </div>
    )
}

export default DataNotFound

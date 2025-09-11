import { Send2 } from 'iconsax-reactjs';
import BasicBars from '../../../components/Charts/BasicBars';
import PiaCharts from '../../../components/Charts/PiaCharts';
import { auth } from '../../../utils/firebase/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


const Dashboard = () => {

    // const handerGoogleSignIn = () => {
    //     const provider = new GoogleAuthProvider();
    //     signInWithPopup(auth, provider).then((result) => {
    //         console.log(result);
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    // }
    return (
        <>
            <div className="px-1 mx-4 m-2 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
                {/* Employees Card */}
                <div className="bg-primary p-5 rounded-3xl space-y-1.5 relative overflow-hidden" >
                    <div className='absolute -bottom-8 -right-5 w-24 h-24 bg-white/20  rounded-full flex items-center justify-center' />
                    <div className='flex items-center justify-between'>
                        <h6 className='text-white font-tb text-sm'>Clients</h6>
                        <div className="p-1.5 rounded-full bg-white">
                            <Send2 size={20} className="text-black" />
                        </div>
                    </div>
                    <h6 className='text-white font-tbPop font-semibold text-3xl'>22</h6>
                    <h6 className='text-slate-300 font-tb font-normal text-xs'>Currently active clients</h6>
                </div>

                {/* Clients/Partners Card */}
                <div className="bg-white p-5 rounded-3xl space-y-1.5 ">
                    <div className='flex items-center justify-between'>
                        <h6 className='text-black font-tb text-sm'>Channel Partners</h6>
                        <div className="p-1.5 rounded-full bg-orange-200">
                            <Send2 size={20} className="text-black" />
                        </div>
                    </div>
                    <h6 className='text-black font-tbPop font-semibold text-3xl'>22</h6>
                    <h6 className='text-slate-500 font-tb font-normal text-xs'>Active channel partners</h6>
                </div>

                {/* New Applications Card */}
                <div className="bg-white p-5 rounded-3xl space-y-1.5">
                    <div className='flex items-center justify-between'>
                        <h6 className='text-black font-tb text-sm'>New Applications</h6>
                        <div className="p-1.5 rounded-full bg-teal-200">
                            <Send2 size={20} className="text-black" />
                        </div>
                    </div>
                    <h6 className='text-black font-tbPop font-semibold text-3xl'>22</h6>
                    <h6 className='text-slate-500 font-tb font-normal text-xs'>Received this week</h6>
                </div>

                {/* Processed Card */}
                <div className="bg-white p-5 rounded-3xl space-y-1.5">
                    <div className='flex items-center justify-between'>
                        <h6 className='text-black font-tb text-sm'>Processed</h6>
                        <div className="p-1.5 rounded-full bg-pink-200">
                            <Send2 size={20} className="text-black" />
                        </div>
                    </div>
                    <h6 className='text-black font-tbPop font-semibold text-3xl'>22</h6>
                    <h6 className='text-slate-500 font-tb font-normal text-xs'>Applications in progress</h6>
                </div>

                {/* Completed Card */}
                <div className="bg-white p-5 rounded-3xl space-y-1.5">
                    <div className='flex items-center justify-between'>
                        <h6 className='text-black font-tb text-sm'>Completed</h6>
                        <div className="p-1.5 rounded-full bg-indigo-200">
                            <Send2 size={20} className="text-black" />
                        </div>
                    </div>
                    <h6 className='text-black font-tbPop font-semibold text-3xl'>22</h6>
                    <h6 className='text-slate-500 font-tb font-normal text-xs'>Successful hires this year</h6>
                </div>
            </div>
            {/* =====================Dashboard table===================== */}
            <div className="grid grid-cols-12 gap-4 p-4 sm:p-5  ">
                <div className="col-span-6 bg-white rounded-2xl">
                    <BasicBars data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                </div>
                <div className="col-span-6 bg-white rounded-2xl">
                    <PiaCharts />
                </div>
            </div>
        </>
    )
}

export default Dashboard

import { Chair, FilmReel, UsersThree } from '@phosphor-icons/react';
import greetingTime from 'greeting-time';
import { Eye, Profile, Profile2User } from 'iconsax-reactjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getAllUser, getDashboardInsight } from '../../../api';
import Table from '../../../components/Table/Table';
import { formatRole, imageComponet, paymentBody, statusBody } from '../../../helper/Helper';
import AnimatedNumbers from "react-animated-numbers";
import TableHeader from '../../../components/Table/TableHeader';

const Dashboard = () => {
    const user = useSelector((state) => state.user.userDetails)
    const [combinedState, setCombinedState] = useState({
        userData: [],
        insightData: null
    });

    const ActionBody = (row) => {
        return (
            <div className='flex items-center space-x-2'>
                <NavLink to={`/dashboard/${row?._id}`}>
                    <Eye size={20} className="text-gray-500 cursor-pointer" />
                </NavLink>
            </div>
        )
    }

    // ====================== table columns ======================
    const columns = [
        { field: "profile", header: "Profile", body: imageComponet, style: true },
        { field: 'fullName', header: 'Name', body: (row) => <span className='capitalize'>{row?.fullName || "---- -----"}</span>, style: true },
        { field: 'role', header: 'Role', body: (row) => <span className='capitalize'>{formatRole(row?.role) || "---- -----"}</span>, style: true },
        { field: 'email', header: 'Email', body: (row) => <span className='capitalize'>{row?.email || "---- -----"}</span>, style: true },
        { field: 'phoneNumber', header: 'Phone No.', body: (row) => <span className='capitalize'>{row?.phoneNumber || "---- -----"}</span>, style: true },
        { field: 'status', header: 'Status', body: statusBody, style: true },
        { field: 'paymentStatus', header: 'Payment Status', body: paymentBody, style: true },
        { field: 'createdAt', header: 'Registration date', body: (row) => <>{moment(row?.createdAt)?.format('DD-MM-YYYY (hh:mm A)') || "---- -----"}</>, style: true },
        // { field: 'action', header: 'Action', body: ActionBody, style: true },
    ];


    useEffect(() => {
        const fetchData = async () => {
            try {

            } catch (error) {
                console.log('error', error);
            }
        };

        fetchData();
    }, []);


    return (
        <>
            {/* <DeleteModal
                title='Delete Stroage'
                deleteBtn={deleteData}
                toggleModalBtn={toggleModalBtn}
                description={"Are you sure you want to delete this Stroage"} open={open}
            /> */}
            <section className='h-full w-full'>
                {/* =====================Dashboard header===================== */}
                <div className="mx-4 p-2">
                    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6 ">
                        <div className="mt-2 flex items-center text-sm font-tbPop font-normal text-slate-500">
                            {moment().format('ddd , DD MMMM YYYY')}
                        </div>
                    </div>
                    <h2 className="font-tbLex font-bold text-2xl  md:text-2xl lg:text-3xl whitespace- tracking-tight capitalize text-slate-800">
                        {greetingTime(new Date())} 👋🏻, <span className="capitalize text-primary"> {user?.user?.fullName}</span>
                    </h2>
                </div>
                <div className="bg-white p-8 px-5 m-4 sm:m-5 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-y-10 ">
                    <div className="flex items-center space-x-3 border-r-0 sm:border-r mr-8 border-gray-200/70">
                        <div className="p-3.5 rounded-xl bg-orange-50">
                            <Profile size={26} className="text-orange-500" />
                        </div>
                        <div className="space-y-1">
                            <h6 className='text-gray-500 font-tb text-sm'>Primary Actor</h6>
                            <h6 className='text-orange-500 font-tb font-semibold text-base'>
                                <AnimatedNumbers
                                    animateToNumber={combinedState?.insightData?.primary || 0}
                                    configs={(_, index) => {
                                        return {
                                            mass: 1,
                                            tension: 230 * (index + 1),
                                            friction: 140,
                                        };
                                    }}
                                />
                            </h6>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 border-r-0 lg:border-r  mr-8 border-gray-200/70">
                        <div className="p-3.5 rounded-xl bg-purple-50">
                            <Profile2User size={26} className="text-purple-600" />
                        </div>
                        <div className="space-y-1">
                            <h6 className='text-gray-500 font-tb text-sm'>Secondary Actor</h6>
                            <h6 className='text-purple-600 font-tb font-semibold text-base'>
                                <AnimatedNumbers
                                    animateToNumber={combinedState?.insightData?.secondary || 0}
                                    configs={(_, index) => {
                                        return {
                                            mass: 1,
                                            tension: 230 * (index + 1),
                                            friction: 140,
                                        };
                                    }}
                                />

                            </h6>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 border-r-0 md:border-r mr-8 border-gray-200/70">
                        <div className="p-3.5 rounded-xl bg-blue-50">
                            <Chair size={26} className="text-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <h6 className='text-gray-500 font-tb text-sm'>Casting Director</h6>
                            <h6 className='text-blue-500 font-tb font-semibold text-base'>
                                <AnimatedNumbers
                                    animateToNumber={combinedState?.insightData?.castingDirectors || 0}
                                    configs={(_, index) => {
                                        return {
                                            mass: 1,
                                            tension: 230 * (index + 1),
                                            friction: 140,
                                        };
                                    }}
                                />

                            </h6>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 border-r-0 lg:border-r  mr-8 border-gray-200/70">
                        <div className="p-3.5 rounded-xl bg-red-50">
                            <UsersThree size={26} className="text-red-500" />
                        </div>
                        <div className="space-y-1">
                            <h6 className='text-gray-500 font-tb text-sm'>Casting Agency</h6>
                            <h6 className='text-red-500 font-tb font-semibold text-base'>
                                <AnimatedNumbers
                                    animateToNumber={combinedState?.insightData?.castingTeam || 0}
                                    configs={(_, index) => {
                                        return {
                                            mass: 1,
                                            tension: 230 * (index + 1),
                                            friction: 140,
                                        };
                                    }}
                                />

                            </h6>
                        </div>
                    </div>
                    {/* <div className="flex items-center space-x-3   mr-8 ">
                        <div className="p-3.5 rounded-xl bg-red-50">
                            <FilmReel sersThree size={26} className="text-yellow-500" />
                        </div>
                        <div className="space-y-1">
                            <h6 className='text-gray-500 font-tb text-sm'>Production Team</h6>
                            <h6 className='text-yellow-500 font-tb font-semibold text-base'>
                                <AnimatedNumbers
                                    animateToNumber={combinedState?.insightData?.productionTeam || 0}
                                    configs={(_, index) => {
                                        return {
                                            mass: 1,
                                            tension: 230 * (index + 1),
                                            friction: 140,
                                        };
                                    }}
                                />
                            </h6>
                        </div>
                    </div> */}
                </div>

                {/* =====================Dashboard table===================== */}
                <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 " >
                    <TableHeader title="Latest Registered User" subtitle="Recently registered users will appear here" />
                    <Table data={combinedState?.userData} columns={columns} paginator={false} />
                </div>
            </section >
        </>

    )
}

export default Dashboard

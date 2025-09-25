import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Switch from "react-js-switch";
import { editCustomer, getAllCustomers } from '../../../api';
import Table from '../../../components/Table/Table';
import TextInput from '../../../components/TextInput/TextInput';
import { imageComponet } from '../../../helper/Helper';
import { formBtn1, tableBtn } from '../../../utils/CustomClass';
import usePagination from '../../../utils/customHooks/usePagination';
import { validateAlphabets } from '../../../utils/validateFunction';

const initialFilterState = {
    name: ''
};

function AllUserProfiles() {
    const { register, handleSubmit, reset } = useForm({ defaultValues: initialFilterState });
    const [filterCriteria, setFilterCriteria] = useState(initialFilterState);
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const combinedFilters = useMemo(() => ({
        ...filterCriteria,
        refresh: refreshTrigger
    }), [filterCriteria, refreshTrigger]);

    const {
        filterData,
        pageNo,
        nextIsValid,
        prevIsValid,
        pageChangeHandler,
        recordChangeHandler,
        records,
        error
    } = usePagination(1, 10, getAllCustomers, combinedFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
    }, [error]);


    const handleFilterSubmit = (data) => {
        setFilterCriteria(data);
        pageChangeHandler(1);
    };


    const handleClearFilters = () => {
        reset(initialFilterState);
        setFilterCriteria(initialFilterState);
        toast.success('Filters cleared');
    };
    const handleActiveChange = async (id, isActive) => {
        try {
            const updatedData = {
                isActive: !isActive
            }
            await editCustomer(id, updatedData);
            setRefreshTrigger(prev => prev + 1);
            toast.success('Status updated');
        } catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    }

    const activeBody = (row) => (
        <Switch
            value={row?.isActive}
            disabled={row?.isActive == false ? true : false}
            onChange={() => handleActiveChange(row?._id, row?.isActive)}
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    )

    const columns = [
        { field: "profile", header: "Profile", body: imageComponet, style: true },
        { field: 'firstName', header: 'First Name', body: (row) => <span className='capitalize'>{row?.profile?.firstName || "---- -----"}</span>, style: true },
        { field: 'lastName', header: 'Last Name', body: (row) => <span className='capitalize'>{row?.profile?.lastName || "---- -----"}</span>, style: true },
        { field: 'role', header: 'Role', body: (row) => <span className='capitalize'>{row?.role || "---- -----"}</span>, style: true },
        { field: 'email', header: 'Email', body: (row) => <span className='capitalize'>{row?.email || "---- -----"}</span>, style: true },
        { field: 'mobileNo', header: 'Phone No.', body: (row) => <span className='capitalize'>{row?.mobileNo || "---- -----"}</span>, style: true },
        {
            field: 'createdAt',
            header: 'Registration date',
            body: (row) => <>{moment(row?.createdAt).format('DD-MM-YYYY') || "---- -----"}</>,
            style: true
        },
        {
            field: 'isActive',
            header: 'Active',
            body: activeBody,
            style: true
        }
    ];

    return (
        <div className="space-y-5">

            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 w-full gap-2">
                        <TextInput
                            label="Enter Full Name*"
                            placeholder="Enter Full Name"
                            type="text"
                            registerName="name"
                            props={{ ...register('name', { validate: validateAlphabets }) }}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button type="submit" className={`${tableBtn} w-full`}>Search</button>
                        <button type="button" onClick={handleClearFilters} className={`${formBtn1} w-full !bg-transparent border border-primary !text-primary`}>Clear</button>
                    </div>
                </form>
            </div>


            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <div className="flex justify-between flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                    <div className="lg:space-y-[1px]">
                        <h2 className='font-tbPop text-base md:text-lg lg:text-xl font-semibold text-black'>All Users</h2>
                        <h6 className='text-slate-500 font-tbLex font-normal text-xs lg:text-sm'>Recently added registered users will appear here</h6>
                    </div>

                </div>
                <Table data={filterData} columns={columns} paginator={false} />


                <div className="flex justify-end items-center gap-4 mt-4">
                    <button
                        onClick={() => pageChangeHandler(pageNo - 1)}
                        disabled={!prevIsValid}
                    >
                        <ArrowLeft2 size={20} color={prevIsValid ? "#007bff" : "#ccc"} />
                    </button>
                    <button
                        onClick={() => pageChangeHandler(pageNo + 1)}
                        disabled={!nextIsValid}
                    >
                        <ArrowRight2 size={20} color={nextIsValid ? "#007bff" : "#ccc"} />
                    </button>
                    <div className="relative">
                        <select
                            value={records}
                            onChange={(e) => recordChangeHandler(Number(e.target.value))}
                            className="pr-8 appearance-none"
                        >
                            {[10, 25, 50].map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllUserProfiles;

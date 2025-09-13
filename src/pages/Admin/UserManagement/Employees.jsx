import { ArrowLeft2, ArrowRight2, Copy } from 'iconsax-reactjs';
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getAllEmployees, getAllEqnuires } from '../../../api';
import Table from '../../../components/Table/Table'
import TextInput from '../../../components/TextInput/TextInput'
import usePagination from '../../../utils/customHooks/usePagination'
import { formBtn1, tableBtn } from '../../../utils/CustomClass'
// import EmployeeFormModal from '../../../components/Modals/EmployeeModal/EmployeeFormModal';
import { useSelector } from 'react-redux';
import { validateAlphabets } from '../../../utils/validateFunction';
import CreateEmployeeModal from '../../../components/Modals/AdminModals/CreateEmployeeModal';
import TableHeader from '../../../components/Table/TableHeader';
import { Trash } from 'iconsax-reactjs';


const Employees = () => {
    const initialFilterState = {
        name: ''
    };

    const { register, handleSubmit, reset } = useForm({ defaultValues: initialFilterState });
    const [filterCriteria, setFilterCriteria] = useState(initialFilterState);
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const combinedFilters = useMemo(() => ({
        ...filterCriteria,
        refresh: refreshTrigger
    }), [filterCriteria, refreshTrigger]);

    // Pagination hook
    const {
        filterData,
        pageNo,
        nextIsValid,
        prevIsValid,
        pageChangeHandler,
        recordChangeHandler,
        records,
        error
    } = usePagination(1, 10, getAllEmployees, combinedFilters);

    // Handle API errors
    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
    }, [error]);

    // Form submit handler
    const handleFilterSubmit = (data) => {
        setFilterCriteria(data);
        pageChangeHandler(1);
    };

    // Clear filters
    const handleClearFilters = () => {
        reset(initialFilterState);
        setFilterCriteria(initialFilterState);
        toast.success('Filters cleared');
    };

    const actionBodyTemplate = (row) => <div className="flex items-center gap-2">
        <CreateEmployeeModal edit={true} title='Edit Employee Details' userData={row} setRefreshTrigger={setRefreshTrigger} />
    </div>


    const columns = [
        {
            field: 'code', header: 'Employee Id', body: (row) => <div className="flex items-center gap-2"><span className='capitalize'>{row?._id?.slice(-10) || "---- -----"}</span> <span><Copy className="cursor-pointer text-primary hover:text-primary" size={18}
                onClick={() => {
                    navigator.clipboard.writeText(row?._id);
                    toast.success('ID Copied!');
                }} /></span>
            </div>, style: true
        },
        { field: 'firstName', header: 'First Name', body: (row) => <span className='capitalize'>{row?.profile?.firstName || "---- -----"}</span>, style: true },
        { field: 'lastName', header: 'Last Name', body: (row) => <span className='capitalize'>{row?.profile?.lastName || "---- -----"}</span>, style: true },
        { field: 'email', header: 'Email', body: (row) => <span className='capitalize'>{row?.email || "---- -----"}</span> },
        { field: 'mobileNo', header: 'Phone No.', body: (row) => <span className='capitalize'>{row?.mobileNo || "---- -----"}</span>, style: true },
        {
            field: 'createdAt',
            header: 'Registration date',
            body: (row) => <>{moment(row?.createdAt).format('DD-MM-YYYY (hh:mm)') || "---- -----"}</>,
            style: true
        },
        { field: 'action', header: 'Action', body: actionBodyTemplate, sortable: true },
    ];


    return (
        <section className='h-full w-full'>
            {/* =====================Dashboard header===================== */}
            {/* <DashboardHeader /> */}

            {/* =====================Main Dashaboard ===================== */}

            <div className="space-y-5">
                {/* Filter Form */}


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

                {/* User Table Section */}
                <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">

                    <TableHeader title={"All Employees"} subtitle={"Recently added employees will appear here"} component={<CreateEmployeeModal title={"Create Employee"} edit={false} setRefreshTrigger={setRefreshTrigger} />} />

                    <Table data={filterData} columns={columns} paginator={false} />

                    {/* Pagination Controls */}
                    <div className="flex justify-end items-center gap-4 mt-4">
                        <button
                            onClick={() => pageChangeHandler(pageNo - 1)}
                            disabled={!prevIsValid}
                        >
                            <ArrowLeft2 size={20} color={prevIsValid ? "#8833FF" : "#ccc"} />
                        </button>
                        <button
                            onClick={() => pageChangeHandler(pageNo + 1)}
                            disabled={!nextIsValid}
                        >
                            <ArrowRight2 size={20} color={nextIsValid ? "#8833FF" : "#ccc"} />
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
        </section >
    )
}

export default Employees

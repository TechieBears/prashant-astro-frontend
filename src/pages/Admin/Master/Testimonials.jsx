import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getAllEqnuires } from '../../../api'
import Table from '../../../components/Table/Table'
import TableHeader from '../../../components/Table/TableHeader'
import usePagination from '../../../utils/customHooks/usePagination'

const initialFilterState = {
    name: '',
    email: '',
    status: '',
    phoneNumber: '',
};

export default function Testimonials() {
    const { register, handleSubmit, reset, watch } = useForm({ defaultValues: initialFilterState });
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
    } = usePagination(1, 10, getAllEqnuires, combinedFilters);
    // Handle API errors
    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
    }, [error]);

    const columns = [
        { field: 'fullName', header: 'Name', body: (row) => <span className='capitalize'>{row?.fullName || "---- -----"}</span>, style: true },
        { field: 'email', header: 'Email', body: (row) => <span className='capitalize'>{row?.email || "---- -----"}</span>, style: true },
        { field: 'phoneNumber', header: 'Phone No', body: (row) => <span className='capitalize'>{row?.phoneNumber || "---- -----"}</span>, style: true },
        { field: 'createdAt', header: 'Enquiry Date', body: (row) => <>{moment(row?.createdAt)?.format('DD-MM-YYYY') || "---- -----"}</>, style: true },
        { field: 'message', header: 'Message', body: (row) => <div className='capitalize overflow-y-scroll w-[20rem] h-[5rem] text-wrap bg-slate1 rounded-md px-2 py-1'>{row?.message || "---- -----"}</div>, style: true },
        { field: 'status', header: 'Status', body: (row) => <h6 className={`${row?.status == 'rejected' ? 'text-red-500 bg-red-200' : row?.status == 'accepted' ? 'text-green-500 bg-green-200' : 'text-yellow-500 bg-yellow-100/80'} p-2 text-center rounded-full capitalize px-5`}>{row?.status}</h6>, sortable: true, style: true },
    ];
    return (
        <div className="space-y-5">

            {/* User Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title={`Testimonials (${filterData?.length || 0})`} subtitle={'Recently users testimonials will appear here'} />

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
    )
}

import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getAllFeedback } from '../../../api';
import Table from '../../../components/Table/Table'
import TableHeader from '../../../components/Table/TableHeader'
import TextInput from '../../../components/TextInput/TextInput'
import { formBtn1 } from '../../../utils/CustomClass'
import usePagination from '../../../utils/customHooks/usePagination'
import SendFeedbackReplay from '../../../components/Modals/AdminModals/SendFeedbackReplay';

const initialFilterState = {
    name: ''
};

export default function CustomerFeedback() {
    const { register, handleSubmit, reset, watch } = useForm({ defaultValues: initialFilterState });
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
    } = usePagination(1, 10, getAllFeedback, combinedFilters);

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

    const actionBodyTemplate = (row) => <div className="flex items-center gap-2">
        <SendFeedbackReplay edit={true} userData={row} setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />
    </div>


    const columns = [
        { field: 'fullName', header: 'fullName', body: (row) => <span className='capitalize'>{row?.fullName || "---- -----"}</span>, style: true, sortable: true },
        { field: 'email', header: 'Email', body: (row) => <span className='capitalize truncate'>{row?.email || "---- -----"}</span>, style: true, sortable: true },
        { field: 'mobileNumber', header: 'Phone No', body: (row) => <span className='capitalize'>{row?.mobileNumber || "---- -----"}</span>, style: true, sortable: true },
        { field: 'source', header: 'Reason Type', style: true, sortable: true },
        { field: 'subject', header: 'Subject', style: true, sortable: true },
        { field: 'createdAt', header: 'Enquiry Date', body: (row) => <>{moment(row?.createdAt)?.format('DD-MM-YYYY') || "---- -----"}</>, style: true, sortable: true },
        { field: 'Message', header: 'Message', body: (row) => <div className='capitalize overflow-y-scroll w-[20rem] h-[5rem] text-wrap bg-slate1 rounded-md px-2 py-1'>{row?.message || "---- -----"}</div>, style: true, sortable: true },
        { field: 'isRead', header: 'Status', body: (row) => <h6 className={`${!row?.isRead ? 'text-red-500 bg-red-200' : 'text-green-500 bg-green-200'} p-2 text-center rounded-full capitalize px-5`}>{row?.isRead ? 'Read' : 'Unread'}</h6>, style: true },
        { field: "action", header: "Action", body: actionBodyTemplate, style: true, sortable: true },
    ];
    return (
        <div className="space-y-5">
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-1 w-full gap-4">
                        <TextInput
                            label="Enter Full Name*"
                            placeholder="Enter Full Name"
                            type="text"
                            registerName="name"
                            props={{ ...register('name') }}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button type="submit" className={`${formBtn1} w-full`}>Filter</button>
                        <button type="button" onClick={handleClearFilters} className={`${formBtn1} w-full !bg-transparent border border-primary !text-primary`}>Clear</button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title={`User Feedbacks (${filterData?.length || 0})`} subtitle={'Recently users enquiries or feedback will appear here'} />

                <Table data={filterData} columns={columns} paginator={false} />

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

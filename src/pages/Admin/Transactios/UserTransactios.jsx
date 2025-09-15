import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminTransactionPagination } from '../../../api';
import Table from '../../../components/Table/Table';
import SelectTextInput from '../../../components/TextInput/SelectTextInput';
import TextInput from '../../../components/TextInput/TextInput';
import { formBtn1 } from '../../../utils/CustomClass';
import usePagination from '../../../utils/customHooks/usePagination';
import TableHeader from '../../../components/Table/TableHeader';

const initialFilterState = {
    email: '',
    status: '',
    orderId: ''
};

const UserTransactios = () => {
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
    } = usePagination(1, 10, adminTransactionPagination, combinedFilters);
    console.log('filteredData=================', filterData)
    // Handle API errors
    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
    }, [error]);

    // Form submit handler
    const handleFilterSubmit = (data) => {
        setFilterCriteria(data);
        pageChangeHandler(1); // Reset to first page when filters change
    };

    // Clear filters
    const handleClearFilters = () => {
        reset(initialFilterState);
        setFilterCriteria(initialFilterState);
        toast.success('Filters cleared');
    };

    const columns = [
        {
            field: 'orderId',
            header: 'Transaction ID',
            body: (row) => <>{row?.paymentDetails?.order?.order_id}</>,
            style: true
        },
        {
            field: 'fullName',
            header: 'Name',
            style: true
        },
        {
            field: 'email',
            header: 'Email',
            style: true
        },
        {
            field: 'phoneNumber',
            header: 'Phone No',
            style: true
        },
        {
            field: 'amount',
            header: 'Amount (₹)',
            body: (row) => <>{row?.paymentDetails?.order?.order_amount}</>,
            style: true
        },
        {
            field: 'status',
            header: 'Status',
            body: (row) => <>
                <h4 className={`${row?.paymentStatus === 'success' ? 'text-green-500 bg-green-100' : row?.paymentStatus === 'failed' ? 'text-red-500 bg-red-100' : 'text-yellow-500 bg-yellow-100'} self-center p-2 px-4 rounded-full capitalize font-tbPop`}>{row?.paymentStatus}</h4>
            </>,
            style: true
        },
        {
            field: 'createdAt',
            header: 'Transaction Date',
            body: (row) => <>{moment(row?.paymentDetails?.createdAt).format('DD-MM-YYYY hh:mm A')}</>,
            style: true
        }
    ];

    return (
        <div className="space-y-5">
            {/* Filter Form */}
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2">
                        <TextInput
                            label="Enter transaction Id*"
                            placeholder="Enter transaction Id"
                            type="text"
                            registerName="orderId"
                            props={{ ...register('orderId') }}
                        />
                        <TextInput
                            label="Enter Email*"
                            placeholder="Enter Email"
                            type="email"
                            registerName="email"
                            props={{ ...register('email') }}
                        />
                        <div className="">
                            <SelectTextInput
                                label="Select Status*"
                                registerName="status"
                                options={[
                                    { value: '', label: 'Select Status' },
                                    { value: 'unpaid', label: 'Unpaid' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'failed', label: 'Failed' },
                                    { value: 'success', label: 'Success' },
                                ]}
                                placeholder="Select Status"
                                props={{
                                    ...register('status'),
                                    value: watch('status') || ''
                                }}
                            />
                        </div>

                    </div>
                    <div className="flex space-x-2">
                        <button type="submit" className={`${formBtn1} w-full`}>Filter</button>
                        <button type="button" onClick={handleClearFilters} className={`${formBtn1} w-full !bg-transparent border border-primary !text-primary`}>Clear</button>
                    </div>
                </form>
            </div>

            {/* User Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title="All Transaction" subtitle="Recently transactions will appear here" />
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

export default UserTransactios

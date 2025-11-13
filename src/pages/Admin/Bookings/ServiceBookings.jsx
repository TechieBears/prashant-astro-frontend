import { ArrowLeft2, ArrowRight2, Copy } from 'iconsax-reactjs';
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getAllServiceOrdersAdmin } from '../../../api';
import Table from '../../../components/Table/Table'
import SelectTextInput from '../../../components/TextInput/SelectTextInput'
import TextInput from '../../../components/TextInput/TextInput'
import usePagination from '../../../utils/customHooks/usePagination'
import { formBtn1 } from '../../../utils/CustomClass'
import TableHeader from '../../../components/Table/TableHeader'
import ServiceBookingViewModal from '../../../components/Modals/AdminModals/ServiceBookingViewModal';
import { useSelector } from 'react-redux';

const ServiceBookings = () => {
    const user = useSelector((state) => state.user.userDetails);
    const initialFilterState = {
        orderId: '',
        date: '',
        status: '',
        astrologerId: user?.role === 'astrologer' ? user?._id : '',
    };

    const { register, handleSubmit, reset, watch } = useForm({ defaultValues: initialFilterState });
    const [filterCriteria, setFilterCriteria] = useState(initialFilterState);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    } = usePagination(1, 10, getAllServiceOrdersAdmin, combinedFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch service bookings');
    }, [error]);

    const handleFilterSubmit = (data) => {
        setFilterCriteria(data);
        pageChangeHandler(1);
        toast.success('Filters applied');
    };

    const handleClearFilters = () => {
        reset(initialFilterState);
        setFilterCriteria(initialFilterState);
        toast.success('Filters cleared');
    };

    const orderStatusOptions = [
        { value: 'PENDING', label: 'Pending' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'SHIPPED', label: 'Shipped' },
        { value: 'DELIVERED', label: 'Delivered' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'REFUNDED', label: 'Refunded' }
    ];

    const getValidStatusOptions = (currentStatus) => {
        const statusFlow = {
            'PENDING': ['PENDING', 'CONFIRMED', 'CANCELLED'],
            'CONFIRMED': ['CONFIRMED', 'SHIPPED', 'CANCELLED'],
            'SHIPPED': ['SHIPPED', 'DELIVERED', 'CANCELLED'],
            'DELIVERED': ['DELIVERED', 'REFUNDED'],
            'CANCELLED': ['CANCELLED', 'REFUNDED'],
            'REFUNDED': ['REFUNDED']
        };

        const validStatuses = statusFlow[currentStatus] || ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
        return orderStatusOptions.filter(option => validStatuses.includes(option.value));
    };

    const orderStatusBody = (row) => {
        const currentStatus = row?.orderStatus || 'PENDING';
        return (
            <div className="space-y-1">
                <span>{currentStatus}</span>
            </div>
        );
    };

    const paymentStatusBody = (row) => {
        const statusColor =
            row?.paymentStatus?.toUpperCase() === 'PAID'
                ? 'text-green-600 bg-green-100'
                : row?.paymentStatus?.toUpperCase() === 'PENDING'
                    ? 'text-yellow-600 bg-yellow-100'
                    : 'text-red-600 bg-red-100';
        return (
            <span className={`px-4 py-2 rounded-full text-xs font-tbLex tracking-tight font-medium ${statusColor}`}>
                {row?.paymentStatus?.toUpperCase() || 'PENDING'}
            </span>
        );
    };

    const columns = [
        {
            field: 'orderId',
            header: 'Order Id',
            body: (row) => (
                <div className="flex items-center gap-2">
                    <span className="capitalize">{row?.orderId?.slice(-10) || "---- -----"}</span>
                    <span>
                        <Copy
                            className="cursor-pointer text-primary hover:text-primary"
                            size={18}
                            onClick={() => {
                                navigator.clipboard.writeText(row?.orderId);
                                toast.success('ID Copied!');
                            }}
                        />
                    </span>
                </div>
            ),
            style: true, sortable: true
        },
        {
            field: 'services',
            header: 'Services',
            body: (row) => (
                <div className="space-y-2">
                    {row?.services?.map((service, index) => (
                        <div key={index} className="text-sm">
                            <div className="font-medium">{service?.serviceName}</div>
                            <div className="text-xs text-gray-500">
                                {moment(service?.bookingDate).format('DD-MM-YYYY')} | {service?.startTime} - {service?.endTime}
                            </div>
                            <div className="text-xs text-gray-500">₹{service?.servicePrice}</div>
                        </div>
                    ))}
                </div>
            ),
            style: true, sortable: false
        },
        // {
        //     field: 'address',
        //     header: 'Address',
        //     body: (row) => row?.address ? (
        //         <div className="text-sm space-y-1">
        //             <div className="font-medium">{row?.address?.firstName} {row?.address?.lastName}</div>
        //             <div className="text-xs text-gray-500">{row?.address?.phoneNumber}</div>
        //             <div className="text-xs text-gray-500">{row?.address?.address}, {row?.address?.city}, {row?.address?.state}</div>
        //         </div>
        //     ) : <span className="text-xs text-gray-400">-- No Address --</span>,
        //     style: true, sortable: false
        // },
        {
            field: 'finalAmount',
            header: 'Total Amount',
            body: (row) => (
                <div className="font-bold text-green-600">₹{row?.finalAmount}</div>
            ),
            style: true, sortable: true
        },
        {
            field: 'paymentId',
            header: 'Payment Method',
            body: (row) => (
                <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-tbLex tracking-tight'>
                    {row?.paymentId?.startsWith("COD") ? "COD" : "ONLINE"}
                </span>
            ),
            style: true, sortable: true
        },
        {
            field: 'paymentStatus',
            header: 'Payment Status',
            body: paymentStatusBody,
            style: true, sortable: true
        },
        {
            field: 'createdAt',
            header: 'Order Date',
            body: (row) => <>{moment(row?.createdAt).format('DD-MM-YYYY HH:mm') || '---- -----'}</>,
            style: true, sortable: true
        },
        {
            field: 'action',
            header: 'Action',
            body: (row) => <div className="flex items-center gap-2">
                <ServiceBookingViewModal bookingData={row} />
            </div>,
            style: true, sortable: false
        }
    ];

    return (
        <div className="space-y-5 h-screen bg-slate-100">
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2">
                        <TextInput
                            label="Enter Order Id*"
                            placeholder="Enter Order Id"
                            type="text"
                            registerName="orderId"
                            props={{ ...register('orderId') }}
                        />
                        <TextInput
                            label="Enter Date*"
                            placeholder="Enter Date"
                            type="date"
                            registerName="date"
                            props={{ ...register('date') }}
                        />
                        <div className="">
                            <SelectTextInput
                                label="Select Status*"
                                registerName="status"
                                options={[
                                    { value: 'PENDING', label: 'Pending' },
                                    { value: 'CONFIRMED', label: 'Confirmed' },
                                    { value: 'SHIPPED', label: 'Shipped' },
                                    { value: 'DELIVERED', label: 'Delivered' },
                                    { value: 'CANCELLED', label: 'Cancelled' },
                                    { value: 'REFUNDED', label: 'Refunded' }
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
                        <button type="button" onClick={handleClearFilters} className={`${formBtn1} w-full !bg-white border border-primary !text-primary`}>Clear</button>
                    </div>
                </form>
            </div>

            {/* Service Booking Table */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title={"Service Bookings"} subtitle={"Recently added service bookings will appear here"} />
                <Table data={filterData} columns={columns} paginator={false} />

                {/* Pagination */}
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
    );
}

export default ServiceBookings;

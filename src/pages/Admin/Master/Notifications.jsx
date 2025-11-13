import { ArrowLeft2, ArrowRight2, Copy } from 'iconsax-reactjs';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllNotifications } from '../../../api';
import Table from '../../../components/Table/Table';
import TableHeader from '../../../components/Table/TableHeader';
import usePagination from '../../../utils/customHooks/usePagination';
import SendNotificationModal from '../../../components/Modals/AdminModals/MasterModals/SendNotificationModal';


export default function Notifications() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const emptyFilters = useMemo(() => ({
        refresh: refreshTrigger
    }), [refreshTrigger]);

    const {
        pageNo,
        nextIsValid,
        prevIsValid,
        pageChangeHandler,
        recordChangeHandler,
        records,
        filterData,
        error
    } = usePagination(1, 10, getAllNotifications, emptyFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
    }, [error]);


    const notificationIdBody = (row) => (
        <div className="flex items-center gap-2">
            <span className="capitalize font-medium">{row?._id?.slice(-8) || "---- -----"}</span>
            <span>
                <Copy
                    className="cursor-pointer text-primary hover:text-primary-dark"
                    size={16}
                    onClick={() => {
                        navigator.clipboard.writeText(row?._id);
                        toast.success('Notification ID Copied!');
                    }}
                />
            </span>
        </div>
    );

    const imageBodyTemp = (row) => (
        <div className='w-52 h-24 rounded-lg overflow-hidden'>
            <img
                loading="lazy"
                src={row?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="notification"
                className='w-full h-full object-cover bg-slate-100'
            />
        </div>
    );

    const notificationDetailsBody = (row) => (
        <div className="space-y-2">
            <div className="text-sm">
                <div className="font-medium capitalize">
                    {row?.title || "---- -----"}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {row?.description || "---- -----"}
                </div>
                <div className="text-xs text-gray-500">
                    From: {row?.from || "---- -----"}
                </div>
            </div>
        </div>
    );

    const notificationTypeBody = (row) => {
        const typeColors = {
            'in-app': 'bg-blue-100 text-blue-800',
            'push': 'bg-green-100 text-green-800',
            'email': 'bg-purple-100 text-purple-800',
            'sms': 'bg-orange-100 text-orange-800'
        };
        const notificationType = row?.notificationType || "---- -----";
        const colorClass = typeColors[notificationType] || 'bg-gray-100 text-gray-800';

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
                {notificationType}
            </span>
        );
    };

    const userTypeBody = (row) => {
        const typeColors = {
            'all-customers': 'bg-indigo-100 text-indigo-800',
            'specific-users': 'bg-pink-100 text-pink-800',
            'premium-users': 'bg-yellow-100 text-yellow-800'
        };
        const userType = row?.userType || "---- -----";
        const colorClass = typeColors[userType] || 'bg-gray-100 text-gray-800';

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
                {userType}
            </span>
        );
    };

    const statsBody = (row) => {
        const stats = row?.stats || { success: 0, failed: 0 };
        const total = stats.success + stats.failed;
        const successRate = total > 0 ? Math.round((stats.success / total) * 100) : 0;

        return (
            <div className="space-y-1">
                <div className="text-sm">
                    <div className="font-medium text-green-600">{stats.success} sent</div>
                    <div className="text-xs text-red-500">{stats.failed} failed</div>
                </div>
                <div className="text-xs text-gray-500">
                    {successRate}% success rate
                </div>
            </div>
        );
    };

    const scheduledDateBody = (row) => (
        <div className="text-sm">
            <div className="font-medium">
                {moment(row?.scheduledAt).format('DD-MM-YYYY') || "---- -----"}
            </div>
            <div className="text-xs text-gray-500">
                {moment(row?.scheduledAt).format('hh:mm A') || ""}
            </div>
        </div>
    );

    const expiryDateBody = (row) => (
        <div className="text-sm">
            <div className="font-medium">
                {moment(row?.expiryDate).format('DD-MM-YYYY') || "---- -----"}
            </div>
            <div className="text-xs text-gray-500">
                {row?.expiryDate ? moment(row?.expiryDate).fromNow() : ""}
            </div>
        </div>
    );

    const statusBody = (row) => {
        const statusColors = {
            'active': 'bg-green-100 text-green-800',
            'inactive': 'bg-gray-100 text-gray-800',
            'scheduled': 'bg-blue-100 text-blue-800',
            'expired': 'bg-red-100 text-red-800'
        };
        const status = row?.status || "---- -----";
        const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
                {status}
            </span>
        );
    };

    const actionBodyTemplate = (row) => (
        <div className="flex items-center gap-2">
            <SendNotificationModal
                edit={true}
                title='Edit Notification'
                data={row}
                setRefreshTrigger={setRefreshTrigger}
                refreshTrigger={refreshTrigger}
            />
        </div>
    );


    const columns = [
        {
            field: 'image',
            header: 'Image',
            body: imageBodyTemp,
            style: true,
            sortable: true
        },
        {
            field: '_id',
            header: 'Notification ID',
            body: notificationIdBody,
            style: true,
            sortable: true
        },
        {
            field: 'notificationDetails',
            header: 'Notification Details',
            body: notificationDetailsBody,
            style: true,
            sortable: true
        },
        {
            field: 'notificationType',
            header: 'Type',
            body: notificationTypeBody,
            style: true,
            sortable: true
        },
        {
            field: 'userType',
            header: 'Target Users',
            body: userTypeBody,
            style: true,
            sortable: true
        },
        {
            field: 'stats',
            header: 'Delivery Stats',
            body: statsBody,
            style: true,
            sortable: true
        },
        {
            field: 'scheduledAt',
            header: 'Scheduled Date',
            body: scheduledDateBody,
            style: true,
            sortable: true
        },
        {
            field: 'expiryDate',
            header: 'Expiry Date',
            body: expiryDateBody,
            style: true,
            sortable: true
        },
        {
            field: 'status',
            header: 'Status',
            body: statusBody,
            style: true,
            sortable: true
        },
        {
            field: 'action',
            header: 'Action',
            body: actionBodyTemplate,
            style: true,
            sortable: true
        }
    ];

    return (
        <div className="space-y-5 h-screen bg-slate-100">

            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm p-5 sm:p-7">
                <TableHeader
                    title="All Notifications"
                    subtitle="Recently sent notifications will appear here"
                    component={<SendNotificationModal setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />}
                />
                <Table data={filterData} columns={columns} paginator={false} />

                {/* Pagination Controls */}
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
    )
}

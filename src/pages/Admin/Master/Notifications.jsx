import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import SendNotificationModal from '../../../components/Modals/AdminModals/MasterModals/SendNotificationModal';
import Table from '../../../components/Table/Table'
import TableHeader from '../../../components/Table/TableHeader'
import { useEffect, useMemo, useState } from 'react';
import usePagination from '../../../utils/customHooks/usePagination';
import toast from 'react-hot-toast';
import { getProductSubCategories } from '../../../api';


export default function Notifications() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const emptyFilters = useMemo(() => ({}), []);

    const {
        filterData,
        pageNo,
        nextIsValid,
        prevIsValid,
        pageChangeHandler,
        recordChangeHandler,
        records,
        error
    } = usePagination(1, 10, getProductSubCategories, emptyFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
    }, [error]);



    // ================= action of the table ===============
    const actionBodyTemplate = (row) => <div className="flex items-center gap-2">
        <SendNotificationModal button='edit' title='Edit Product Sub Category' data={row} setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />
    </div>


    const imageBodyTemp = (row) => {
        return (
            <>
                {
                    row?.image_url !== null ?
                        <div className="h-20 rounded bg-slate-100">
                            <img
                                loading="lazy"
                                src={row?.image_url}
                                alt="image"
                                className="object-cover w-full h-full rounded bg-slate-100"
                            />
                        </div> : "----"
                }

            </>
        )
    }

    const columns = [
        { field: "image", header: "Image", body: imageBodyTemp, style: true },
        { field: 'title', header: 'Title', sortable: true, style: true },
        { field: 'sub_title', header: 'Message', sortable: true, style: true },
        { field: 'notification_for', header: 'Notification For', body: (row) => <h5>User</h5>, sortable: true, style: true },
        { field: 'pincode', header: 'Pincode', body: (row) => <h5>{row?.pincode == 'All' ? row?.pincode : row?.pincode?.join()}</h5>, sortable: true, style: true },
        { field: 'action', header: 'Action', body: actionBodyTemplate, style: true, sortable: true },
    ];

    return (
        <div className="space-y-5">

            {/* User Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title="All Notifications" subtitle={'Recently users notifications will appear here'} action={<SendNotificationModal setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />} />
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

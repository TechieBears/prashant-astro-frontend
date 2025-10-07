import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllCoupons, editCoupon, deleteCoupon } from '../../../api';
import Table from '../../../components/Table/Table';
import TableHeader from '../../../components/Table/TableHeader';
import CreateCouponModal from '../../../components/Modals/AdminModals/MasterModals/CreateCouponModal.jsx';
import usePagination from '../../../utils/customHooks/usePagination';
import Switch from 'react-js-switch';
import { TrashIcon } from 'lucide-react';

function OffersCoupons() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const combinedFilters = useMemo(() => ({
        refresh: refreshTrigger,
    }), [refreshTrigger]);

    const {
        filterData,
        pageNo,
        nextIsValid,
        prevIsValid,
        pageChangeHandler,
        recordChangeHandler,
        records,
        error
    } = usePagination(1, 10, getAllCoupons, combinedFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch coupons');
    }, [error]);

    // ================= Active Toggle =================
    const handleActiveChange = async (id, isActive) => {
        try {
            await editCoupon(id, { isActive: !isActive });
            setRefreshTrigger(prev => prev + 1);
            toast.success('Status updated');
        } catch (error) {
            console.error('Failed to update status', error);
            toast.error('Update failed');
        }
    };

    const activeBody = (row) => (
        <Switch
            value={row?.isActive}
            onChange={() => handleActiveChange(row?._id, row?.isActive)}
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    );

    // ================= Delete Coupon =================
    const handleDeleteCoupon = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;

        try {
            await deleteCoupon(id);
            toast.success("Coupon deleted successfully");
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Failed to delete coupon", error);
            toast.error("Failed to delete coupon");
        }
    };

    // ================= Action Buttons =================
    const actionBodyTemplate = (row) => (
        <div className="flex items-center gap-2">
            <CreateCouponModal edit={true} title="Edit Coupon" userData={row} setRefreshTrigger={setRefreshTrigger} />
            <button
                onClick={() => handleDeleteCoupon(row?._id)}
                className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
            >
                <TrashIcon size={16} />
            </button>
        </div>
    );

    // ================= Expiry Status =================
    const expiryStatus = (row) => {
        const isExpired = moment().isAfter(moment(row?.expiryDate));
        return (
            <h6 className={`${!isExpired ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"} py-2 px-5 text-center capitalize rounded-full`}>
                {isExpired ? "Expired" : "Active"}
            </h6>
        );
    };
    const couponType = (row) => {
        return (
            <h6 className={`${row?.couponType == "both" ? "bg-orange-100 text-orange-500" : row?.couponType === "products" ? "bg-blue-100 text-blue-500" : "bg-purple-100 text-purple-500"} py-2 px-5 text-center capitalize rounded-full`}>
                {row?.couponType}
            </h6>
        );
    };


    // ================= Columns =================
    const columns = [
        { field: 'couponName', header: 'Coupon Title', body: (row) => <span className='capitalize'>{row?.couponName}</span>, sortable: true },
        { field: 'couponCode', header: 'Coupon Code', body: (row) => <span className='capitalize'>{row?.couponCode}</span>, sortable: true },
        { field: 'discount', header: 'Discount', body: (row) => <span className='capitalize'>{row?.discount}</span>, sortable: true },
        { field: 'discountIn', header: 'Discount Type', body: (row) => <span className='capitalize'>{row?.discountIn}</span>, sortable: true },
        {
            field: 'activationDate',
            header: 'Activation Date',
            sortable: true,
            body: (row) => <span className='capitalize'>{moment(row.activationDate).format('YYYY-MM-DD')}</span>
        },
        {
            field: 'expiryDate',
            header: 'Expiry Date',
            sortable: true,
            body: (row) => <span className='capitalize'>{moment(row.expiryDate).format('YYYY-MM-DD')}</span>
        },
        { field: 'couponType', header: 'Coupon Type', body: couponType, sortable: true },
        { field: 'status', header: 'Status', body: expiryStatus },
        { field: 'isActive', header: 'Active', body: activeBody, sortable: true },
        { field: 'action', header: 'Action', body: actionBodyTemplate, sortable: true }
    ];

    return (
        <div className="space-y-5 h-screen bg-slate-100">
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm p-5 sm:p-7">
                <TableHeader
                    title={`Coupons (${filterData?.length || 0})`}
                    subtitle="Recently added coupons will appear here"
                    component={
                        <CreateCouponModal edit={false} userData={null} setRefreshTrigger={setRefreshTrigger} />
                    }
                />

                <Table data={filterData || []} columns={columns} paginator={false} />

                {/* Pagination Controls */}
                <div className="flex justify-end items-center gap-4 mt-4">
                    <button onClick={() => pageChangeHandler(pageNo - 1)} disabled={!prevIsValid}>
                        <ArrowLeft2 size={20} color={prevIsValid ? "#007bff" : "#ccc"} />
                    </button>
                    <button onClick={() => pageChangeHandler(pageNo + 1)} disabled={!nextIsValid}>
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

export default OffersCoupons;

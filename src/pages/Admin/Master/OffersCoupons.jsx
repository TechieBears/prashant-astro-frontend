import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { adminGetFilteredActors } from '../../../api';
import Table from '../../../components/Table/Table';
import usePagination from '../../../utils/customHooks/usePagination';

const initialFilterState = {
    email: '',
    role: '',
};

function OffersCoupons() {
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
    } = usePagination(1, 10, adminGetFilteredActors, combinedFilters);
    // Handle API errors
    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
    }, [error]);

    // =============================== active user switch =============================
    const expiryStatus = (row) => {
        const isCouponExpired = expiryDate => moment().isAfter(moment(expiryDate));
        const couponExpired = isCouponExpired(row?.expiry_date);
        return <h6 className={`${!couponExpired ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"} py-2 px-5 text-center capitalize rounded-full`}>
            {couponExpired ? "Expired" : "Active"}
            {/* {rowData?.role} */}
        </h6>
    }

    // =============================== columns of the table =============================
    const columns = [
        { field: 'coupon_name', header: 'Coupon Name', sortable: true },
        { field: 'category', header: 'Coupon Category', sortable: true, style: true },
        { field: 'discount_price', header: 'Discounted Price', sortable: true },
        { field: 'discount_percent', header: 'Coupon Percentage', sortable: true },
        { field: 'activation_date', header: 'Activation Date', sortable: true, style: true },
        { field: 'expiry_date', header: 'Expiry Date', },
        { field: 'coupon_type', header: 'Coupon Type', sortable: true },
        { field: 'status', header: 'Expiry Status', body: expiryStatus, sortable: true },
        // { field: 'action', header: 'Action', body: action, sortable: true },
    ]

    return (
        <div className="space-y-5">
            {/* User Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <div className="flex justify-between flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                    <div className="lg:space-y-[1px]">
                        <h2 className='font-tbPop text-base md:text-lg lg:text-xl font-semibold text-black'>Coupons ({0})</h2>
                        <h6 className='text-slate-500 font-tbLex font-normal text-xs lg:text-sm'>Recently added coupons will appear here</h6>
                    </div>
                </div>
                <Table data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} columns={columns} paginator={false} />

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
    );
}

export default OffersCoupons;

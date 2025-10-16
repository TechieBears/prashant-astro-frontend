import { ArrowLeft2, ArrowRight2, Copy } from 'iconsax-reactjs';
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
import TextInput from '../../../components/TextInput/TextInput.jsx';
import { formBtn1 } from '../../../utils/CustomClass.jsx';
import { useForm } from 'react-hook-form';

function OffersCoupons() {
    const initialFilterState = {
        name: ''
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
    } = usePagination(1, 10, getAllCoupons, combinedFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch coupons');
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

    // ================= Enhanced Body Templates =================
    const couponIdBody = (row) => (
        <div className="flex items-center gap-2">
            <span className="capitalize font-medium">{row?._id?.slice(-8) || "---- -----"}</span>
            <span>
                <Copy
                    className="cursor-pointer text-primary hover:text-primary-dark"
                    size={16}
                    onClick={() => {
                        navigator.clipboard.writeText(row?._id);
                        toast.success('Coupon ID Copied!');
                    }}
                />
            </span>
        </div>
    );

    const couponDetailsBody = (row) => (
        <div className="space-y-1">
            <div className="text-sm">
                <div className="font-medium capitalize">
                    {row?.couponName || "---- -----"}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                        {row?.couponCode || "---- -----"}
                    </span>
                    <Copy
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                        size={14}
                        onClick={() => {
                            navigator.clipboard.writeText(row?.couponCode);
                            toast.success('Coupon Code Copied!');
                        }}
                    />
                </div>
            </div>
        </div>
    );

    const discountDetailsBody = (row) => {
        const discountIn = row?.discountIn || "percent";
        const discount = row?.discount || 0;

        return (
            <div className="space-y-1">
                <div className="text-sm font-bold text-green-600">
                    {discountIn === "percent" ? `${discount}%` : `₹${discount}`}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                    {discountIn === "percent" ? "Percentage" : "Fixed Amount"}
                </div>
            </div>
        );
    };

    const couponTypeBody = (row) => {
        const typeColors = {
            'products': 'bg-blue-100 text-blue-600',
            'services': 'bg-purple-100 text-purple-600',
            'both': 'bg-orange-100 text-orange-600'
        };
        const type = row?.couponType || "---- -----";
        const colorClass = typeColors[type] || 'bg-gray-100 text-gray-600';

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
                {type}
            </span>
        );
    };

    const applicableItemsBody = (row) => {
        const applicableServices = row?.applicableServices || [];
        const applicableServiceCategories = row?.applicableServiceCategories || [];
        const applicableProducts = row?.applicableProducts || [];
        const applicableProductCategories = row?.applicableProductCategories || [];
        const applicableProductSubcategories = row?.applicableProductSubcategories || [];

        let items = [];
        let label = "";
        let colorClass = "";

        if (row?.couponType === 'services') {
            if (applicableServices.length > 0) {
                items = applicableServices;
                label = "Services";
                colorClass = "bg-purple-100 text-purple-700";
            } else if (applicableServiceCategories.length > 0) {
                items = applicableServiceCategories;
                label = "Categories";
                colorClass = "bg-purple-100 text-purple-700";
            }
        } else if (row?.couponType === 'products') {
            if (applicableProducts.length > 0) {
                items = applicableProducts;
                label = "Products";
                colorClass = "bg-blue-100 text-blue-700";
            } else if (applicableProductCategories.length > 0) {
                items = applicableProductCategories;
                label = "Categories";
                colorClass = "bg-blue-100 text-blue-700";
            } else if (applicableProductSubcategories.length > 0) {
                items = applicableProductSubcategories;
                label = "Subcategories";
                colorClass = "bg-blue-100 text-blue-700";
            }
        }

        if (items.length === 0) {
            return <span className="text-xs text-gray-400">All {row?.couponType}</span>;
        }

        return (
            <div className="space-y-1">
                <div className="text-xs font-medium text-gray-600">{label}</div>
                <div className="flex flex-wrap gap-1">
                    <span className={`px-2 py-1 ${colorClass} text-xs rounded-full`}>
                        {items.length} {label}
                    </span>
                </div>
            </div>
        );
    };

    const datesBody = (row) => (
        <div className="space-y-1 text-sm">
            <div>
                <div className="text-xs text-gray-500">Activation</div>
                <div className="font-medium text-green-600">
                    {moment(row?.activationDate).format('DD-MM-YYYY') || "---- -----"}
                </div>
            </div>
            <div>
                <div className="text-xs text-gray-500">Expiry</div>
                <div className="font-medium text-red-600">
                    {moment(row?.expiryDate).format('DD-MM-YYYY') || "---- -----"}
                </div>
            </div>
        </div>
    );

    const expiryStatusBody = (row) => {
        const isExpired = moment().isAfter(moment(row?.expiryDate));
        const isUpcoming = moment().isBefore(moment(row?.activationDate));

        let statusText = "Active";
        let colorClass = "bg-green-100 text-green-600";

        if (isExpired) {
            statusText = "Expired";
            colorClass = "bg-red-100 text-red-600";
        } else if (isUpcoming) {
            statusText = "Upcoming";
            colorClass = "bg-yellow-100 text-yellow-600";
        }

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                {statusText}
            </span>
        );
    };

    const redemptionBody = (row) => {
        const redemptionPerUser = row?.redemptionPerUser || 0;
        const totalRedemptions = row?.totalRedemptions || 0;

        return (
            <div className="space-y-1 text-sm">
                <div>
                    <div className="text-xs text-gray-500">Per User</div>
                    <div className="font-medium text-blue-600">{redemptionPerUser}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="font-medium text-purple-600">{totalRedemptions}</div>
                </div>
            </div>
        );
    };

    const activeBody = (row) => (
        <div className="space-y-2">
            <div className="flex items-center">
                <Switch
                    value={row?.isActive}
                    onChange={() => handleActiveChange(row?._id, row?.isActive)}
                    size={50}
                    backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
                    borderColor={{ on: "#86d993", off: "#c6c6c6" }}
                />
            </div>
        </div>
    );

    const createdAtBody = (row) => (
        <div className="text-sm">
            <div className="font-medium">
                {moment(row?.createdAt).format('DD-MM-YYYY') || "---- -----"}
            </div>
            <div className="text-xs text-gray-500">
                {moment(row?.createdAt).format('hh:mm A') || ""}
            </div>
        </div>
    );

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


    // ================= Columns =================
    const columns = [
        {
            field: '_id',
            header: 'Coupon ID',
            body: couponIdBody,
            style: true,
            sortable: true
        },
        {
            field: 'couponDetails',
            header: 'Coupon Details',
            body: couponDetailsBody,
            style: true,
            sortable: true
        },
        {
            field: 'discount',
            header: 'Discount',
            body: discountDetailsBody,
            style: true,
            sortable: true
        },
        {
            field: 'couponType',
            header: 'Coupon Type',
            body: couponTypeBody,
            style: true,
            sortable: true
        },
        {
            field: 'applicableItems',
            header: 'Applicable To',
            body: applicableItemsBody,
            style: true,
            sortable: false
        },
        {
            field: 'dates',
            header: 'Dates',
            body: datesBody,
            style: true,
            sortable: true
        },
        {
            field: 'status',
            header: 'Status',
            body: expiryStatusBody,
            style: true,
            sortable: true
        },
        {
            field: 'redemption',
            header: 'Redemptions',
            body: redemptionBody,
            style: true,
            sortable: true
        },
        {
            field: 'isActive',
            header: 'Active',
            body: activeBody,
            style: true,
            sortable: true
        },
        {
            field: 'createdAt',
            header: 'Created At',
            body: createdAtBody,
            style: true,
            sortable: true
        },
        {
            field: 'action',
            header: 'Action',
            body: actionBodyTemplate,
            style: true,
            sortable: false
        }
    ];

    return (
        <div className="space-y-5 h-screen bg-slate-100">
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 w-full gap-2">
                        <TextInput
                            label="Enter Coupon Name*"
                            placeholder="Enter Coupon Name"
                            type="text"
                            registerName="name"
                            props={{ ...register('name') }}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button type="submit" className={`${formBtn1} w-full`}>Filter</button>
                        <button type="button" onClick={handleClearFilters} className={`${formBtn1} w-full !bg-white border border-primary !text-primary`}>Clear</button>
                    </div>
                </form>
            </div>
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

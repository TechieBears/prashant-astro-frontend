import moment from 'moment';
import Switch from "react-js-switch";
import Table from '../../../components/Table/Table';
import TableHeader from '../../../components/Table/TableHeader';
import CreateBannersModal from '../../../components/Modals/AdminModals/MasterModals/CreateBannersModal';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import usePagination from '../../../utils/customHooks/usePagination';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { useState } from 'react';
import { getAllBanners } from '../../../api';

function Banner() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const emptyFilters = useMemo(() => ({}), []);

    const {
        pageNo,
        nextIsValid,
        prevIsValid,
        pageChangeHandler,
        recordChangeHandler,
        records,
        filterData,
        error
    } = usePagination(1, 10, getAllBanners, emptyFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch banners');
    }, [error]);

    // ================= action of the table ===============
    const actionBodyTemplate = (row) => <div className="flex items-center gap-2">
        <CreateBannersModal button='edit' title='Edit Banner' data={row} setRefreshTrigger={setRefreshTrigger} />
    </div>

    const premiumBody = (row) => (
        <Switch
            value={row?.isPremium}
            disabled={row?.is_registered || !row?.isVerified || !row?.isRejected == false ? true : false}
            onChange={() => handlePremiumChange(row?._id, row?.isPremium)}
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    )


    // ================= columns of the table ===============

    const imageBodyTemp = (row) => (
        <div className="h-24 rounded bg-slate-100">
            <img
                loading="lazy"
                src={row?.image}
                alt="image"
                className="object-cover w-full h-full rounded bg-slate-100"
            />
        </div>
    );


    const columns = [
        { field: "image", header: "Image", body: imageBodyTemp, style: true },
        { field: 'vendor_type', header: 'Banner For', sortable: true, style: true },
        { field: 'redirection_type', header: 'Redirection Type', body: (row) => <h5>{row?.redirection_type ? row?.redirection_type : row?.redirect_link}</h5>, sortable: true, style: true },
        { field: 'featured_time', header: 'Featured Time', body: (row) => <h6>{row?.start_time != null ? (moment(row?.start_time).format('YYYY-MM-DD ,HH:mm') + " to " + moment(row?.end_time).format('YYYY-MM-DD ,HH:mm')) : '-----'}</h6>, sortable: true, style: true },
        { field: "isactive", header: "Active", body: premiumBody, sortable: true, style: true },
        { field: "action", header: "Action", body: actionBodyTemplate, sortable: true, style: true },
    ];

    return (
        <div className="space-y-5">
            {/* User Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title="All Banners" subtitle="Recently added banners will appear here" component={<CreateBannersModal setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />} />
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
    );
}

export default Banner;

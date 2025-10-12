import moment from 'moment';
import Switch from "react-js-switch";
import Table from '../../../components/Table/Table';
import TableHeader from '../../../components/Table/TableHeader';
import CreateBannersModal from '../../../components/Modals/AdminModals/MasterModals/CreateBannersModal';
import { ArrowLeft2, ArrowRight2, Copy } from 'iconsax-reactjs';
import usePagination from '../../../utils/customHooks/usePagination';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { useState } from 'react';
import { editBanner, getAllBanners } from '../../../api';
import { formBtn1 } from '../../../utils/CustomClass';
import { useForm } from 'react-hook-form';
import TextInput from '../../../components/TextInput/TextInput';

const Banner = () => {
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
    } = usePagination(1, 10, getAllBanners, combinedFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch banners');
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

    // ================= action of the table ===============
    const actionBodyTemplate = (row) => <div className="flex items-center gap-2">
        <CreateBannersModal edit={true} title='Edit Product Category' userData={row} setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />
    </div>

    const imageBodyTemp = (row) => <div className='w-52 h-24 rounded'>
        <img loading="lazy" src={row?.image} alt="image" className='w-full h-full object-cover rounded bg-slate-100' />
    </div>

    const handleActiveChange = async (id, isActive) => {
        try {
            const updatedData = {
                isActive: !isActive
            }
            await editBanner(id, updatedData);
            setRefreshTrigger(prev => prev + 1);
            toast.success('Status updated');
        }
        catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    }

    const bannerIdBody = (row) => (
        <div className="flex items-center gap-2">
            <span className="capitalize font-medium">{row?._id?.slice(-8) || "---- -----"}</span>
            <span>
                <Copy
                    className="cursor-pointer text-primary hover:text-primary-dark"
                    size={16}
                    onClick={() => {
                        navigator.clipboard.writeText(row?._id);
                        toast.success('Banner ID Copied!');
                    }}
                />
            </span>
        </div>
    );

    const bannerTitleBody = (row) => (
        <div className="space-y-1">
            <div className="font-medium text-sm capitalize text-wrap w-[12rem]">
                {row?.title || "---- -----"}
            </div>
            <div className="text-xs text-gray-500">
                Position: {row?.position || "Not set"}
            </div>
        </div>
    );

    const bannerDescriptionBody = (row) => (
        <div className="text-sm text-wrap w-[14rem]">
            <div className="text-gray-700 line-clamp-2">
                {row?.description || "No description available"}
            </div>
        </div>
    );

    const bannerTypeBody = (row) => {
        const typeColors = {
            'website': 'bg-blue-100 text-blue-800',
            'mobile': 'bg-green-100 text-green-800',
            'app': 'bg-purple-100 text-purple-800'
        };
        const bannerType = row?.type || "---- -----";
        const colorClass = typeColors[bannerType] || 'bg-gray-100 text-gray-800';

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
                {bannerType}
            </span>
        );
    };

    const featuredTimeBody = (row) => {
        const startDate = row?.startDate;
        const endDate = row?.endDate;

        if (!startDate || !endDate) {
            return <span className="text-xs text-gray-400">Not configured</span>;
        }

        const now = moment();
        const start = moment(startDate);
        const end = moment(endDate);

        let statusColor = 'text-gray-500';
        let statusText = 'Scheduled';

        if (now.isBefore(start)) {
            statusColor = 'text-blue-600';
            statusText = 'Upcoming';
        } else if (now.isBetween(start, end)) {
            statusColor = 'text-green-600';
            statusText = 'Active';
        } else if (now.isAfter(end)) {
            statusColor = 'text-red-600';
            statusText = 'Expired';
        }

        return (
            <div className="space-y-1">
                <div className="text-xs font-medium">
                    <div>{moment(startDate).format('DD-MM-YYYY, HH:mm')}</div>
                    <div className="text-gray-400">to</div>
                    <div>{moment(endDate).format('DD-MM-YYYY, HH:mm')}</div>
                </div>
                <div className={`text-xs font-medium ${statusColor}`}>
                    {statusText}
                </div>
            </div>
        );
    };

    const createdDateBody = (row) => (
        <div className="text-sm">
            <div className="font-medium">
                {moment(row?.createdAt).format('DD-MM-YYYY') || "---- -----"}
            </div>
            <div className="text-xs text-gray-500">
                {moment(row?.createdAt).format('hh:mm A') || ""}
            </div>
        </div>
    );

    const statusBody = (row) => {
        return (
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
    };

    const columns = [
        {
            field: "image",
            header: "Banner Image",
            body: imageBodyTemp,
            style: true,
            sortable: false
        },
        {
            field: '_id',
            header: 'Banner ID',
            body: bannerIdBody,
            style: true,
            sortable: true
        },
        {
            field: 'title',
            header: 'Banner Title',
            body: bannerTitleBody,
            style: true,
            sortable: true
        },
        {
            field: 'description',
            header: 'Description',
            body: bannerDescriptionBody,
            style: true,
            sortable: true
        },
        {
            field: 'type',
            header: 'Banner Type',
            body: bannerTypeBody,
            style: true,
            sortable: true
        },
        {
            field: 'featuredTime',
            header: 'Featured Duration',
            body: featuredTimeBody,
            style: true,
            sortable: true
        },
        {
            field: 'createdAt',
            header: 'Created Date',
            body: createdDateBody,
            style: true,
            sortable: true
        },
        {
            field: "status",
            header: "Status",
            body: statusBody,
            style: true,
            sortable: true
        },
        {
            field: "action",
            header: "Action",
            body: actionBodyTemplate,
            style: true,
            sortable: true
        }
    ];

    return (
        <div className="space-y-5 h-screen bg-slate-100">
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 w-full gap-2">
                        <TextInput
                            label="Enter Banner Title*"
                            placeholder="Enter Banner Title"
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
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title="All Banners" subtitle="Recently added banners will appear here" component={<CreateBannersModal setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />} />
                <Table data={filterData} columns={columns} />

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

export default Banner;

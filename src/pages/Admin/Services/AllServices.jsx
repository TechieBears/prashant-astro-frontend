import { ArrowLeft2, ArrowRight2, Copy } from 'iconsax-reactjs';
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Switch from "react-js-switch";
import { editService, getServices } from '../../../api';
import Table from '../../../components/Table/Table'
import SelectTextInput from '../../../components/TextInput/SelectTextInput'
import TextInput from '../../../components/TextInput/TextInput'
import usePagination from '../../../utils/customHooks/usePagination'
import { formBtn1 } from '../../../utils/CustomClass'
import TableHeader from '../../../components/Table/TableHeader'
import CreateServiceModal from '../../../components/Modals/AdminModals/CreateServiceModal';
import { useSelector } from 'react-redux';

const initialFilterState = {
    name: '',
    categoryId: '',
};

const AllServices = () => {
    const serviceCategories = useSelector(state => state.appRoot?.serviceCategories || []);
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
    } = usePagination(1, 10, getServices, combinedFilters);


    useEffect(() => {
        if (error) toast.error('Failed to fetch services');
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

    const handleActiveChange = async (id, isActive) => {
        try {
            const updatedData = {
                isActive: !isActive
            }
            await editService(id, updatedData);
            setRefreshTrigger(prev => prev + 1);
            toast.success('Status updated');
        }
        catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    }

    // Enhanced body templates following ServiceBookings design pattern
    const serviceIdBody = (row) => (
        <div className="flex items-center gap-2">
            <span className="capitalize font-medium">{row?._id?.slice(-8) || "---- -----"}</span>
            <span>
                <Copy
                    className="cursor-pointer text-primary hover:text-primary-dark"
                    size={16}
                    onClick={() => {
                        navigator.clipboard.writeText(row?._id);
                        toast.success('Service ID Copied!');
                    }}
                />
            </span>
        </div>
    );

    const serviceDetailsBody = (row) => (
        <div className="space-y-2">
            <div className="text-sm">
                <div className="font-medium capitalize">{row?.name || "---- -----"}</div>
                {row?.subTitle && (
                    <div className="text-xs text-gray-400 capitalize mt-1">
                        {row.subTitle.length > 50 ? `${row.subTitle.substring(0, 50)}...` : row.subTitle}
                    </div>
                )}
            </div>
        </div>
    );

    const serviceTypeBody = (row) => {
        const typeColors = {
            'online': 'bg-blue-100 text-blue-800',
            'pooja_at_home': 'bg-green-100 text-green-800',
            'pandit_center': 'bg-purple-100 text-purple-800'
        };
        const displayType = row?.serviceType?.replace(/_/g, ' ') || "---- -----";
        const colorClass = typeColors[row?.serviceType] || 'bg-gray-100 text-gray-800';

        return (
            <span className={`px-4 py-2 rounded-full text-xs font-tbLex tracking-tight font-medium capitalize ${colorClass}`}>
                {displayType}
            </span>
        );
    };

    const categoryBody = (row) => (
        <div className="text-sm capitalize">
            <div className="font-medium">{row?.category?.name || "---- -----"}</div>
            <div className="text-xs text-gray-500">(Category)</div>
        </div>
    );

    const priceDetailsBody = (row) => (
        <div className="space-y-1">
            <div className="font-bold text-green-600">₹{row?.price ? row.price.toLocaleString('en-IN') : "----"}</div>
            <div className="text-xs text-gray-500">
                {row?.durationInMinutes ? `${row.durationInMinutes} minutes` : "Duration not set"}
            </div>
        </div>
    );

    const contentBody = (row) => {
        const content = row?.htmlContent?.replace(/<[^>]*>/g, '') || "No description available";
        const videoCount = row?.videoUrl?.length || 0;

        return (
            <div className="space-y-1">
                <h4 className="text-xs text-gray-600 max-w-xs line-clamp-4">
                    {content}
                </h4>
                {videoCount > 0 && (
                    <div className="flex items-center gap-1">
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            {videoCount} video{videoCount > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const statusBody = (row) => {
        const statusColor = row?.isActive
            ? 'text-green-600 bg-green-100'
            : 'text-red-600 bg-red-100';

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

    const imageBody = (row) => <div className='w-52 h-24 rounded'>
        <img loading="lazy" src={row?.image} alt="image" className='w-full h-full object-cover rounded bg-slate-100' />
    </div>

    const actionBody = (row) => (
        <div className="flex items-center gap-2">
            <CreateServiceModal
                edit={true}
                title='Edit Service'
                userData={row}
                setRefreshTrigger={setRefreshTrigger}
            />
        </div>
    );

    const columns = [
        {
            field: 'image',
            header: 'Image',
            body: imageBody,
            style: true,
            sortable: false
        },
        {
            field: '_id',
            header: 'Service ID',
            body: serviceIdBody,
            style: true,
            sortable: true
        },
        {
            field: 'serviceDetails',
            header: 'Service Details',
            body: serviceDetailsBody,
            style: true,
            sortable: false
        },
        {
            field: 'serviceType',
            header: 'Service Type',
            body: serviceTypeBody,
            style: true,
            sortable: true
        },
        {
            field: 'category',
            header: 'Category',
            body: categoryBody,
            style: true,
            sortable: true
        },
        {
            field: 'priceDetails',
            header: 'Price & Duration',
            body: priceDetailsBody,
            style: true,
            sortable: true
        },
        {
            field: 'content',
            header: 'Content & Media',
            body: contentBody,
            style: true,
            sortable: false
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
            body: actionBody,
            style: true,
            sortable: true
        }
    ];
    return (
        <div className="space-y-5 h-screen bg-slate-100">
            {/* Filter Form */}
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
                        <TextInput
                            label="Enter Service Name*"
                            placeholder="Enter Service Name"
                            type="text"
                            registerName="name"
                            props={{ ...register('name') }}
                        />
                        <div className="">
                            <SelectTextInput
                                label="Select Service Category*"
                                registerName="categoryId"
                                options={[
                                    ...serviceCategories
                                ]}
                                placeholder="Select Service Category"
                                props={{
                                    ...register('categoryId'),
                                    value: watch('categoryId') || ''
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

            {/* User Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">

                <TableHeader title={"All Services"} subtitle={"Recently added services will appear here"} component={<CreateServiceModal setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />} />

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
    );
}

export default AllServices;

import { ArrowLeft2, ArrowRight2, Star1 } from 'iconsax-reactjs';
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Switch from "react-js-switch";
import { getAdminAllReviews, editReviews } from '../../../api';
import Table from '../../../components/Table/Table'
import TableHeader from '../../../components/Table/TableHeader'
import usePagination from '../../../utils/customHooks/usePagination'
import { validateAlphabets } from '../../../utils/validateFunction';
import { formBtn1 } from '../../../utils/CustomClass';
import TextInput from '../../../components/TextInput/TextInput';
import { useForm } from 'react-hook-form';

const StarRating = ({ rating, maxStars = 5 }) => {
    return (
        <div className="flex items-center gap-1 justify-center">
            {[...Array(maxStars)].map((_, index) => (
                <Star1
                    key={index}
                    size={16}
                    variant={index < rating ? "Bold" : "Outline"}
                    color={index < rating ? "#FFD700" : "#E5E7EB"}
                />
            ))}
            <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
        </div>
    );
};

export default function Reviews() {
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
    } = usePagination(1, 10, getAdminAllReviews, combinedFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch reviews');
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


    const handleActiveChange = async (id, isActive) => {
        try {
            const updatedData = {
                isActive: !isActive
            }
            await editReviews(id, updatedData);
            setRefreshTrigger(prev => prev + 1);
            toast.success('Status updated successfully');
        }
        catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    }

    const activeBody = (row) => (
        <Switch
            value={row?.isActive}
            onChange={() => handleActiveChange(row?._id, row?.isActive)}
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    )

    const columns = [
        {
            field: 'user',
            header: 'User',
            body: (row) => (
                <div className="flex items-center gap-3">
                    <img
                        src={row?.user?.profileImage || '/api/placeholder/32/32'}
                        alt={`${row?.user?.firstName} ${row?.user?.lastName}`}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${row?.user?.firstName}+${row?.user?.lastName}&background=8833FF&color=fff&size=32`;
                        }}
                    />
                    <div className=''>
                        <p className="font-medium capitalize text-sm">{row?.user?.firstName} {row?.user?.lastName}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[130px]" title={row?.user?.email}>
                            {row?.user?.email}
                        </p>
                    </div>
                </div>
            ),
            style: true
        },
        {
            field: 'service',
            header: 'Service/Product',
            body: (row) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {row?.service?.name || row?.service?.title || row?.product?.name || "N/A"}
                </span>
            ),
            style: true
        },
        {
            field: 'rating',
            header: 'Rating',
            body: (row) => <StarRating rating={row?.rating || 0} />,
            style: true
        },
        {
            field: 'createdAt',
            header: 'Date',
            body: (row) => (
                <div>
                    <p className="text-sm font-medium">{moment(row?.createdAt)?.format('DD-MM-YYYY') || "N/A"}</p>
                    <p className="text-xs text-gray-500">{moment(row?.createdAt)?.format('hh:mm A') || ""}</p>
                </div>
            ),
            style: true
        },
        { field: 'message', header: 'Message', body: (row) => <textarea className='capitalize overflow-y-auto w-[20rem] h-[5rem] text-wrap rounded-md px-2 py-1 resize-none cursor-default' value={row?.message || "---- -----"} readOnly />, style: true },
        { field: "isactive", header: "Visible On Website", body: activeBody, sortable: true, style: true },
    ];

    return (
        <div className="space-y-5 h-screen bg-slate-100">
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 w-full gap-2">
                        <TextInput
                            label="Enter User Name*"
                            placeholder="Enter User Name"
                            type="text"
                            registerName="name"
                            props={{ ...register('name', { validate: validateAlphabets }) }}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button type="submit" className={`${formBtn1} w-full`}>Filter</button>
                        <button type="button" onClick={handleClearFilters} className={`${formBtn1} w-full !bg-white border border-primary !text-primary`}>Clear</button>
                    </div>
                </form>
            </div>
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title="All Reviews" subtitle="Recently added Reviews will appear here" />
                <Table data={filterData} columns={columns} />

                {/* Pagination */}
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

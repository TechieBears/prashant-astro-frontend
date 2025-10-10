import { useEffect, useState, useMemo } from 'react';
import Switch from "react-js-switch";
import moment from 'moment'
import { Copy } from 'iconsax-reactjs';
import Table from '../../../components/Table/Table';
import TableHeader from '../../../components/Table/TableHeader';
import ServiceCategoriesModal from '../../../components/Modals/AdminModals/ServiceCategoriesModal';
import usePagination from '../../../utils/customHooks/usePagination';
import toast from 'react-hot-toast';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import { getServiceCategories, editServiceCategory } from '../../../api';


const ServicesCategories = () => {
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
    } = usePagination(1, 10, getServiceCategories, emptyFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
    }, [error]);

    useEffect(() => {
        if (error) toast.error('Failed to fetch service categories');
    }, [error]);

    const handleActiveChange = async (id, isActive) => {
        try {
            const updatedData = {
                isActive: !isActive
            }
            await editServiceCategory(id, updatedData);
            setRefreshTrigger(prev => prev + 1);
            toast.success('Status updated');
        }
        catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    }

    // Enhanced body templates following Employees design pattern
    const categoryIdBody = (row) => (
        <div className="flex items-center gap-2">
            <span className="capitalize font-medium">{row?._id?.slice(-8) || "---- -----"}</span>
            <span>
                <Copy
                    className="cursor-pointer text-primary hover:text-primary-dark"
                    size={16}
                    onClick={() => {
                        navigator.clipboard.writeText(row?._id);
                        toast.success('Service Category ID Copied!');
                    }}
                />
            </span>
        </div>
    );

    const imageBodyTemp = (row) => <div className='w-52 h-24 rounded'>
        <img loading="lazy" src={row?.image} alt="image" className='w-full h-full object-cover rounded bg-slate-100' />
    </div>

    const categoryDetailsBody = (row) => (
        <div className="space-y-2">
            <div className="text-sm">
                <div className="font-medium capitalize text-base">
                    {row?.name || "---- -----"}
                </div>
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


    const creationDateBody = (row) => (
        <div className="text-sm">
            <div className="font-medium text-xs text-gray-600">
                Created At
            </div>
            <div className="font-medium text-xs mt-1">
                {moment(row?.createdAt).format('DD-MM-YYYY') || "---- -----"}
            </div>
            <div className="text-xs text-gray-500">
                {moment(row?.createdAt).format('hh:mm A') || ""}
            </div>
        </div>
    );

    const actionBodyTemplate = (row) => (
        <div className="flex items-center gap-2">
            <ServiceCategoriesModal
                edit={true}
                title='Edit Service Category'
                userData={row}
                setRefreshTrigger={setRefreshTrigger}
            />
        </div>
    );

    const columns = [
        {
            field: 'image',
            header: 'Image',
            body: imageBodyTemp,
            style: true,
            sortable: false
        },
        {
            field: '_id',
            header: 'Category ID',
            body: categoryIdBody,
            style: true,
            sortable: true
        },
        {
            field: 'categoryDetails',
            header: 'Category Details',
            body: categoryDetailsBody,
            style: true,
            sortable: true
        },
        {
            field: 'createdAt',
            header: 'Created Date',
            body: creationDateBody,
            style: true,
            sortable: true
        },
        // {
        //     field: 'status',
        //     header: 'Status',
        //     body: statusBody,
        //     style: true,
        //     sortable: true
        // },
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
            {/* Service Category Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm p-5 sm:p-7">
                <TableHeader
                    title={"Service Categories"}
                    subtitle={"Recently added service categories will appear here"}
                    component={<ServiceCategoriesModal title={"Create Service Category"} edit={false} setRefreshTrigger={setRefreshTrigger} />}
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
    );
}

export default ServicesCategories;

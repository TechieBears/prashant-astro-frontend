import { ArrowLeft2, ArrowRight2, Edit, Eye, Trash } from 'iconsax-reactjs';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Switch from "react-js-switch";
import { NavLink } from 'react-router-dom';
import { adminGetFilteredActors, verifyUser } from '../../../api';
import Table from '../../../components/Table/Table';
import SelectTextInput from '../../../components/TextInput/SelectTextInput';
import TextInput from '../../../components/TextInput/TextInput';
import { imageComponet, statusBody } from '../../../helper/Helper';
import { formBtn1 } from '../../../utils/CustomClass';
import usePagination from '../../../utils/customHooks/usePagination';
import CreateProductModal from '../../../components/Modals/AdminModals/CreateProductModal';
import TableHeader from '../../../components/Table/TableHeader';

const initialFilterState = {
    email: '',
    role: '',
};

function AllUserProfiles() {
    const { register, handleSubmit, reset, watch } = useForm({ defaultValues: initialFilterState });
    const [filterCriteria, setFilterCriteria] = useState(initialFilterState);
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(false)
    const [edit, setEdit] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

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

    // Form submit handler
    const handleFilterSubmit = (data) => {
        setFilterCriteria(data);
        pageChangeHandler(1); // Reset to first page when filters change
    };

    // Clear filters
    const handleClearFilters = () => {
        reset(initialFilterState);
        setFilterCriteria(initialFilterState);
        toast.success('Filters cleared');
    };

    const handleVarificationChange = async (id, isVerified) => {
        try {
            const updatedData = {
                isVerified: !isVerified
            }
            await verifyUser(id, updatedData).then(res => {
                if (res?.message == "User verified successfully") {
                    toast.success('Status updated');
                } else {
                    toast.error(res?.message);
                }
            }); // Toggle verification state
            setRefreshTrigger(prev => prev + 1); // Trigger refreshz
        } catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    }

    const toggleModal = () => {
        setOpen(!open);
    };

    const handleTrashClick = (row) => {
        setSelectedUser(row); // set the user from current row
        toggleModal();
    };

    const ActionBody = (row) => (
        <div className='flex items-center gap-x-1'>
            <NavLink to={`/admin-actors-profile/${row?._id}`} state={{ row }}>
                <Eye size={20} className="text-gray-500 cursor-pointer" />
            </NavLink>
            <button onClick={() => handleTrashClick(row)}><Trash className='text-red-500' size={20} /></button>
            <button onClick={() => {
                setEdit(true)
                toggleModal()
                setData(row)
            }} >
                <Edit className='text-yellow-500' size={20} />
            </button>
        </div>
    )

    const varificationBody = (row) => {
        return <Switch
            value={row?.isVerified}
            disabled={row?.is_registered || row?.paymentStatus !== "success" || !row?.isRejected == false ? true : false}
            onChange={() => handleVarificationChange(row?._id, row?.isVerified)}
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    }


    const columns = [
        { field: "image", header: "Image", body: imageComponet, style: true },
        { field: 'name', header: 'Product Name', body: (row) => <span className='capitalize'>{row?.name || "---- -----"}</span>, style: true },
        { field: 'category', header: 'Category', body: (row) => <span className='capitalize'>{row?.category || "---- -----"}</span>, style: true },
        { field: 'price', header: 'Price', body: (row) => <span>₹{row?.price || "0"}</span>, style: true },
        { field: 'duration', header: 'Duration', body: (row) => <span>{row?.duration || "---- -----"}</span>, style: true },
        {
            field: 'createdAt',
            header: 'Created Date',
            body: (row) => <>{moment(row?.createdAt).format('DD-MM-YYYY') || "---- -----"}</>,
            style: true
        },
        { field: 'status', header: 'Status', body: statusBody, style: true },
        {
            field: 'isApproved',
            header: 'Approved',
            body: varificationBody,
            style: true
        },
        {
            field: 'action',
            header: 'Action',
            body: ActionBody,
            style: true
        }
    ];

    return (
        <div className="space-y-5">
            {/* Filter Form */}
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 w-full gap-2">
                        <TextInput
                            label="Product Name*"
                            placeholder="Enter Product Name"
                            type="text"
                            registerName="name"
                            props={{ ...register('name') }}
                        />
                        <div className="">
                            <SelectTextInput
                                label="Select Category*"
                                registerName="category"
                                options={[
                                    { value: '', label: 'Select Category' },
                                    { value: 'astrology', label: 'Astrology' },
                                    { value: 'palmistry', label: 'Palmistry' },
                                    { value: 'numerology', label: 'Numerology' },
                                    { value: 'tarot', label: 'Tarot Reading' },
                                    { value: 'vastu', label: 'Vastu Shastra' },
                                ]}
                                props={{
                                    ...register('category', { required: true }),
                                    value: watch('category') || ''
                                }}
                            />
                        </div>
                        <div className="">
                            <SelectTextInput
                                label="Select Status*"
                                registerName="status"
                                options={[
                                    { value: '', label: 'Select Status' },
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'approved', label: 'Approved' },
                                    { value: 'rejected', label: 'Rejected' },
                                ]}
                                props={{
                                    ...register('status', { required: true }),
                                    value: watch('status') || ''
                                }}
                            />
                        </div>

                    </div>
                    <div className="flex space-x-2">
                        <button type="submit" className={`${formBtn1} w-full`}>Filter</button>
                        <button type="button" onClick={handleClearFilters} className={`${formBtn1} w-full !bg-transparent border border-primary !text-primary`}>Clear</button>
                    </div>
                </form>
            </div>

            {/* Product Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title='All Products' subtitle='List of all Products' component={<CreateProductModal setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />} />
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

export default AllUserProfiles;

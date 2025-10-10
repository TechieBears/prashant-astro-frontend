import { ArrowLeft2, ArrowRight2, Copy } from 'iconsax-reactjs';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Switch from "react-js-switch";
import { editCustomer, getAllCustomers } from '../../../api';
import Table from '../../../components/Table/Table';
import TextInput from '../../../components/TextInput/TextInput';
import TableHeader from '../../../components/Table/TableHeader';
import { formBtn1 } from '../../../utils/CustomClass';
import usePagination from '../../../utils/customHooks/usePagination';
import { validateAlphabets } from '../../../utils/validateFunction';

const initialFilterState = {
    name: ''
};

function AllUserProfiles() {
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
    } = usePagination(1, 10, getAllCustomers, combinedFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
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
            await editCustomer(id, updatedData);
            setRefreshTrigger(prev => prev + 1);
            toast.success('Status updated');
        } catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    }

    // Enhanced body templates following Employees design pattern
    const userIdBody = (row) => (
        <div className="flex items-center gap-2">
            <span className="capitalize font-medium">{row?._id?.slice(-8) || "---- -----"}</span>
            <span>
                <Copy
                    className="cursor-pointer text-primary hover:text-primary-dark"
                    size={16}
                    onClick={() => {
                        navigator.clipboard.writeText(row?._id);
                        toast.success('User ID Copied!');
                    }}
                />
            </span>
        </div>
    );

    const profileImageBody = (row) => (
        <div className='w-16 h-16 rounded-full overflow-hidden'>
            <img
                loading="lazy"
                src={row?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="profile"
                className='w-full h-full object-cover bg-slate-100'
            />
        </div>
    );

    const userDetailsBody = (row) => (
        <div className="space-y-2">
            <div className="text-sm">
                <div className="font-medium capitalize">
                    {`${row?.profile?.firstName || ""} ${row?.profile?.lastName || ""}`.trim() || "---- -----"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {row?.email || "---- -----"}
                </div>
                <div className="text-xs text-gray-500">
                    {row?.mobileNo || "---- -----"}
                </div>
            </div>
        </div>
    );

    const roleBody = (row) => {
        const roleColors = {
            'customer': 'bg-blue-100 text-blue-800',
            'admin': 'bg-red-100 text-red-800',
            'employee': 'bg-green-100 text-green-800'
        };
        const userRole = row?.role || "---- -----";
        const colorClass = roleColors[userRole] || 'bg-gray-100 text-gray-800';

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
                {userRole}
            </span>
        );
    };

    const titleBody = (row) => {
        const title = row?.profile?.title;

        if (!title) {
            return <span className="text-xs text-gray-400">Not specified</span>;
        }

        const titleColors = {
            'Mr': 'bg-blue-100 text-blue-700',
            'Mrs': 'bg-pink-100 text-pink-700',
            'Ms': 'bg-purple-100 text-purple-700',
            'Master': 'bg-orange-100 text-orange-700'
        };

        const colorClass = titleColors[title] || 'bg-gray-100 text-gray-700';

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                {title}
            </span>
        );
    };

    const genderBody = (row) => {
        const gender = row?.profile?.gender;

        if (!gender) {
            return <span className="text-xs text-gray-400">Not specified</span>;
        }

        const genderColors = {
            'male': 'bg-blue-100 text-blue-700',
            'female': 'bg-pink-100 text-pink-700',
            'other': 'bg-purple-100 text-purple-700'
        };

        const colorClass = genderColors[gender] || 'bg-gray-100 text-gray-700';

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
                {gender}
            </span>
        );
    };

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

    const registrationDateBody = (row) => (
        <div className="text-sm">
            <div className="font-medium">
                {moment(row?.createdAt).format('DD-MM-YYYY') || "---- -----"}
            </div>
            <div className="text-xs text-gray-500">
                {moment(row?.createdAt).format('hh:mm A') || ""}
            </div>
        </div>
    );

    const columns = [
        {
            field: 'profileImage',
            header: 'Profile',
            body: profileImageBody,
            style: true,
            sortable: false
        },
        {
            field: '_id',
            header: 'User ID',
            body: userIdBody,
            style: true,
            sortable: true
        },
        {
            field: 'userDetails',
            header: 'User Details',
            body: userDetailsBody,
            style: true,
            sortable: true
        },
        {
            field: 'role',
            header: 'Role',
            body: roleBody,
            style: true,
            sortable: true
        },
        {
            field: 'title',
            header: 'Title',
            body: titleBody,
            style: true,
            sortable: true
        },
        {
            field: 'gender',
            header: 'Gender',
            body: genderBody,
            style: true,
            sortable: true
        },
        {
            field: 'status',
            header: 'Status',
            body: statusBody,
            style: true,
            sortable: true
        },
        {
            field: 'createdAt',
            header: 'Registration Date',
            body: registrationDateBody,
            style: true,
            sortable: true
        }
    ];

    return (
        <div className="space-y-5 h-screen bg-slate-100">
            {/* Filter Form */}
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 w-full gap-2">
                        <TextInput
                            label="Enter Full Name*"
                            placeholder="Enter Full Name"
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

            {/* User Profiles Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm p-5 sm:p-7">
                <TableHeader
                    title={"All User Profiles"}
                    subtitle={"Recently registered users will appear here"}
                />

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

export default AllUserProfiles;

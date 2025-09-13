import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Switch from "react-js-switch";
import { blacklistUser, blockUser, getAllBlockedUser } from '../../../api'
import Table from '../../../components/Table/Table'
import SelectTextInput from '../../../components/TextInput/SelectTextInput'
import TextInput from '../../../components/TextInput/TextInput'
import usePagination from '../../../utils/customHooks/usePagination'
import { formBtn1 } from '../../../utils/CustomClass'
import { formatRole, imageComponet } from '../../../helper/Helper'
import TableHeader from '../../../components/Table/TableHeader'
import CreateServiceModal from '../../../components/Modals/AdminModals/CreateServiceModal';

const initialFilterState = {
    name: '',
    email: '',
    role: '',
};

const AllServices = () => {
    const { register, handleSubmit, reset, watch } = useForm({ defaultValues: initialFilterState });
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
    } = usePagination(1, 10, getAllBlockedUser, combinedFilters);
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


    const handleBlockChange = async (id, isBlocked) => {
        try {
            const updatedData = {
                isBlocked: !isBlocked
            }
            await blockUser(id, updatedData); // Toggle verification state
            setRefreshTrigger(prev => prev + 1); // Trigger refresh
            toast.success('Status updated');
        } catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    };

    const ActionBody = (row) => (
        <NavLink to={`/dashboard/${row?._id}`}>
            <Eye size={20} className="text-gray-500 cursor-pointer" />
        </NavLink>
    )


    const varificationBody = (row) => (
        <Switch
            value={row?.isVerified}
            disabled
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    )

    const handleBlackListChange = async (id, isBlacklisted) => {
        try {
            const updatedData = {
                isBlacklisted: !isBlacklisted
            }
            await blacklistUser(id, updatedData); // Toggle verification state
            setRefreshTrigger(prev => prev + 1); // Trigger refresh
            toast.success('Status updated');
        } catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    }

    const blackListBody = (row) => (
        <Switch
            value={row?.isBlacklisted}
            disabled={row?.is_registered == false ? true : false}
            onChange={() => handleBlackListChange(row?._id, row?.isBlacklisted)}
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    )

    const blockBody = (row) => (
        <Switch
            value={row?.isBlocked} onChange={() => handleBlockChange(row?._id, row?.isBlocked)}
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    )
    const columns = [
        { field: "profile", header: "Profile", body: imageComponet, style: true },
        { field: 'fullName', header: 'Name', body: (row) => <span className='capitalize'>{row?.fullName || "---- -----"}</span>, style: true },
        { field: 'role', header: 'Role', body: (row) => row?.role == "primary" ? "Primary" : row?.role == "secondary" ? "Secondary" : row?.subRole == "castingAgency" ? "Casting Agency" : formatRole(row?.subRole) || "---- -----", style: true },
        { field: 'email', header: 'Email', body: (row) => <span className='capitalize'>{row?.email || "---- -----"}</span>, style: true },
        { field: 'phoneNumber', header: 'Phone No.', body: (row) => <span className='capitalize'>{row?.phoneNumber || "---- -----"}</span>, style: true },
        {
            field: 'createdAt',
            header: 'Registration date',
            body: (row) => <>{moment(row?.createdAt).format('DD-MM-YYYY') || "---- -----"}</>,
            style: true
        },
        { field: 'rejectionCount', header: 'Rejection Count', style: true },
        {
            field: 'isVerified',
            header: 'Verification',
            body: varificationBody,
            style: true
        },
        {
            field: 'isBlacklisted',
            header: 'Blacklisted',
            body: blackListBody,
            style: true
        },
    ];
    return (
        <div className="space-y-5">
            {/* Filter Form */}
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2">
                        <TextInput
                            label="Enter Full Name*"
                            placeholder="Enter Full Name"
                            type="text"
                            registerName="name"
                            props={{ ...register('name') }}
                        />
                        <TextInput
                            label="Enter Email*"
                            placeholder="Enter Email"
                            type="email"
                            registerName="email"
                            props={{ ...register('email') }}
                        />
                        <div className="">
                            <SelectTextInput
                                label="Select Role*"
                                registerName="role"
                                options={[
                                    { value: '', label: 'Select Role' },
                                    { value: 'primary', label: 'Primary Actor' },
                                    { value: 'secondary', label: 'Secondary Actor' },
                                    { value: 'castingAgency', label: 'Casting Agency' },
                                    { value: 'castingDirector', label: 'Casting Director' },
                                    { value: 'productionTeam', label: 'Production Team' }
                                ]}
                                props={{
                                    ...register('role', { required: true }),
                                    value: watch('role') || ''
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

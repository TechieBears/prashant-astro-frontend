import { ArrowLeft2, ArrowRight2, Copy } from 'iconsax-reactjs';
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Switch from "react-js-switch";
import { getAllEmployees, editEmployee } from '../../../api';
import Table from '../../../components/Table/Table'
import TextInput from '../../../components/TextInput/TextInput'
import usePagination from '../../../utils/customHooks/usePagination'
import { formBtn1, tableBtn } from '../../../utils/CustomClass'
import { validateAlphabets } from '../../../utils/validateFunction';
import CreateEmployeeModal from '../../../components/Modals/AdminModals/CreateEmployeeModal';
import TableHeader from '../../../components/Table/TableHeader';

const initialFilterState = {
    name: ''
};

const Employees = () => {
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
    } = usePagination(1, 10, getAllEmployees, combinedFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch employees');
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
            await editEmployee(id, updatedData);
            setRefreshTrigger(prev => prev + 1);
            toast.success('Status updated');
        }
        catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    }

    // Enhanced body templates following AllServices design pattern
    const employeeIdBody = (row) => (
        <div className="flex items-center gap-2">
            <span className="capitalize font-medium">{row?._id?.slice(-8) || "---- -----"}</span>
            <span>
                <Copy
                    className="cursor-pointer text-primary hover:text-primary-dark"
                    size={16}
                    onClick={() => {
                        navigator.clipboard.writeText(row?._id);
                        toast.success('Employee ID Copied!');
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

    const employeeDetailsBody = (row) => (
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

    const employeeTypeBody = (row) => {
        const typeColors = {
            'astrologer': 'bg-purple-100 text-purple-800',
            'employee': 'bg-blue-100 text-blue-800'
        };
        const employeeType = row?.profile?.employeeType || "---- -----";
        const colorClass = typeColors[employeeType] || 'bg-gray-100 text-gray-800';

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
                {employeeType}
            </span>
        );
    };

    const skillsBody = (row) => {
        const skills = row?.profile?.skills || [];

        if (skills.length === 0) {
            return <span className="text-xs text-gray-400">No skills added</span>;
        }

        return (
            <div className="space-y-1">
                <div className="flex flex-wrap gap-1">
                    {skills.slice(0, 2).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full capitalize">
                            {skill}
                        </span>
                    ))}
                    {skills.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{skills.length - 2} more
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const languagesBody = (row) => {
        const languages = row?.profile?.languages || [];

        if (languages.length === 0) {
            return <span className="text-xs text-gray-400">No languages</span>;
        }

        return (
            <div className="space-y-1">
                <div className="flex flex-wrap gap-1">
                    {languages.slice(0, 2).map((language, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                            {language}
                        </span>
                    ))}
                    {languages.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{languages.length - 2} more
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const experienceBody = (row) => {
        const experience = row?.profile?.experience;

        if (!experience) {
            return <span className="text-xs text-gray-400">Not specified</span>;
        }

        return (
            <div className="text-sm">
                <div className="font-medium text-orange-600">{experience} years</div>
                <div className="text-xs text-gray-500">Experience</div>
            </div>
        );
    };

    const availabilityBody = (row) => {
        const days = row?.profile?.days || [];
        const startTime = row?.profile?.startTime;
        const endTime = row?.profile?.endTime;

        if (days.length === 0 || !startTime || !endTime) {
            return <span className="text-xs text-gray-400">Not configured</span>;
        }

        return (
            <div className="space-y-1">
                <div className="text-xs font-medium">
                    {startTime} - {endTime}
                </div>
                <div className="text-xs text-gray-500">
                    {days.length} day{days.length > 1 ? 's' : ''} available
                </div>
                <div className="flex flex-wrap gap-1">
                    {days.slice(0, 2).map((day, index) => (
                        <span key={index} className="px-1 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                            {day.slice(0, 3)}
                        </span>
                    ))}
                    {days.length > 2 && (
                        <span className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            +{days.length - 2}
                        </span>
                    )}
                </div>
            </div>
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

    const actionBodyTemplate = (row) => (
        <div className="flex items-center gap-2">
            <CreateEmployeeModal
                edit={true}
                title='Edit Employee Details'
                userData={row}
                setRefreshTrigger={setRefreshTrigger}
            />
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
            header: 'Employee ID',
            body: employeeIdBody,
            style: true,
            sortable: true
        },
        {
            field: 'employeeDetails',
            header: 'Employee Details',
            body: employeeDetailsBody,
            style: true,
            sortable: true
        },
        {
            field: 'employeeType',
            header: 'Employee Type',
            body: employeeTypeBody,
            style: true,
            sortable: true
        },
        {
            field: 'skills',
            header: 'Skills',
            body: skillsBody,
            style: true,
            sortable: true
        },
        {
            field: 'languages',
            header: 'Languages',
            body: languagesBody,
            style: true,
            sortable: true
        },
        {
            field: 'experience',
            header: 'Experience',
            body: experienceBody,
            style: true,
            sortable: true
        },
        {
            field: 'availability',
            header: 'Availability',
            body: availabilityBody,
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
        },
        {
            field: 'action',
            header: 'Action',
            body: actionBodyTemplate,
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

            {/* Employee Table Section */}
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm p-5 sm:p-7">
                <TableHeader
                    title={"All Employees"}
                    subtitle={"Recently added employees will appear here"}
                    component={<CreateEmployeeModal title={"Create Employee"} edit={false} setRefreshTrigger={setRefreshTrigger} />}
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
    )
}

export default Employees

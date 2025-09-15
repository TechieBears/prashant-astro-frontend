import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
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
import { imageComponet1 } from '../../../helper/Helper';
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

    const activeBody = (row) => (
        <Switch
            value={row?.isActive}
            onChange={() => handleActiveChange(row?._id, row?.isActive)}
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    )

    const actionBodyTemplate = (row) => <div className="flex items-center gap-2">
        <CreateServiceModal edit={true} title='Edit Service' userData={row} setRefreshTrigger={setRefreshTrigger} />
    </div>

    const columns = [
        { field: "image", header: "Image", body: imageComponet1, style: true, sortable: true },
        { field: 'name', header: 'Name', body: (row) => <span className='capitalize'>{row?.name || "---- -----"}</span>, style: true, sortable: true },
        { field: 'serviceType', header: 'Service Type', body: (row) => <span className='capitalize'>{row?.serviceType || "---- -----"}</span>, style: true, sortable: true },
        { field: 'title', header: 'Title', body: (row) => <span className='capitalize'>{row?.title || "---- -----"}</span>, style: true, sortable: true },
        { field: 'subTitle', header: 'Sub Title', body: (row) => <span className='capitalize'>{row?.subTitle || "---- -----"}</span>, style: true, sortable: true },
        { field: 'categoryName', header: 'Category', body: (row) => <span className='capitalize'>{row?.category?.name || "---- -----"}</span>, style: true, sortable: true },
        { field: 'price', header: 'Price', body: (row) => <span className='capitalize'>{row?.price || "---- -----"}</span>, style: true, sortable: true },
        { field: 'durationInMinutes', header: 'Duration', body: (row) => <span className='capitalize'>{row?.durationInMinutes || "---- -----"}</span>, style: true, sortable: true },
        {
            field: 'isActive',
            header: 'Active',
            body: activeBody,
            style: true,
            sortable: true
        },
        { field: 'action', header: 'Action', body: actionBodyTemplate, sortable: true }
    ];
    return (
        <div className="space-y-5">
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

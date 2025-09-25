import { ArrowLeft2, ArrowRight2, Copy } from 'iconsax-reactjs';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Switch from "react-js-switch";
import { editProduct } from '../../../api';
import { getProducts } from '../../../api';
import Table from '../../../components/Table/Table';
import SelectTextInput from '../../../components/TextInput/SelectTextInput';
import TextInput from '../../../components/TextInput/TextInput';
import { formBtn1 } from '../../../utils/CustomClass';
import usePagination from '../../../utils/customHooks/usePagination';
import CreateProductModal from '../../../components/Modals/AdminModals/CreateProductModal';
import TableHeader from '../../../components/Table/TableHeader';
import { useSelector } from 'react-redux';

const initialFilterState = {
    name: '',
    categoryId: '',
};

function AllUserProfiles() {
    const { register, handleSubmit, reset, watch } = useForm({ defaultValues: initialFilterState });
    const [filterCriteria, setFilterCriteria] = useState(initialFilterState);
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const productCategories = useSelector(state => state.appRoot?.productCategories || []);
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
    } = usePagination(1, 10, getProducts, combinedFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch products');
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
            await editProduct(id, updatedData).then(res => {
                if (res?.message == "Product updated successfully") {
                    toast.success('Status updated');
                } else {
                    toast.error(res?.message);
                }
            });
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.log('error', error)
            toast.error('Update failed');
        }
    }

    const activeBody = (row) => {
        return <Switch
            value={row?.isActive}
            disabled={row?.isActive == false ? true : false}
            onChange={() => handleActiveChange(row?._id, row?.isActive)}
            size={50}
            backgroundColor={{ on: "#86d993", off: "#c6c6c6" }}
            borderColor={{ on: "#86d993", off: "#c6c6c6" }}
        />
    }
    const actionBodyTemplate = (row) => <div className="flex items-center gap-2">
        <CreateProductModal edit={true} title='Edit Product' userData={row} setRefreshTrigger={setRefreshTrigger} />
    </div>

    const imageComponet = (row) => (<div className="w-16 h-16">
        <img
            src={row?.images[0] || "https://avatar.iran.liara.run/public"}
            className="object-cover w-full h-full rounded-full bg-slate1"
            alt={row?.name}
        />
    </div>)

    const columns = [
        { field: "image", header: "Image", body: imageComponet, style: true, sortable: true },
        {
            field: 'code', header: 'Product Id', body: (row) => <div className="flex items-center gap-2"><span className='capitalize'>{row?._id?.slice(-10) || "---- -----"}</span> <span><Copy className="cursor-pointer text-primary hover:text-primary" size={18}
                onClick={() => {
                    navigator.clipboard.writeText(row?._id);
                    toast.success('ID Copied!');
                }} /></span>
            </div>, style: true, sortable: true
        },
        { field: 'name', header: 'Product Name', body: (row) => <span className='capitalize'>{row?.name || "---- -----"}</span>, style: true, sortable: true },
        { field: 'category.name', header: 'Category', body: (row) => <span className='capitalize'>{row?.category?.name || "---- -----"}</span>, style: true, sortable: true },
        { field: 'subcategory.name', header: 'Sub Category', body: (row) => <span className='capitalize'>{row?.subcategory?.name || "---- -----"}</span>, style: true, sortable: true },
        { field: 'mrpPrice', header: 'MRP Price', body: (row) => <span>₹{row?.mrpPrice || "0"}</span>, style: true, sortable: true },
        { field: 'sellingPrice', header: 'Selling Price', body: (row) => <span>₹{row?.sellingPrice || "0"}</span>, style: true, sortable: true },
        { field: 'stock', header: 'Stock', body: (row) => <span>{row?.stock || "0"}</span>, style: true, sortable: true },
        {
            field: 'createdAt',
            header: 'Created Date',
            body: (row) => <>{moment(row?.createdAt).format('DD-MM-YYYY') || "---- -----"}</>,
            style: true, sortable: true
        },
        { field: "action", header: "Action", body: actionBodyTemplate, style: true, sortable: true },
        {
            field: 'isActive',
            header: 'Status',
            body: activeBody,
            style: true, sortable: true
        }
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
                                options={productCategories}
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

            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 ">
                <TableHeader title='All Products' subtitle='Recently added products will appear here' component={<CreateProductModal setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />} />
                <Table data={filterData} columns={columns} paginator={false} />

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

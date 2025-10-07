import { ArrowLeft2, ArrowRight2, Copy, Eye } from 'iconsax-reactjs';
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
import { ProductViewButton } from '../../../components/Modals/AdminModals/ProductViewModal';

const initialFilterState = {
    name: '',
    categoryId: '',
};

function AllUserProfiles() {
    const { register, handleSubmit, reset, watch } = useForm({ defaultValues: initialFilterState });
    const [filterCriteria, setFilterCriteria] = useState(initialFilterState);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
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
    const actionBodyTemplate = (row) => (
        <div className="flex items-center gap-2">
            <ProductViewButton product={row} />
            <CreateProductModal edit={true} title='Edit Product' userData={row} setRefreshTrigger={setRefreshTrigger} />
        </div>
    );

    const imageBodyTemp = (row) => (
        <div className="h-20 w-20 rounded-lg bg-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <img
                loading="lazy"
                src={row?.images[0] || ""}
                alt={row?.name || "Product"}
                className="object-cover w-full h-full rounded-lg hover:scale-105 transition-transform duration-200"
            />
        </div>
    );

    const priceBodyTemp = (row) => (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-green-600">₹{row?.sellingPrice || "0"}</span>
                {row?.discountPercentage > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        -{row?.discountPercentage}%
                    </span>
                )}
            </div>
            {row?.mrpPrice !== row?.sellingPrice && (
                <div className="text-sm text-gray-500 line-through">₹{row?.mrpPrice}</div>
            )}
        </div>
    );

    const stockBodyTemp = (row) => (
        <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${row?.stock > 50 ? 'bg-green-100 text-green-700' :
                row?.stock > 10 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                }`}>
                {row?.stock || "0"}
            </span>
            <span className="text-xs text-gray-500">units</span>
        </div>
    );

    const productDetailsTemp = (row) => (
        <div className="space-y-2 max-w-xs">
            <div className="font-semibold text-gray-800 capitalize truncate" title={row?.name}>
                {row?.name || "---- -----"}
            </div>
            <div className="text-sm text-gray-600">
                <span className="capitalize">{row?.category?.name || "No Category"}</span>
                {row?.subcategory?.name && (
                    <span className="text-slate-600 font-tbPop font-normal text-xs"> • {row?.subcategory?.name}</span>
                )}
            </div>
        </div>
    );


    const columns = [
        { field: "image", header: "Image", body: imageBodyTemp, style: true, sortable: false },
        {
            field: 'code', header: 'Product ID', body: (row) => (
                <div className="flex items-center gap-2">
                    <span className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>
                        {row?._id?.slice(-8) || "---- -----"}
                    </span>
                    <Copy
                        className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                        size={16}
                        onClick={() => {
                            navigator.clipboard.writeText(row?._id);
                            toast.success('ID Copied!');
                        }}
                    />
                </div>
            ), style: true, sortable: true
        },
        { field: 'productDetails', header: 'Product Details', body: productDetailsTemp, style: true, sortable: false },
        { field: 'pricing', header: 'Pricing', body: priceBodyTemp, style: true, sortable: true },
        { field: 'stock', header: 'Stock', body: stockBodyTemp, style: true, sortable: true },
        {
            field: 'createdAt',
            header: 'Created Date',
            body: (row) => (
                <div className="text-sm">
                    <div className="font-medium">{moment(row?.createdAt).format('DD MMM YYYY') || "---- -----"}</div>
                    <div className="text-xs text-gray-500">{moment(row?.createdAt).format('hh:mm A') || ""}</div>
                </div>
            ),
            style: true, sortable: true
        },
        {
            field: 'isActive',
            header: 'Status',
            body: activeBody,
            style: true, sortable: true
        },
        { field: "action", header: "Actions", body: actionBodyTemplate, style: true, sortable: false }
    ];



    return (
        <div className="space-y-5 h-screen bg-slate-100">
            {/* Filter Form */}
            <div className="bg-white p-4 sm:m-5 rounded-xl">
                <form onSubmit={handleSubmit(handleFilterSubmit)} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
                        <TextInput
                            label="Enter Product Name*"
                            placeholder="Enter Product Name"
                            type="text"
                            registerName="name"
                            props={{ ...register('name') }}
                        />
                        <div className="">
                            <SelectTextInput
                                label="Select Product Category*"
                                registerName="categoryId"
                                options={productCategories}
                                placeholder="Select Product Category"
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

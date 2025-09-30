import { useEffect, useState, useMemo } from 'react';
import { Tab, TabList, Tabs, TabPanel } from 'react-tabs'
import Table from '../../../components/Table/Table';
import TableHeader from '../../../components/Table/TableHeader';
import ProductCategoriesModal from '../../../components/Modals/AdminModals/ProductCategoriesModal';
import ProductSubCategoriesModal from '../../../components/Modals/AdminModals/ProductSubCategoriesModal';
import { getProductCategories, getProductSubCategories } from '../../../api';
import usePagination from '../../../utils/customHooks/usePagination';
import toast from 'react-hot-toast';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';

const ProductCategories = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    return (
        <div className="mx-5 mt-10 h-screen bg-slate-100" >
            <Tabs selectedIndex={selectedTab} onSelect={index => setSelectedTab(index)} >
                <TabList className="flex space-x-2 mx-1 ">
                    <Tab
                        className={`p-3 cursor-pointer font-tbPop font-medium  transition duration-300 ${selectedTab === 0 ? 'text-primary rounded bg-white border-b-2  border-primary outline-0' : 'text-black border-b-2  rounded'
                            }`}
                    >
                        Category List
                    </Tab>
                    <Tab
                        className={`p-3 cursor-pointer font-tbPop font-medium  transition ${selectedTab === 1 ? 'text-primary border-b-2  border-primary rounded bg-white outline-0' : 'text-black border-b-2  rounded'
                            }`}
                    >
                        Sub Category List
                    </Tab>
                </TabList>
                {/* ================= Store Category component ============== */}
                <TabPanel>
                    <ProductCategoriesPanel />
                </TabPanel>
                <TabPanel>
                    <SubProductCategoriesPanel />
                </TabPanel>
            </Tabs>
        </div>
    )
}



const ProductCategoriesPanel = () => {
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
    } = usePagination(1, 10, getProductCategories, emptyFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
    }, [error]);

    // ================= action of the table ===============
    const actionBodyTemplate = (row) => <div className="flex items-center gap-2">
        <ProductCategoriesModal edit={true} title='Edit Product Category' userData={row} setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />
    </div>

    const imageBodyTemp = (row) => <div className='w-52 h-24 rounded'>
        <img loading="lazy" src={row?.image} alt="image" className='w-full h-full object-cover rounded' />
    </div>

    // ================= columns of the table ===============
    const columns = [
        { field: "image", header: "Image", body: imageBodyTemp, style: true, sortable: true },
        { field: "name", header: "Name", body: (row) => (<h6 className="">{row?.name}</h6>), style: false, sortable: true },
        { field: "action", header: "Action", body: actionBodyTemplate, style: true, sortable: true },
    ];

    return (
        <>
            <div className="bg-white rounded-xl my-4 sm:my-5 shadow-sm  sm:p-7  " >
                <TableHeader title='Categories' subtitle='List of all Product Categories' component={<ProductCategoriesModal setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />} />
                <Table data={filterData} columns={columns} />

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
        </>
    )
}
const SubProductCategoriesPanel = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const emptyFilters = useMemo(() => ({
        refresh: refreshTrigger
    }), [refreshTrigger]);

    const {
        filterData,
        pageNo,
        nextIsValid,
        prevIsValid,
        pageChangeHandler,
        recordChangeHandler,
        records,
        error
    } = usePagination(1, 10, getProductSubCategories, emptyFilters);

    useEffect(() => {
        if (error) toast.error('Failed to fetch users');
    }, [error]);


    // ================= action of the table ===============
    const actionBodyTemplate = (row) => <div className="flex items-center gap-2">
        <ProductSubCategoriesModal edit={true} title='Edit Product Sub Category' userData={row} setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />
    </div>

    const imageBodyTemp = (row) => <div className='w-52 h-24 rounded'>
        <img loading="lazy" src={row?.image} alt="image" className='w-full h-full object-cover rounded' />
    </div>

    const columns = [
        { field: "image", header: "Image", body: imageBodyTemp, style: true, sortable: true },
        { field: "name", header: "Name", body: (row) => (<h6 className="">{row?.name}</h6>), style: true, sortable: true },
        {
            field: 'category', header: 'Category', style: false, sortable: true,
            body: (row) => <h6>{row?.category?.name}</h6>,
        },
        { field: "action", header: "Action", body: actionBodyTemplate, style: true, sortable: true },
    ];

    return (
        <>
            <div className="bg-white rounded-xl my-4 sm:my-5 shadow-sm  p-5 sm:p-7  " >
                <TableHeader title='Sub Categories' subtitle='List of all Sub Categories' component={<ProductSubCategoriesModal setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />} />
                <Table data={filterData} columns={columns} />
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
        </>
    )
}


export default ProductCategories

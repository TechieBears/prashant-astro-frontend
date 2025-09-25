import { useEffect, useState, useMemo } from 'react';
import Table from '../../../components/Table/Table';
import TableHeader from '../../../components/Table/TableHeader';
import ServiceCategoriesModal from '../../../components/Modals/AdminModals/ServiceCategoriesModal';
import usePagination from '../../../utils/customHooks/usePagination';
import toast from 'react-hot-toast';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import { getServiceCategories } from '../../../api';
import { useDispatch } from 'react-redux';
import { setServiceCategories } from '../../../redux/Slices/rootSlice';


const ServicesCategories = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const dispatch = useDispatch();
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

    // ================= action of the table ===============
    const actionBodyTemplate = (row) => <div className="flex items-center gap-2">
        <ServiceCategoriesModal edit={true} title='Edit Service Category' userData={row} setRefreshTrigger={setRefreshTrigger} />
    </div>

    const imageBodyTemp = (row) => <div className='w-52 h-24 rounded'>
        {console.log(row)}
        <img loading="lazy" src={row?.image} alt="image" className='w-full h-full object-cover rounded' />
    </div>

    // ================= columns of the table ===============
    const columns = [
        { field: "image", header: "Image", body: imageBodyTemp, style: true, sortable: true },
        { field: "name", header: "Name", body: (row) => (<h6 className="">{row?.name}</h6>), style: false, sortable: true },
        { field: "description", header: "Description", body: (row) => (<h6 className="">{row?.description}</h6>), style: false, sortable: true },
        { field: "action", header: "Action", body: actionBodyTemplate, style: true, sortable: true },
    ];

    useEffect(() => {
        dispatch(setServiceCategories(filterData?.map(item => ({ value: item?._id, label: item?.name }))));
    }, [refreshTrigger, filterData]);

    return (
        <>
            <div className="bg-white rounded-xl m-4 sm:m-5 shadow-sm  p-5 sm:p-7 " >
                <TableHeader title='Service Categories' subtitle='List of all Service Categories' component={<ServiceCategoriesModal setRefreshTrigger={setRefreshTrigger} refreshTrigger={refreshTrigger} />} />
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
    );
}

export default ServicesCategories;

import { useState, useEffect } from 'react';

const usePagination = (initialPage, initialRecords, fetchFunction, filters) => {
    const [state, setState] = useState({
        data: [],
        page: initialPage,
        records: initialRecords,
        total: 0,
        hasNext: false,
        hasPrev: false,
        error: null
    });

    const fetchData = async () => {
        try {
            const params = {
                p: state.page,
                records: state.records,
                ...filters
            };

            const response = await fetchFunction(params);
            const { meta } = response;
            const currentPage = meta?.page || 1;
            const totalPages = meta?.totalPages || 1;
            setState(prev => ({
                ...prev,
                data: response?.data || [],
                total: meta?.total || 0,
                hasNext: currentPage < totalPages,
                hasPrev: currentPage > 1,
                error: null
            }));
        } catch (error) {
            setState(prev => ({ ...prev, error }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [state.page, state.records, filters]);

    const handlePageChange = (newPage) => {
        if (newPage !== state.page) {
            setState(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleRecordsChange = (newRecords) => {
        setState(prev => ({
            ...prev,
            records: newRecords,
            page: 1 // Reset to first page when records per page changes
        }));
    };

    return {
        filterData: state.data,
        pageNo: state.page,
        records: state.records,
        totalRecord: state.total,
        nextIsValid: state.hasNext,
        prevIsValid: state.hasPrev,
        pageChangeHandler: handlePageChange,
        recordChangeHandler: handleRecordsChange,
        error: state.error
    };
};

export default usePagination;
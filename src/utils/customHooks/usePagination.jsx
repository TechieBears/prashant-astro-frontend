import { useState, useEffect, useMemo, useCallback } from 'react';

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

    const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

    const fetchData = useCallback(async () => {
        try {
            const params = {
                p: state.page,
                records: state.records,
                ...memoizedFilters
            };

            const response = await fetchFunction(params);
            const meta = response?.meta || response?.pagination || {};
            const currentPage = meta?.page || meta?.currentPage || state.page;
            const totalPages = meta?.totalPages || meta?.total_pages || 1;
            const total = meta?.total || meta?.totalRecords || response?.total || 0;
            const dataLength = response?.data?.length || 0;
            const hasMoreData = dataLength === state.records;
            const hasNext = currentPage < totalPages || (hasMoreData && totalPages === 1);
            setState(prev => ({
                ...prev,
                data: response?.data || [],
                total: total,
                hasNext: hasNext,
                hasPrev: currentPage > 1,
                error: null
            }));
        } catch (error) {
            setState(prev => ({ ...prev, error }));
        }
    }, [state.page, state.records, memoizedFilters, fetchFunction]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

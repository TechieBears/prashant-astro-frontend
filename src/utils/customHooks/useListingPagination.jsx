import { useState, useEffect, useRef, useCallback } from 'react';

const useListingPagination = (initialPage = 1, initialLimit = 10) => {
    const [page, setPage] = useState(initialPage);
    const [pagination, setPagination] = useState({ 
        page: initialPage, 
        limit: initialLimit, 
        total: 0, 
        totalPages: 0 
    });
    const contentRef = useRef(null);

    const resetToFirstPage = useCallback(() => {
        setPage(1);
    }, []);

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
        requestAnimationFrame(() => {
            if (contentRef.current) {
                const elementPosition = contentRef.current.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - 120;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }, []);

    return {
        page,
        setPage,
        pagination,
        setPagination,
        contentRef,
        resetToFirstPage,
        handlePageChange
    };
};

export default useListingPagination;

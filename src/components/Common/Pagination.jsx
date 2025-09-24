import React from 'react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    onPreviousPage,
    onNextPage,
    showPageNumbers = true,
    showPreviousNext = true,
    maxVisiblePages = 5,
    className = '',
    buttonClassName = '',
    activeButtonClassName = '',
    disabledButtonClassName = ''
}) => {
    // Don't render if there's only one page or no pages
    if (totalPages <= 1) {
        return null;
    }

    // Calculate which page numbers to show
    const getVisiblePages = () => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        // Adjust start if we're near the end
        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const visiblePages = getVisiblePages();

    // Default button classes
    const defaultButtonClass = `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${buttonClassName}`;
    const defaultActiveClass = `bg-orange-500 text-white ${activeButtonClassName}`;
    const defaultInactiveClass = `bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 ${buttonClassName}`;
    const defaultDisabledClass = `bg-gray-100 text-gray-400 cursor-not-allowed ${disabledButtonClassName}`;

    return (
        <div className={`flex justify-center items-center space-x-2 ${className}`}>
            {/* Previous Button */}
            {showPreviousNext && (
                <button
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                    className={`${defaultButtonClass} ${currentPage === 1 ? defaultDisabledClass : defaultInactiveClass
                        }`}
                    aria-label="Go to previous page"
                >
                    Previous
                </button>
            )}

            {/* First page and ellipsis */}
            {showPageNumbers && visiblePages[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className={`${defaultButtonClass} ${defaultInactiveClass}`}
                        aria-label="Go to page 1"
                    >
                        1
                    </button>
                    {visiblePages[0] > 2 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}
                </>
            )}

            {/* Page Numbers */}
            {showPageNumbers && visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`${defaultButtonClass} ${currentPage === page ? defaultActiveClass : defaultInactiveClass
                        }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            {/* Last page and ellipsis */}
            {showPageNumbers && visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`${defaultButtonClass} ${defaultInactiveClass}`}
                        aria-label={`Go to page ${totalPages}`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next Button */}
            {showPreviousNext && (
                <button
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                    className={`${defaultButtonClass} ${currentPage === totalPages ? defaultDisabledClass : defaultInactiveClass
                        }`}
                    aria-label="Go to next page"
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default Pagination;

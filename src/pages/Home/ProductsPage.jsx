import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import ProductCard from '../../components/Products/ProductCard';
import FilterSidebar from '../../components/Products/FilterSidebar';
import Pagination from '../../components/Common/Pagination';
import { PulseLoader } from 'react-spinners';
import { getActiveProducts, getProductFilters } from '../../api';

const ProductsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [selectedCategories, setSelectedCategories] = useState([])
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
    const [filterCategories, setFilterCategories] = useState([])
    const [filtersLoading, setFiltersLoading] = useState(true)
    const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 10000 })

    const [price, setPrice] = useState([0, 10000])
    const [debouncedPrice, setDebouncedPrice] = useState([0, 10000])
    const priceDebounceTimer = useRef(null)
    const [currentPage, setCurrentPage] = useState(1)

    // Fetch filter categories
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                setFiltersLoading(true)
                const response = await getProductFilters()
                if (response.success) {
                    const categories = response.data.category || []
                    const { minPrice = 0, maxPrice = 10000 } = response.data.priceRange || {}
                    
                    setFilterCategories(categories)
                    setPriceRange({ minPrice, maxPrice })
                    setPrice([minPrice, maxPrice])
                    setDebouncedPrice([minPrice, maxPrice])
                }
            } catch (err) {
                console.error('Error fetching filters:', err)
            } finally {
                setFiltersLoading(false)
            }
        }
        fetchFilters()
    }, [])

    const filterData = useMemo(() => ({
        categories: filterCategories
            .filter(cat => cat.productCount > 0)
            .map(cat => ({
                _id: cat._id,
                name: cat.name,
                image: cat.image,
                count: cat.productCount
            }))
    }), [filterCategories]);

    // Handle pre-selected category from navigation
    useEffect(() => {
        if (location.state?.selectedCategoryId && filterData.categories.length > 0) {
            const categoryId = location.state.selectedCategoryId;

            if (!selectedCategories.includes(categoryId)) {
                setSelectedCategories([categoryId]);
            }

            navigate(location.pathname, { replace: true });
        }
    }, [location.state, filterData.categories]);

    // Debounce price changes
    useEffect(() => {
        if (priceDebounceTimer.current) {
            clearTimeout(priceDebounceTimer.current)
        }
        
        priceDebounceTimer.current = setTimeout(() => {
            setDebouncedPrice(price)
        }, 500)
        
        return () => {
            if (priceDebounceTimer.current) {
                clearTimeout(priceDebounceTimer.current)
            }
        }
    }, [price])

    // Fetch products with filters
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                setError(null)
                
                const params = { page: currentPage, limit: 10 }
                if (search) params.search = search
                if (debouncedPrice[0] !== priceRange.minPrice || debouncedPrice[1] !== priceRange.maxPrice) {
                    params.minPrice = debouncedPrice[0]
                    params.maxPrice = debouncedPrice[1]
                }
                if (selectedCategories.length > 0) {
                    params.category = selectedCategories.join(',')
                }
                
                const response = await getActiveProducts(params)
                if (response.success) {
                    setProducts(response.data || [])
                    setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
                } else {
                    setError(response.message || 'Failed to fetch products')
                }
            } catch (err) {
                console.error('Error fetching products:', err)
                setError('Failed to fetch products. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [selectedCategories, search, debouncedPrice, currentPage])

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        )
    }



    const resetFilters = () => {
        setSearch('')
        setSelectedCategories([])
        setPrice([priceRange.minPrice, priceRange.maxPrice])
        setDebouncedPrice([priceRange.minPrice, priceRange.maxPrice])
    }

    const contentRef = useRef(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories, search, debouncedPrice]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < pagination.pages) {
            handlePageChange(currentPage + 1);
        }
    };

    return (
        <div className='bg-slate1'>
            <BackgroundTitle
                title="Products"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Products", href: null }
                ]}
                backgroundImage={bannerImage}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />

            {/* Main Content */}
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-12 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                    {/* Products Grid */}
                    <div className="lg:col-span-9 order-2 lg:order-1" ref={contentRef}>
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <PulseLoader color="#F97316" size={15} />
                            </div>
                        ) : error ? (
                            <div className="text-center py-10">
                                <p className="text-red-500 text-lg mb-4">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Results Count */}
                                {pagination.total > 0 && (
                                    <div className="mb-4 flex justify-between items-center">
                                        <p className="text-slate-600 text-sm sm:text-base">
                                            Showing <span className="font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                                            <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                                            <span className="font-semibold">{pagination.total}</span> products
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                                    {products.map((product) => (
                                        <div
                                            key={product._id || product.id}
                                            className="h-full cursor-pointer"
                                            onClick={(e) => {
                                                // Stop event propagation to prevent interference with add to cart button
                                                if (e.target.closest('button') || e.target.tagName === 'BUTTON') {
                                                    return;
                                                }
                                                navigate(`/products/${product._id}`);
                                            }}
                                        >
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>

                                {products.length === 0 && !loading && (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                                        <button
                                            onClick={resetFilters}
                                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                )}

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={pagination.pages}
                                            onPageChange={handlePageChange}
                                            onPreviousPage={handlePreviousPage}
                                            onNextPage={handleNextPage}
                                            maxVisiblePages={5}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Filter Sidebar */}
                    <aside className="lg:col-span-3 order-1 lg:order-2">
                        <div>
                            <FilterSidebar
                                search={search}
                                setSearch={setSearch}
                                categories={filterData.categories}
                                selectedCategories={selectedCategories}
                                toggleCategory={toggleCategory}
                                price={price}
                                setPrice={setPrice}
                                minPrice={priceRange.minPrice}
                                maxPrice={priceRange.maxPrice}
                                resetFilters={resetFilters}
                                isLoading={filtersLoading}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default ProductsPage

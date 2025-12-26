import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import ProductCard from '../../components/Products/ProductCard';
import FilterSidebar from '../../components/Products/FilterSidebar';
import Pagination from '../../components/Common/Pagination';
import { PulseLoader } from 'react-spinners';
import { getActiveProducts } from '../../api';

const ProductsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { productsDropdown } = useSelector(state => state.nav);
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [selectedCategories, setSelectedCategories] = useState([])
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

    const [price, setPrice] = useState([200, 6800])
    const [debouncedPrice, setDebouncedPrice] = useState([200, 6800])
    const priceDebounceTimer = useRef(null)
    const [currentPage, setCurrentPage] = useState(1)
    const PRICE_MIN = 0
    const PRICE_MAX = 10000

    // Filter categories to only show those with products and add count
    const filterData = useMemo(() => ({
        categories: (productsDropdown || [])
            .filter(cat => cat.products && cat.products.length > 0)
            .map(cat => ({
                ...cat,
                count: cat.products.length
            }))
    }), [productsDropdown]);

    // Handle pre-selected category from navigation
    useEffect(() => {
        if (location.state?.selectedCategoryId && filterData.categories.length > 0) {
            const categoryId = location.state.selectedCategoryId;

            if (!selectedCategories.includes(categoryId)) {
                setSelectedCategories([categoryId]);
            }

            window.history.replaceState({}, document.title);
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
                if (debouncedPrice[0] !== PRICE_MIN || debouncedPrice[1] !== PRICE_MAX) {
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
        setPrice([PRICE_MIN, PRICE_MAX])
        setDebouncedPrice([PRICE_MIN, PRICE_MAX])
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories, search, debouncedPrice]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < pagination.pages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    <div className="lg:col-span-9 order-2 lg:order-1">
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
                                minPrice={PRICE_MIN}
                                maxPrice={PRICE_MAX}
                                resetFilters={resetFilters}
                                isLoading={!productsDropdown}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default ProductsPage

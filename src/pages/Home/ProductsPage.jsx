import React from 'react';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import ProductCard from '../../components/Products/ProductCard';
import FilterSidebar from '../../components/Products/FilterSidebar';
// import '../../css/Products.css';

// Import product images
import img1 from '../../assets/user/products/productImages (1).png';
import img2 from '../../assets/user/products/productImages (2).png';
import img3 from '../../assets/user/products/productImages (3).png';
import img4 from '../../assets/user/products/productImages (4).png';
import img5 from '../../assets/user/products/productImages (5).png';
import img6 from '../../assets/user/products/productImages (6).png';
import img7 from '../../assets/user/products/productImages (7).png';
import img8 from '../../assets/user/products/productImages (8).png';
import img9 from '../../assets/user/products/productImages (9).png';
import img10 from '../../assets/user/products/productImages (10).png';
import img11 from '../../assets/user/products/productImages (11).png';

const ProductsPage = () => {
    // Hardcoded filter categories (label with optional count)
    const categories = [
        { key: 'amulets', label: 'Amulets', count: 3, color: 'bg-orange-500' },
        { key: 'candles', label: 'Candles', count: 3, color: 'bg-teal-500' },
        { key: 'divination', label: 'Divination', count: 2, color: 'bg-blue-500' },
        { key: 'gemstone', label: 'Gemstone', count: 6, color: 'bg-amber-500' },
        { key: 'uncategorized', label: 'Uncategorized', count: 0, color: 'bg-gray-300' },
    ]

    // Hardcoded products array
    const products = [
        {
            id: 'P4000',
            title: 'Rudraksha',
            category: 'amulets',
            price: 3520,
            oldPrice: 4090,
            rating: 4,
            image: img1,
        },
        {
            id: 'P4001',
            title: 'James stone',
            category: 'gemstone',
            price: 3520,
            oldPrice: 4090,
            rating: 4,
            image: img2,
        },
        {
            id: 'P4002',
            title: 'Exclusive James Stone',
            category: 'gemstone',
            price: 3520,
            oldPrice: 4090,
            rating: 5,
            image: img3,
        },
        {
            id: 'P4003',
            title: 'Bracelets',
            category: 'amulets',
            price: 3520,
            oldPrice: 4090,
            rating: 3,
            image: img4,
        },
        {
            id: 'P4004',
            title: 'Pendants',
            category: 'amulets',
            price: 3520,
            oldPrice: 4090,
            rating: 4,
            image: img5,
        },
        {
            id: 'P4005',
            title: 'Yantras',
            category: 'divination',
            price: 3520,
            oldPrice: 4090,
            rating: 4,
            image: img6,
        },
        {
            id: 'P4006',
            title: 'Murti',
            category: 'divination',
            price: 3520,
            oldPrice: 4090,
            rating: 4,
            image: img7,
        },
        {
            id: 'P4007',
            title: 'Siddha Product',
            category: 'candles',
            price: 3520,
            oldPrice: 4090,
            rating: 4,
            image: img8,
        },
        {
            id: 'P4008',
            title: 'Frames',
            category: 'uncategorized',
            price: 3520,
            oldPrice: 4090,
            rating: 4,
            image: img9,
        },
        {
            id: 'P4009',
            title: 'Crystal Trees',
            category: 'gemstone',
            price: 3520,
            oldPrice: 4090,
            rating: 4,
            image: img10,
        },
        {
            id: 'P4010',
            title: 'Kawach',
            category: 'amulets',
            price: 3520,
            oldPrice: 4090,
            rating: 3,
            image: img11,
        },
    ]

    const [search, setSearch] = React.useState('')
    const [selected, setSelected] = React.useState([])
    const [price, setPrice] = React.useState([200, 6800])
    const PRICE_MIN = 0
    const PRICE_MAX = 10000

    const toggleCategory = (key) => {
        setSelected((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        )
    }

    const resetFilters = () => {
        setSearch('')
        setSelected([])
        setPrice([200, 6800])
    }

    const filtered = React.useMemo(() => {
        return products.filter((p) => {
            const inCat = selected.length ? selected.includes(p.category) : true
            const inSearch = search
                ? p.title.toLowerCase().includes(search.toLowerCase())
                : true
            const inPrice = p.price >= price[0] && p.price <= price[1]
            return inCat && inSearch && inPrice
        })
    }, [products, selected, search, price])


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
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                    {/* Products Grid */}
                    <div className="lg:col-span-9 order-2 lg:order-1">
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                            {filtered.map((product) => (
                                <div key={product.id} className="h-full">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        {filtered.length === 0 && (
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
                    </div>

                    {/* Filter Sidebar */}
                    <aside className="lg:col-span-3 order-1 lg:order-2">
                        <FilterSidebar
                            search={search}
                            onSearchChange={setSearch}
                            priceRange={price}
                            onPriceChange={setPrice}
                            categories={categories}
                            selectedCategories={selected}
                            onToggleCategory={toggleCategory}
                            onResetFilters={resetFilters}
                            minPrice={PRICE_MIN}
                            maxPrice={PRICE_MAX}
                        />
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default ProductsPage

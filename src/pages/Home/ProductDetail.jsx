import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart, FaRegHeart, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import LoadBox from '../../components/Loader/LoadBox';
import { getActiveProduct } from '../../api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const carouselRef = useRef(null);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            console.log('Fetching product with ID:', id);
            if (!id) {
                console.error('No product ID provided');
                setError('No product ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                console.log('Calling getActiveProduct with ID:', id);
                const response = await getActiveProduct(id);
                console.log('API Response:', response);

                if (response && response.success) {
                    if (response.data) {
                        console.log('Product data received:', response.data);
                        setProduct(response.data);
                        setRelatedProducts(response.data.relatedProducts || []);
                    } else {
                        console.error('No product data in response');
                        setError('Product not found or no data available');
                    }
                } else {
                    const errorMsg = response?.message || 'Failed to load product';
                    console.error('API Error:', errorMsg);
                    setError(errorMsg);
                }
            } catch (err) {
                console.error('Error in fetchProduct:', err);
                setError(err.message || 'Failed to load product. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        {error || 'The product you are looking for does not exist or may have been removed.'}
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const handleQuantityChange = (increment) => {
        const newQuantity = increment ? quantity + 1 : Math.max(1, quantity - 1);
        setQuantity(newQuantity);
    };

    const navigateToImage = (direction) => {
        if (direction === 'next') {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
            );
        } else {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
            );
        }
    };

    const addToCart = () => {
        // Add to cart logic here
        console.log(`Added ${quantity} ${product.title} to cart`);
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            // Get current screen width to determine scroll amount
            const screenWidth = window.innerWidth;
            let scrollAmount;

            if (screenWidth < 640) { // Mobile: 2 cards per view
                scrollAmount = carouselRef.current.offsetWidth; // Scroll by full container width
            } else if (screenWidth < 768) { // Small screens
                scrollAmount = 224 + 12; // Card width + spacing
            } else if (screenWidth < 1024) { // Medium screens
                scrollAmount = 256 + 16; // Card width + spacing
            } else { // Large screens
                scrollAmount = 288 + 16; // Card width + spacing
            }

            if (direction === 'left') {
                carouselRef.current.scrollLeft -= scrollAmount;
            } else {
                carouselRef.current.scrollLeft += scrollAmount;
            }
        }
    };

    const handleAddToCart = (productId) => {
        console.log(`Added product ${productId} to cart`);
        // Add to cart logic here
    };

    const renderProductInfo = () => {
        if (!product) return null;

        return (
            <div className="lg:w-1/2 mt-6 lg:mt-0 px-0 md:px-4">
                {/* Title & Subtitle */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {product.name}
                        </h1>
                        {product.category && (
                            <p className="text-gray-600 font-medium text-sm">
                                {product.category.name}
                                {product.subcategory && ` > ${product.subcategory.name}`}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className="text-2xl font-bold text-gray-900">
                            ₹{product.sellingPrice?.toLocaleString() || '0.00'}
                        </span>
                        {product.mrpPrice > product.sellingPrice && (
                            <>
                                <span className="text-lg text-gray-500 line-through ml-2">
                                    ₹{product.mrpPrice?.toLocaleString()}
                                </span>
                                <span className="text-sm font-medium text-green-600 ml-2">
                                    {product.discountPercentage}% OFF
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Stock Status */}
                <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>

                {/* Product Description */}
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                        Product Highlights:
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {product.description || 'No description available.'}
                    </p>
                </div>
                {/* Quantity Selector */}
                <div className="mt-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Quantity:</label>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                -
                            </button>
                            <span className="w-12 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(prev => prev + 1)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                disabled={quantity >= (product.stock || 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
                {/* Add to Cart Button */}
                <div className="mt-6">
                    <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={!product.stock}
                        className={`w-full py-3 px-6 rounded-md font-medium text-white transition-colors ${product.stock
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {product.stock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>

                {/* Additional Information */}
                {product.additionalInfo && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                            Specifications:
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {product.additionalInfo}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate1">
            <BackgroundTitle
                title={product.name}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Shop", href: "/products" },
                    { label: product.name, href: null }
                ]}
                backgroundImage={bannerImage}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />
            <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8">

                {/* Product Section */}
                <div className="lg:flex gap-6">
                    {/* Left - Thumbnails */}
                    <div className="hidden lg:flex flex-col space-y-4 w-24">
                        {product.images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-full aspect-square rounded-md overflow-hidden border-2 ${currentImageIndex === index
                                    ? 'border-orange-500'
                                    : 'border-transparent hover:border-gray-200'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`${product.title} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Right - Main Image */}
                    <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
                            <img
                                src={product.images && product.images[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Available';
                                }}
                            />
                        </div>

                        {/* Mobile Thumbnails */}
                        <div className="lg:hidden flex space-x-2 mt-4 overflow-x-auto pb-2">
                            {product.images && product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`flex-shrink-0 w-16 h-16 rounded border ${currentImageIndex === index
                                        ? 'border-orange-500'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/100x100?text=Image';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right - Product Info and Add to Cart */}
                    <div className="lg:w-1/2 mt-6 lg:mt-0 px-0 md:px-4">
                        {renderProductInfo()}
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12 w-full">
                    <div className="max-w-3xl border-b border-gray-200">
                        <nav className="flex">
                            {/* Active Tab */}
                            <button className="relative py-3 px-1 font-medium text-gray-900 flex-1 text-center text-sm sm:text-base">
                                Description
                                <span className="absolute left-0 bottom-[1px] h-[2px] w-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"></span>
                            </button>

                            {/* Inactive Tabs */}
                            <button className="py-3 px-1 font-medium text-gray-500 hover:text-gray-700 flex-1 text-center text-sm sm:text-base">
                                <span className="hidden sm:inline">Additional Information</span>
                                <span className="sm:hidden">Info</span>
                            </button>
                            <button className="py-3 px-1 font-medium text-gray-500 hover:text-gray-700 flex-1 text-center text-sm sm:text-base">
                                Reviews (24)
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="py-6 w-full">
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Rudraksha is a sacred seed revered in Vedic traditions, known for its spiritual and
                            healing properties. Worn by sages and seekers for centuries, it is believed to bring
                            peace, clarity, and protection. This authentic Rudraksha bead is carefully sourced,
                            retaining its natural texture and energy. Perfect for meditation, prayer, or as a
                            spiritual accessory, it embodies divine vibrations and holistic well-being.
                        </p>
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="mt-12 md:mt-16">
                    <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-6 md:mb-8">Related Products</h2>

                    <div className="relative">
                        {/* Navigation Arrows - All Screens */}
                        <button
                            onClick={() => scrollCarousel('left')}
                            className="absolute -left-4 sm:-left-8 md:-left-12 lg:-left-16 top-[40%] sm:top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                        >
                            <IoIosArrowBack className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </button>

                        <button
                            onClick={() => scrollCarousel('right')}
                            className="absolute -right-4 sm:-right-8 md:-right-12 lg:-right-16 top-[40%] sm:top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                        >
                            <IoIosArrowForward className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </button>

                        {/* Products Carousel */}
                        <div
                            ref={carouselRef}
                            className="flex space-x-3 md:space-x-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                scrollSnapType: 'x mandatory'
                            }}
                        >
                            {relatedProducts && relatedProducts.length > 0 ? (
                                relatedProducts.map((relatedProduct) => (
                                    <div
                                        key={relatedProduct._id}
                                        className="flex flex-col flex-shrink-0 w-[calc(50%-6px)] sm:w-56 md:w-64 lg:w-72 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 snap-start"
                                    >
                                        {/* Product Image */}
                                        <div className="relative">
                                            {relatedProduct.images && relatedProduct.images[0] ? (
                                                <img
                                                    src={relatedProduct.images[0]}
                                                    alt={relatedProduct.name}
                                                    className="w-full aspect-square object-cover rounded-t-lg"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-t-lg">
                                                    <span className="text-gray-400 text-sm">No Image</span>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setIsWishlisted(!isWishlisted)}
                                                className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                                            >
                                                {isWishlisted ? (
                                                    <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                                                ) : (
                                                    <FaRegHeart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex flex-col flex-1 p-3 sm:p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-xs sm:text-sm md:text-base">
                                                {relatedProduct.name}
                                            </h3>

                                            {/* Price */}
                                            <div className="mt-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    ₹{relatedProduct.sellingPrice?.toLocaleString() || '0.00'}
                                                </p>
                                                {relatedProduct.mrpPrice > relatedProduct.sellingPrice && (
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs text-gray-500 line-through">
                                                            ₹{relatedProduct.mrpPrice?.toLocaleString()}
                                                        </p>
                                                        <span className="text-xs text-green-600">
                                                            {relatedProduct.discountPercentage}% OFF
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={() => handleAddToCart(relatedProduct._id)}
                                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-md font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base mt-3"
                                                disabled={relatedProduct.stock <= 0}
                                            >
                                                {relatedProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-gray-500">No related products found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

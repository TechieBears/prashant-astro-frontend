import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart, FaRegHeart, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
import RelatedProducts from '../../components/Products/RelatedProducts';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import LoadBox from '../../components/Loader/LoadBox';
import { getActiveProduct } from '../../api';
import AddToCartButton from '../../components/Products/AddToCartButton';

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
    const [activeTab, setActiveTab] = useState('description');

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

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };



    const renderProductInfo = () => {
        if (!product) return null;

        return (
            <div className="w-full">
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
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500">
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
                <div className="mt-6 flex items-center gap-4">
                    {/* Quantity Selector */}
                    <div>
                        <input
                            type="number"
                            min="1"
                            max={product.stock || 1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-16 px-2 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* Buy Now Button */}
                    <button
                        onClick={() => handleBuyNow(product._id)}
                        disabled={!product.stock}
                        className={`px-6 py-2 rounded-[0.2rem] font-medium text-white transition-all ${product.stock
                            ? 'bg-button-diagonal-gradient-orange hover:opacity-90 hover:shadow-lg'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Buy Now
                    </button>

                    {/* Add to Cart Button */}
                    <AddToCartButton
                        productId={product._id}
                        quantity={quantity}
                        stock={product.stock}
                        size="default"
                        variant="default"
                    />
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
                    <div className="flex-1 mt-6 lg:mt-0 px-0 md:px-4">
                        {renderProductInfo()}
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12 w-full">
                    <div className="max-w-3xl border-b border-gray-200">
                        <nav className="flex">
                            {/* Description Tab */}
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`relative py-3 px-1 font-medium flex-1 text-center text-sm sm:text-base transition-colors ${activeTab === 'description'
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Description
                                {activeTab === 'description' && (
                                    <span className="absolute left-0 bottom-[1px] h-[2px] w-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"></span>
                                )}
                            </button>

                            {/* Additional Information Tab */}
                            <button
                                onClick={() => setActiveTab('additional')}
                                className={`relative py-3 px-1 font-medium flex-1 text-center text-sm sm:text-base transition-colors ${activeTab === 'additional'
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="hidden sm:inline">Additional Information</span>
                                <span className="sm:hidden">Info</span>
                                {activeTab === 'additional' && (
                                    <span className="absolute left-0 bottom-[1px] h-[2px] w-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"></span>
                                )}
                            </button>

                            {/* Reviews Tab */}
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`relative py-3 px-1 font-medium flex-1 text-center text-sm sm:text-base transition-colors ${activeTab === 'reviews'
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Reviews (24)
                                {activeTab === 'reviews' && (
                                    <span className="absolute left-0 bottom-[1px] h-[2px] w-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"></span>
                                )}
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="py-6 w-full">
                        {activeTab === 'description' && (
                            <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                {product?.description ? (
                                    <p>{product.description}</p>
                                ) : (
                                    <p>No description available for this product.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'additional' && (
                            <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                {product?.additionalInfo ? (
                                    <div>
                                        {typeof product.additionalInfo === 'string' ? (
                                            <p>{product.additionalInfo}</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {Object.entries(product.additionalInfo).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                                                        <span className="font-medium text-gray-700 capitalize">
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                        </span>
                                                        <span className="text-gray-600">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p>No additional information available for this product.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                <p>Reviews will be available soon.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                <RelatedProducts
                    products={relatedProducts}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={() => setIsWishlisted(!isWishlisted)}
                />
            </div>
        </div>
    );
};

export default ProductDetail;

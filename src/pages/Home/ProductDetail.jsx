import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaRegStar, FaShoppingCart, FaRegHeart, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
import RelatedProducts from '../../components/Products/RelatedProducts';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';
import LoadBox from '../../components/Loader/LoadBox';
import Preloaders from '../../components/Loader/Preloaders';
import { getActiveProduct, getFilteredTestimonials } from '../../api';
import AddToCartButton from '../../components/Products/AddToCartButton';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';
import ProductImage from '../../components/Common/ProductImage';
import UserReviews from '../../components/Common/UserReviews';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fetchCartData } = useCart();

    // Redux state
    const { productItems: cartItems } = useSelector(state => state.cart);
    const { isLogged, loggedUserDetails } = useSelector(state => state.user);
    const userId = loggedUserDetails?._id;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [isProductInCart, setIsProductInCart] = useState(false);
    const [cartItemId, setCartItemId] = useState(null);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [totalReviews, setTotalReviews] = useState(0);
    const [editingReviewId, setEditingReviewId] = useState(null);

    // Simple quantity update handler
    const updateQuantity = useCallback((newQuantity) => {
        setQuantity(newQuantity);
    }, []);

    // Quantity change handlers
    const handleQuantityChange = useCallback((increment) => {
        const newQuantity = increment ? quantity + 1 : Math.max(1, quantity - 1);
        updateQuantity(newQuantity);
    }, [quantity, updateQuantity]);

    const handleQuantityInputChange = useCallback((value) => {
        const newQuantity = Math.max(1, Math.min(product?.stock || 1, Number(value) || 1));
        updateQuantity(newQuantity);
    }, [product?.stock, updateQuantity]);

    // Check if product is in cart and set initial quantity
    const checkProductInCart = useCallback(() => {
        if (!product || !cartItems.length) return;

        const cartItem = cartItems.find(item =>
            item.productId === product._id ||
            item.product?._id === product._id ||
            item._id === product._id
        );

        if (cartItem) {
            console.log('Product found in cart with quantity:', cartItem.quantity);
            setIsProductInCart(true);
            setCartItemId(cartItem._id);
            setQuantity(cartItem.quantity);
        } else {
            console.log('Product not in cart, using default quantity');
            setIsProductInCart(false);
            setCartItemId(null);
            setQuantity(1);
        }
    }, [product, cartItems]);

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

    // Fetch cart data on component mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                await fetchCartData();
            } catch (error) {
                console.error('Failed to fetch cart data:', error);
            }
        };

        loadCart();
    }, [fetchCartData]);

    // Check if product is in cart when product or cart data changes
    useEffect(() => {
        checkProductInCart();
    }, [checkProductInCart]);

    // Fetch reviews for the product
    const fetchProductReviews = useCallback(async () => {
        if (!id) return;
        try {
            setLoadingReviews(true);
            const response = await getFilteredTestimonials({
                productId: id
            });
            if (response.success) {
                setReviews(response.data || []);
                setTotalReviews(response.data?.length || 0);
            }
        } catch (err) {
            console.error('Error fetching product reviews:', err);
        } finally {
            setLoadingReviews(false);
        }
    }, [id]);

    // Fetch reviews when product is loaded
    useEffect(() => {
        if (product) {
            fetchProductReviews();
        }
    }, [product, fetchProductReviews]);

    if (loading) {
        return <Preloaders />;
    }

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

    const handleBuyNow = (productId) => {
        if (!isLogged) {
            toast.error('Please login to continue with your purchase');
            return;
        }
        navigate('/buy-now', {
            state: {
                product: product,
                quantity: quantity
            }
        });
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

                {/* Product Description */}
                <div className="mt-6 flex items-center gap-4">
                    {/* Quantity Selector */}
                    {/* <div>
                        <input
                            type="number"
                            min="1"
                            max={product.stock || 1}
                            value={quantity}
                            onChange={(e) => handleQuantityInputChange(e.target.value)}
                            onBlur={(e) => {
                                const value = Number(e.target.value);
                                if (!value || value < 1) {
                                    handleQuantityInputChange(1);
                                }
                            }}
                            className="w-16 px-2 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div> */}

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
                        isInCart={isProductInCart}
                        cartItemId={cartItemId}
                    />
                </div>
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
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-12 md:py-14">

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
                        <ProductImage
                            images={product.images}
                            name={product.name}
                            imageIndex={currentImageIndex}
                            containerClassName="bg-gray-50 rounded-lg h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden"
                            imgClassName="w-full h-full object-cover rounded-lg"
                            fallbackClassName="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg"
                            fallbackContent={
                                <div className="text-center text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-gray-400">No Image Available</p>
                                </div>
                            }
                        />

                        {/* Mobile Thumbnails */}
                        <div className="lg:hidden flex space-x-2 mt-4 overflow-x-auto pb-2">
                            {product.images && product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className="flex-shrink-0"
                                >
                                    <ProductImage
                                        images={product.images}
                                        name={product.name}
                                        imageIndex={index}
                                        containerClassName={`w-16 h-16 rounded border ${currentImageIndex === index ? 'border-orange-500' : 'border-gray-200'}`}
                                        imgClassName="w-full h-full object-cover"
                                        fallbackClassName="w-full h-full bg-gray-200 flex items-center justify-center"
                                        fallbackContent={
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        }
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
                                Reviews ({totalReviews})
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
                            <UserReviews
                                reviews={reviews}
                                loadingReviews={loadingReviews}
                                onReviewUpdate={fetchProductReviews}
                                editingReviewId={editingReviewId}
                                setEditingReviewId={setEditingReviewId}
                                variant="detailed"
                                currentUserId={userId}
                                showEmptyState={true}
                                showWriteReview={true}
                                productId={id}
                                serviceId={null}
                                isLogged={isLogged}
                                onLoginClick={() => navigate('/login')}
                            />
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

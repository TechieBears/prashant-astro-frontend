import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart, FaRegHeart, FaHeart, FaMinus, FaPlus, FaCircle } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { BsArrowLeft } from 'react-icons/bs';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import bannerImage from '../../assets/user/home/pages_banner.jpg';

// Import product images (you can replace these with actual product images)
import product1 from '../../assets/user/products/productImages (1).png';
import product2 from '../../assets/user/products/productImages (2).png';
import product3 from '../../assets/user/products/productImages (3).png';
import product4 from '../../assets/user/products/productImages (4).png';
import product5 from '../../assets/user/products/productImages (5).png';
import product6 from '../../assets/user/products/productImages (6).png';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('bg-blue-600');
    const carouselRef = useRef(null);

    // Mock product data - replace with actual data from API
    const product = {
        id: id || 'P4000',
        title: 'Rudraksha',
        price: 3520,
        oldPrice: 4090,
        rating: 4,
        description: 'Rudraksha is a seed used as a prayer bead in Hinduism. The seed is produced by several species of large evergreen broad-leaved tree in the genus Elaeocarpus. The seeds are known as rudraksha, or rudraksh, Sanskrit: rudrākṣa. Rudraksha may be produced by several species of Elaeocarpus, however E. ganitrus is the principal species used in the making of a bead chain or mala.',
        images: [product1, product2, product3],
        category: 'Amulets',
        inStock: true,
        sku: 'P4000',
        tags: ['Spiritual', 'Healing', 'Meditation']
    };

    // Related products data
    const relatedProducts = [
        {
            id: 'P4001',
            title: 'Rudraksha',
            price: 3520,
            oldPrice: 4000,
            rating: 5,
            image: product1,
            inStock: true
        },
        {
            id: 'P4002',
            title: 'James stone',
            price: 3520,
            oldPrice: 4000,
            rating: 5,
            image: product2,
            inStock: true
        },
        {
            id: 'P4003',
            title: 'Exclusive James Stone',
            price: 3520,
            oldPrice: 4000,
            rating: 5,
            image: product3,
            inStock: true
        },
        {
            id: 'P4004',
            title: 'Bracelets',
            price: 3520,
            oldPrice: 4000,
            rating: 5,
            image: product4,
            inStock: true
        },
        {
            id: 'P4005',
            title: 'Sacred Gemstone',
            price: 3520,
            oldPrice: 4000,
            rating: 5,
            image: product5,
            inStock: true
        },
        {
            id: 'P4006',
            title: 'Spiritual Pendant',
            price: 3520,
            oldPrice: 4000,
            rating: 5,
            image: product6,
            inStock: true
        }
    ];

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
            const scrollAmount = 304; // Card width (288px) + spacing (16px)
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

    return (
        <div className="min-h-screen bg-slate1">
            <BackgroundTitle
                title={product.title}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Shop", href: "/products" },
                    { label: product.title, href: null }
                ]}
                backgroundImage={bannerImage}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />
            <div className="container mx-auto px-8 max-w-7xl py-8">

                {/* Product Section */}
                <div className="md:flex gap-6">
                    {/* Left - Thumbnails */}
                    <div className="hidden md:flex flex-col space-y-4 w-24">
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
                        <div className="bg-gray-50 rounded-lg h-[500px] overflow-hidden">
                            <img
                                src={product.images[currentImageIndex]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Mobile Thumbnails */}
                        <div className="md:hidden flex space-x-2 mt-4 overflow-x-auto pb-2">
                            {product.images.map((img, index) => (
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
                                        alt={`${product.title} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right - Product Info */}
                    <div className="md:w-1/2 mt-6 md:mt-0 px-4">
                        {/* Title & Subtitle */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Sacred Rudraksha Bead
                                </h1>
                                <p className="text-gray-600 font-medium text-sm">
                                    (Symbol of Spiritual Energy)
                                </p>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-orange bg-clip-text text-transparent">
                                ₹3520
                            </span>
                        </div>

                        {/* Product Highlights */}
                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                                Product Highlights:
                            </h3>
                            <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                                <li>Authentic natural Rudraksha bead</li>
                                <li>Rooted in Vedic traditions &amp; Indian culture</li>
                                <li>Symbol of divine energy, meditation &amp; healing</li>
                                <li>Hand-selected and lab-certified for authenticity</li>
                                <li>Ideal for spiritual practices, yoga, and daily wear</li>
                            </ul>
                        </div>

                        {/* Quantity + Buttons */}
                        <div className="mt-6 flex items-center space-x-4">
                            {/* Quantity input */}
                            <input
                                type="number"
                                min="1"
                                defaultValue="1"
                                className="w-16 border rounded-md px-3 py-2 text-center text-gray-900 font-medium focus:ring-2 focus:ring-orange-400 focus:outline-none"
                            />

                            {/* Buy Now button */}
                            <button className="bg-button-diagonal-gradient-orange text-white px-6 py-2 rounded-md font-medium shadow hover:opacity-90 transition">
                                Buy Now
                            </button>

                            {/* Add to Cart button */}
                            <button className="border border-orange-400 text-transparent bg-clip-text bg-gradient-orange px-6 py-2 rounded-md font-medium hover:bg-orange-50 transition">
                                Add to Cart
                            </button>
                        </div>


                        {/* Specifications */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Specifications:
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium text-base-font">Type:</span> Natural Rudraksha Bead</p>
                                <p><span className="font-medium text-base-font">Origin:</span> India &amp; Nepal (sacred regions)</p>
                                <p><span className="font-medium text-base-font">Size:</span> 10–20 mm (approx.)</p>
                                <p><span className="font-medium text-base-font">Certification:</span> Authenticity lab-certified</p>
                                <p><span className="font-medium text-base-font">Material:</span> 100% Natural Seed</p>
                                <p><span className="font-medium text-base-font">Use:</span> Meditation, Healing, Daily Wear, Spiritual Practices</p>
                                <p><span className="font-medium text-base-font">Weight:</span> 250 grams</p>
                                <p><span className="font-medium text-base-font">Color:</span> Brown to Dark Brown</p>
                                <p><span className="font-medium text-base-font">Shape:</span> Round, slightly irregular</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Tabs Section */}
                <div className="mt-12 w-full">
                    <div className="max-w-3xl border-b border-gray-200">
                        <nav className="flex justify-between">
                            {/* Active Tab */}
                            <button className="relative py-3 px-1 font-medium text-gray-900 flex-1 text-center">
                                Description
                                <span className="absolute left-0 bottom-[1px] h-[2px] w-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"></span>
                            </button>

                            {/* Inactive Tabs */}
                            <button className="py-3 px-1 font-medium text-gray-500 hover:text-gray-700 flex-1 text-center">
                                Additional Information
                            </button>
                            <button className="py-3 px-1 font-medium text-gray-500 hover:text-gray-700 flex-1 text-center">
                                Reviews (24)
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="py-6 w-full">
                        <p className="text-gray-600 leading-relaxed">
                            Rudraksha is a sacred seed revered in Vedic traditions, known for its spiritual and
                            healing properties. Worn by sages and seekers for centuries, it is believed to bring
                            peace, clarity, and protection. This authentic Rudraksha bead is carefully sourced,
                            retaining its natural texture and energy. Perfect for meditation, prayer, or as a
                            spiritual accessory, it embodies divine vibrations and holistic well-being.
                        </p>
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-orange-600 mb-8">Related Products</h2>

                    <div className="relative">
                        {/* Navigation Arrows */}
                        <button
                            onClick={() => scrollCarousel('left')}
                            className="absolute -left-16 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                        >
                            <IoIosArrowBack className="w-5 h-5 text-gray-600" />
                        </button>

                        <button
                            onClick={() => scrollCarousel('right')}
                            className="absolute -right-16 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                        >
                            <IoIosArrowForward className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Products Carousel */}
                        <div
                            ref={carouselRef}
                            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {relatedProducts.map((relatedProduct) => (
                                <div
                                    key={relatedProduct.id}
                                    className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    {/* Product Image */}
                                    <div className="relative">
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.title}
                                            className="w-full aspect-square object-cover rounded-t-lg"
                                        />
                                        <button
                                            onClick={() => setIsWishlisted(!isWishlisted)}
                                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                                        >
                                            {isWishlisted ? (
                                                <FaHeart className="w-4 h-4 text-red-500" />
                                            ) : (
                                                <FaRegHeart className="w-4 h-4 text-gray-600" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {relatedProduct.title}
                                        </h3>

                                        {/* Star Rating */}
                                        <div className="flex items-center mb-3">
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar
                                                    key={index}
                                                    className={`w-4 h-4 ${index < relatedProduct.rating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Pricing */}
                                        <div className="mb-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ₹{relatedProduct.price.toLocaleString()}
                                                </span>
                                                <span className="text-sm text-gray-500 line-through">
                                                    ₹{relatedProduct.oldPrice.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={() => handleAddToCart(relatedProduct.id)}
                                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-md font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ProductDetail;

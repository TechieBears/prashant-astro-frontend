import React, { useRef } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';

const RelatedProducts = ({
    products = []
}) => {
    const carouselRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const { scrollLeft, clientWidth } = carouselRef.current;
            const scrollAmount = clientWidth * 0.8;

            carouselRef.current.scrollTo({
                left: direction === 'left'
                    ? scrollLeft - scrollAmount
                    : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const navigate = useNavigate();

    if (!products.length) return null;

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div className="mt-12 md:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-6 md:mb-8">
                Related Products
            </h2>

            <div className="relative">
                <button
                    onClick={() => scrollCarousel('left')}
                    className="absolute -left-4 sm:-left-8 md:-left-12 lg:-left-16 top-[40%] sm:top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                    aria-label="Scroll left"
                >
                    <IoIosArrowBack className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <div
                    ref={carouselRef}
                    className="flex space-x-3 md:space-x-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        scrollSnapType: 'x mandatory'
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => handleProductClick(product._id)}
                            className="flex flex-col flex-shrink-0 w-[calc(50%-6px)] sm:w-56 md:w-64 lg:w-72 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 snap-start cursor-pointer"
                        >
                            <div className="relative">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
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
                            </div>

                            <div className="flex flex-col flex-1 p-3 sm:p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-xs sm:text-sm md:text-base">
                                    {product.name}
                                </h3>

                                <div className="mt-2">
                                    <p className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500">
                                        ₹{product.sellingPrice?.toLocaleString() || '0.00'}
                                    </p>
                                    {product.mrpPrice > product.sellingPrice && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-gray-500 line-through">
                                                ₹{product.mrpPrice?.toLocaleString()}
                                            </p>
                                            <span className="text-xs text-green-600">
                                                {product.discountPercentage}% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
                                    <AddToCartButton
                                        productId={product._id}
                                        stock={product.stock > 0}
                                        className="w-full mt-3"
                                        size="small"
                                        variant="gradient"
                                        redirectToCart={false}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scrollCarousel('right')}
                    className="absolute -right-4 sm:-right-8 md:-right-12 lg:-right-16 top-[40%] sm:top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                    aria-label="Scroll right"
                >
                    <IoIosArrowForward className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default RelatedProducts;

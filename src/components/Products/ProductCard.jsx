import React from 'react';
import AddToCartButton from './AddToCartButton';
import BuyNowButton from './BuyNowButton';

const Star = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-4 h-4 ${filled ? 'text-amber-400' : 'text-gray-300'}`}
    fill="currentColor"
  >
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.4 8.164L12 18.896l-7.334 3.864 1.4-8.164L.132 9.21l8.2-1.192L12 .587z" />
  </svg>
);

const ProductImage = ({ src, alt, isVisible, onError, onLoad }) => (
  <img
    src={src}
    alt={alt}
    className={`absolute top-0 left-0 w-full rounded-2xl h-full object-cover p-1 sm:p-2 transition-opacity duration-700 ease-in-out ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
    loading="lazy"
    onError={onError}
    onLoad={onLoad}
  />
);

const ProductCard = ({ product }) => {
  const {
    _id,
    id,
    name: title,
    sellingPrice: price,
    mrpPrice: oldPrice,
    rating = 4,
    images = [],
    category,
    subcategory,
    stock = true
  } = product;

  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageError = (e) => {
    e.target.onerror = null;
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className="h-full flex flex-col bg-white rounded-lg p-1 shadow-sm transition-shadow duration-200 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pt-[100%] ">
        {images?.length > 0 && !imageError ? (
          <>
            <ProductImage
              src={images[0]}
              alt={title}
              isVisible={!(isHovered && images.length > 1)}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {images[1] && (
              <ProductImage
                src={images[1]}
                alt={title}
                isVisible={isHovered}
                onError={handleImageError}
              />
            )}
          </>
        ) : (
          <div className="absolute top-0 left-0 w-full rounded-2xl h-full bg-gray-200 flex items-center justify-center p-1 sm:p-2">
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-gray-400">No Image</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-3 gap-2 sm:gap-0">
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-1 sm:mb-2">
              {title}
            </h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} filled={i <= rating} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 sm:flex-col sm:items-end sm:gap-0 ml-2">
            {oldPrice > price && (
              <div className="text-xs text-gray-500 line-through">
                ₹{oldPrice.toLocaleString()}
              </div>
            )}
            <div className="text-sm sm:text-base font-semibold text-gray-900">
              ₹{price.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex gap-2">
            <BuyNowButton
              productId={_id || id}
              product={product}
              quantity={1}
              stock={stock}
              className="flex-1"
              size="small"
              variant="gradient"
            />
            <AddToCartButton
              productId={_id || id}
              stock={stock}
              className="w-8 h-8 p-0 min-w-0"
              size="small"
              variant="gradient"
              redirectToCart={false}
              iconOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);

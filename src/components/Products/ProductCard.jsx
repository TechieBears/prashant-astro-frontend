import React from 'react';
import AddToCartButton from './AddToCartButton';

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

  // Use first image if available, otherwise use a placeholder
  const image = images && images.length > 0 ? images[0] : '/placeholder-product.png';

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg p-1 shadow-sm transition-shadow duration-200 overflow-hidden">
      <div className="relative pt-[100%] ">
        <img
          src={image}
          alt={title}
          className="absolute top-0 left-0 w-full rounded-2xl h-full object-cover p-1 sm:p-2"
          loading="lazy"
          onError={handleImageError}
        />
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
          <AddToCartButton
            productId={_id || id}
            stock={stock}
            className="w-full mt-3"
            size="small"
            variant="gradient"
            redirectToCart={false}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);

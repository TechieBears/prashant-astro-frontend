import React from 'react';

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
  const { id, title, price, oldPrice, rating, image } = product;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
      <div className="relative pt-[100%] bg-gray-50">
        <img 
          src={image} 
          alt={title} 
          className="absolute top-0 left-0 w-full h-full object-cover p-2" 
          loading="lazy"
        />
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-1 sm:mb-2">
          {title}
        </h3>
        
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} filled={i <= rating} />
          ))}
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="text-sm sm:text-base font-semibold text-gray-900">
              ₹{price.toLocaleString()}
            </div>
            {oldPrice > price && (
              <div className="text-xs text-gray-500 line-through">
                ₹{oldPrice.toLocaleString()}
              </div>
            )}
          </div>
          
          <button 
            className="w-full py-2 px-2 sm:px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm sm:text-base font-medium rounded-md hover:opacity-90 transition-opacity"
            onClick={() => {}}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);

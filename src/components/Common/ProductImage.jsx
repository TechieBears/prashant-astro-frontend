import React, { useState } from 'react';

/**
 * Reusable ProductImage component with error handling and fallback
 * Fully customizable to preserve existing UI designs
 * 
 * @param {Object} props
 * @param {string|array} props.images - Image URL or array of URLs
 * @param {string} props.name - Product name for alt text
 * @param {string} props.containerClassName - Full control over container classes (overrides all defaults)
 * @param {string} props.imgClassName - Full control over img element classes
 * @param {string} props.fallbackClassName - Full control over fallback div classes
 * @param {React.ReactNode} props.fallbackContent - Custom fallback content (icon, text, etc.)
 * @param {number} props.imageIndex - Which image to show from array (default: 0)
 */
const ProductImage = ({
    images,
    name,
    containerClassName = 'w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg overflow-hidden flex-shrink-0',
    imgClassName = 'w-full h-full object-cover',
    fallbackClassName = 'w-full h-full flex items-center justify-center bg-gray-100',
    fallbackContent = <span className="text-gray-400 text-xs">No Image</span>,
    imageIndex = 0
}) => {
    const [imageError, setImageError] = useState(false);

    // Extract image URL from various formats
    let imageUrl = null;
    if (Array.isArray(images) && images.length > imageIndex) {
        imageUrl = images[imageIndex];
    } else if (typeof images === 'string') {
        imageUrl = images;
    }

    const hasValidImage = imageUrl && !imageError;

    return (
        <div className={containerClassName}>
            {hasValidImage ? (
                <img
                    src={imageUrl}
                    alt={name || 'Product'}
                    className={imgClassName}
                    onError={() => setImageError(true)}
                    loading="lazy"
                />
            ) : (
                <div className={fallbackClassName}>
                    {fallbackContent}
                </div>
            )}
        </div>
    );
};

export default ProductImage;


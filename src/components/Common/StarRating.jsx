import React from 'react';
import { Star1 } from 'iconsax-reactjs';

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex gap-1">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
                    disabled={readOnly}
                    className={`transition-colors ${!readOnly ? 'cursor-pointer' : 'cursor-default'}`}
                >
                    <Star1
                        size={28}
                        variant={star <= rating ? 'Bold' : 'Outline'}
                        className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRating;


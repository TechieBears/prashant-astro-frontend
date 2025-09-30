import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { createTestimonial } from '../../api';
import toast from 'react-hot-toast';

const ReviewForm = ({
    isOpen,
    onClose,
    onSubmitSuccess,
    serviceId = null,
    productId = null
}) => {
    const loggedUserDetails = useSelector(state => state.user.loggedUserDetails);
    const userId = loggedUserDetails?._id;
    const [reviewForm, setReviewForm] = useState({ message: '', rating: 0 });
    const [submittingReview, setSubmittingReview] = useState(false);

    const resetForm = () => setReviewForm({ message: '', rating: 0 });

    const showToast = (type, message, options = {}) => {
        const defaultOptions = { position: 'top-right' };
        toast[type](message, { ...defaultOptions, ...options });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.message.trim() || reviewForm.rating === 0) {
            showToast('error', 'Please provide both a rating and review message', { duration: 3000 });
            return;
        }

        if (!userId) {
            showToast('error', 'User not authenticated. Please login again.', { duration: 3000 });
            return;
        }

        const loadingToast = toast.loading('Submitting your review...', { position: 'top-right' });

        try {
            setSubmittingReview(true);
            const response = await createTestimonial({
                user_id: userId,
                service_id: serviceId,
                product_id: productId,
                message: reviewForm.message.trim(),
                rating: reviewForm.rating
            });

            toast.dismiss(loadingToast);

            if (response.success) {
                resetForm();
                onSubmitSuccess?.();
                onClose?.();
                showToast('success', 'Review submitted successfully!', {
                    duration: 3000,
                    style: { background: '#10B981', color: '#fff' }
                });
            } else {
                showToast('error', response.message || 'Failed to submit review', { duration: 4000 });
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            toast.dismiss(loadingToast);
            showToast('error', 'Failed to submit review. Please try again.', { duration: 4000 });
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleCancel = () => {
        resetForm();
        onClose?.();
    };

    if (!isOpen) return null;

    return (
        <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                </label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                            className="focus:outline-none"
                        >
                            <FaStar
                                className={`w-5 h-5 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                        {reviewForm.rating === 0 ? 'No rating selected' : `${reviewForm.rating} star${reviewForm.rating !== 1 ? 's' : ''}`}
                    </span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                </label>
                <textarea
                    value={reviewForm.message}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Share your experience..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={submittingReview || !reviewForm.message.trim() || reviewForm.rating === 0}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;

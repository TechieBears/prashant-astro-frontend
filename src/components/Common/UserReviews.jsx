import React, { useState, useMemo } from 'react';
import { FaStar, FaEdit } from 'react-icons/fa';
import { editTestimonials } from '../../api';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ReviewForm from './ReviewForm';

// Style configurations
const VARIANT_STYLES = {
    compact: {
        container: 'space-y-2',
        card: 'bg-gray-50 rounded-md p-2 space-y-1.5',
        loader: 'py-2',
        loaderSize: 'w-4 h-4 border-2',
        loaderText: 'text-xs',
        editSpacing: 'space-y-2',
        label: 'mb-1 text-xs',
        starSize: 'w-4 h-4',
        starText: 'text-xs',
        input: 'rounded-md px-2 py-1.5 text-xs',
        inputRows: 3,
        buttonSpacing: 'gap-2',
        button: 'rounded-md px-3 py-1 text-xs',
        userImage: 'w-6 h-6',
        userName: 'text-xs font-medium',
        userGap: 'gap-2',
        editButton: 'p-1',
        editIcon: 'w-3 h-3',
        ratingGap: 'gap-1',
        starRating: 'w-3 h-3',
        dateText: 'text-xs',
        message: 'text-xs line-clamp-3'
    },
    detailed: {
        container: 'space-y-3',
        card: 'bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300',
        loader: 'py-4',
        loaderSize: 'w-5 h-5',
        loaderText: 'text-sm',
        editSpacing: 'space-y-3',
        label: 'mb-2 text-sm',
        starSize: 'w-4 h-4',
        starText: 'text-xs',
        input: 'rounded-lg px-3 py-2.5 text-sm',
        inputRows: 3,
        buttonSpacing: 'gap-3',
        button: 'rounded-lg px-5 py-2.5 text-sm',
        userImage: 'w-10 h-10',
        userName: 'font-semibold text-sm',
        userGap: 'gap-3',
        editButton: 'p-2',
        editIcon: 'w-4 h-4',
        ratingGap: 'gap-2 mb-3',
        starRating: 'w-4 h-4',
        dateText: 'text-xs',
        message: 'text-sm leading-relaxed'
    }
};

// Helper functions
const formatDate = (dateString, isDetailed) => {
    const date = new Date(dateString);
    return isDetailed
        ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const showToast = (type, message, duration = 3000, style = {}) => {
    toast[type](message, { position: 'top-right', duration, style });
};

const UserReviews = ({
    reviews = [],
    loadingReviews,
    onReviewUpdate,
    editingReviewId,
    setEditingReviewId,
    variant = 'compact',
    currentUserId = null,
    showEmptyState = false,
    showWriteReview = false,
    productId = null,
    serviceId = null,
    isLogged = true, // For showing login prompt in detailed view
    onLoginClick = null // Callback for login navigation
}) => {
    const loggedUserDetails = useSelector(state => state.user.loggedUserDetails);
    const userId = loggedUserDetails?._id;

    const [editForm, setEditForm] = useState({ message: '', rating: 0 });
    const [submitting, setSubmitting] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Memoized values
    const isCompact = variant === 'compact';
    const isDetailed = variant === 'detailed';
    const styles = useMemo(() => VARIANT_STYLES[variant], [variant]);
    const hasReviews = reviews.length > 0;

    const canEditReview = useMemo(() => (review) => {
        if (isCompact) return true; // In modals, all reviews are user's own
        if (!currentUserId) {
            return false; // Not logged in
        }

        // Check multiple possible ID fields
        const reviewUserId = review.user?._id || review.user?.id || review.userId || review.user_id;

        // Also check if user object has an email match (fallback)
        const emailMatch = review.user?.email && loggedUserDetails?.email &&
            review.user.email === loggedUserDetails.email;

        const canEdit = reviewUserId === currentUserId || emailMatch;

        return canEdit;
    }, [isCompact, currentUserId, isDetailed, loggedUserDetails]);

    // Event handlers
    const handleEditClick = (review) => {
        setEditingReviewId(review._id);
        setEditForm({ message: review.message, rating: review.rating });
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setEditForm({ message: '', rating: 0 });
    };

    const handleUpdateReview = async (reviewId) => {
        if (!editForm.message.trim() || editForm.rating === 0) {
            showToast('error', 'Please provide both a rating and review message');
            return;
        }

        const loadingToast = toast.loading('Updating your review...', { position: 'top-right' });

        try {
            setSubmitting(true);
            const response = await editTestimonials(reviewId, {
                message: editForm.message.trim(),
                rating: editForm.rating
            });

            toast.dismiss(loadingToast);

            if (response.success) {
                showToast('success', 'Review updated successfully!', 3000, { background: '#10B981', color: '#fff' });
                handleCancelEdit();
                onReviewUpdate?.();
            } else {
                showToast('error', response.message || 'Failed to update review', 4000);
            }
        } catch (err) {
            console.error('Error updating review:', err);
            toast.dismiss(loadingToast);
            showToast('error', 'Failed to update review. Please try again.', 4000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReviewSuccess = () => {
        setShowReviewForm(false);
        onReviewUpdate?.();
    };

    // Render helpers
    const renderStars = (rating, size) => (
        [...Array(5)].map((_, i) => (
            <FaStar
                key={i}
                className={`${size} ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ))
    );

    const renderEditableStars = () => (
        <>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setEditForm(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                >
                    <FaStar className={`${styles.starSize} ${star <= editForm.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                </button>
            ))}
            <span className={`ml-2 text-gray-600 ${styles.starText}`}>
                {editForm.rating === 0 ? 'No rating' : `${editForm.rating} star${editForm.rating !== 1 ? 's' : ''}`}
            </span>
        </>
    );

    const renderEditMode = (review) => (
        <div className={styles.editSpacing}>
            <div>
                <label className={`block font-medium text-gray-700 ${styles.label}`}>Rating</label>
                <div className="flex items-center gap-1">
                    {renderEditableStars()}
                </div>
            </div>

            <div>
                <label className={`block font-medium text-gray-700 ${styles.label}`}>Review</label>
                <textarea
                    value={editForm.message}
                    onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Share your experience..."
                    className={`w-full border border-gray-300 ${styles.input} focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none`}
                    rows={styles.inputRows}
                />
            </div>

            <div className={`flex ${styles.buttonSpacing}`}>
                <button
                    type="button"
                    onClick={() => handleUpdateReview(review._id)}
                    disabled={submitting || !editForm.message.trim() || editForm.rating === 0}
                    className={`bg-orange-500 text-white ${styles.button} hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {submitting ? 'Updating...' : isDetailed ? 'Update Review' : 'Update'}
                </button>
                <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={submitting}
                    className={`bg-gray-300 text-gray-700 ${styles.button} hover:bg-gray-400 transition-colors font-medium disabled:opacity-50`}
                >
                    Cancel
                </button>
            </div>
        </div>
    );

    const renderViewMode = (review) => {
        const isOwnReview = canEditReview(review);

        return (
            <>
                <div className="flex items-start justify-between mb-3">
                    <div className={`flex items-start ${styles.userGap} flex-1`}>
                        <div className="relative flex-shrink-0">
                            <img
                                src={review.user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                alt={`${review.user?.firstName || ''} ${review.user?.lastName || ''}`}
                                className={`rounded-full object-cover ${styles.userImage} ${isDetailed && isOwnReview ? 'ring-2 ring-orange-400 ring-offset-2' : 'ring-1 ring-gray-200'}`}
                                onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                            />
                            {isDetailed && isOwnReview && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`${styles.userName} text-gray-900`}>
                                    {review.user?.firstName} {review.user?.lastName}
                                </span>
                                <span className="text-gray-300">•</span>
                                <p className="text-xs text-gray-400">{formatDate(review.createdAt, false)}</p>
                            </div>
                        </div>
                    </div>
                    {isOwnReview && (
                        <button
                            onClick={() => handleEditClick(review)}
                            className={`text-gray-400 hover:text-orange-500 transition-all duration-200 ${styles.editButton} flex-shrink-0 hover:bg-orange-50 rounded-lg`}
                            title="Edit review"
                        >
                            <FaEdit className={styles.editIcon} />
                        </button>
                    )}
                </div>

                <div className={`flex items-center ${styles.ratingGap}`}>
                    <div className="flex items-center gap-0.5">
                        {renderStars(review.rating, styles.starRating)}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-2">{review.rating}.0</span>
                </div>

                <p className={`text-gray-600 ${styles.message}`}>{review.message}</p>
            </>
        );
    };

    // Loading state
    if (loadingReviews) {
        return (
            <div className={`${styles.loader} flex items-center justify-center`}>
                <div className={`${styles.loaderSize} border-orange-500 rounded-full animate-spin`} style={{ borderTopColor: 'transparent' }}></div>
            </div>
        );
    }

    // Empty state
    if (!hasReviews) {
        if (showEmptyState && isDetailed) {
            return (
                <>
                    {/* Write Review Section for empty state */}
                    {showWriteReview && !editingReviewId && (
                        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Customer Reviews
                                    <span className="ml-2 text-sm font-normal text-gray-400">(0)</span>
                                </h3>
                                {isLogged ? (
                                    !showReviewForm ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowReviewForm(true);
                                            }}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium whitespace-nowrap"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Write Review
                                        </button>
                                    ) : null
                                ) : (
                                    <button
                                        onClick={onLoginClick}
                                        className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium whitespace-nowrap"
                                    >
                                        Login to Review
                                    </button>
                                )}
                            </div>

                            {/* Show Review Form */}
                            {showReviewForm && isLogged && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <ReviewForm
                                        isOpen={showReviewForm}
                                        onClose={() => setShowReviewForm(false)}
                                        onSubmitSuccess={handleReviewSuccess}
                                        serviceId={serviceId}
                                        productId={productId}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="text-center py-10 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100">
                        <div className="text-5xl mb-3 opacity-40">💭</div>
                        <p className="text-gray-800 text-base font-semibold mb-1">No reviews yet</p>
                        <p className="text-gray-500 text-sm">Be the first to share your thoughts</p>
                    </div>
                </>
            );
        }

        // For compact view (modals) - show write button if enabled
        if (showWriteReview && isCompact) {
            return (
                <div className="pt-2 border-t border-gray-200">
                    {!showReviewForm ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowReviewForm(true);
                            }}
                            className="bg-gray-800 text-white px-3 py-1.5 rounded-md hover:bg-gray-900 transition-colors text-xs font-medium w-full"
                        >
                            Write Review
                        </button>
                    ) : (
                        <div onClick={(e) => e.stopPropagation()}>
                            <ReviewForm
                                isOpen={showReviewForm}
                                onClose={() => setShowReviewForm(false)}
                                onSubmitSuccess={handleReviewSuccess}
                                serviceId={serviceId}
                                productId={productId}
                            />
                        </div>
                    )}
                </div>
            );
        }

        return null;
    }

    // Render write review button and reviews list
    const renderWriteButton = () => {
        if (!showWriteReview || editingReviewId) return null;

        return (
            <div className={isCompact ? 'pt-2 border-t border-gray-200' : 'bg-gray-50 p-3 rounded-lg mb-3'}>
                {isLogged ? (
                    <>
                        {!showReviewForm ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReviewForm(true);
                                }}
                                className={
                                    isCompact
                                        ? 'bg-gray-800 text-white px-3 py-1.5 rounded-md hover:bg-gray-900 transition-colors text-xs font-medium w-full'
                                        : 'w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-all duration-150 text-sm font-medium'
                                }
                            >
                                <svg className={isDetailed ? "w-4 h-4" : "hidden"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {isDetailed ? 'Write a Review' : 'Write Review'}
                            </button>
                        ) : (
                            <div onClick={(e) => isCompact && e.stopPropagation()}>
                                {isDetailed && <h3 className="text-sm font-medium text-gray-900 mb-3">Write Your Review</h3>}
                                <ReviewForm
                                    isOpen={showReviewForm}
                                    onClose={() => setShowReviewForm(false)}
                                    onSubmitSuccess={handleReviewSuccess}
                                    serviceId={serviceId}
                                    productId={productId}
                                />
                            </div>
                        )}
                    </>
                ) : isDetailed && (
                    <div className="text-center">
                        <p className="text-gray-600 mb-3 text-sm">Please login to write a review</p>
                        <button
                            onClick={onLoginClick}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-all duration-150 text-sm font-medium"
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Reviews Section with Header and Write Button */}
            {isDetailed && showWriteReview && !editingReviewId && (
                <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            Customer Reviews
                            <span className="ml-2 text-sm font-normal text-gray-400">({reviews.length})</span>
                        </h3>
                        {isLogged ? (
                            !showReviewForm ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowReviewForm(true);
                                    }}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium whitespace-nowrap"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Write Review
                                </button>
                            ) : null
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium whitespace-nowrap"
                            >
                                Login to Review
                            </button>
                        )}
                    </div>

                    {/* Show Review Form */}
                    {showReviewForm && isLogged && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <ReviewForm
                                isOpen={showReviewForm}
                                onClose={() => setShowReviewForm(false)}
                                onSubmitSuccess={handleReviewSuccess}
                                serviceId={serviceId}
                                productId={productId}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Compact mode write button */}
            {isCompact && showWriteReview && !editingReviewId && (
                <div className="pt-2 border-t border-gray-200">
                    {!showReviewForm ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowReviewForm(true);
                            }}
                            className="bg-gray-800 text-white px-3 py-1.5 rounded-md hover:bg-gray-900 transition-colors text-xs font-medium w-full"
                        >
                            Write Review
                        </button>
                    ) : (
                        <div onClick={(e) => e.stopPropagation()}>
                            <ReviewForm
                                isOpen={showReviewForm}
                                onClose={() => setShowReviewForm(false)}
                                onSubmitSuccess={handleReviewSuccess}
                                serviceId={serviceId}
                                productId={productId}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Reviews Header for Compact */}
            {isCompact && hasReviews && <h5 className="text-xs font-semibold text-gray-700 mt-2">Your Reviews:</h5>}

            {/* Reviews List */}
            {hasReviews && (
                <div className={styles.container}>
                    {reviews.map((review) => (
                        <div key={review._id} className={styles.card}>
                            {editingReviewId === review._id ? renderEditMode(review) : renderViewMode(review)}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default UserReviews;
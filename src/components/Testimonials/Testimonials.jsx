import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { ArrowLeft02Icon, ArrowRight02Icon } from 'hugeicons-react';
import SectionHeader from '../Titles/SectionHeader';
import { getAllTestimonials } from '../../api';
import Comment from '../../assets/user/home/comment.png';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [testimonialsData, setTestimonialsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await getAllTestimonials(1, 10, true);

                if (response.success && response.data?.length > 0) {
                    const transformedData = response.data.map(testimonial => ({
                        name: `${testimonial.user?.firstName || ''} ${testimonial.user?.lastName || ''}`.trim() || 'Anonymous',
                        review: testimonial.message || '',
                        rating: testimonial.rating || 5,
                        image: testimonial.user?.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
                    }));
                    setTestimonialsData(transformedData);
                }
            } catch (err) {
                console.error('Error fetching testimonials:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const handlePrev = () => setCurrentIndex(prev => prev === 0 ? testimonialsData.length - 1 : prev - 1);
    const handleNext = () => setCurrentIndex(prev => prev === testimonialsData.length - 1 ? 0 : prev + 1);

    const renderStars = (rating) => Array.from({ length: 5 }, (_, index) => (
        <FaStar key={index} className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));

    const getTestimonial = (index) => testimonialsData[index] || testimonialsData[0];

    if (loading || testimonialsData.length === 0) {
        return (
            <div className="relative bg-light-orange py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <SectionHeader prefix="Our" highlight="Testimonials" />
                        <div className="mt-4 flex items-center gap-2 justify-center">
                            <SectionHeader prefix="What" highlight="Our" suffix="Clients Say" showImage={false} />
                        </div>
                        <p className="w-11/12 md:w-6/12 mx-auto text-center text-sm sm:text-base text-slate-600 mb-10">
                            Read the testimonials by our clients and find more about our services.
                        </p>
                    </div>
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-light-orange py-16 px-4 sm:px-6 lg:px-8">
            {/* Background decorative hands */}
            {/* <div className="absolute top-8 left-8 w-16 h-16 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                        d="M20 30 Q30 20 40 30 Q50 40 60 30 Q70 20 80 30 Q85 35 80 40 Q75 45 70 40 Q65 35 60 40 Q55 45 50 40 Q45 35 40 40 Q35 45 30 40 Q25 35 20 40 Q15 35 20 30 Z"
                        fill="url(#gradient1)"
                        stroke="url(#gradient1)"
                        strokeWidth="2"
                    />
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#F43F5E" />
                        </linearGradient>
                    </defs>
                </svg>
            </div> */}

            {/* <div className="absolute bottom-8 right-8 w-16 h-16 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                        d="M20 30 Q30 20 40 30 Q50 40 60 30 Q70 20 80 30 Q85 35 80 40 Q75 45 70 40 Q65 35 60 40 Q55 45 50 40 Q45 35 40 40 Q35 45 30 40 Q25 35 20 40 Q15 35 20 30 Z"
                        fill="url(#gradient2)"
                        stroke="url(#gradient2)"
                        strokeWidth="2"
                    />
                    <defs>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#F43F5E" />
                        </linearGradient>
                    </defs>
                </svg>
            </div> */}

            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                {/* Title Section */}
                <div className="text-center mb-12">
                    <SectionHeader prefix="Our" highlight="Testimonials" />
                    <div className="mt-4 flex items-center gap-2 justify-center">
                        <SectionHeader prefix="What" highlight="Our" suffix="Clients Say" showImage={false} />
                    </div>
                    <p className="w-11/12 md:w-6/12 mx-auto text-center text-sm sm:text-base text-slate-600 mb-10">
                        Read the testimonials by our clients and find more about our services.
                    </p>
                </div>

                {/* Testimonials Carousel */}
                <div className="relative">
                    {/* Navigation Arrows */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                        <ArrowLeft02Icon className="w-6 h-6 text-gray-600" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                        <ArrowRight02Icon className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Testimonials Cards */}
                    <div className="flex items-center justify-center gap-6 px-16">
                        {[
                            { index: currentIndex === 0 ? testimonialsData.length - 1 : currentIndex - 1, isCenter: false },
                            { index: currentIndex, isCenter: true },
                            { index: currentIndex === testimonialsData.length - 1 ? 0 : currentIndex + 1, isCenter: false }
                        ].map(({ index, isCenter }, cardIndex) => {
                            const testimonial = getTestimonial(index);
                            return (
                                <div
                                    key={cardIndex}
                                    className={`relative transition-all duration-500 ease-in-out ${isCenter ? 'scale-100 opacity-100 z-20' : 'scale-90 opacity-50 z-10'
                                        }`}
                                >
                                    <img src={Comment} alt="Comment" className="absolute -top-4 -left-4 w-16 h-16 z-20 scale-x-[-1]" />
                                    <div className={`w-80 h-96 rounded-2xl p-6 flex flex-col ${isCenter ? 'bg-button-gradient-orange text-white shadow-2xl' : 'bg-slate1 text-base-font shadow-lg'
                                        }`}>
                                        <div className="flex justify-center mb-4">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                            />
                                        </div>
                                        <p className={`text-sm leading-relaxed mb-4 flex-grow ${isCenter ? 'text-white' : 'text-base-font'
                                            }`}>
                                            {testimonial.review}
                                        </p>
                                        <div className="flex justify-center mb-3">
                                            <div className="flex gap-1">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h3 className={`font-semibold ${isCenter ? 'text-white' : 'text-base-font'
                                                }`}>
                                                {testimonial.name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
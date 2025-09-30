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

    const handlePrev = () => setCurrentIndex(prev => prev === 0 ? Math.max(0, testimonialsData.length - 1) : prev - 1);
    const handleNext = () => setCurrentIndex(prev => prev >= Math.max(0, testimonialsData.length - 1) ? 0 : prev + 1);

    const renderStars = (rating) => Array.from({ length: 5 }, (_, index) => (
        <FaStar key={index} className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));

    const getTestimonial = (index) => {
        if (testimonialsData.length === 0) return null;
        return testimonialsData[index % testimonialsData.length];
    };

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
                    {testimonialsData.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md"
                            >
                                <ArrowLeft02Icon className="w-6 h-6 text-gray-600" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md"
                            >
                                <ArrowRight02Icon className="w-6 h-6 text-gray-600" />
                            </button>
                        </>
                    )}

                    {/* Testimonials Cards */}
                    <div className="flex items-center justify-center gap-6 px-16">
                        {testimonialsData.length > 0 ? (
                            // If we have 3 or more testimonials, show 3 cards
                            // If we have 2 testimonials, show 2 cards
                            // If we have 1 testimonial, show 1 card centered
                            [
                                ...(testimonialsData.length > 1 ? [{ 
                                    index: (currentIndex - 1 + testimonialsData.length) % testimonialsData.length, 
                                    isCenter: false 
                                }] : []),
                                { index: currentIndex, isCenter: true },
                                ...(testimonialsData.length > 2 ? [{
                                    index: (currentIndex + 1) % testimonialsData.length,
                                    isCenter: false
                                }] : [])
                            ].map(({ index, isCenter }) => {
                                const testimonial = testimonialsData[index];
                                if (!testimonial) return null;
                                
                                return (
                                    <div
                                        key={index}
                                        className={`relative transition-all duration-500 ease-in-out ${
                                            isCenter 
                                                ? 'scale-100 opacity-100 z-20' 
                                                : 'scale-90 opacity-70 z-10'
                                        }`}
                                    >
                                        <img 
                                            src={Comment} 
                                            alt="Comment" 
                                            className="absolute -top-4 -left-4 w-16 h-16 z-20 scale-x-[-1]" 
                                        />
                                        <div className={`w-80 h-auto min-h-[24rem] rounded-2xl p-8 flex flex-col ${
                                            isCenter 
                                                ? 'bg-button-gradient-orange text-white shadow-2xl' 
                                                : 'bg-white text-base-font shadow-lg'
                                        }`}>
                                            <div className="flex justify-center mb-6">
                                                <div className="flex">
                                                    {renderStars(testimonial.rating)}
                                                </div>
                                            </div>
                                            <p className={`flex-grow italic mb-6 ${
                                                isCenter ? 'text-white' : 'text-gray-600'
                                            }`}>
                                                "{testimonial.review}"
                                            </p>
                                            <div className="flex items-center">
                                                <img 
                                                    src={testimonial.image} 
                                                    alt={testimonial.name}
                                                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=8833FF&color=fff&size=96`;
                                                    }}
                                                />
                                                <div>
                                                    <h4 className={`font-semibold ${isCenter ? 'text-white' : 'text-gray-800'}`}>
                                                        {testimonial.name}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No testimonials available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Testimonials;
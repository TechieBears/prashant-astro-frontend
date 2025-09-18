import React, { useState } from 'react';
import SectionHeader from '../Titles/SectionHeader';
import { FavouriteIcon } from 'hugeicons-react';
import Flowers from '../../assets/user/home/flowers.png';
import Testimonial1 from '../../assets/user/home/t1.png';
import Testimonial2 from '../../assets/user/home/t2.png';
import Testimonial3 from '../../assets/user/home/t3.jpg';
import Profile1 from '../../assets/user/home/profile1.png';
import Profile2 from '../../assets/user/home/profile2.png';
import Profile3 from '../../assets/user/home/profile3.png';
import Comment from '../../assets/user/home/comment.png';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const testimonialsData = [
    {
        name: "Vikram Singh",
        location: "Pune, Maharashtra",
        category: "Kundali Analysis",
        description: "The astrologer provided deep insights into my career path that were surprisingly accurate. The remedies suggested have brought positive changes in my professional life.",
        image2: Profile1,
        image: Testimonial1
    },
    {
        name: "Priya Sharma",
        location: "Bangalore, Karnataka",
        category: "Marriage Compatibility",
        description: "The kundali matching was done with great precision. The detailed analysis helped our families make an informed decision. Highly recommended for marriage consultations.",
        image2: Profile2,
        image: Testimonial2
    },
    {
        name: "Rahul Mehta",
        location: "Delhi",
        category: "Career Guidance",
        description: "The career prediction was spot on! The astrologer's guidance helped me make crucial career decisions. The remedies suggested have been very effective.",
        image2: Profile3,
        image: Testimonial3
    },
    {
        name: "Anjali Verma",
        location: "Mumbai, Maharashtra",
        category: "Business Astrology",
        description: "I was unsure about starting my new business, but the consultation gave me the confidence to go ahead. Everything is now falling into place, just as predicted!",
        image2: Profile1,
        image: Testimonial2
    }
];

const Testimonials = () => {
    const [expandedIndexes, setExpandedIndexes] = useState([]);
    const DESCRIPTION_LIMIT = 140;

    const toggleReadMore = (index) => {
        setExpandedIndexes((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="relative bg-[#F7E8D4] w-full pb-10 sm:pb-20 mt-20">
            {/* Flower decorations */}
            <img
                src={Flowers}
                alt="Flowers left"
                className="absolute left-4 top-0 w-16 sm:w-32 md:w-[15%] opacity-80"
            />
            <img
                src={Flowers}
                alt="Flowers right"
                className="absolute right-4 top-0 w-16 sm:w-32 md:w-[15%] opacity-80 scale-x-[-1]"
            />

            {/* Section Header */}
            <div className="px-4 sm:px-6 lg:px-16 pt-16 pb-6 max-w-[1280px] mx-auto space-y-4 relative z-10">
                <SectionHeader prefix="Our" highlight="Testimonials" />
                <div className="flex items-center gap-2 justify-center">
                    <SectionHeader prefix="What" highlight="Our" suffix="Clients Say" showImage={false} />
                </div>
                <p className="w-11/12 md:w-6/12 mx-auto text-center text-sm sm:text-base text-slate-600 mb-10">
                    Read the testimonials by our clients and find more about our services.
                </p>
            </div>

            {/* Background shape */}
            <div className="hidden sm:block absolute bottom-24 left-1/2 -translate-x-1/2 translate-y-2 w-40 sm:w-1/2 md:w-[50%] h-48 sm:h-64 md:h-80 bg-orange-light z-0 rounded-lg"></div>

            {/* Swiper Carousel */}
            <div className="mt-2 px-4 sm:px-6 lg:px-16 py-16 relative z-10 max-w-[1280px] mx-auto pt-1">
                <Swiper
                    spaceBetween={40}
                    slidesPerView={1}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    loop={true}
                >
                    {testimonialsData.map((item, index) => {
                        const isExpanded = expandedIndexes.includes(index);
                        const shouldTruncate = item.description.length > DESCRIPTION_LIMIT;
                        const displayedText = isExpanded
                            ? item.description
                            : item.description.slice(0, DESCRIPTION_LIMIT) + (shouldTruncate ? '...' : '');

                        return (
                            <SwiperSlide key={index}>
                                <div className="mx-6">
                                    {/* Comment icon */}
                                    <img
                                        src={Comment}
                                        alt="Comment"
                                        className="absolute top-3 right-1 w-10 sm:w-10 h-10 sm:h-10 z-20"
                                    />

                                    <div className="relative bg-white rounded-lg p-4 sm:p-6 mt-6 shadow-md w-full flex flex-col overflow-visible">
                                        {/* Top: User info */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800">{item.name}</h3>
                                                <p className="text-xs text-slate-500">{item.location}</p>
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <span className="w-fit inline-block mb-3 px-3 py-1 text-xs font-medium text-white bg-[#0088FF] rounded-full">
                                            {item.category}
                                        </span>

                                        {/* Description */}
                                        <p className="text-sm text-slate-600 mb-2">
                                            {displayedText}
                                            {shouldTruncate && (
                                                <button
                                                    onClick={() => toggleReadMore(index)}
                                                    className="text-blue-600 font-medium ml-1"
                                                >
                                                    {isExpanded ? 'Read less' : 'Read more'}
                                                </button>
                                            )}
                                        </p>

                                        {/* Image / Video */}
                                        <div className="rounded-md overflow-hidden mt-auto">
                                            <img
                                                src={item.image2}
                                                alt="testimonial"
                                                className="w-full h-32 sm:h-40 object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </div>
    );
};

export default Testimonials;

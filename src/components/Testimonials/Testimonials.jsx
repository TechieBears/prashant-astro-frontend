import React, { useState, useEffect, useMemo, useRef } from 'react';
import SectionHeader from '../Titles/SectionHeader';
import Flowers from '../../assets/user/home/flowers.png';
import Testimonial1 from '../../assets/user/home/t1.png';
import Testimonial2 from '../../assets/user/home/t2.png';
import Testimonial3 from '../../assets/user/home/t3.jpg';
import Profile1 from '../../assets/user/home/profile1.png';
import Profile2 from '../../assets/user/home/profile2.png';
import Profile3 from '../../assets/user/home/profile3.png';
import Comment from '../../assets/user/home/comment.png';
import { ArrowLeft02Icon, ArrowRight02Icon } from 'hugeicons-react';
import { Play } from 'iconsax-reactjs';
import { getAllTestimonials } from '../../api';
import TestimonialModal from '../Modals/TestimonialModal';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const TestimonialsData = [
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
        location: "Nagpur, Maharashtra",
        category: "Marriage Compatibility",
        description: "The kundali matching was done with great precision. The detailed analysis helped our families make an informed decision. Highly recommended for marriage consultations.",
        image2: Profile2,
        image: Testimonial2
    },
    {
        name: "Rahul Mehta",
        location: "Kolhapur, Maharashtra",
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
    },
    {
        name: "Suresh Kumar",
        location: "Chennai, Tamil Nadu",
        category: "Health Astrology",
        description: "The health predictions were incredibly accurate. Following the suggested remedies has improved my overall well-being significantly. Grateful for the guidance!",
        image2: Profile3,
        image: Testimonial3
    },
    {
        name: "Meera Patel",
        location: "Ahmedabad, Gujarat",
        category: "Financial Guidance",
        description: "The financial advice based on my birth chart helped me make better investment decisions. The return on investments has been exactly as predicted.",
        image2: Profile2,
        image: Testimonial1
    }
];

const VideoPlayer = ({ src, videoId, playingVideos, setPlayingVideos }) => {
    const videoRef = useRef(null);
    const isPlaying = playingVideos[videoId];

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setPlayingVideos(prev => ({ ...prev, [videoId]: true }));
        }
    };

    const handlePause = () => {
        setPlayingVideos(prev => ({ ...prev, [videoId]: false }));
    };

    return (
        <div className="relative w-full h-32 sm:h-40">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                controls={isPlaying}
                preload="metadata"
                onPause={handlePause}
                onEnded={handlePause}
            >
                Your browser does not support the video tag.
            </video>

            {!isPlaying && (
                <div
                    className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer group hover:bg-opacity-40 transition-all duration-300"
                    onClick={handlePlay}
                >
                    <div className="bg-white bg-opacity-90 rounded-full p-3 sm:p-4 group-hover:bg-opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Play size={24} variant="Bold" className="text-orange-500" />
                    </div>
                </div>
            )}
        </div>
    );
};

const Testimonials = () => {
    const [expandedIndexes, setExpandedIndexes] = useState([]);
    const [currentGroup, setCurrentGroup] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [fadeClass, setFadeClass] = useState('opacity-100');
    const [slidesPerGroup, setSlidesPerGroup] = useState(3);
    const [testimonials, setTestimonials] = useState([]);
    const [playingVideos, setPlayingVideos] = useState({});
    const [showExperienceModal, setShowExperienceModal] = useState(false);

    const { isLogged } = useSelector(state => state.user);

    const handleShareExperience = () => {
        if (!isLogged) {
            toast.error('Please login to share your experience');
            return;
        }
        setShowExperienceModal(true);
    };

    const formattedData = useMemo(() =>
        testimonials.map(item => {
            const mediaUrl = item.media?.[0] || '';
            const isVideo = mediaUrl && (
                mediaUrl.includes('.mp4') ||
                mediaUrl.includes('.mov') ||
                mediaUrl.includes('.webm') ||
                mediaUrl.includes('video/upload')
            );

            return {
                name: (item.user?.firstName || "Anonymous") + " " + (item.user?.lastName || ""),
                location: (item.city || "Unknown") + ", " + (item.state || "Unknown"),
                category: item.product?.name || item.service?.title || "General",
                description: item.message || "No description provided",
                image: item.user?.profileImage || Profile1,
                image2: mediaUrl,
                isVideo: isVideo
            };
        })
        , [testimonials]);

    const DESCRIPTION_LIMIT = 140;

    const totalGroups = Math.ceil(formattedData.length / slidesPerGroup);

    const toggleReadMore = (index) => {
        setExpandedIndexes((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const animateTransition = (newGroupIndex) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setFadeClass('opacity-0');

        setTimeout(() => {
            setCurrentGroup(newGroupIndex);
            setTimeout(() => {
                setFadeClass('opacity-100');
                setIsAnimating(false);
            }, 50);
        }, 300);
    };

    const handlePrevClick = () => {
        const prevGroupIndex = currentGroup === 0 ? totalGroups - 1 : currentGroup - 1;
        animateTransition(prevGroupIndex);
    };

    const handleNextClick = () => {
        const nextGroupIndex = currentGroup === totalGroups - 1 ? 0 : currentGroup + 1;
        animateTransition(nextGroupIndex);
    };

    const getCurrentSlides = () => {
        const startIndex = currentGroup * slidesPerGroup;
        return formattedData.slice(startIndex, startIndex + slidesPerGroup);
    };

    useEffect(() => {
        const updateSlides = () => {
            const width = window.innerWidth;
            if (width < 640) setSlidesPerGroup(1);
            else if (width < 1024) setSlidesPerGroup(2);
            else setSlidesPerGroup(3);
        };

        updateSlides();
        window.addEventListener('resize', updateSlides);
        return () => window.removeEventListener('resize', updateSlides);
    }, []);

    useEffect(() => {
        const fetchAllTestimonials = async () => {
            try {
                const response = await getAllTestimonials({ p: 1, records: 100 });
                if (response?.success) {
                    // Filter out testimonials without proper data
                    const validTestimonials = response?.data?.filter(item =>
                        item && item.message && (item.user || item.city)
                    ) || [];
                    setTestimonials(validTestimonials);
                }
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            }
        }
        fetchAllTestimonials();
    }, [])

    return (
        <div className="relative bg-[#F7E8D4] w-full mt-8 sm:mt-12 md:mt-16 lg:mt-20">
            {/* Flowers */}
            <img src={Flowers} alt="Flowers left" className="absolute left-4 top-0 w-16 sm:w-32 md:w-[15%] opacity-80" />
            <img src={Flowers} alt="Flowers right" className="absolute right-4 top-0 w-16 sm:w-32 md:w-[15%] opacity-80 scale-x-[-1]" />

            {/* Section Header */}
            <div className="px-4 sm:px-6 lg:px-16 pt-16 pb-6 max-w-[1280px] mx-auto space-y-4 relative z-10">
                {/* <SectionHeader prefix="Our" highlight="Testimonials" /> */}
                <div className="flex items-center gap-2 justify-center">
                    <SectionHeader prefix="What" highlight="Our" suffix="Clients Say" showImage={false} />
                </div>
                <p className="w-11/12 md:w-6/12 mx-auto text-center text-sm sm:text-base text-slate-600 mb-10">
                    Read the Testimonials by our clients and find more about our services.
                </p>
            </div>

            {/* Share Experience Section */}
            <div className="px-4 sm:px-6 lg:px-16 w-full max-w-[1280px] mx-auto">
                <div className="text-center">
                    {/* <SectionHeader
                        prefix="Share your experience"
                        highlight="with us"
                    /> */}
                    <div className="mb-2 sm:mb-12 md:mb-10">
                        <button
                            onClick={handleShareExperience}
                            className="bg-button-diagonal-gradient-orange text-white px-12 sm:px-16 py-2.5 md:py-3 rounded-full font-medium transition-opacity shadow-md text-sm md:text-base hover:opacity-90"
                        >
                            Share Your Experience with us
                        </button>
                    </div>
                </div>
            </div>

            {/* Background Shape */}
            <div className="hidden sm:block absolute bottom-24 left-1/2 -translate-x-1/2 translate-y-2 w-40 sm:w-1/2 md:w-[50%] h-48 sm:h-64 md:h-80 bg-orange-light z-0 rounded-lg"></div>

            {/* Cards */}
            <div className="mt-2 px-4 sm:px-6 lg:px-16 py-16 relative z-10 max-w-[1280px] mx-auto pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {getCurrentSlides().map((item, index) => {
                        const globalIndex = currentGroup * slidesPerGroup + index;
                        const isExpanded = expandedIndexes.includes(globalIndex);
                        const shouldTruncate = item.description.length > DESCRIPTION_LIMIT;
                        const displayedText = isExpanded
                            ? item.description
                            : item.description.slice(0, DESCRIPTION_LIMIT) + (shouldTruncate ? '...' : '');

                        return (
                            <div key={`${currentGroup}-${index}`} className="mx-6 relative transform transition-all duration-300 ease-in-out">
                                <img src={Comment} alt="Comment" className="absolute top-3 right-1 w-10 h-10 z-20" />
                                <div className="relative bg-white rounded-lg p-4 sm:p-6 mt-6 shadow-md w-full hover:shadow-lg transition-shadow duration-200 h-[420px] sm:h-[450px] flex flex-col">

                                    <div className={`transition-opacity duration-300 ease-in-out ${fadeClass} flex-1 flex flex-col`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src={item.image} alt={item.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800">{item.name}</h3>
                                                <p className="text-xs text-slate-500">{item.location}</p>
                                            </div>
                                        </div>

                                        <span className="w-fit inline-block mb-3 px-3 py-1 text-xs font-medium text-white bg-[#0088FF] rounded-full">
                                            {item.category}
                                        </span>

                                        <p className="text-sm text-slate-600 mb-4">
                                            {displayedText}
                                            {shouldTruncate && (
                                                <button
                                                    onClick={() => toggleReadMore(globalIndex)}
                                                    className="text-blue-600 font-medium ml-1 hover:text-blue-800 transition-colors duration-200"
                                                >
                                                    {isExpanded ? 'Read less' : 'Read more'}
                                                </button>
                                            )}
                                        </p>

                                        <div className="rounded-md overflow-hidden mt-auto">
                                            {item.image2 ? (
                                                item.isVideo ? (
                                                    <VideoPlayer
                                                        src={item.image2}
                                                        videoId={`video-${currentGroup}-${index}`}
                                                        playingVideos={playingVideos}
                                                        setPlayingVideos={setPlayingVideos}
                                                    />
                                                ) : (
                                                    <img src={item.image2} alt="testimonial" className="w-full h-32 sm:h-40 object-cover" />
                                                )
                                            ) : (
                                                <div className="w-full h-32 sm:h-40 bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-sm">No media</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-around gap-4 mt-8">
                    <button
                        onClick={handlePrevClick}
                        disabled={isAnimating}
                        className={`flex items-center justify-center p-3 rounded-full bg-primary hover:bg-primary transition-all duration-300 text-white ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                    >
                        <ArrowLeft02Icon size={30} />
                    </button>

                    <button
                        onClick={handleNextClick}
                        disabled={isAnimating}
                        className={`flex items-center justify-center p-3 rounded-full bg-primary hover:bg-primary transition-all duration-300 text-white ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                    >
                        <ArrowRight02Icon size={30} />
                    </button>
                </div>
            </div>

            {/* Share Experience Modal */}
            <TestimonialModal
                open={showExperienceModal}
                setOpen={setShowExperienceModal}
            />
        </div>
    );
};

export default Testimonials;

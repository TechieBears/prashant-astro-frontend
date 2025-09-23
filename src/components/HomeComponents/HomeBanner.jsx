import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { formBtn1 } from '../../utils/CustomClass'
import { Calendar03Icon, PlayListIcon } from 'hugeicons-react';
import { NavLink } from 'react-router-dom';
// import { useGSAP } from '@gsap/react';
// import { gsap } from 'gsap';
// import { SplitText } from 'gsap/all';

const HomeBanner = ({ slidesData, isLoading }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // GSAP Animation Hook (uncomment when you have GSAP installed)
    // useGSAP(() => {
    //     let split = SplitText.create(".split", { type: "words" });

    //     const tl = gsap.timeline({
    //         defaults: {
    //             duration: 1,
    //             ease: "power1.inOut",
    //         },
    //     });

    //     tl.from(split.words, {
    //         y: 100,
    //         autoAlpha: 0,
    //         stagger: 0.05
    //     })

    //     tl.from(".discrption", {
    //         y: 100,
    //         opacity: 0,
    //     })

    //     tl.from(".btn", {
    //         y: 100,
    //         opacity: 0,
    //     })
    // }, [currentSlide]) // Re-run animation when slide changes

    // Auto-play functionality
    useEffect(() => {
        let interval;
        if (isAutoPlay && slidesData && slidesData.length > 1) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slidesData.length);
            }, 6000); // 6 seconds per slide to allow GSAP animations to complete
        }
        return () => clearInterval(interval);
    }, [isAutoPlay, slidesData]);

    const nextSlide = () => {
        if (slidesData && slidesData.length > 1) {
            setCurrentSlide((prev) => (prev + 1) % slidesData.length);
        }
    };

    const prevSlide = () => {
        if (slidesData && slidesData.length > 1) {
            setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
        }
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const toggleAutoPlay = () => {
        setIsAutoPlay(!isAutoPlay);
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!slidesData || slidesData.length === 0) {
        return <div className="h-64 flex items-center justify-center">No slides available</div>;
    }

    const currentSlideData = slidesData[currentSlide];

    return (
        <div className="relative">
            {/* Custom CSS for animations */}


            {/* Slider Container */}
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slidesData.map((slide) => (
                        <div key={slide.id} className="w-full flex-shrink-0">
                            <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen w-full overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-0">
                                {/* Background Image */}
                                <img
                                    src={slide.image}
                                    alt="Home Banner"
                                    className="w-full h-full object-cover absolute inset-0 z-0"
                                    onError={(e) => {
                                        console.error("Image failed to load:", slide.image);
                                        if (slide.onImageError) {
                                            slide.onImageError(e);
                                        }
                                    }}
                                    referrerPolicy="no-referrer"
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />

                                {/* Video overlay - uncomment if needed */}
                                {slide.video && (
                                    <video
                                        src={slide.video}
                                        className="absolute w-full h-full object-cover z-0"
                                        loop
                                        autoPlay
                                        playsInline
                                        muted
                                    />
                                )}

                                {/* Dark overlay for better text readability */}
                                <div className="absolute inset-0 z-5 bg-black/20 md:bg-transparent"></div>

                                {/* Foreground Content */}
                                <div className="relative z-10 flex flex-col md:flex-row h-full w-full">
                                    {/* Left Half - Empty on Desktop */}
                                    <div className="hidden md:block md:w-1/2" />

                                    {/* Right Half - Content */}
                                    <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16">
                                        <div className="text-center md:text-left flex flex-col space-y-4 sm:space-y-6 max-w-2xl">
                                            <h1 className="split text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-4 sm:mb-6 font-procSans font-bold bg-text-gradient-orange bg-clip-text text-transparent overflow-hidden leading-tight">
                                                {slide.title}
                                            </h1>
                                            <p className="discrption text-sm sm:text-base md:text-lg lg:text-xl font-tbPop font-normal text-white md:text-black max-w-4xl !mb-4 sm:!mb-5 overflow-hidden leading-relaxed">
                                                {slide.description}
                                            </p>
                                            {/* {slide.button && (
                                                <button
                                                    className={`btn ${formBtn1} text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 mt-2 sm:mt-4`}
                                                    onClick={slide.onClick}
                                                >
                                                    Register to join
                                                </button>
                                            )} */}

                                            <div className='flex w-full justify-between gap-6'>
                                                <NavLink to='/services' className="bg-gradient-orange w-full justify-center items-center gap-2 flex flex-row text-white font-medium px-6 py-2 rounded shadow hover:opacity-90 transition">
                                                    <Calendar03Icon size={18} color='#fff' />
                                                    <span>
                                                    Book Consultation
                                                    </span>
                                                </NavLink>
                                               <button
  onClick={() => {
    const element = document.getElementById('social-media');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }}
  className="bg-white w-full justify-center items-center gap-2 flex flex-row text-black font-medium px-6 py-2 rounded shadow hover:opacity-90 transition"
>
  <PlayListIcon size={18} color="orange" />
  <span className="bg-text-gradient-orange bg-clip-text text-transparent">
    Watch Introduction
  </span>
</button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ))}

                </div>
            </div>

            {/* Show controls only if there are multiple slides */}
            {slidesData.length > 1 && (
                <>
                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 bg-orange-500 bg-opacity-80 hover:bg-opacity-100 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 group shadow-lg z-50"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 bg-orange-500 bg-opacity-80 hover:bg-opacity-100 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 group shadow-lg z-50"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-50">
                        {slidesData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-orange-400 scale-125 shadow-lg'
                                    : 'bg-white bg-opacity-60 hover:bg-orange-300'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Auto-play Control */}
                    {/* <button
                        onClick={toggleAutoPlay}
                        className="absolute top-6 sm:top-8 right-4 sm:right-6 lg:right-8 bg-orange-500 bg-opacity-80 hover:bg-opacity-100 text-white p-3 sm:p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-lg z-50"
                        aria-label={isAutoPlay ? "Pause autoplay" : "Start autoplay"}
                    >
                        {isAutoPlay ? (
                            <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                            <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                    </button> */}

                    {/* Slide Counter */}
                    {/* <div className="absolute top-6 sm:top-8 left-4 sm:left-6 lg:left-8 bg-orange-500 bg-opacity-80 text-white px-4 py-2 rounded-full backdrop-blur-sm shadow-lg z-50">
                        <span className="text-sm sm:text-base font-medium">
                            {currentSlide + 1} / {slidesData.length}
                        </span>
                    </div> */}

                    {/* Progress Bar */}
                    {/* <div className="absolute bottom-0 left-0 w-full h-2 bg-black bg-opacity-20 z-50">
                        <div 
                            className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${((currentSlide + 1) / slidesData.length) * 100}%` }}
                        />
                    </div> */}
                </>
            )}
        </div>
    );
};

export default HomeBanner;
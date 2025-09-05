import { useState, useEffect } from 'react';
import { SlideshowLightbox } from 'lightbox.js-react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Autoplay } from 'swiper/modules';

export default function ImageGallery({ images }) {
    console.log("⚡️🤯 ~ ImageGallery.jsx:5 ~ ImageGallery ~ images:", images)
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!images || images.length === 0) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p className="text-gray-500">No images to display</p>
            </div>
        );
    }



    return (
        <div className="container mx-auto px-2">
            {isClient ? (
                <Swiper
                    slidesPerView={"auto"}
                    freeMode={true}
                    autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    modules={[FreeMode, Autoplay, Navigation]}
                    navigation={true}
                    className="mySwiper"
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 4 },
                        480: { slidesPerView: 1, spaceBetween: 4 },
                        768: { slidesPerView: 2, spaceBetween: 10 },
                        1024: { slidesPerView: 3, spaceBetween: 10 },
                        1280: { slidesPerView: 4, spaceBetween: 10 }
                    }}
                >
                    {images?.map((src, index) => {
                        return (
                            <SwiperSlide key={index} className='h-[15rem] rounded-2xl border border-gray-200'>
                                <div className="flex transition-transform duration-300 ease-in-out p-1 rounded-2xl h-[15rem]">
                                    <SlideshowLightbox
                                        theme="lightbox"
                                        iconColor="silver"
                                        thumbnailBorder="silver"
                                        imgAnimation="fade"
                                        className="w-full h-full"
                                        showThumbnails={true}
                                    >
                                        <img
                                            loading="lazy"
                                            src={src}
                                            className="w-full flex-shrink-0 h-full rounded-2xl object-cover cursor-pointer"
                                            alt={`Slide ${index + 1}`}
                                        />
                                    </SlideshowLightbox>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((src, index) => (
                        <img
                            key={index}
                            className="w-full h-48 object-cover rounded-lg"
                            src={src}
                            alt={`Gallery image ${index + 1}`}
                            loading="lazy"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

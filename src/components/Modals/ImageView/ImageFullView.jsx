import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper/modules';


const ImageFullView = ({ isOpen, toggle, slides }) => {

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100000]" onClose={() => toggle()}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 backdrop-blur-[3px] bg-black/10" />
                </Transition.Child>
                <div className="fixed inset-0 ">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white  text-left align-center self-center  transition-all">
                                <div className="flex items-center justify-center self-center ">
                                    <div className="w-full max-w-xl overflow-hidden">
                                        <Swiper
                                            cssMode={true}
                                            navigation={true}
                                            keyboard={true}
                                            modules={[Navigation, Keyboard]}
                                            className="sliderBox"
                                        >
                                            {slides?.map((slide, i) => (<SwiperSlide key={i} className='h-[35rem] rounded-2xl' >
                                                <div className="flex transition-transform duration-300 ease-in-out p-5 rounded-2xl h-[33rem]">
                                                    <img loading="lazy" src={slide} className="w-full flex-shrink-0 h-full rounded-2xl object-contain " alt={`Slide ${i + 1}`} />
                                                </div>
                                            </SwiperSlide>))}
                                        </Swiper>

                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}

export default ImageFullView

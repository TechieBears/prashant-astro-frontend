import React from 'react';
import logo from '../../assets/astroguid logo.png';
import logoText from '../../assets/astroguid logo text.png';
import swastikaGif from '../../assets/loader/swastika.gif';
import { getHomeModalStatus } from '../../api';

const ComingSoonModal = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop with blur effect */}
            <div className="fixed inset-0 z-[9998] backdrop-blur-md bg-black/30" />

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 md:p-12 transform transition-all animate-fadeIn border-2 border-orange-100">
                    {/* Preloader */}
                    {/* <div className="flex justify-center mb-6">
                        <img
                            src={swastikaGif}
                            alt="Loading..."
                            className="w-28 h-28 md:w-32 md:h-32"
                        />
                    </div> */}

                    <div className="flex justify-center flex-col items-center mb-6">
                        <img src={logo} alt="Astroguid Logo" className="h-20 md:h-24 animate-spin-slow" />
                        <img src={logoText} alt="Astroguid" className="h-8 md:h-6" />
                    </div>

                    {/* Title */}
                    <h2 className="text-5xl font-bold text-center mb-4 font-tbPop">
                        <span className="bg-button-gradient-orange bg-clip-text text-transparent">
                            Coming Soon
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-base-font text-center mb-8 text-lg font-tbPop">
                        We're working hard to bring you something amazing. Stay tuned for updates!
                    </p>

                    {/* Logo */}
                    {/* <div className="flex justify-center items-center gap-3 mb-8">
                        <img src={logo} alt="Astroguid Logo" className="h-16 md:h-20" />
                        <img src={logoText} alt="Astroguid" className="h-8 md:h-10" />
                    </div> */}
                    {/* Decorative elements */}
                    {/* <div className="flex justify-center space-x-3">
                        <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-4 h-4 bg-primary-orange rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default ComingSoonModal;


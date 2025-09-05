import React, { useState, useEffect } from 'react';

const SlideUpText = ({ items, interval = 3000 }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (items.length === 0) return;

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, interval);

        return () => clearInterval(timer);
    }, [items.length, interval]);

    if (items.length === 0) return null;

    return (
        <div className="relative h-10 overflow-hidden">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === activeIndex
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-full opacity-0'
                        }`}
                >
                    {item}
                </div>
            ))}
        </div>
    );
};

export default SlideUpText;

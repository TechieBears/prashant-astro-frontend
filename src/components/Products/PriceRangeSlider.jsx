import React, { useRef } from 'react';

const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const maxValueRef = useRef(null);

  const currentMax = Math.max(max, value[1]);
  if (maxValueRef.current === null || currentMax > maxValueRef.current) {
    maxValueRef.current = currentMax;
  }

  const effectiveMax = maxValueRef.current;
  const range = effectiveMax - min;

  const minP = ((value[0] - min) / range) * 100;
  const maxP = ((value[1] - min) / range) * 100;

  const handleMinChange = (e) => {
    e.preventDefault();
    const newMin = Math.min(Number(e.target.value), value[1] - 1);
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e) => {
    e.preventDefault();
    const newMax = Math.max(Number(e.target.value), value[0] + 1);
    onChange([value[0], newMax]);
  };

  return (
    <div className="relative py-1">
      <div className="h-2 bg-slate-200 rounded-full absolute left-0 right-0 top-1/2 -translate-y-1/2" />

      <div
        className="absolute top-1/2 -translate-y-1/2 h-2 bg-orange-500 rounded-full"
        style={{
          left: `${minP}%`,
          width: `${Math.min(maxP - minP, 100 - minP)}%`
        }}
      />

      <div className="relative h-8 flex items-center">
        <div className="absolute w-full h-1">
          <input
            type="range"
            min={min}
            max={effectiveMax}
            step={1}
            value={value[0]}
            onChange={handleMinChange}
            className="absolute w-full h-full opacity-0 z-10 cursor-pointer"
            style={{
              appearance: 'none',
              pointerEvents: 'none',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={min}
            max={effectiveMax}
            step={1}
            value={value[1]}
            onChange={handleMaxChange}
            className="absolute w-full h-full opacity-0 z-20 cursor-pointer"
            style={{
              appearance: 'none',
              pointerEvents: 'none',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            aria-label="Maximum price"
          />

          <div
            className="absolute w-4 h-4 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer touch-none"
            style={{
              left: `${minP}%`,
              top: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startValue = value[0];
              const range = effectiveMax - min;
              const sliderWidth = e.currentTarget.parentElement.offsetWidth;

              const handleMouseMove = (moveEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const deltaValue = (deltaX / sliderWidth) * range;
                const newValue = Math.min(
                  Math.max(min, startValue + deltaValue),
                  value[1] - 1
                );
                onChange([Math.round(newValue), value[1]]);
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              const startX = e.touches[0].clientX;
              const startValue = value[0];
              const range = effectiveMax - min;
              const sliderWidth = e.currentTarget.parentElement.offsetWidth;

              const handleTouchMove = (moveEvent) => {
                const deltaX = moveEvent.touches[0].clientX - startX;
                const deltaValue = (deltaX / sliderWidth) * range;
                const newValue = Math.min(
                  Math.max(min, startValue + deltaValue),
                  value[1] - 1
                );
                onChange([Math.round(newValue), value[1]]);
              };

              const handleTouchEnd = () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              };

              document.addEventListener('touchmove', handleTouchMove);
              document.addEventListener('touchend', handleTouchEnd);
            }}
          />

          <div
            className="absolute w-4 h-4 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer touch-none"
            style={{
              left: `${Math.min(maxP, 100)}%`,
              top: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const range = effectiveMax - min;
              const sliderElement = e.currentTarget.parentElement;
              const sliderWidth = sliderElement.offsetWidth;

              const handleMouseMove = (moveEvent) => {
                const sliderRect = sliderElement.getBoundingClientRect();
                const relativeX = moveEvent.clientX - sliderRect.left;
                const percentage = Math.max(0, Math.min(100, (relativeX / sliderWidth) * 100));

                let newValue;
                if (percentage >= 99.5) {
                  newValue = effectiveMax;
                } else {
                  newValue = Math.round(min + (percentage / 100) * range);
                }

                const clampedValue = Math.max(
                  Math.min(effectiveMax, newValue),
                  value[0] + 1
                );

                onChange([value[0], clampedValue]);
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              const range = effectiveMax - min;
              const sliderElement = e.currentTarget.parentElement;
              const sliderWidth = sliderElement.offsetWidth;

              const handleTouchMove = (moveEvent) => {
                const sliderRect = sliderElement.getBoundingClientRect();
                const relativeX = moveEvent.touches[0].clientX - sliderRect.left;
                const percentage = Math.max(0, Math.min(100, (relativeX / sliderWidth) * 100));

                let newValue;
                if (percentage >= 99.5) {
                  newValue = effectiveMax;
                } else {
                  newValue = Math.round(min + (percentage / 100) * range);
                }

                const clampedValue = Math.max(
                  Math.min(effectiveMax, newValue),
                  value[0] + 1
                );

                onChange([value[0], clampedValue]);
              };

              const handleTouchEnd = () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              };

              document.addEventListener('touchmove', handleTouchMove);
              document.addEventListener('touchend', handleTouchEnd);
            }}
          />
        </div>
      </div>

      <div className="absolute w-full">
        <div
          className="absolute px-2 py-0.5 rounded-md text-white text-xs bg-orange-500 shadow"
          style={{ left: `${minP}%`, transform: 'translateX(-50%)' }}
        >
          {value[0].toLocaleString()}
        </div>
        <div
          className="absolute px-2 py-0.5 rounded-md text-white text-xs bg-orange-500 shadow"
          style={{ left: `${Math.min(maxP, 100)}%`, transform: 'translateX(-50%)' }}
        >
          {value[1].toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PriceRangeSlider);

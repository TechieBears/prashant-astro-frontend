import React from 'react';

const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const range = max - min;
  const minP = ((value[0] - min) / range) * 100;
  const maxP = ((value[1] - min) / range) * 100;

  // Handle minimum price change
  const handleMinChange = (e) => {
    e.preventDefault();
    const newMin = Math.min(Number(e.target.value), value[1] - 1);
    onChange([newMin, value[1]]);
  };

  // Handle maximum price change
  const handleMaxChange = (e) => {
    e.preventDefault();
    const newMax = Math.max(Number(e.target.value), value[0] + 1);
    onChange([value[0], newMax]);
  };

  return (
    <div className="relative py-1">
      {/* Background track */}
      <div className="h-2 bg-slate-200 rounded-full absolute left-0 right-0 top-1/2 -translate-y-1/2" />

      {/* Active range track */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-2 bg-orange-500 rounded-full"
        style={{ left: `${minP}%`, width: `${maxP - minP}%` }}
      />

      {/* Slider inputs */}
      <div className="relative h-8 flex items-center">
        <div className="absolute w-full h-1">
          <input
            type="range"
            min={min}
            max={max}
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
            max={max}
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

          {/* Interactive track */}
          <div
            className="absolute h-2 bg-slate-200 rounded-full w-full top-1/2 -translate-y-1/2"
            style={{
              pointerEvents: 'none',
            }}
          >
            <div
              className="absolute h-full bg-orange-500 rounded-full"
              style={{
                left: `${minP}%`,
                width: `${maxP - minP}%`,
              }}
            />
          </div>

          {/* Thumb for min value */}
          <div
            className="absolute w-4 h-4 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
            style={{
              left: `${minP}%`,
              top: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startValue = value[0];
              const range = max - min;
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
          />

          {/* Thumb for max value */}
          <div
            className="absolute w-4 h-4 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
            style={{
              left: `${maxP}%`,
              top: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startValue = value[1];
              const range = max - min;
              const sliderWidth = e.currentTarget.parentElement.offsetWidth;

              const handleMouseMove = (moveEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const deltaValue = (deltaX / sliderWidth) * range;
                const newValue = Math.max(
                  Math.min(max, startValue + deltaValue),
                  value[0] + 1
                );
                onChange([value[0], Math.round(newValue)]);
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
        </div>
      </div>

      {/* Value labels */}
      <div className="absolute -bottom-3" style={{ left: `max(0px, calc(${minP}% - 18px))` }}>
        <div className="px-2 py-0.5 rounded-md text-white text-xs bg-orange-500 shadow">
          {value[0].toLocaleString()}
        </div>
      </div>
      <div className="absolute -bottom-3" style={{ left: `min(calc(100% - 36px), calc(${maxP}% - 18px))` }}>
        <div className="px-2 py-0.5 rounded-md text-white text-xs bg-orange-500 shadow">
          {value[1].toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PriceRangeSlider);

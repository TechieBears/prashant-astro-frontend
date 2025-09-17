import React from 'react';

const PriceRangeSlider = ({ min, max, value, onChange, minValue, maxValue }) => {
  const minP = ((value[0] - min) / (max - min)) * 100;
  const maxP = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="relative py-6">
      {/* Background track */}
      <div className="h-2 bg-slate-200 rounded-full absolute left-0 right-0 top-1/2 -translate-y-1/2" />

      {/* Active range track */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-2 bg-orange-500 rounded-full"
        style={{ left: `${minP}%`, width: `${maxP - minP}%` }}
      />

      {/* Slider inputs */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={value[0]}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), value[1] - 10);
            onChange([v, value[1]]);
          }}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
          style={{
            zIndex: 2,
            background: 'transparent'
          }}
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={value[1]}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), value[0] + 10);
            onChange([value[0], v]);
          }}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
          style={{
            zIndex: 1,
            background: 'transparent'
          }}
          aria-label="Maximum price"
        />
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

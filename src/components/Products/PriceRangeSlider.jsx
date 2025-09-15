import React from 'react';

const PriceRangeSlider = ({ min, max, value, onChange, minValue, maxValue }) => {
  const minP = ((value[0] - min) / (max - min)) * 100;
  const maxP = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="relative">
      <div className="h-2 bg-slate-200 rounded-full z-0 absolute left-0 right-0 top-1/2 -translate-y-1/2" />
      <div 
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-orange-500 rounded-full z-0" 
        style={{ left: `${minP}%`, right: `${100 - maxP}%` }} 
      />
      <div className="products-range">
        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={value[0]}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), value[1]);
            onChange([v, value[1]]);
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
            const v = Math.max(Number(e.target.value), value[0]);
            onChange([value[0], v]);
          }}
          aria-label="Maximum price"
        />
      </div>
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

import React from 'react';

interface ChartControlsProps {
  totalHours: number;
  currentStartIndex: number;
  onScrollChange: (index: number) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  totalHours,
  currentStartIndex,
  onScrollChange,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400/90 to-blue-400/80 backdrop-blur-sm p-4 md:relative md:bg-transparent md:backdrop-blur-none md:p-0 md:mt-4">
      <div className="max-w-6xl mx-auto">
        <input
          type="range"
          min={0}
          max={Math.max(0, totalHours - 8)}
          value={currentStartIndex}
          onChange={(e) => onScrollChange(parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:hover:bg-white/90
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:hover:bg-white/90
            [&::-moz-range-thumb]:border-0
            md:[&::-webkit-slider-thumb]:w-4
            md:[&::-webkit-slider-thumb]:h-4
            md:[&::-moz-range-thumb]:w-4
            md:[&::-moz-range-thumb]:h-4"
        />
      </div>
    </div>
  );
};

export default ChartControls; 
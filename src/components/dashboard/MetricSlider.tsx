import React from 'react';

interface MetricSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: 'cyan' | 'amber' | 'green';
}

const colorClasses = {
  cyan: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    slider: 'accent-cyan-500',
    text: 'text-cyan-700'
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    slider: 'accent-amber-500',
    text: 'text-amber-700'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    slider: 'accent-green-500',
    text: 'text-green-700'
  }
};

const MetricSlider: React.FC<MetricSliderProps> = ({ label, value, onChange, color }) => {
  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl p-4`}>
      <div className="flex justify-between items-center mb-2">
        <label className={`text-sm font-bold ${colors.text}`}>{label}</label>
        <span className={`text-lg font-bold ${colors.text}`}>{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${colors.slider}`}
      />
      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
        <span>Bajo</span>
        <span>Alto</span>
      </div>
    </div>
  );
};

export default MetricSlider;

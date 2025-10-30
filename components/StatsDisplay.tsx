
import React from 'react';

interface StatsDisplayProps {
  wpm: number;
  accuracy: number;
  streak: number;
}

const StatItem: React.FC<{ label: string, value: string | number }> = ({ label, value }) => (
    <div className="flex flex-col items-center p-4 bg-white/30 dark:bg-gray-800/30 rounded-lg backdrop-blur-sm">
        <span className="text-3xl md:text-4xl font-bold text-teal-500">{value}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
);


const StatsDisplay: React.FC<StatsDisplayProps> = ({ wpm, accuracy, streak }) => {
  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-4 mb-8 animate-fadeIn">
        <StatItem label="WPM" value={wpm} />
        <StatItem label="Accuracy" value={`${accuracy}%`} />
        <StatItem label="Streak" value={streak} />
    </div>
  );
};

export default StatsDisplay;

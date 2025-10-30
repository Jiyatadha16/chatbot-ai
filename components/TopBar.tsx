
import React from 'react';
import type { Theme } from '../types';
import SoundOnIcon from './icons/SoundOnIcon';
import SoundOffIcon from './icons/SoundOffIcon';
import FocusOnIcon from './icons/FocusOnIcon';
import FocusOffIcon from './icons/FocusOffIcon';
import GeminiIcon from './icons/GeminiIcon';
import ThemeIcon from './icons/ThemeIcon';

interface TopBarProps {
  theme: Theme;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  geminiMode: boolean;
  onToggleGeminiMode: () => void;
  isUIVisible: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  focusMode,
  onToggleFocusMode,
  geminiMode,
  onToggleGeminiMode,
  isUIVisible,
}) => {
  const baseButtonClass = "p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const iconClass = "w-5 h-5";

  return (
    <header className={`w-full max-w-4xl p-4 transition-all duration-500 ${isUIVisible ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-light tracking-wider text-slate-600 dark:text-slate-300">
          Typing<span className="font-semibold text-teal-500">Zen</span>Garden
        </h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button onClick={onToggleSound} title={soundEnabled ? "Disable Sound" : "Enable Sound"} className={`${baseButtonClass} ${soundEnabled ? 'text-teal-500 bg-teal-100 dark:bg-teal-900/50' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            {soundEnabled ? <SoundOnIcon className={iconClass} /> : <SoundOffIcon className={iconClass} />}
          </button>
          <button onClick={onToggleFocusMode} title={focusMode ? "Disable Focus Mode" : "Enable Focus Mode"} className={`${baseButtonClass} ${focusMode ? 'text-teal-500 bg-teal-100 dark:bg-teal-900/50' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            {focusMode ? <FocusOnIcon className={iconClass} /> : <FocusOffIcon className={iconClass} />}
          </button>
          <button onClick={onToggleGeminiMode} title={geminiMode ? "Disable Gemini Mode" : "Enable Gemini Mode"} className={`${baseButtonClass} ${geminiMode ? 'text-teal-500 bg-teal-100 dark:bg-teal-900/50' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            <GeminiIcon className={`${iconClass} ${geminiMode ? 'animate-glow' : ''}`} />
          </button>
          <button onClick={onToggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`} className={`${baseButtonClass} text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700`}>
             <ThemeIcon className={iconClass} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

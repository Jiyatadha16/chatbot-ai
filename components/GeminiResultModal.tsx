
import React from 'react';

interface GeminiResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: string;
  isLoading: boolean;
}

// Simple markdown-to-html parser
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={i} className="font-bold text-teal-400 block mb-2">{line.slice(2, -2)}</strong>;
      }
      return <p key={i} className="mb-2">{line}</p>;
    });
  
    return <div>{lines}</div>;
};

const GeminiResultModal: React.FC<GeminiResultModalProps> = ({ isOpen, onClose, result, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 m-4 max-w-lg w-full relative transform transition-all duration-300 scale-95" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200 flex items-center">
          <svg className="w-6 h-6 mr-2 text-teal-500 animate-glow" viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 2.75a10 10 0 1 0 8.243 15.123.75.75 0 0 1-1.02-1.102A8.5 8.5 0 1 1 12.75 4.25a.75.75 0 0 1 0 1.5 7 7 0 1 0 5.103 9.47.75.75 0 1 1 1.058.979A8.5 8.5 0 0 1 12.75 21.25a.75.75 0 0 1 0-1.5 7 7 0 1 0-4.945-11.953.75.75 0 0 1-1.06-1.06A8.5 8.5 0 0 1 12.75 4.25Z" /></svg>
          Gemini's Reflection
        </h2>
        <div className="text-slate-600 dark:text-slate-300 space-y-4">
            {isLoading ? (
                <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
            ) : (
                <SimpleMarkdown text={result} />
            )}
        </div>
      </div>
    </div>
  );
};

export default GeminiResultModal;

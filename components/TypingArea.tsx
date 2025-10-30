import React, { useEffect, useRef } from 'react';
import type { TypingState, TypingActions } from '../types';
import { useTypingSounds } from '../hooks/useTypingSounds';

interface TypingAreaProps {
  state: TypingState;
  actions: TypingActions;
  soundEnabled: boolean;
}

const Character: React.FC<{
  char: string;
  state: 'correct' | 'incorrect' | 'untyped' | 'cursor';
}> = React.memo(({ char, state }) => {
  const baseClass = "transition-all duration-150";
  let stateClass = '';

  switch (state) {
    case 'correct':
      stateClass = 'text-slate-700 dark:text-slate-300';
      break;
    case 'incorrect':
      stateClass = 'text-red-500 dark:text-red-400';
      break;
    case 'untyped':
      stateClass = 'text-slate-400 dark:text-slate-500';
      break;
    case 'cursor':
      stateClass = 'text-teal-500 bg-teal-200/50 dark:bg-teal-700/50 rounded-sm animate-pulse';
      break;
  }
  return <span className={`${baseClass} ${stateClass}`}>{char}</span>;
});

const TypingArea: React.FC<TypingAreaProps> = ({ state, actions, soundEnabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { playKeySound, playErrorSound, playWordCompleteSound } = useTypingSounds();
  const { wordCompleted } = state;
  const { setWordCompleted } = actions;
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'Escape') {
        actions.resetGame();
        return;
      }
      if (e.key.length === 1 || e.key === 'Backspace') {
        if (soundEnabled && e.key.length === 1) { // Play sound for character keys only
          if (e.key === state.text[state.cursor]) {
            playKeySound();
          } else {
            playErrorSound();
          }
        }
        actions.handleKeyDown(e.key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, soundEnabled, playKeySound, playErrorSound, state.cursor, state.text]);

  useEffect(() => {
    if (wordCompleted) {
        if (soundEnabled) {
          playWordCompleteSound();
        }
        setTimeout(() => setWordCompleted(false), 1500); // match animation duration
    }
  }, [wordCompleted, setWordCompleted, soundEnabled, playWordCompleteSound]);

  return (
    <div className="relative w-full max-w-4xl mx-auto" onClick={() => inputRef.current?.focus()}>
       {wordCompleted && <div className="absolute -top-4 left-1/2 text-3xl animate-leafFloat">🌿</div>}
      <input ref={inputRef} type="text" className="absolute opacity-0 w-0 h-0" />
      <div className="text-2xl md:text-3xl font-mono p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-sm focus-within:ring-2 focus-within:ring-teal-500 transition-all duration-300 animate-fadeIn select-none leading-relaxed tracking-wide">
        {state.text.split('').map((char, index) => {
          let charState: 'correct' | 'incorrect' | 'untyped' | 'cursor' = 'untyped';
          if (index < state.cursor) {
            charState = state.typed[index] === char ? 'correct' : 'incorrect';
          } else if (index === state.cursor) {
            charState = 'cursor';
          }
          return <Character key={index} char={char} state={charState} />;
        })}
      </div>
      <div className="text-center mt-6">
        <button onClick={actions.resetGame} className="px-4 py-2 text-sm text-slate-500 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            Reset (Esc)
        </button>
      </div>
    </div>
  );
};

export default TypingArea;

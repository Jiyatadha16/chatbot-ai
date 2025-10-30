import { useState, useEffect, useCallback } from 'react';
import type { TypingState, TypingActions } from '../types';

const initialState = (text: string): TypingState => ({
  text,
  typed: '',
  cursor: 0,
  startTime: null,
  endTime: null,
  errors: 0,
  wpm: 0,
  accuracy: 100,
  streak: 0,
  status: 'idle',
  wordCompleted: false,
});

export const useTypingGame = (text: string): { state: TypingState, actions: TypingActions } => {
  const [state, setState] = useState<TypingState>(initialState(text));

  const calculateWPM = useCallback((startTime: number, cursor: number) => {
    const now = Date.now();
    const durationInMinutes = (now - startTime) / 60000;
    if (durationInMinutes === 0) return 0;
    const wordsTyped = (cursor / 5);
    return Math.round(wordsTyped / durationInMinutes);
  }, []);
  
  const calculateAccuracy = useCallback((cursor: number, errors: number) => {
    if (cursor === 0) return 100;
    return Math.round(((cursor - errors) / cursor) * 100);
  }, []);

  useEffect(() => {
    if (state.status === 'typing' && state.startTime) {
      const interval = setInterval(() => {
        setState(prevState => ({
          ...prevState,
          wpm: calculateWPM(prevState.startTime!, prevState.cursor),
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.status, state.startTime, calculateWPM]);

  const handleKeyDown = useCallback((key: string) => {
    setState(prevState => {
      if (prevState.status === 'finished') {
        return prevState;
      }

      let { typed, cursor, startTime, errors, streak, status, wordCompleted, endTime } = prevState;

      if (status === 'idle') {
        startTime = Date.now();
        status = 'typing';
      }

      if (key === 'Backspace') {
        if (cursor > 0) {
          typed = typed.slice(0, -1);
          cursor--;
        }
      } else if (key.length === 1) {
        if (text[cursor] === ' ' && typed.slice(-1) === ' ') {
            // Prevent typing multiple spaces
            return prevState;
        }

        const prevWord = text.slice(0, cursor).split(' ').pop() || '';
        const prevTypedWord = typed.split(' ').pop() || '';

        typed += key;
        cursor++;
        
        if (key !== text[cursor - 1]) {
          errors++;
          streak = 0;
        }

        if (key === ' ' && text[cursor - 1] === ' ') {
          if (prevWord === prevTypedWord) {
            streak++;
            wordCompleted = true;
          } else {
            streak = 0;
          }
        }
      }
      
      const wpm = startTime ? calculateWPM(startTime, cursor) : 0;
      const accuracy = calculateAccuracy(cursor, errors);
      
      if (cursor === text.length) {
        status = 'finished';
        endTime = Date.now();
        if (wpm === 0 && startTime) { // Final calculation
          const finalWPM = calculateWPM(startTime, cursor);
          return { ...prevState, typed, cursor, errors, streak, status, wpm: finalWPM, accuracy, endTime, wordCompleted };
        }
      }

      return { ...prevState, typed, cursor, startTime, errors, streak, status, wpm, accuracy, wordCompleted };
    });
  }, [text, calculateWPM, calculateAccuracy]);

  const setWordCompleted = useCallback((completed: boolean) => {
    setState(prevState => ({...prevState, wordCompleted: completed}));
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState(text));
  }, [text]);

  return { state, actions: { handleKeyDown, resetGame, setWordCompleted } };
};

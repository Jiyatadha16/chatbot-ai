import { useRef, useCallback } from 'react';

export const useTypingSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn("Web Audio API is not supported in this browser.");
        return;
      }
    }
    const context = audioContextRef.current;
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gainNode.gain.setValueAtTime(0.08, context.currentTime); // Lowered volume for subtlety

    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }, []);
  
  // Sound for a correct key press
  const playKeySound = useCallback(() => playSound(523.25, 0.1), [playSound]); // C5
  
  // Sound for an incorrect key press
  const playErrorSound = useCallback(() => playSound(261.63, 0.1, 'square'), [playSound]); // C4, square wave for distinction
  
  // Sound for completing a word correctly
  const playWordCompleteSound = useCallback(() => playSound(783.99, 0.15), [playSound]); // G5, slightly longer

  return { playKeySound, playErrorSound, playWordCompleteSound };
};

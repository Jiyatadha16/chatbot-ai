
import { useRef, useCallback } from 'react';

export const useTypingSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playKeySound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const context = audioContextRef.current;
    
    // Create a gentle, short tone
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, context.currentTime); // A4 note
    gainNode.gain.setValueAtTime(0.1, context.currentTime); // Quiet volume

    // Fade out quickly
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  }, []);

  return { playKeySound };
};

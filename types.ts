
export type Theme = 'light' | 'dark';

export interface TypingState {
  text: string;
  typed: string;
  cursor: number;
  startTime: number | null;
  endTime: number | null;
  errors: number;
  wpm: number;
  accuracy: number;
  streak: number;
  status: 'idle' | 'typing' | 'finished';
  wordCompleted: boolean;
}

export interface TypingActions {
  handleKeyDown: (key: string) => void;
  resetGame: () => void;
  setWordCompleted: (completed: boolean) => void;
}


import React, { useState, useEffect, useCallback } from 'react';
import TopBar from './components/TopBar';
import TypingArea from './components/TypingArea';
import StatsDisplay from './components/StatsDisplay';
import ParticleCanvas from './components/ParticleCanvas';
import GeminiResultModal from './components/GeminiResultModal';
import { useTypingGame } from './hooks/useTypingGame';
import { analyzeTextWithGemini } from './services/geminiService';
import { SAMPLE_TEXT } from './constants';
import type { Theme, TypingState } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [geminiMode, setGeminiMode] = useState(false);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);

  const { state, actions } = useTypingGame(SAMPLE_TEXT);
  const { wpm } = state;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const onGameEnd = useCallback(async (finalState: TypingState) => {
    if (geminiMode) {
      setIsGeminiLoading(true);
      try {
        const typedText = finalState.text.substring(0, finalState.cursor);
        const result = await analyzeTextWithGemini(typedText);
        setGeminiResult(result);
      } catch (error) {
        console.error("Gemini analysis failed:", error);
        setGeminiResult("Sorry, there was an error analyzing your text.");
      } finally {
        setIsGeminiLoading(false);
      }
    }
  }, [geminiMode]);

  useEffect(() => {
    if (state.status === 'finished') {
      onGameEnd(state);
    }
  }, [state, onGameEnd]);


  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4 selection:bg-teal-300 selection:text-teal-900">
      <ParticleCanvas wpm={wpm} />
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
        <TopBar
          theme={theme}
          onToggleTheme={handleToggleTheme}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(prev => !prev)}
          focusMode={focusMode}
          onToggleFocusMode={() => setFocusMode(prev => !prev)}
          geminiMode={geminiMode}
          onToggleGeminiMode={() => setGeminiMode(prev => !prev)}
          isUIVisible={!focusMode}
        />

        <main className="w-full flex-grow flex flex-col items-center justify-center transition-opacity duration-500" style={{ opacity: focusMode ? 0 : 1 }}>
          <StatsDisplay
            wpm={state.wpm}
            accuracy={state.accuracy}
            streak={state.streak}
          />
        </main>

        <div className="w-full flex items-center justify-center flex-grow">
            <TypingArea
              state={state}
              actions={actions}
              soundEnabled={soundEnabled}
            />
        </div>

        <footer className="w-full text-center p-4 mt-8 transition-opacity duration-500" style={{ opacity: focusMode ? 0 : 1 }}>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Typing Zen Garden - Find your flow.
          </p>
        </footer>
      </div>
      <GeminiResultModal
        isOpen={!!geminiResult}
        onClose={() => setGeminiResult(null)}
        result={geminiResult || ''}
        isLoading={isGeminiLoading}
      />
    </div>
  );
};

export default App;

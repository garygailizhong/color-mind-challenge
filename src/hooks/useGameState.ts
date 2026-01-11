import { useState, useCallback, useRef, useEffect } from 'react';
import {
  GameMode,
  GameColor,
  GameWord,
  QuestionResult,
  GameSession,
  GameStats,
  GAME_COLORS,
  NEUTRAL_WORDS,
  EMOTIONAL_WORDS,
  MODE_CONFIG,
} from '@/types/game';

type GamePhase = 'idle' | 'countdown' | 'playing' | 'result';

interface UseGameStateReturn {
  phase: GamePhase;
  mode: GameMode | null;
  currentQuestion: number;
  totalQuestions: number;
  currentWord: GameWord | null;
  timeLeft: number;
  score: number;
  combo: number;
  maxCombo: number;
  results: QuestionResult[];
  lastResult: 'correct' | 'wrong' | 'timeout' | null;
  
  setMode: (mode: GameMode) => void;
  startGame: () => void;
  selectColor: (color: GameColor) => void;
  resetGame: () => void;
  getStats: () => GameStats;
  getSession: () => GameSession;
}

const generateWord = (mode: GameMode): GameWord => {
  const config = MODE_CONFIG[mode];
  const useEmotional = config.useEmotionalWords && Math.random() > 0.3;
  
  let text: string;
  let isEmotional = false;
  let category: 'positive' | 'negative' | 'neutral' = 'neutral';
  
  if (useEmotional) {
    const isPositive = Math.random() > 0.5;
    const words = isPositive ? EMOTIONAL_WORDS.positive : EMOTIONAL_WORDS.negative;
    text = words[Math.floor(Math.random() * words.length)];
    isEmotional = true;
    category = isPositive ? 'positive' : 'negative';
  } else {
    text = NEUTRAL_WORDS[Math.floor(Math.random() * NEUTRAL_WORDS.length)];
  }
  
  // 确保显示颜色与文字颜色不同（Stroop效应）
  const displayColor = GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)];
  
  return { text, displayColor, isEmotional, category };
};

export const useGameState = (): UseGameStateReturn => {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [mode, setModeState] = useState<GameMode | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentWord, setCurrentWord] = useState<GameWord | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(0);
  const sessionIdRef = useRef<string>('');
  const startTimeRef = useRef<Date>(new Date());

  const totalQuestions = mode ? MODE_CONFIG[mode].totalQuestions : 20;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextQuestion = useCallback(() => {
    if (!mode) return;
    
    const config = MODE_CONFIG[mode];
    const newWord = generateWord(mode);
    setCurrentWord(newWord);
    setTimeLeft(config.timeLimit * 1000);
    questionStartTimeRef.current = Date.now();
    setLastResult(null);
    
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          // 超时
          clearTimer();
          handleTimeout();
          return 0;
        }
        return newTime;
      });
    }, 100);
  }, [mode, clearTimer]);

  const handleTimeout = useCallback(() => {
    if (!currentWord || !mode) return;
    
    const responseTime = MODE_CONFIG[mode].timeLimit * 1000;
    const result: QuestionResult = {
      word: currentWord,
      selectedColor: null,
      correctColor: currentWord.displayColor,
      isCorrect: false,
      responseTime,
      questionIndex: currentQuestion,
    };
    
    setResults((prev) => [...prev, result]);
    setCombo(0);
    setLastResult('timeout');
    
    setTimeout(() => {
      if (currentQuestion + 1 >= totalQuestions) {
        setPhase('result');
      } else {
        setCurrentQuestion((prev) => prev + 1);
      }
    }, 800);
  }, [currentWord, mode, currentQuestion, totalQuestions]);

  const setMode = useCallback((newMode: GameMode) => {
    setModeState(newMode);
    setPhase('idle');
  }, []);

  const startGame = useCallback(() => {
    if (!mode) return;
    
    sessionIdRef.current = Date.now().toString();
    startTimeRef.current = new Date();
    setPhase('countdown');
    setCurrentQuestion(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setResults([]);
    setLastResult(null);
    
    // 3秒倒计时后开始
    setTimeout(() => {
      setPhase('playing');
    }, 3000);
  }, [mode]);

  const selectColor = useCallback((color: GameColor) => {
    if (!currentWord || !mode || phase !== 'playing') return;
    
    clearTimer();
    const responseTime = Date.now() - questionStartTimeRef.current;
    const isCorrect = color === currentWord.displayColor;
    
    const result: QuestionResult = {
      word: currentWord,
      selectedColor: color,
      correctColor: currentWord.displayColor,
      isCorrect,
      responseTime,
      questionIndex: currentQuestion,
    };
    
    setResults((prev) => [...prev, result]);
    
    if (isCorrect) {
      setScore((prev) => prev + 100 + combo * 10);
      setCombo((prev) => {
        const newCombo = prev + 1;
        setMaxCombo((max) => Math.max(max, newCombo));
        return newCombo;
      });
      setLastResult('correct');
    } else {
      setCombo(0);
      setLastResult('wrong');
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 >= totalQuestions) {
        setPhase('result');
      } else {
        setCurrentQuestion((prev) => prev + 1);
      }
    }, 500);
  }, [currentWord, mode, phase, currentQuestion, totalQuestions, combo, clearTimer]);

  const resetGame = useCallback(() => {
    clearTimer();
    setPhase('idle');
    setModeState(null);
    setCurrentQuestion(0);
    setCurrentWord(null);
    setTimeLeft(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setResults([]);
    setLastResult(null);
  }, [clearTimer]);

  const getStats = useCallback((): GameStats => {
    const emotionalResults = results.filter((r) => r.word.isEmotional);
    const emotionalCorrect = emotionalResults.filter((r) => r.isCorrect).length;
    const totalCorrect = results.filter((r) => r.isCorrect).length;
    
    const emotionalErrorRate = emotionalResults.length > 0
      ? (emotionalResults.length - emotionalCorrect) / emotionalResults.length
      : 0;
    
    const correctRate = results.length > 0 ? totalCorrect / results.length : 0;
    const antiInterferenceIndex = correctRate / (emotionalErrorRate + 1) * 100;
    
    const avgResponseTime = results.length > 0
      ? results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
      : 0;
    
    // 计算敏感词
    const wordErrors: Record<string, { count: number; totalTime: number; appearances: number }> = {};
    results.forEach((r) => {
      if (r.word.isEmotional) {
        if (!wordErrors[r.word.text]) {
          wordErrors[r.word.text] = { count: 0, totalTime: 0, appearances: 0 };
        }
        wordErrors[r.word.text].appearances++;
        wordErrors[r.word.text].totalTime += r.responseTime;
        if (!r.isCorrect) {
          wordErrors[r.word.text].count++;
        }
      }
    });
    
    const sensitiveWords = Object.entries(wordErrors)
      .filter(([_, data]) => data.count > 0)
      .map(([word, data]) => ({
        word,
        errorCount: data.count,
        avgTime: data.totalTime / data.appearances,
      }))
      .sort((a, b) => b.errorCount - a.errorCount);
    
    return {
      totalCorrect,
      totalQuestions: results.length,
      correctRate: correctRate * 100,
      emotionalCorrect,
      emotionalTotal: emotionalResults.length,
      emotionalErrorRate: emotionalErrorRate * 100,
      averageResponseTime: avgResponseTime,
      antiInterferenceIndex,
      maxCombo,
      sensitiveWords,
    };
  }, [results, maxCombo]);

  const getSession = useCallback((): GameSession => {
    return {
      id: sessionIdRef.current,
      mode: mode || 'normal',
      startTime: startTimeRef.current,
      endTime: new Date(),
      results,
      totalQuestions: results.length,
      correctCount: results.filter((r) => r.isCorrect).length,
      comboMax: maxCombo,
    };
  }, [mode, results, maxCombo]);

  // 当问题改变时，生成新题目
  useEffect(() => {
    if (phase === 'playing' && mode) {
      nextQuestion();
    }
  }, [currentQuestion, phase, mode, nextQuestion]);

  // 清理定时器
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    phase,
    mode,
    currentQuestion,
    totalQuestions,
    currentWord,
    timeLeft,
    score,
    combo,
    maxCombo,
    results,
    lastResult,
    setMode,
    startGame,
    selectColor,
    resetGame,
    getStats,
    getSession,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { GameSession, GameHistory, GameStats } from '@/types/game';

const STORAGE_KEY = 'stroop-game-history';

const getInitialHistory = (): GameHistory => ({
  sessions: [],
  bestScore: 0,
  bestAntiInterferenceIndex: 0,
  totalGamesPlayed: 0,
});

export const useGameHistory = () => {
  const [history, setHistory] = useState<GameHistory>(getInitialHistory);

  // 从 localStorage 加载历史记录
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // 转换日期字符串为 Date 对象
        parsed.sessions = parsed.sessions.map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: s.endTime ? new Date(s.endTime) : undefined,
        }));
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load game history:', error);
    }
  }, []);

  // 保存历史记录到 localStorage
  const saveHistory = useCallback((newHistory: GameHistory) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save game history:', error);
    }
  }, []);

  // 添加新的游戏记录
  const addSession = useCallback((session: GameSession, stats: GameStats) => {
    setHistory((prev) => {
      const score = session.correctCount * 100;
      const newHistory: GameHistory = {
        sessions: [session, ...prev.sessions].slice(0, 50), // 只保留最近50场
        bestScore: Math.max(prev.bestScore, score),
        bestAntiInterferenceIndex: Math.max(prev.bestAntiInterferenceIndex, stats.antiInterferenceIndex),
        totalGamesPlayed: prev.totalGamesPlayed + 1,
      };
      saveHistory(newHistory);
      return newHistory;
    });
  }, [saveHistory]);

  // 清除所有历史记录
  const clearHistory = useCallback(() => {
    const emptyHistory = getInitialHistory();
    saveHistory(emptyHistory);
  }, [saveHistory]);

  // 获取最近的游戏记录
  const getRecentSessions = useCallback((count: number = 10) => {
    return history.sessions.slice(0, count);
  }, [history.sessions]);

  // 获取进步趋势数据
  const getProgressTrend = useCallback(() => {
    return history.sessions
      .slice(0, 10)
      .reverse()
      .map((session, index) => ({
        game: index + 1,
        score: session.correctCount * 100,
        correctRate: (session.correctCount / session.totalQuestions) * 100,
      }));
  }, [history.sessions]);

  return {
    history,
    addSession,
    clearHistory,
    getRecentSessions,
    getProgressTrend,
  };
};

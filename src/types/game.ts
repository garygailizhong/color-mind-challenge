export type GameMode = 'normal' | 'stress' | 'extreme';

export type GameColor = 'red' | 'blue' | 'green' | 'yellow';

export interface GameWord {
  text: string;
  displayColor: GameColor;
  isEmotional: boolean;
  category?: 'positive' | 'negative' | 'neutral';
}

export interface QuestionResult {
  word: GameWord;
  selectedColor: GameColor | null;
  correctColor: GameColor;
  isCorrect: boolean;
  responseTime: number; // 毫秒
  questionIndex: number;
}

export interface GameSession {
  id: string;
  mode: GameMode;
  startTime: Date;
  endTime?: Date;
  results: QuestionResult[];
  totalQuestions: number;
  correctCount: number;
  comboMax: number;
}

export interface GameStats {
  totalCorrect: number;
  totalQuestions: number;
  correctRate: number;
  emotionalCorrect: number;
  emotionalTotal: number;
  emotionalErrorRate: number;
  averageResponseTime: number;
  antiInterferenceIndex: number;
  maxCombo: number;
  sensitiveWords: { word: string; errorCount: number; avgTime: number }[];
}

export interface GameHistory {
  sessions: GameSession[];
  bestScore: number;
  bestAntiInterferenceIndex: number;
  totalGamesPlayed: number;
}

export interface PsychReport {
  overallScore: number;
  antiInterferenceIndex: number;
  responseSpeed: 'fast' | 'medium' | 'slow';
  emotionalStability: 'high' | 'medium' | 'low';
  sensitiveAreas: string[];
  suggestions: string[];
  funnyComment: string;
  radarData: {
    speed: number;
    accuracy: number;
    stability: number;
    focus: number;
    resilience: number;
  };
}

export const GAME_COLORS: GameColor[] = ['red', 'blue', 'green', 'yellow'];

export const COLOR_NAMES: Record<GameColor, string> = {
  red: '红',
  blue: '蓝',
  green: '绿',
  yellow: '黄',
};

export const COLOR_HEX: Record<GameColor, string> = {
  red: 'hsl(0, 80%, 55%)',
  blue: 'hsl(210, 90%, 55%)',
  green: 'hsl(140, 70%, 45%)',
  yellow: 'hsl(45, 100%, 50%)',
};

// 中性词库
export const NEUTRAL_WORDS = [
  '桌子', '椅子', '天空', '大地', '苹果', '香蕉', '书本', '铅笔',
  '窗户', '门口', '花朵', '树叶', '河流', '山峰', '太阳', '月亮',
  '星星', '云朵', '石头', '草地', '鱼儿', '鸟儿', '房子', '道路',
];

// 情绪词库
export const EMOTIONAL_WORDS = {
  positive: ['成功', '胜利', '快乐', '幸福', '优秀', '完美', '棒极了', '厉害'],
  negative: ['失败', '错误', '焦虑', '紧张', '糟糕', '可怕', '危险', '压力'],
};

// 模式配置
export const MODE_CONFIG: Record<GameMode, {
  name: string;
  emoji: string;
  description: string;
  timeLimit: number; // 秒
  totalQuestions: number;
  useEmotionalWords: boolean;
  hasFlashEffect: boolean;
  color: string;
}> = {
  normal: {
    name: '普通模式',
    emoji: '🌿',
    description: '轻松热身，使用中性词汇',
    timeLimit: 5,
    totalQuestions: 20,
    useEmotionalWords: false,
    hasFlashEffect: false,
    color: 'mode-normal',
  },
  stress: {
    name: '压力模式',
    emoji: '😰',
    description: '情绪词干扰，考验专注力',
    timeLimit: 4,
    totalQuestions: 20,
    useEmotionalWords: true,
    hasFlashEffect: false,
    color: 'mode-stress',
  },
  extreme: {
    name: '极限模式',
    emoji: '🔥',
    description: '背景闪烁+情绪词，终极挑战',
    timeLimit: 3,
    totalQuestions: 20,
    useEmotionalWords: true,
    hasFlashEffect: true,
    color: 'mode-extreme',
  },
};

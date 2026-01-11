import { useCallback } from 'react';
import { GameStats, PsychReport } from '@/types/game';

const FUNNY_COMMENTS = {
  high: [
    '你的大脑像是装了防火墙，情绪干扰对你来说就是小菜一碟！🧠✨',
    '心理学家看了都说强！你是天生的抗压小能手！💪',
    '你的专注力堪比激光，情绪词对你毫无影响！🎯',
  ],
  medium: [
    '你的心理素质还不错，偶尔被情绪词绊一下也是人之常情～😊',
    '表现良好！继续练习，你离心理大师不远了！🌟',
    '情绪有时会给你使绊子，但你总能站稳脚跟！⚡',
  ],
  low: [
    '情绪词是你的克星？没关系，承认自己是人类也很重要～😄',
    '你的心可能比较柔软，这不是缺点，是特点！💖',
    '建议：下次遇到"失败"这个词，心里默念"假的假的"～🙈',
  ],
};

const SUGGESTIONS = {
  speed: {
    fast: '反应速度很快！继续保持这种敏锐度。',
    medium: '反应速度适中，可以尝试提高专注度来加快反应。',
    slow: '建议多做一些快速反应训练，提升信息处理速度。',
  },
  accuracy: {
    high: '准确率非常高！你的判断力很棒。',
    medium: '准确率还可以，建议放慢一点确保看清颜色。',
    low: '多注意观察文字的颜色而非内容，这需要练习。',
  },
  emotional: {
    stable: '面对情绪词时表现稳定，心理韧性很强。',
    affected: '情绪词对你有一定影响，这很正常，多练习会改善。',
    sensitive: '对情绪词比较敏感，建议在日常生活中多练习情绪觉察。',
  },
};

export const usePsychReport = () => {
  const generateReport = useCallback((stats: GameStats): PsychReport => {
    // 计算各维度分数 (0-100)
    const speedScore = Math.max(0, Math.min(100, 100 - (stats.averageResponseTime - 500) / 30));
    const accuracyScore = stats.correctRate;
    const stabilityScore = 100 - stats.emotionalErrorRate;
    const focusScore = Math.min(100, (stats.maxCombo / 10) * 100);
    const resilienceScore = stats.antiInterferenceIndex;

    // 综合评分
    const overallScore = Math.round(
      speedScore * 0.15 +
      accuracyScore * 0.3 +
      stabilityScore * 0.25 +
      focusScore * 0.15 +
      resilienceScore * 0.15
    );

    // 判断各维度等级
    const responseSpeed: 'fast' | 'medium' | 'slow' = 
      stats.averageResponseTime < 1000 ? 'fast' :
      stats.averageResponseTime < 2000 ? 'medium' : 'slow';

    const emotionalStability: 'high' | 'medium' | 'low' =
      stats.emotionalErrorRate < 20 ? 'high' :
      stats.emotionalErrorRate < 40 ? 'medium' : 'low';

    // 敏感领域分析
    const sensitiveAreas = stats.sensitiveWords
      .slice(0, 3)
      .map(w => `"${w.word}"`);

    // 生成建议
    const suggestions: string[] = [];
    suggestions.push(SUGGESTIONS.speed[responseSpeed]);
    suggestions.push(SUGGESTIONS.accuracy[
      stats.correctRate > 80 ? 'high' : stats.correctRate > 60 ? 'medium' : 'low'
    ]);
    suggestions.push(SUGGESTIONS.emotional[
      stats.emotionalErrorRate < 20 ? 'stable' :
      stats.emotionalErrorRate < 40 ? 'affected' : 'sensitive'
    ]);

    // 趣味评语
    const commentLevel = overallScore > 70 ? 'high' : overallScore > 40 ? 'medium' : 'low';
    const comments = FUNNY_COMMENTS[commentLevel];
    const funnyComment = comments[Math.floor(Math.random() * comments.length)];

    return {
      overallScore,
      antiInterferenceIndex: Math.round(stats.antiInterferenceIndex),
      responseSpeed,
      emotionalStability,
      sensitiveAreas,
      suggestions,
      funnyComment,
      radarData: {
        speed: Math.round(speedScore),
        accuracy: Math.round(accuracyScore),
        stability: Math.round(stabilityScore),
        focus: Math.round(focusScore),
        resilience: Math.round(resilienceScore),
      },
    };
  }, []);

  return { generateReport };
};

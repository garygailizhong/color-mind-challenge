import { forwardRef } from 'react';
import { PsychReport, GameMode, MODE_CONFIG } from '@/types/game';
import { RadarChart } from './RadarChart';

interface ReportCardProps {
  report: PsychReport;
  mode: GameMode;
}

export const ReportCard = forwardRef<HTMLDivElement, ReportCardProps>(
  ({ report, mode }, ref) => {
    const modeConfig = MODE_CONFIG[mode];

    return (
      <div
        ref={ref}
        className="w-full max-w-md mx-auto bg-gradient-to-br from-primary/5 via-background to-accent/10 p-6 rounded-3xl border-2 border-primary/20"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* 头部 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary">🧠 心理韧性报告</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {modeConfig.emoji} {modeConfig.name} · 仅供娱乐
          </p>
        </div>

        {/* 综合评分 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-4 border-primary">
            <span className="text-3xl font-bold text-primary">
              {report.overallScore}
            </span>
          </div>
          <p className="mt-2 text-lg font-medium">综合评分</p>
        </div>

        {/* 雷达图 */}
        <div className="mb-6">
          <RadarChart data={report.radarData} />
        </div>

        {/* 关键指标 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-card rounded-xl">
            <p className="text-2xl font-bold text-primary">
              {report.antiInterferenceIndex}
            </p>
            <p className="text-xs text-muted-foreground">抗干扰指数</p>
          </div>
          <div className="text-center p-3 bg-card rounded-xl">
            <p className="text-2xl font-bold">
              {report.responseSpeed === 'fast' ? '⚡快' : 
               report.responseSpeed === 'medium' ? '🚶中' : '🐢慢'}
            </p>
            <p className="text-xs text-muted-foreground">反应速度</p>
          </div>
        </div>

        {/* 敏感词分析 */}
        {report.sensitiveAreas.length > 0 && (
          <div className="mb-6 p-4 bg-destructive/10 rounded-xl">
            <p className="text-sm font-medium mb-2">⚠️ 敏感词汇</p>
            <p className="text-sm text-muted-foreground">
              你对 {report.sensitiveAreas.join('、')} 等词汇反应较慢
            </p>
          </div>
        )}

        {/* 趣味评语 */}
        <div className="mb-6 p-4 bg-accent/20 rounded-xl">
          <p className="text-sm">{report.funnyComment}</p>
        </div>

        {/* 底部 */}
        <div className="text-center text-xs text-muted-foreground">
          <p>颜色反应 · 情绪干扰</p>
          <p>本报告仅供娱乐，不作为专业心理评估依据</p>
        </div>
      </div>
    );
  }
);

ReportCard.displayName = 'ReportCard';

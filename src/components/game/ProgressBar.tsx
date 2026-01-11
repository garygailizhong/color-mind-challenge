import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  timeLeft: number;
  maxTime: number;
}

export const ProgressBar = ({ current, total, timeLeft, maxTime }: ProgressBarProps) => {
  const questionProgress = ((current + 1) / total) * 100;
  const timeProgress = (timeLeft / maxTime) * 100;

  return (
    <div className="w-full space-y-3">
      {/* 题目进度 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground w-16">进度</span>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${questionProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm font-medium w-16 text-right">
          {current + 1}/{total}
        </span>
      </div>

      {/* 时间进度 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground w-16">时间</span>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors duration-300 ${
              timeProgress > 60 ? 'bg-mode-normal' :
              timeProgress > 30 ? 'bg-mode-stress' : 'bg-mode-extreme'
            }`}
            style={{ width: `${timeProgress}%` }}
          />
        </div>
        <span className="text-sm font-medium w-16 text-right">
          {(timeLeft / 1000).toFixed(1)}s
        </span>
      </div>
    </div>
  );
};

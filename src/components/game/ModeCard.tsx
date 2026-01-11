import { motion } from 'framer-motion';
import { GameMode, MODE_CONFIG } from '@/types/game';
import { cn } from '@/lib/utils';

interface ModeCardProps {
  mode: GameMode;
  selected?: boolean;
  onClick: () => void;
}

const modeColors: Record<GameMode, string> = {
  normal: 'border-mode-normal hover:bg-mode-normal/10',
  stress: 'border-mode-stress hover:bg-mode-stress/10',
  extreme: 'border-mode-extreme hover:bg-mode-extreme/10',
};

const selectedColors: Record<GameMode, string> = {
  normal: 'bg-mode-normal/20 border-mode-normal',
  stress: 'bg-mode-stress/20 border-mode-stress',
  extreme: 'bg-mode-extreme/20 border-mode-extreme',
};

export const ModeCard = ({ mode, selected, onClick }: ModeCardProps) => {
  const config = MODE_CONFIG[mode];

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'w-full p-5 rounded-2xl border-2 text-left transition-all duration-200',
        'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50',
        selected ? selectedColors[mode] : modeColors[mode]
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{config.emoji}</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold">{config.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
          <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
            <span>⏱️ {config.timeLimit}秒/题</span>
            <span>📝 {config.totalQuestions}题</span>
            {config.hasFlashEffect && <span>⚡ 闪烁效果</span>}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

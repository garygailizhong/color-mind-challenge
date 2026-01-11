import { motion } from 'framer-motion';
import { GameColor, COLOR_NAMES } from '@/types/game';
import { cn } from '@/lib/utils';

interface ColorButtonProps {
  color: GameColor;
  onClick: () => void;
  disabled?: boolean;
  showCombo?: boolean;
}

const colorClasses: Record<GameColor, string> = {
  red: 'game-btn-red',
  blue: 'game-btn-blue',
  green: 'game-btn-green',
  yellow: 'game-btn-yellow',
};

export const ColorButton = ({ color, onClick, disabled, showCombo }: ColorButtonProps) => {
  return (
    <motion.button
      className={cn(
        'w-16 h-16 md:w-20 md:h-20 rounded-2xl font-bold text-lg md:text-xl',
        'shadow-lg transition-all duration-150',
        'focus:outline-none focus:ring-4 focus:ring-primary/30',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        colorClasses[color],
        showCombo && 'combo-glow'
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
    >
      {COLOR_NAMES[color]}
    </motion.button>
  );
};

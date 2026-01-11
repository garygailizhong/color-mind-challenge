import { motion, AnimatePresence } from 'framer-motion';
import { GameWord, COLOR_HEX } from '@/types/game';
import { cn } from '@/lib/utils';

interface WordDisplayProps {
  word: GameWord | null;
  lastResult: 'correct' | 'wrong' | 'timeout' | null;
  isFlashing?: boolean;
}

export const WordDisplay = ({ word, lastResult, isFlashing }: WordDisplayProps) => {
  if (!word) return null;

  return (
    <div className={cn(
      'relative flex items-center justify-center h-40 md:h-52 rounded-3xl transition-all duration-300',
      isFlashing && 'flash-bg',
      lastResult === 'wrong' && 'shake'
    )}>
      <AnimatePresence mode="wait">
        <motion.div
          key={word.text + word.displayColor}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative"
        >
          <span
            className="text-6xl md:text-8xl font-bold"
            style={{ color: COLOR_HEX[word.displayColor] }}
          >
            {word.text}
          </span>
          
          {/* 正确/错误反馈 */}
          <AnimatePresence>
            {lastResult && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -right-8 -top-8"
              >
                {lastResult === 'correct' && (
                  <span className="text-4xl">👍</span>
                )}
                {lastResult === 'wrong' && (
                  <span className="text-4xl">😅</span>
                )}
                {lastResult === 'timeout' && (
                  <span className="text-4xl">⏰</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

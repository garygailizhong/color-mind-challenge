import { motion, AnimatePresence } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  combo: number;
}

export const ScoreDisplay = ({ score, combo }: ScoreDisplayProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">得分</span>
        <motion.span
          key={score}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-primary"
        >
          {score}
        </motion.span>
      </div>

      <AnimatePresence>
        {combo > 1 && (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1 px-4 py-2 bg-accent rounded-full"
          >
            <span className="text-xl">🔥</span>
            <span className="font-bold text-accent-foreground">
              {combo}连击!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-end">
        <span className="text-sm text-muted-foreground">最高连击</span>
        <span className="text-lg font-medium">{combo > 0 ? combo : '-'}</span>
      </div>
    </div>
  );
};

import { motion } from 'framer-motion';

export const GameLogo = () => {
  const colors = ['text-game-red', 'text-game-blue', 'text-game-green', 'text-game-yellow'];
  const letters = '颜色反应';

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div 
        className="flex gap-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {letters.split('').map((letter, index) => (
          <motion.span
            key={index}
            className={`text-4xl md:text-5xl font-bold ${colors[index % colors.length]}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.2, rotate: [-5, 5, 0] }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
      <motion.div
        className="text-xl md:text-2xl text-primary font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        · 情绪干扰 ·
      </motion.div>
      <motion.p
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Stroop心理测试 × 趣味挑战
      </motion.p>
    </div>
  );
};

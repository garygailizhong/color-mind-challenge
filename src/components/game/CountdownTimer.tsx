import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  onComplete: () => void;
}

export const CountdownTimer = ({ onComplete }: CountdownTimerProps) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <motion.div
        key={count}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 2, opacity: 0 }}
        className="text-9xl font-bold text-primary"
      >
        {count === 0 ? '开始!' : count}
      </motion.div>
    </div>
  );
};

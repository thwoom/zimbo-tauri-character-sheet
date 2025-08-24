import { motion } from 'framer-motion';
import React from 'react';

interface DiceProps {
  isRolling: boolean;
  onRollComplete?: (_result: number) => void;
}

const Dice3D: React.FC<DiceProps> = ({ isRolling, onRollComplete }) => {
  return (
    <div className="w-32 h-32 flex items-center justify-center">
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-lg shadow-lg border-2 border-gray-300 flex items-center justify-center text-2xl font-bold"
        animate={
          isRolling
            ? {
                rotateX: [0, 360, 720],
                rotateY: [0, 360, 720],
                scale: [1, 1.1, 1],
              }
            : {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
              }
        }
        transition={{
          duration: 2,
          ease: 'easeInOut',
          times: [0, 0.8, 1],
        }}
        onAnimationComplete={() => {
          if (isRolling && onRollComplete) {
            setTimeout(() => {
              onRollComplete(Math.floor(Math.random() * 6) + 1);
            }, 500);
          }
        }}
      >
        {'?'}
      </motion.div>
    </div>
  );
};

export default Dice3D;

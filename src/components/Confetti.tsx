
import React, { useEffect, useState } from 'react';
import type { ConfettiPiece } from './../../types';

const COLORS = ['#F472B6', '#EC4899', '#DB2777', '#FDF2F8', '#FB7185'];

export const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 10 + Math.random() * 20,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
          .confetti-heart {
            animation: fall var(--duration) linear var(--delay) infinite;
          }
        `}
      </style>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-heart absolute top-0"
          style={{
            left: `${p.x}%`,
            color: p.color,
            fontSize: `${p.size}px`,
            ['--duration' as any]: `${p.duration}s`,
            ['--delay' as any]: `${p.delay}s`,
          }}
        >
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

import confetti from 'canvas-confetti';

/**
 * Explosive festive celebration with multi-bursts, streamers, and stars
 * Designed for reaching or beating the daily driver goal.
 */
export function triggerCelebration() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // 1. Initial sparkling emerald and blue burst
  fire(0.25, {
    spread: 30,
    startVelocity: 55,
    colors: ['#10B981', '#34D399', '#059669', '#3B82F6', '#60A5FA', '#F59E0B'],
  });

  // 2. Wide spread with ribbons
  fire(0.2, {
    spread: 65,
    colors: ['#FBBF24', '#F43F5E', '#10B981', '#6366F1', '#EC4899'],
  });

  // 3. High velocity core
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1.2,
    colors: ['#10B981', '#3B82F6', '#F59E0B', '#FFFFFF'],
  });

  // 4. Slow floating stars/circles
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.4,
    shapes: ['circle', 'star'],
    colors: ['#FFD700', '#10B981', '#38BDF8'],
  });

  // 5. Side cannons for mobile screen width
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#10B981', '#3B82F6', '#F59E0B'],
      zIndex: 9999,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#10B981', '#3B82F6', '#F59E0B'],
      zIndex: 9999,
    });
  }, 250);
}

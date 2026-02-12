import confetti from "canvas-confetti";

// Play a celebration chime using Web Audio API
export function playCelebrationSound() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Play a bright ascending chime
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.4);
    });
  } catch {
    // Audio not supported, fail silently
  }
}

// Fire confetti burst
export function fireCelebration() {
  playCelebrationSound();

  // Main burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#fbbf24", "#34d399", "#60a5fa"],
    disableForReducedMotion: true,
  });

  // Side bursts
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ["#8b5cf6", "#fbbf24", "#34d399"],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#a78bfa", "#60a5fa", "#c4b5fd"],
      disableForReducedMotion: true,
    });
  }, 150);
}

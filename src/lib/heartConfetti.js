import confetti from "canvas-confetti";

export function launchHeartConfetti() {
  const heartShape = confetti.shapeFromPath({
    path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  });

  const duration = 3500;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      shapes: [heartShape],
      colors: ["#ff4d6d", "#ff758f", "#c9184a", "#ffb3c1", "#ffccd5"],
      scalar: 2,
      ticks: 200,
      gravity: 0.7,
      drift: 0.1,
    });

    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      shapes: [heartShape],
      colors: ["#ff4d6d", "#ff758f", "#c9184a", "#ffb3c1", "#ffccd5"],
      scalar: 2,
      ticks: 200,
      gravity: 0.7,
      drift: -0.1,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

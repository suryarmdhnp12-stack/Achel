"use client";

import React, { useState, useRef, useEffect } from "react";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      window.removeEventListener("pointerdown", unlockAudio);
    };

    window.addEventListener("pointerdown", unlockAudio);
    return () => window.removeEventListener("pointerdown", unlockAudio);
  }, [isPlaying]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3"
        loop
        preload="auto"
      />
      <button
        onClick={toggleMusic}
        type="button"
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md border border-rose-200 rounded-full shadow-md text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
      >
        <span>{isPlaying ? "🎵" : "🔇"}</span>
        <span>{isPlaying ? "Musik: Aktif" : "Putar Musik"}</span>
      </button>
    </>
  );
}

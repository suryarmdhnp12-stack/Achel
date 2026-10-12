"use client";

import React, { useState, useRef } from "react";

export default function PuzzlePhotoUploader({ grid = 3, boardSize = 360, onReadyToPlay }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const processAndStartGame = () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = previewUrl;

    img.onload = () => {
      const pieceSize = boardSize / grid;
      const pieces = [];
      let idCounter = 0;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = pieceSize;
      canvas.height = pieceSize;

      const minDimension = Math.min(img.width, img.height);
      const srcPieceSize = minDimension / grid;
      const srcOffsetX = (img.width - minDimension) / 2;
      const srcOffsetY = (img.height - minDimension) / 2;

      for (let r = 0; r < grid; r++) {
        for (let c = 0; c < grid; c++) {
          ctx.clearRect(0, 0, pieceSize, pieceSize);

          ctx.drawImage(
            img,
            srcOffsetX + c * srcPieceSize,
            srcOffsetY + r * srcPieceSize,
            srcPieceSize,
            srcPieceSize,
            0,
            0,
            pieceSize,
            pieceSize
          );

          const targetX = c * pieceSize;
          const targetY = r * pieceSize;

          const randomX = Math.floor(Math.random() * (boardSize - pieceSize));
          const randomY = Math.floor(Math.random() * (boardSize - pieceSize));

          pieces.push({
            id: idCounter++,
            row: r,
            col: c,
            imageClipUrl: canvas.toDataURL("image/jpeg", 0.85),
            targetX,
            targetY,
            currentX: randomX,
            currentY: randomY,
            isLocked: false,
          });
        }
      }

      setIsProcessing(false);
      if (onReadyToPlay) {
        onReadyToPlay({ pieces, fullImageUrl: previewUrl });
      }
    };
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
      <h2 className="text-lg font-bold text-slate-800 mb-1">Pilih Foto Kejutan</h2>
      <p className="text-xs text-slate-500 mb-5 text-center">
        Pilih foto kalian berdua. Sistem akan memotongnya otomatis menjadi {grid * grid} kepingan.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative mb-5 flex flex-col items-center">
          <div className="w-60 h-60 rounded-xl overflow-hidden shadow-inner border border-slate-200 relative">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0 grid pointer-events-none"
              style={{
                gridTemplateColumns: `repeat(${grid}, 1fr)`,
                gridTemplateRows: `repeat(${grid}, 1fr)`,
              }}
            >
              {Array.from({ length: grid * grid }).map((_, idx) => (
                <div key={idx} className="border border-white/40 border-dashed" />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
          >
            Pilih foto lain
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-56 border-2 border-dashed border-slate-300 hover:border-rose-400 bg-slate-50 rounded-xl flex flex-col items-center justify-center p-4 transition mb-5"
        >
          <span className="text-2xl mb-2">📸</span>
          <span className="text-sm font-semibold text-slate-700">Sentuh untuk pilih foto</span>
        </button>
      )}

      <button
        type="button"
        disabled={!previewUrl || isProcessing}
        onClick={processAndStartGame}
        className={`w-full py-3 rounded-xl font-semibold text-xs transition ${
          previewUrl && !isProcessing
            ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        {isProcessing ? "Menyiapkan Kepingan..." : "Mulai Mainkan"}
      </button>
    </div>
  );
}

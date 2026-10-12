"use client";

import React, { useState, useRef } from "react";
import { playSnapSound, playVictoryChime } from "@/lib/soundEffects";
import { launchHeartConfetti } from "@/lib/heartConfetti";

export default function PuzzleGame({
  piecesData = [],
  boardSize = 360,
  grid = 3,
  fullImageUrl = "",
  onPieceMoved,
}) {
  const [pieces, setPieces] = useState(piecesData);
  const [activeDragId, setActiveDragId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCompleted, setIsCompleted] = useState(false);
  const boardRef = useRef(null);

  const pieceSize = boardSize / grid;
  const snapThreshold = 25;

  const handlePointerDown = (e, piece) => {
    if (piece.isLocked) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const touchX = e.clientX - boardRect.left;
    const touchY = e.clientY - boardRect.top;

    setActiveDragId(piece.id);
    setDragOffset({
      x: touchX - piece.currentX,
      y: touchY - piece.currentY,
    });

    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (activeDragId === null) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - boardRect.left;
    const mouseY = e.clientY - boardRect.top;

    let newX = mouseX - dragOffset.x;
    let newY = mouseY - dragOffset.y;

    newX = Math.max(0, Math.min(newX, boardSize - pieceSize));
    newY = Math.max(0, Math.min(newY, boardSize - pieceSize));

    setPieces((prev) =>
      prev.map((p) =>
        p.id === activeDragId ? { ...p, currentX: newX, currentY: newY } : p
      )
    );
  };

  const handlePointerUp = (e) => {
    if (activeDragId === null) return;

    let pieceSnapped = false;
    let movedPiece = null;

    const updatedPieces = pieces.map((piece) => {
      if (piece.id !== activeDragId) return piece;

      const diffX = Math.abs(piece.currentX - piece.targetX);
      const diffY = Math.abs(piece.currentY - piece.targetY);

      if (diffX < snapThreshold && diffY < snapThreshold) {
        pieceSnapped = true;
        movedPiece = {
          ...piece,
          currentX: piece.targetX,
          currentY: piece.targetY,
          isLocked: true,
        };
        return movedPiece;
      }

      movedPiece = piece;
      return piece;
    });

    if (pieceSnapped) {
      playSnapSound();
    }

    setPieces(updatedPieces);
    setActiveDragId(null);

    if (onPieceMoved && movedPiece) {
      onPieceMoved(movedPiece);
    }

    const completed = updatedPieces.every((p) => p.isLocked);
    if (completed && !isCompleted) {
      setIsCompleted(true);
      playVictoryChime();
      launchHeartConfetti();
    }
  };

  return (
    <div className="flex flex-col items-center select-none p-2 w-full">
      <div
        ref={boardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ width: boardSize, height: boardSize }}
        className="relative bg-slate-100 border-2 border-slate-300 rounded-xl overflow-hidden shadow-inner touch-none mx-auto"
      >
        <div
          className="absolute inset-0 grid pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${grid}, 1fr)`,
            gridTemplateRows: `repeat(${grid}, 1fr)`,
          }}
        >
          {Array.from({ length: grid * grid }).map((_, idx) => (
            <div key={idx} className="border border-slate-200/80 border-dashed" />
          ))}
        </div>

        {pieces.map((piece) => {
          const isDragging = piece.id === activeDragId;

          return (
            <div
              key={piece.id}
              onPointerDown={(e) => handlePointerDown(e, piece)}
              style={{
                width: pieceSize,
                height: pieceSize,
                transform: `translate3d(${piece.currentX}px, ${piece.currentY}px, 0)`,
                backgroundImage: `url(${piece.imageClipUrl})`,
                backgroundSize: "cover",
                zIndex: isDragging ? 50 : piece.isLocked ? 1 : 10,
                cursor: piece.isLocked ? "default" : isDragging ? "grabbing" : "grab",
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
              className={`absolute top-0 left-0 rounded-sm ${
                piece.isLocked
                  ? "border-none shadow-none"
                  : isDragging
                  ? "shadow-2xl scale-105 ring-2 ring-rose-400"
                  : "shadow-md"
              }`}
            />
          );
        })}
      </div>

      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-rose-100 flex flex-col items-center">
            <span className="text-4xl mb-2 animate-bounce">💖</span>
            <h3 className="text-xl font-bold text-slate-800">Kenangan Kita Utuh!</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Terima kasih sudah menyatukan setiap kepingan ini bareng aku.
            </p>

            <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-md mb-6 border-2 border-rose-200">
              <img
                src={fullImageUrl || pieces[0]?.imageClipUrl}
                alt="Foto Utuh"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition shadow-md shadow-rose-200"
            >
              Mainkan Sekali Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

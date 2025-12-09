"use client";

import { useState, useRef } from "react";

export default function SongResultCard({ song, onAdd }) {
  //States for the audio Preview
  const [currentPreviewId, setCurrentPreviewId] = useState(null);
  const audioRef = useRef(null);

  //Function to handle play and pause of audio preview
  //Function to handle playing preview
  const handlePlayPreview = (song) => {
    const audio = audioRef.current; //Get audio element
    if (!audio) return;

    if (currentPreviewId === song.id) {
      //If the same song is clicked, pause it
      audio.pause();
      setCurrentPreviewId(null);
      return;
    }

    //Othwerwise, play the new song
    audio.src = song.previewUrl;
    audio.play();
    setCurrentPreviewId(song.id);
  };

  return (
    <div className="flex gap-4 bg-black/40 border border-white/10 rounded-xl p-3 hover:bg-black/60 transition">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={song.artwork}
          alt={`${song.title} cover`}
          className="object-cover h-full w-full"
        />
      </div>
      <audio ref={audioRef} className="hidden" />{" "}
      {/* Hidden audio element for previews */}
      <div className="flex flex-col justify-center overflow-hidden flex-1">
        <p className="text-sm font-semibold text-white truncate">
          {song.title}
        </p>
        <p className="text-xs text-slate-300 truncate">{song.artist}</p>
        <p className="text-xs text-slate-400 truncate">{song.album}</p>
      </div>
      {/* Preview button */}
      {song.previewUrl && (
        <button
          type="button"
          onClick={() => handlePlayPreview(song)}
          className="self-center px-3 py-1 text-[#FA8128] border border-[#FA8128] bg-black rounded-md hover:bg-gray-800 text-xs font-bold transition">
          {currentPreviewId === song.id ? "Pause preview" : "Play preview"}
        </button>
      )}
      {onAdd && (
        <button
          onClick={() => onAdd(song)}
          className="self-center px-3 py-1 bg-[#FA8128] text-black rounded-md hover:bg-[#ff9b47] text-xs font-bold">
          Add
        </button>
      )}
    </div>
  );
}

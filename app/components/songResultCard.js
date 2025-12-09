"use client";

export default function SongResultCard({ song, onAdd, onPreview, isPlaying }) {
  return (
    <div className="flex gap-4 bg-black/40 border border-white/10 rounded-xl p-3 hover:bg-black/60 transition">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={song.artwork}
          alt={`${song.title} cover`}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="flex flex-col justify-center overflow-hidden flex-1">
        <p className="text-sm font-semibold text-white truncate">
          {song.title}
        </p>
        <p className="text-xs text-slate-300 truncate">{song.artist}</p>
        <p className="text-xs text-slate-400 truncate">{song.album}</p>
      </div>
      {/* Preview button */}
      {song.previewUrl && onPreview && (
        <button
          type="button"
          onClick={() => onPreview(song)}
          className="self-center px-3 py-1 text-[#FA8128] border border-[#FA8128] bg-black rounded-md hover:bg-gray-800 text-xs font-bold transition">
          {isPlaying ? "Pause preview" : "Play preview"}
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

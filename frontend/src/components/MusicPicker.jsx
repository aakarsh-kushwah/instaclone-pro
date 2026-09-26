import { useState } from 'react';

const presets = [
  { id: 1, name: 'Ambient', artist: 'Relaxing Beats', url: 'https://example.com/audio/ambient.mp3' },
  { id: 2, name: 'Chill', artist: 'Lo-fi', url: 'https://example.com/audio/chill.mp3' },
  { id: 3, name: 'Travel', artist: 'Vibes', url: 'https://example.com/audio/travel.mp3' },
  { id: 4, name: 'Night', artist: 'Night Drive', url: 'https://example.com/audio/night.mp3' }
];

export default function MusicPicker({ value, onChange }) {
  const [selected, setSelected] = useState(value || presets[0].id);

  const handleSelect = (track) => {
    setSelected(track.id);
    onChange?.(track);
  };

  return (
    <div className="music-picker">
      <h4>Background Audio</h4>
      <div className="music-grid">
        {presets.map((track) => (
          <button
            key={track.id}
            className={selected === track.id ? 'music-item selected' : 'music-item'}
            onClick={() => handleSelect(track)}
            type="button"
          >
            <span>{track.name}</span>
            <small>{track.artist}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

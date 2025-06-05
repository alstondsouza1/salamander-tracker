// this component displays the preview page for a selected video.
'use client';

import { useEffect, useState } from 'react';
import { getMockThumbnailUrl } from '@/mock/thumbnails';

export default function PreviewPage({ params }) {
  const { filename } = params;
  const [thumbnail, setThumbnail] = useState('');
  const [targetColor, setTargetColor] = useState('#ff0000');
  const [threshold, setThreshold] = useState(50);
  const [centroid, setCentroid] = useState({ x: 100, y: 100 }); // mock for now

  useEffect(() => {
    setThumbnail(getMockThumbnailUrl(filename));

    // Fake centroid logic — in the future, compute this based on settings
    setCentroid({ x: Math.floor(Math.random() * 200), y: Math.floor(Math.random() * 200) });
  }, [filename, targetColor, threshold]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Preview Processing</h1>

      <div className="flex items-center gap-4 mb-4">
        <label>
          🎨 Target Color:
          <input
            type="color"
            value={targetColor}
            onChange={(e) => setTargetColor(e.target.value)}
            className="ml-2"
          />
        </label>

        <label>
          🎚️ Threshold:
          <input
            type="range"
            min="0"
            max="255"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="ml-2"
          />
          <span className="ml-2">{threshold}</span>
        </label>
      </div>

      <div className="flex gap-10">
        <div className="relative">
          <p className="font-semibold mb-1">Original Frame (with centroid)</p>
          <img src={thumbnail} alt="Original" className="w-64 border" />
          <div
            className="absolute w-4 h-4 bg-green-500 rounded-full border border-white"
            style={{
              left: `${centroid.x}px`,
              top: `${centroid.y}px`,
              transform: 'translate(-50%, -50%)',
              position: 'absolute',
            }}
          ></div>
        </div>

        <div>
          <p className="font-semibold mb-1">Binarized Frame (with centroid)</p>
          <img src={thumbnail} alt="Binarized" className="w-64 border grayscale" />
        </div>
      </div>

      <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded">
        Process Video with These Settings
      </button>
    </div>
  );
}
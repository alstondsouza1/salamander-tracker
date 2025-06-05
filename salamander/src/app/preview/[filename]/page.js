// this component displays the preview page for a selected video.
'use client';

import { useEffect, useState } from 'react';
import { getMockThumbnailUrl } from '@/mock/thumbnails';

export default function PreviewPage({ params }) {
  const { filename } = params;
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    const thumbUrl = getMockThumbnailUrl(filename);
    setThumbnail(thumbUrl);
  }, [filename]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Preview Processing</h1>
      <p className="text-sm text-gray-600 mb-2">Target Color: <input type="color" /></p>
      <p>Threshold: <input type="range" min="0" max="255" defaultValue="50" /></p>

      <div className="flex gap-6 mt-4">
        <div>
          <p className="font-semibold">Original Frame (with centroid)</p>
          <img src={thumbnail} alt="Original Frame" className="w-64 border" />
        </div>
        <div>
          <p className="font-semibold">Binarized Frame (with centroid)</p>
          <img src={thumbnail} alt="Binary Frame" className="w-64 border grayscale" />
        </div>
      </div>

      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Process Video with These Settings</button>
    </div>
  );
}
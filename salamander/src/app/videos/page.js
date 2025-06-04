// this component displays a list of available videos.
"use client";
import { useEffect, useState } from 'react';
// import { mockVideoList } from '@/mock/videos';

export default function VideoChooserPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // simulate fetching video list from a server
    setVideos(mockVideoList);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Available Videos</h1>
      <ul className="mt-4 space-y-2">
        {videos.map((file) => (
          <li key={file}>
            {file} -{" "}
            <a href={`/preview/${file}`} className="text-blue-600 underline">
              Preview
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

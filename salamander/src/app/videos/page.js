// this component displays a list of available videos.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VideoChooserPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/videos");
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Available Videos</h1>
      <ul className="mt-4 space-y-2">
        {videos.map((video, idx) => (
          <li key={idx}>
            {video} -{" "}
            <Link
              href={`/preview/${encodeURIComponent(video)}`}
              className="text-blue-600 underline"
            >
              Preview
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
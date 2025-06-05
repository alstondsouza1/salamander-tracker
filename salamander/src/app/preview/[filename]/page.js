// this component displays the preview page for a selected video.
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PreviewPage() {
  const params = useParams();
  const filename = params?.filename || "sample.mp4";

  const [thumbnail, setThumbnail] = useState("");
  const [targetColor, setTargetColor] = useState("#ff0000");
  const [threshold, setThreshold] = useState(50);
  const [centroid, setCentroid] = useState({ x: 100, y: 100 });

  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/videos/thumbnail/${filename}`);
        if (!res.ok) throw new Error("Failed to load thumbnail");
        const blob = await res.blob();
        setThumbnail(URL.createObjectURL(blob));
      } catch (err) {
        console.error(err);
      }
    };

    fetchThumbnail();

    setCentroid({
      x: Math.floor(Math.random() * 200),
      y: Math.floor(Math.random() * 200),
    });
  }, [filename, targetColor, threshold]);

  const handleProcessClick = async () => {
    const hex = targetColor.replace('#', '');
    try {
      const res = await fetch(
        `http://localhost:3001/api/process/${filename}?targetColor=${hex}&threshold=${threshold}`,
        { method: 'POST' }
      );
      const data = await res.json();
      setJobId(data.jobId);
      setStatus('processing');

      const interval = setInterval(async () => {
        const statusRes = await fetch(`http://localhost:3001/api/process/${data.jobId}/status`);
        const statusData = await statusRes.json();

        if (statusData.status === 'done') {
          clearInterval(interval);
          setStatus('complete');
          setResultUrl(`http://localhost:3001${statusData.result}`);
        }
      }, 2000);
    } catch (err) {
      console.error("Failed to start job:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Preview Processing</h1>

      <div className="flex items-center gap-4 mb-4">
        <label>
          Target Color:
          <input
            type="color"
            value={targetColor}
            onChange={(e) => setTargetColor(e.target.value)}
            className="ml-2"
          />
        </label>

        <label>
          Threshold:
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
              transform: "translate(-50%, -50%)",
              position: "absolute",
            }}
          ></div>
        </div>

        <div>
          <p className="font-semibold mb-1">Binarized Frame (with centroid)</p>
          <img
            src={thumbnail}
            alt="Binarized"
            className="w-64 border grayscale"
          />
        </div>
      </div>

      <button
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleProcessClick}
      >
        Process Video with These Settings
      </button>

      {status === 'processing' && (
        <p className="mt-4 text-yellow-500">Processing video...</p>
      )}

      {status === 'complete' && (
        <div className="mt-4">
          <p className="text-green-600">Processing complete!</p>
          <a href={resultUrl} download className="text-blue-600 underline">
            Download CSV
          </a>
        </div>
      )}
    </div>
  );
}
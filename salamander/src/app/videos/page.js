// this component displays a list of available videos.
export default function VideoChooserPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Available Videos</h1>
      <ul className="mt-4 space-y-2">
        <li>
          example.mp4 -{" "}
          <a href="/preview/example.mp4" className="text-blue-600 underline">
            Preview
          </a>
        </li>
      </ul>
    </div>
  );
}

// this component displays the preview page for a selected video.
export default function PreviewPage({ params }) {
    const { filename } = params;
  
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Previewing: {filename}</h1>
        <p>This is the preview page where processing controls will go.</p>
      </div>
    );
  }
import { useRef, useEffect } from "react";
import { Monitor } from "lucide-react";

interface PreviewWindowProps {
  stream: MediaStream | null;
  isRecording: boolean;
}

export const PreviewWindow = ({ stream, isRecording }: PreviewWindowProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="flex-1 flex justify-center items-start p-5">
      <div className="relative w-[70%] aspect-video bg-obs-preview border-2 border-obs-preview-border rounded-lg shadow-[var(--shadow-preview)] overflow-hidden">
        {stream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-obs-recording/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                REC
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Monitor className="w-12 h-12 mb-4" />
            <span className="text-xl font-bold">No Signal</span>
            <span className="text-sm mt-2">Add a source to begin</span>
          </div>
        )}
      </div>
    </div>
  );
};
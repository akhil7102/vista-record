import { Button } from "@/components/ui/button";
import { Pause, Play, Square } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
}

export const RecordingControls = ({
  isRecording,
  isPaused,
  onStart,
  onStop,
  onPause,
}: RecordingControlsProps) => {
  return (
    <div className="w-48 bg-babxrec-panel border-r border-babxrec-panel-border p-4">
      <h3 className="text-sm font-medium mb-4 text-foreground">Controls</h3>
      <div className="space-y-3">
        <Button
          onClick={onStart}
          disabled={isRecording}
          className="w-full bg-babxrec-recording hover:bg-babxrec-recording/90 text-white font-medium"
          size="lg"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Recording
        </Button>
        
        <Button
          onClick={onStop}
          disabled={!isRecording}
          variant="destructive"
          className="w-full"
          size="lg"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop Recording
        </Button>
        
        <Button
          onClick={onPause}
          disabled={!isRecording}
          variant="secondary"
          className="w-full"
          size="lg"
        >
          <Pause className="w-4 h-4 mr-2" />
          {isPaused ? "Resume" : "Pause"}
        </Button>
      </div>
    </div>
  );
};
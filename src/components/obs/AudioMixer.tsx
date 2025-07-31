import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Settings, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export const AudioMixer = () => {
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate audio level animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMuted) {
        setAudioLevel(Math.random() * 100);
      } else {
        setAudioLevel(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isMuted]);

  const getAudioBarColor = (position: number) => {
    if (position <= audioLevel) {
      if (position <= 60) return 'bg-obs-success';
      if (position <= 80) return 'bg-yellow-500';
      return 'bg-obs-recording';
    }
    return 'bg-obs-control';
  };

  return (
    <div className="flex-1 bg-obs-panel p-4">
      <h3 className="text-sm font-medium mb-4 text-foreground">Audio Mixer</h3>
      
      <div className="bg-obs-preview border border-obs-panel-border rounded p-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-foreground mb-2">Desktop Audio</p>
          
          {/* Audio Level Meter */}
          <div className="h-3 bg-obs-control rounded mb-3 overflow-hidden">
            <div className="h-full flex">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 mx-px transition-colors ${getAudioBarColor((i + 1) * 5)}`}
                />
              ))}
            </div>
          </div>
          
          {/* dB Scale */}
          <div className="flex justify-between text-xs text-muted-foreground mb-3">
            <span>-60</span>
            <span>-45</span>
            <span>-30</span>
            <span>-15</span>
            <span>0</span>
          </div>
          
          {/* Volume Slider */}
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="mb-4"
          />
          
          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 hover:bg-obs-control-hover ${isMuted ? 'bg-obs-recording/20' : ''}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="p-2 hover:bg-obs-control-hover"
              title="Audio Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
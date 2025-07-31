import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Settings, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export const AudioMixer = () => {
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  // Simulate desktop audio levels for demo
  useEffect(() => {
    const updateAudioLevel = () => {
      if (!isMuted) {
        // Simulate realistic audio levels with occasional peaks
        const baseLevel = Math.random() * 15; // Low background
        const hasPeak = Math.random() > 0.8; // 20% chance of audio activity
        const peakLevel = hasPeak ? Math.random() * 60 + 20 : 0; // Peak between 20-80
        setAudioLevel(Math.max(baseLevel, peakLevel));
      } else {
        setAudioLevel(0);
      }
      
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMuted]);

  const getAudioBarColor = (position: number) => {
    if (position <= audioLevel) {
      if (position <= 60) return 'bg-babxrec-success';
      if (position <= 80) return 'bg-yellow-500';
      return 'bg-babxrec-recording';
    }
    return 'bg-babxrec-control';
  };

  return (
    <div className="flex-1 bg-babxrec-panel p-4">
      <h3 className="text-sm font-medium mb-4 text-foreground">Audio Mixer</h3>
      
      <div className="bg-babxrec-preview border border-babxrec-panel-border rounded p-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-foreground mb-2">Desktop Audio</p>
          
          {/* Audio Level Meter */}
          <div className="h-3 bg-babxrec-control rounded mb-3 overflow-hidden">
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
              className={`p-2 hover:bg-babxrec-control-hover ${isMuted ? 'bg-babxrec-recording/20' : ''}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="p-2 hover:bg-babxrec-control-hover"
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
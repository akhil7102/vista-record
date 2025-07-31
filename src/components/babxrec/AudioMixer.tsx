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

  // Monitor actual desktop audio levels
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startAudioMonitoring = async () => {
      try {
        // Get desktop audio stream
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: false,
          audio: true
        });

        // Create audio context and analyser
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);

        // Start analyzing audio levels
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        
        const updateAudioLevel = () => {
          if (analyserRef.current && !isMuted) {
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Calculate average audio level
            const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
            const normalizedLevel = (average / 255) * 100;
            
            // Only show levels above a threshold to avoid showing noise
            setAudioLevel(normalizedLevel > 2 ? normalizedLevel : 0);
          } else {
            setAudioLevel(0);
          }
          
          animationRef.current = requestAnimationFrame(updateAudioLevel);
        };

        updateAudioLevel();
      } catch (error) {
        // If can't access desktop audio, keep level at 0
        setAudioLevel(0);
      }
    };

    startAudioMonitoring();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
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
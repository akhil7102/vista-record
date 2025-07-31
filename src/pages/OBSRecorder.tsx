import { useState, useRef } from "react";
import { MenuBar } from "@/components/obs/MenuBar";
import { PreviewWindow } from "@/components/obs/PreviewWindow";
import { RecordingControls } from "@/components/obs/RecordingControls";
import { SceneManager } from "@/components/obs/SceneManager";
import { SourceManager } from "@/components/obs/SourceManager";
import { AudioMixer } from "@/components/obs/AudioMixer";
import { useToast } from "@/hooks/use-toast";

interface Scene {
  id: string;
  name: string;
}

interface Source {
  id: string;
  name: string;
  type: 'screen' | 'window';
}

export const OBSRecorder = () => {
  const [scenes, setScenes] = useState<Scene[]>([
    { id: '1', name: 'Default Scene' }
  ]);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedScene, setSelectedScene] = useState<string>('1');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  // Scene Management
  const handleSceneAdd = (name: string) => {
    const newScene: Scene = {
      id: Date.now().toString(),
      name,
    };
    setScenes(prev => [...prev, newScene]);
  };

  const handleSceneDelete = (sceneId: string) => {
    setScenes(prev => prev.filter(s => s.id !== sceneId));
    if (selectedScene === sceneId) {
      setSelectedScene(scenes[0]?.id || '');
    }
  };

  const handleSceneDuplicate = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      const newScene: Scene = {
        id: Date.now().toString(),
        name: `${scene.name} (copy)`,
      };
      setScenes(prev => [...prev, newScene]);
    }
  };

  const handleSceneRename = (sceneId: string, newName: string) => {
    setScenes(prev => prev.map(s => 
      s.id === sceneId ? { ...s, name: newName } : s
    ));
  };

  const handleSceneMove = (sceneId: string, direction: 'up' | 'down') => {
    setScenes(prev => {
      const index = prev.findIndex(s => s.id === sceneId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newScenes = [...prev];
      [newScenes[index], newScenes[newIndex]] = [newScenes[newIndex], newScenes[index]];
      return newScenes;
    });
  };

  // Source Management
  const handleSourceAdd = async (type: 'screen' | 'window') => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const newSource: Source = {
        id: Date.now().toString(),
        name: type === 'screen' ? 'Screen Capture' : 'Window Capture',
        type,
      };

      setSources(prev => [...prev, newSource]);
      setSelectedSource(newSource.id);
      setCurrentStream(stream);

      // Stop any existing tracks when screen sharing ends
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        setCurrentStream(null);
        setSources(prev => prev.filter(s => s.id !== newSource.id));
        setSelectedSource(null);
        if (isRecording) {
          handleStopRecording();
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access screen capture. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleSourceDelete = (sourceId: string) => {
    setSources(prev => prev.filter(s => s.id !== sourceId));
    if (selectedSource === sourceId) {
      setSelectedSource(null);
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        setCurrentStream(null);
      }
    }
  };

  const handleSourceMove = (sourceId: string, direction: 'up' | 'down') => {
    setSources(prev => {
      const index = prev.findIndex(s => s.id === sourceId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newSources = [...prev];
      [newSources[index], newSources[newIndex]] = [newSources[newIndex], newSources[index]];
      return newSources;
    });
  };

  // Recording Controls
  const handleStartRecording = async () => {
    if (!currentStream) {
      toast({
        title: "No Source",
        description: "Please add a screen or window capture source first.",
        variant: "destructive",
      });
      return;
    }

    try {
      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(currentStream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Auto-download the recording
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `recording-${new Date().toISOString().slice(0, 19)}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        setIsRecording(false);
        setIsPaused(false);
        
        toast({
          title: "Recording Complete",
          description: "Your recording has been saved and downloaded.",
        });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);

      toast({
        title: "Recording Started",
        description: "Screen recording is now active.",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handlePauseRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (!isPaused && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      toast({
        title: "Recording Paused",
        description: "Recording has been paused.",
      });
    } else if (isPaused && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      toast({
        title: "Recording Resumed",
        description: "Recording has been resumed.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Section */}
      <div className="flex items-start p-4 flex-1">
        <MenuBar />
        <PreviewWindow stream={currentStream} isRecording={isRecording} />
      </div>

      {/* Bottom Section */}
      <div className="flex h-64 border-t border-obs-panel-border">
        <RecordingControls
          isRecording={isRecording}
          isPaused={isPaused}
          onStart={handleStartRecording}
          onStop={handleStopRecording}
          onPause={handlePauseRecording}
        />
        
        <div className="flex-1 flex">
          <SceneManager
            scenes={scenes}
            selectedScene={selectedScene}
            onSceneSelect={setSelectedScene}
            onSceneAdd={handleSceneAdd}
            onSceneDelete={handleSceneDelete}
            onSceneDuplicate={handleSceneDuplicate}
            onSceneRename={handleSceneRename}
            onSceneMove={handleSceneMove}
          />
          
          <SourceManager
            sources={sources}
            selectedSource={selectedSource}
            onSourceSelect={setSelectedSource}
            onSourceAdd={handleSourceAdd}
            onSourceDelete={handleSourceDelete}
            onSourceMove={handleSourceMove}
          />
          
          <AudioMixer />
        </div>
      </div>
    </div>
  );
};
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Scene {
  id: string;
  name: string;
}

interface SceneManagerProps {
  scenes: Scene[];
  selectedScene: string;
  onSceneSelect: (sceneId: string) => void;
  onSceneAdd: (name: string) => void;
  onSceneDelete: (sceneId: string) => void;
  onSceneDuplicate: (sceneId: string) => void;
  onSceneRename: (sceneId: string, newName: string) => void;
  onSceneMove: (sceneId: string, direction: 'up' | 'down') => void;
}

export const SceneManager = ({
  scenes,
  selectedScene,
  onSceneSelect,
  onSceneAdd,
  onSceneDelete,
  onSceneDuplicate,
  onSceneRename,
  onSceneMove,
}: SceneManagerProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newSceneName, setNewSceneName] = useState("");
  const [renameSceneId, setRenameSceneId] = useState("");

  const handleAdd = () => {
    if (newSceneName.trim()) {
      onSceneAdd(newSceneName.trim());
      setNewSceneName("");
      setShowAddDialog(false);
    }
  };

  const handleRename = () => {
    if (newSceneName.trim() && renameSceneId) {
      onSceneRename(renameSceneId, newSceneName.trim());
      setNewSceneName("");
      setRenameSceneId("");
      setShowRenameDialog(false);
    }
  };

  const openRenameDialog = (sceneId: string, currentName: string) => {
    setRenameSceneId(sceneId);
    setNewSceneName(currentName);
    setShowRenameDialog(true);
  };

  return (
    <div className="flex-1 bg-babxrec-panel border-r border-babxrec-panel-border p-4">
      <h3 className="text-sm font-medium mb-4 text-foreground">Scenes</h3>
      
      <div className="bg-babxrec-preview border border-babxrec-panel-border rounded h-40 mb-4 overflow-y-auto">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            onClick={() => onSceneSelect(scene.id)}
            className={`p-2 border-b border-babxrec-panel-border cursor-pointer transition-colors ${
              selectedScene === scene.id
                ? 'bg-babxrec-recording/50 text-white'
                : 'hover:bg-babxrec-recording/20 text-foreground'
            }`}
          >
            {scene.name}
          </div>
        ))}
      </div>

      <div className="flex gap-1 justify-center">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="p-2 hover:bg-babxrec-control-hover"
              title="Add Scene"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-babxrec-panel border-babxrec-panel-border">
            <DialogHeader>
              <DialogTitle>Add New Scene</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sceneName">Scene Name</Label>
                <Input
                  id="sceneName"
                  value={newSceneName}
                  onChange={(e) => setNewSceneName(e.target.value)}
                  placeholder="Enter scene name"
                  className="bg-babxrec-control border-babxrec-panel-border"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleAdd} className="bg-babxrec-recording hover:bg-babxrec-recording/90">Add Scene</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedScene && onSceneDelete(selectedScene)}
          className="p-2 hover:bg-babxrec-control-hover"
          title="Delete Scene"
          disabled={!selectedScene}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedScene && onSceneDuplicate(selectedScene)}
          className="p-2 hover:bg-babxrec-control-hover"
          title="Duplicate Scene"
          disabled={!selectedScene}
        >
          <Copy className="w-4 h-4" />
        </Button>

        <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const scene = scenes.find(s => s.id === selectedScene);
                if (scene) openRenameDialog(scene.id, scene.name);
              }}
              className="p-2 hover:bg-babxrec-control-hover"
              title="Rename Scene"
              disabled={!selectedScene}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-babxrec-panel border-babxrec-panel-border">
            <DialogHeader>
              <DialogTitle>Rename Scene</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newSceneName">New Scene Name</Label>
                <Input
                  id="newSceneName"
                  value={newSceneName}
                  onChange={(e) => setNewSceneName(e.target.value)}
                  placeholder="Enter new scene name"
                  className="bg-babxrec-control border-babxrec-panel-border"
                  onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowRenameDialog(false)}>Cancel</Button>
                <Button onClick={handleRename} className="bg-babxrec-recording hover:bg-babxrec-recording/90">Rename</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedScene && onSceneMove(selectedScene, 'up')}
          className="p-2 hover:bg-babxrec-control-hover"
          title="Move Up"
          disabled={!selectedScene}
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedScene && onSceneMove(selectedScene, 'down')}
          className="p-2 hover:bg-babxrec-control-hover"
          title="Move Down"
          disabled={!selectedScene}
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
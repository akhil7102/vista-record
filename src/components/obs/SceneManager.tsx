import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Scene {
  id: string;
  name: string;
}

interface SceneManagerProps {
  scenes: Scene[];
  selectedScene: string | null;
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [sceneName, setSceneName] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!sceneName.trim()) {
      setError("Please enter a scene name");
      return;
    }
    onSceneAdd(sceneName.trim());
    setSceneName("");
    setShowAddDialog(false);
    setError("");
    toast({
      title: "Scene Added",
      description: `Scene "${sceneName.trim()}" has been created.`,
    });
  };

  const handleDelete = () => {
    if (selectedScene) {
      onSceneDelete(selectedScene);
      setShowDeleteDialog(false);
      toast({
        title: "Scene Deleted",
        description: "The scene has been removed.",
        variant: "destructive",
      });
    }
  };

  const handleRename = () => {
    if (!sceneName.trim()) {
      setError("Please enter a scene name");
      return;
    }
    if (selectedScene) {
      onSceneRename(selectedScene, sceneName.trim());
      setSceneName("");
      setShowRenameDialog(false);
      setError("");
      toast({
        title: "Scene Renamed",
        description: `Scene renamed to "${sceneName.trim()}".`,
      });
    }
  };

  const selectedSceneData = scenes.find(s => s.id === selectedScene);

  return (
    <div className="flex-1 bg-obs-panel border-r border-obs-panel-border p-4">
      <h3 className="text-sm font-medium mb-4 text-foreground">Scenes</h3>
      
      <div className="bg-obs-preview border border-obs-panel-border rounded h-40 mb-4 overflow-y-auto">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            onClick={() => onSceneSelect(scene.id)}
            className={`p-2 border-b border-obs-panel-border cursor-pointer transition-colors ${
              selectedScene === scene.id
                ? 'bg-obs-recording/50 text-white'
                : 'hover:bg-obs-recording/20 text-foreground'
            }`}
          >
            {scene.name}
          </div>
        ))}
      </div>

      <div className="flex gap-1 justify-center">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowAddDialog(true)}
          className="p-2 hover:bg-obs-control-hover"
          title="Add Scene"
        >
          <Plus className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowDeleteDialog(true)}
          disabled={!selectedScene}
          className="p-2 hover:bg-obs-control-hover"
          title="Delete Scene"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSceneName(selectedSceneData?.name || "");
            setShowRenameDialog(true);
          }}
          disabled={!selectedScene}
          className="p-2 hover:bg-obs-control-hover"
          title="Rename Scene"
        >
          <Edit className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedScene && onSceneDuplicate(selectedScene)}
          disabled={!selectedScene}
          className="p-2 hover:bg-obs-control-hover"
          title="Duplicate Scene"
        >
          <Copy className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedScene && onSceneMove(selectedScene, 'up')}
          disabled={!selectedScene}
          className="p-2 hover:bg-obs-control-hover"
          title="Move Up"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedScene && onSceneMove(selectedScene, 'down')}
          disabled={!selectedScene}
          className="p-2 hover:bg-obs-control-hover"
          title="Move Down"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Add Scene Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-obs-panel border-obs-panel-border">
          <DialogHeader>
            <DialogTitle>Add New Scene</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Scene Name"
              value={sceneName}
              onChange={(e) => {
                setSceneName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="bg-obs-control border-obs-panel-border"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} className="bg-obs-recording hover:bg-obs-recording/90">
                Add Scene
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Scene Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-obs-panel border-obs-panel-border">
          <DialogHeader>
            <DialogTitle>Delete Scene</DialogTitle>
          </DialogHeader>
          <p className="text-foreground">Are you sure you want to delete this scene? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Scene Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="bg-obs-panel border-obs-panel-border">
          <DialogHeader>
            <DialogTitle>Rename Scene</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Scene Name"
              value={sceneName}
              onChange={(e) => {
                setSceneName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="bg-obs-control border-obs-panel-border"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRename} className="bg-obs-recording hover:bg-obs-recording/90">
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
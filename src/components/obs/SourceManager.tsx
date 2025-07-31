import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Settings, ChevronUp, ChevronDown, Monitor, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Source {
  id: string;
  name: string;
  type: 'screen' | 'window';
}

interface SourceManagerProps {
  sources: Source[];
  selectedSource: string | null;
  onSourceSelect: (sourceId: string) => void;
  onSourceAdd: (type: 'screen' | 'window') => void;
  onSourceDelete: (sourceId: string) => void;
  onSourceMove: (sourceId: string, direction: 'up' | 'down') => void;
}

export const SourceManager = ({
  sources,
  selectedSource,
  onSourceSelect,
  onSourceAdd,
  onSourceDelete,
  onSourceMove,
}: SourceManagerProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleAdd = (type: 'screen' | 'window') => {
    onSourceAdd(type);
    setShowAddDialog(false);
    toast({
      title: "Source Added",
      description: `${type === 'screen' ? 'Screen' : 'Window'} capture source has been added.`,
    });
  };

  const handleDelete = () => {
    if (selectedSource) {
      onSourceDelete(selectedSource);
      setShowDeleteDialog(false);
      toast({
        title: "Source Deleted",
        description: "The source has been removed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 bg-obs-panel border-r border-obs-panel-border p-4">
      <h3 className="text-sm font-medium mb-4 text-foreground">Sources</h3>
      
      <div className="bg-obs-preview border border-obs-panel-border rounded h-40 mb-4 overflow-y-auto">
        {sources.map((source) => (
          <div
            key={source.id}
            onClick={() => onSourceSelect(source.id)}
            className={`p-2 border-b border-obs-panel-border cursor-pointer transition-colors flex items-center gap-2 ${
              selectedSource === source.id
                ? 'bg-obs-recording/50 text-white'
                : 'hover:bg-obs-recording/20 text-foreground'
            }`}
          >
            {source.type === 'screen' ? (
              <Monitor className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {source.name}
          </div>
        ))}
      </div>

      <div className="flex gap-1 justify-center">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowAddDialog(true)}
          className="p-2 hover:bg-obs-control-hover"
          title="Add Source"
        >
          <Plus className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowDeleteDialog(true)}
          disabled={!selectedSource}
          className="p-2 hover:bg-obs-control-hover"
          title="Remove Source"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          disabled={!selectedSource}
          className="p-2 hover:bg-obs-control-hover"
          title="Source Settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedSource && onSourceMove(selectedSource, 'up')}
          disabled={!selectedSource}
          className="p-2 hover:bg-obs-control-hover"
          title="Move Up"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedSource && onSourceMove(selectedSource, 'down')}
          disabled={!selectedSource}
          className="p-2 hover:bg-obs-control-hover"
          title="Move Down"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Add Source Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-obs-panel border-obs-panel-border">
          <DialogHeader>
            <DialogTitle>Add Source</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground">Choose what you want to record:</p>
            <div className="space-y-3">
              <Button
                onClick={() => handleAdd('screen')}
                className="w-full justify-start bg-obs-control hover:bg-obs-control-hover"
                size="lg"
              >
                <Monitor className="w-5 h-5 mr-3" />
                Entire Screen
                <span className="ml-auto text-sm text-muted-foreground">Capture your entire display</span>
              </Button>
              
              <Button
                onClick={() => handleAdd('window')}
                className="w-full justify-start bg-obs-control hover:bg-obs-control-hover"
                size="lg"
              >
                <Square className="w-5 h-5 mr-3" />
                Window Capture
                <span className="ml-auto text-sm text-muted-foreground">Capture a specific window</span>
              </Button>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Source Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-obs-panel border-obs-panel-border">
          <DialogHeader>
            <DialogTitle>Remove Source</DialogTitle>
          </DialogHeader>
          <p className="text-foreground">Are you sure you want to remove this source?</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
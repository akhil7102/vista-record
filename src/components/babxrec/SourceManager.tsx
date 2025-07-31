import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronUp, ChevronDown, Monitor, Square } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  const handleAddSource = (type: 'screen' | 'window') => {
    onSourceAdd(type);
    setShowAddDialog(false);
  };

  return (
    <div className="flex-1 bg-babxrec-panel border-r border-babxrec-panel-border p-4">
      <h3 className="text-sm font-medium mb-4 text-foreground">Sources</h3>
      
      <div className="bg-babxrec-preview border border-babxrec-panel-border rounded h-40 mb-4 overflow-y-auto">
        {sources.map((source) => (
          <div
            key={source.id}
            onClick={() => onSourceSelect(source.id)}
            className={`p-2 border-b border-babxrec-panel-border cursor-pointer transition-colors flex items-center gap-2 ${
              selectedSource === source.id
                ? 'bg-babxrec-recording/50 text-white'
                : 'hover:bg-babxrec-recording/20 text-foreground'
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
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="p-2 hover:bg-babxrec-control-hover"
              title="Add Source"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-babxrec-panel border-babxrec-panel-border">
            <DialogHeader>
              <DialogTitle>Add Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Choose what you want to record:</p>
              <div className="space-y-2">
                <Button
                  onClick={() => handleAddSource('screen')}
                  className="w-full justify-start bg-babxrec-control hover:bg-babxrec-control-hover"
                  variant="ghost"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Entire Screen
                </Button>
                <Button
                  onClick={() => handleAddSource('window')}
                  className="w-full justify-start bg-babxrec-control hover:bg-babxrec-control-hover"
                  variant="ghost"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Application Window
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedSource && onSourceDelete(selectedSource)}
          className="p-2 hover:bg-babxrec-control-hover"
          title="Delete Source"
          disabled={!selectedSource}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedSource && onSourceMove(selectedSource, 'up')}
          className="p-2 hover:bg-babxrec-control-hover"
          title="Move Up"
          disabled={!selectedSource}
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => selectedSource && onSourceMove(selectedSource, 'down')}
          className="p-2 hover:bg-babxrec-control-hover"
          title="Move Down"
          disabled={!selectedSource}
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
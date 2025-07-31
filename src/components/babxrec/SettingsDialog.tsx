import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface RecordingSettings {
  resolution: string;
  fileType: string;
}

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RecordingSettings;
  onSettingsChange: (settings: RecordingSettings) => void;
}

const resolutionOptions = [
  { value: "144p", label: "144p (256x144)" },
  { value: "240p", label: "240p (426x240)" },
  { value: "360p", label: "360p (640x360)" },
  { value: "480p", label: "480p (854x480)" },
  { value: "720p", label: "720p (1280x720)" },
  { value: "1080p", label: "1080p (1920x1080)" },
];

const fileTypeOptions = [
  { value: "webm", label: "WebM (Recommended)" },
  { value: "mp4", label: "MP4" },
  { value: "mov", label: "MOV" },
  { value: "avi", label: "AVI" },
];

export const SettingsDialog = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsDialogProps) => {
  const [localSettings, setLocalSettings] = useState<RecordingSettings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings); // Reset to original settings
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recording Settings</DialogTitle>
          <DialogDescription>
            Configure your recording preferences including quality and file format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="resolution">Recording Quality</Label>
            <Select
              value={localSettings.resolution}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, resolution: value })
              }
            >
              <SelectTrigger id="resolution">
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                {resolutionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="fileType">File Format</Label>
            <Select
              value={localSettings.fileType}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, fileType: value })
              }
            >
              <SelectTrigger id="fileType">
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                {fileTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
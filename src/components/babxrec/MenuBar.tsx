import { Button } from "@/components/ui/button";
import { Settings, HelpCircle, File } from "lucide-react";

export const MenuBar = () => {
  return (
    <div className="flex gap-2 bg-babxrec-panel border border-babxrec-panel-border rounded-lg p-3 w-fit">
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-babxrec-control-hover"
      >
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-babxrec-control-hover"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Help
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-babxrec-control-hover"
      >
        <File className="w-4 h-4 mr-2" />
        File
      </Button>
    </div>
  );
};
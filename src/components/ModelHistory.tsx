import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Download, Trash2, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ModelHistoryProps {
  models: Array<{
    id: string;
    prompt: string;
    status: "generating" | "completed" | "error";
    timestamp: Date;
    meshUrl?: string;
    thumbnailUrl?: string;
  }>;
  onModelSelect: (modelId: string) => void;
  onModelDelete: (modelId: string) => void;
}

export function ModelHistory({ models, onModelSelect, onModelDelete }: ModelHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "generating": return "bg-orange-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="gradient-card border-border/50 shadow-elevation h-[600px] flex flex-col">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyber-blue" />
            Generation History
          </h3>
          <Badge variant="secondary">
            {models.length} models
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {models.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-12 h-12 mx-auto gradient-primary rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium">No Models Yet</h4>
                <p className="text-sm text-muted-foreground">
                  Your generated 3D models will appear here
                </p>
              </div>
            </motion.div>
          ) : (
            models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-space-gray/50 border-border/30 hover:border-cyber-blue/50 transition-smooth cursor-pointer">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getStatusColor(model.status)} text-white text-xs`}>
                            {model.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(model.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-foreground font-medium line-clamp-2 mb-3">
                          {model.prompt}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onModelSelect(model.id)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          
                          {model.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onModelDelete(model.id)}
                            className="text-xs text-destructive hover:text-destructive ml-auto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
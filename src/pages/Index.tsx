import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PromptInput } from "@/components/PromptInput";
import { ModelViewer } from "@/components/ModelViewer";
import { ModelHistory } from "@/components/ModelHistory";
import { MCPService, GenerationRequest } from "@/services/mcpService";
import { Cpu, Zap, Sparkles } from "lucide-react";

interface ModelData {
  id: string;
  prompt: string;
  status: "generating" | "completed" | "error";
  meshUrl?: string;
  thumbnailUrl?: string;
  timestamp: Date;
  options?: any;
}

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelData | undefined>();
  const [modelHistory, setModelHistory] = useState<ModelData[]>([]);
  const [mcpService] = useState(() => new MCPService());

  useEffect(() => {
    // Set up MCP service event listeners
    const handleModelProgress = (event: CustomEvent) => {
      const { modelId, step, total, message } = event.detail;
      toast.info(`${message} (${step}/${total})`);
    };

    const handleModelComplete = (event: CustomEvent) => {
      const { modelId, meshUrl, thumbnailUrl } = event.detail;
      
      setModelHistory(prev => 
        prev.map(model => 
          model.id === modelId 
            ? { ...model, status: "completed", meshUrl, thumbnailUrl }
            : model
        )
      );
      
      if (currentModel?.id === modelId) {
        setCurrentModel(prev => prev ? {
          ...prev,
          status: "completed",
          meshUrl,
          thumbnailUrl
        } : undefined);
      }
      
      setIsGenerating(false);
      toast.success("3D model generated successfully!");
    };

    window.addEventListener('modelProgress', handleModelProgress as EventListener);
    window.addEventListener('modelComplete', handleModelComplete as EventListener);

    // Initialize MCP connection
    mcpService.establishConnection().then(connected => {
      if (connected) {
        toast.success("Connected to push.ai MCP server");
      } else {
        toast.error("Failed to connect to push.ai MCP server");
      }
    });

    return () => {
      window.removeEventListener('modelProgress', handleModelProgress as EventListener);
      window.removeEventListener('modelComplete', handleModelComplete as EventListener);
    };
  }, [mcpService, currentModel]);

  const handleGenerate = async (prompt: string, options: any) => {
    setIsGenerating(true);
    
    try {
      const request: GenerationRequest = {
        prompt,
        options
      };
      
      const response = await mcpService.generateModel(request);
      
      const newModel: ModelData = {
        id: response.id,
        prompt,
        status: "generating",
        timestamp: new Date(),
        options
      };
      
      setCurrentModel(newModel);
      setModelHistory(prev => [newModel, ...prev]);
      
      toast.success("Generation started! Your 3D model is being created...");
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to start generation. Please try again.");
      console.error("Generation error:", error);
    }
  };

  const handleModelSelect = (modelId: string) => {
    const model = modelHistory.find(m => m.id === modelId);
    if (model) {
      setCurrentModel(model);
    }
  };

  const handleModelDelete = async (modelId: string) => {
    try {
      await mcpService.deleteModel(modelId);
      setModelHistory(prev => prev.filter(m => m.id !== modelId));
      
      if (currentModel?.id === modelId) {
        setCurrentModel(undefined);
      }
      
      toast.success("Model deleted successfully");
    } catch (error) {
      toast.error("Failed to delete model");
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center"
          >
            <Cpu className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyber-blue to-electric-purple bg-clip-text text-transparent">
              AI 3D Studio
            </h1>
            <p className="text-muted-foreground">
              Powered by push.ai MCP & Blender
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyber-blue" />
            Real-time Generation
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-electric-purple" />
            MCP Protocol
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <PromptInput 
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </motion.div>

        {/* Center Column - Viewer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <ModelViewer 
            modelData={currentModel}
            isGenerating={isGenerating}
          />
        </motion.div>

        {/* Right Column - History */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-1"
        >
          <ModelHistory
            models={modelHistory}
            onModelSelect={handleModelSelect}
            onModelDelete={handleModelDelete}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-12 text-sm text-muted-foreground"
      >
        <p>
          Seamlessly integrated with push.ai MCP server for real-time 3D model generation
        </p>
      </motion.div>
    </div>
  );
};

export default Index;

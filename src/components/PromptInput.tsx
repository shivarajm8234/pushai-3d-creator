import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, Settings, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface PromptInputProps {
  onGenerate: (prompt: string, options: GenerationOptions) => void;
  isGenerating: boolean;
}

interface GenerationOptions {
  quality: "draft" | "standard" | "high";
  style: "realistic" | "stylized" | "lowpoly" | "sculpted";
  complexity: "simple" | "medium" | "detailed";
}

export function PromptInput({ onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState<GenerationOptions>({
    quality: "standard",
    style: "realistic",
    complexity: "medium"
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt, options);
    }
  };

  const presetPrompts = [
    "A futuristic spaceship with sleek curves",
    "Medieval castle with detailed architecture", 
    "Modern sports car with aggressive styling",
    "Fantasy dragon with intricate scales"
  ];

  return (
    <Card className="gradient-card border-border/50 shadow-elevation">
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <Wand2 className="h-8 w-8 text-cyber-blue" />
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              3D Model Generator
            </h1>
          </motion.div>
          <p className="text-muted-foreground">
            Describe your 3D model and watch it come to life with AI-powered Blender rendering
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Describe your 3D model
            </label>
            <Textarea
              placeholder="e.g., A sleek futuristic robot with metallic surfaces and glowing blue accents..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none border-border/50 bg-space-gray/50 focus:border-cyber-blue transition-smooth"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Quick prompts:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presetPrompts.map((preset, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-cyber-blue/20 transition-smooth"
                  onClick={() => setPrompt(preset)}
                >
                  {preset}
                </Badge>
              ))}
            </div>
          </div>

          <motion.div
            initial={false}
            animate={{ height: showAdvanced ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality</label>
                  <select
                    value={options.quality}
                    onChange={(e) => setOptions(prev => ({ ...prev, quality: e.target.value as any }))}
                    className="w-full p-2 rounded-md bg-space-gray border border-border/50 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Style</label>
                  <select
                    value={options.style}
                    onChange={(e) => setOptions(prev => ({ ...prev, style: e.target.value as any }))}
                    className="w-full p-2 rounded-md bg-space-gray border border-border/50 text-sm"
                  >
                    <option value="realistic">Realistic</option>
                    <option value="stylized">Stylized</option>
                    <option value="lowpoly">Low Poly</option>
                    <option value="sculpted">Sculpted</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Complexity</label>
                  <select
                    value={options.complexity}
                    onChange={(e) => setOptions(prev => ({ ...prev, complexity: e.target.value as any }))}
                    className="w-full p-2 rounded-md bg-space-gray border border-border/50 text-sm"
                  >
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <Button
              variant="cyber"
              size="lg"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Generate 3D Model
                </>
              )}
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
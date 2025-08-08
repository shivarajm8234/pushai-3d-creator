import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, RotateCcw, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useExporter } from "@/hooks/useExporter";

interface ModelViewerProps {
  modelData?: {
    id: string;
    prompt: string;
    status: "generating" | "completed" | "error";
    meshUrl?: string;
    timestamp: Date;
  };
  isGenerating: boolean;
}

function PlaceholderModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#00d9ff" 
        metalness={0.8} 
        roughness={0.2}
        emissive="#0066ff"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function GeneratingModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial 
          color="#ff6600" 
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="#00d9ff"
        anchorX="center"
        anchorY="middle"
      >
        Generating 3D Model...
      </Text>
    </group>
  );
}

export function ModelViewer({ modelData, isGenerating }: ModelViewerProps) {
  const [wireframe, setWireframe] = useState(false);
  const exportGroupRef = useRef<THREE.Group>(null);
  const { exportObject } = useExporter();

  const handleExport = async (format: string) => {
    if (!exportGroupRef.current) {
      toast.error("Nothing to export");
      return;
    }
    try {
      toast.info(`Exporting ${format.toUpperCase()}...`);
      await exportObject(format as any, exportGroupRef.current, {
        filename: modelData?.id || "model",
      });
      toast.success(`Download started: ${(modelData?.id || "model")}.${format}`);
    } catch (e) {
      console.error(e);
      toast.error("Export failed");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "generating": return "bg-orange-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="gradient-card border-border/50 shadow-elevation h-[600px] flex flex-col">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">3D Model Preview</h3>
            {modelData && (
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(modelData.status)} text-white`}>
                  {modelData.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {modelData.prompt.slice(0, 50)}...
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setWireframe(!wireframe)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="glass" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="glass" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
{modelData?.status === "completed" && (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="generate" size="sm">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="min-w-52">
      <DropdownMenuLabel>Download as</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => handleExport("glb")}>glTF Binary (.glb)</DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleExport("gltf")}>glTF JSON (.gltf)</DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleExport("obj")}>Wavefront OBJ (.obj)</DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleExport("stl")}>STL (.stl)</DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleExport("ply")}>PLY (.ply)</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Server-side (push.ai/Blender)</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => toast.info("FBX export requires server-side conversion via MCP/Blender.")}>FBX (.fbx)</DropdownMenuItem>
      <DropdownMenuItem onClick={() => toast.info("Collada (.dae) export requires server-side conversion via MCP/Blender.")}>Collada (.dae)</DropdownMenuItem>
      <DropdownMenuItem onClick={() => toast.info("X3D export requires server-side conversion via MCP/Blender.")}>X3D (.x3d)</DropdownMenuItem>
      <DropdownMenuItem onClick={() => toast.info("3DS export requires server-side conversion via MCP/Blender.")}>3DS (.3ds)</DropdownMenuItem>
      <DropdownMenuItem onClick={() => toast.info("Alembic export requires server-side conversion via MCP/Blender.")}>Alembic (.abc)</DropdownMenuItem>
      <DropdownMenuItem onClick={() => toast.info("USD export requires server-side conversion via MCP/Blender.")}>USD (.usd)</DropdownMenuItem>
      <DropdownMenuItem onClick={() => toast.info("SVG export will be added soon.")}>SVG (.svg)</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 60 }}
          className="bg-gradient-to-br from-space-gray to-background"
        >
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} color="#ff6600" intensity={0.3} />
          
          <Suspense fallback={null}>
            <Environment preset="studio" />
            {isGenerating ? (
              <GeneratingModel />
            ) : modelData ? (
              <group ref={exportGroupRef} name="ExportGroup">
                <PlaceholderModel />
              </group>
            ) : (
              <Text
                position={[0, 0, 0]}
                fontSize={1}
                color="#666"
                anchorX="center"
                anchorY="middle"
              >
                Enter a prompt to generate\nyour 3D model
              </Text>
            )}
            <ContactShadows 
              opacity={0.4} 
              scale={10} 
              blur={1} 
              far={10} 
              resolution={256} 
              color="#000" 
            />
          </Suspense>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
          />
        </Canvas>

        {!modelData && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto gradient-primary rounded-full flex items-center justify-center">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No Model Generated Yet</h3>
                <p className="text-muted-foreground">
                  Create your first 3D model by entering a prompt above
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
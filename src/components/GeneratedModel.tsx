import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GeneratedModelProps {
  prompt: string;
  description?: string;
  options: {
    quality: "draft" | "standard" | "high";
    style: "realistic" | "stylized" | "lowpoly" | "sculpted";
    complexity: "simple" | "medium" | "detailed";
  };
}

export function GeneratedModel({ prompt, description, options }: GeneratedModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  // Generate geometry based on prompt keywords
  const createGeometry = () => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('bird') || lowerPrompt.includes('eagle') || lowerPrompt.includes('owl')) {
      // Create bird-like shape using basic geometries
      return (
        <group>
          {/* Body (ellipsoid) */}
          <mesh position={[0, 0, 0]} scale={[1, 1.5, 0.8]}>
            <sphereGeometry args={[1, 16, 8]} />
            <meshStandardMaterial color={options.style === 'realistic' ? '#8B4513' : '#FF6B35'} />
          </mesh>
          
          {/* Wings */}
          <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial 
              color={options.style === 'realistic' ? '#654321' : '#FF8C42'}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[1.2, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial 
              color={options.style === 'realistic' ? '#654321' : '#FF8C42'}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Head */}
          <mesh position={[0, 1.8, 0.3]}>
            <sphereGeometry args={[0.5, 12, 8]} />
            <meshStandardMaterial color={options.style === 'realistic' ? '#A0522D' : '#FFB347'} />
          </mesh>
          
          {/* Beak */}
          <mesh position={[0, 1.8, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.1, 0.4, 6]} />
            <meshStandardMaterial color="#FFA500" />
          </mesh>
        </group>
      );
    }
    
    if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle') || lowerPrompt.includes('automobile')) {
      return (
        <group>
          {/* Main body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3, 1, 1.5]} />
            <meshStandardMaterial 
              color={options.style === 'realistic' ? '#FF0000' : '#00D9FF'}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Cabin */}
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2, 1, 1.2]} />
            <meshStandardMaterial 
              color={options.style === 'realistic' ? '#CCCCCC' : '#0099CC'}
              transparent
              opacity={0.7}
            />
          </mesh>
          
          {/* Wheels */}
          <mesh position={[-1.2, -0.7, 0.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[1.2, -0.7, 0.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[-1.2, -0.7, -0.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[1.2, -0.7, -0.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      );
    }
    
    if (lowerPrompt.includes('house') || lowerPrompt.includes('building') || lowerPrompt.includes('home')) {
      return (
        <group>
          {/* Base */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.5, 2, 2]} />
            <meshStandardMaterial color={options.style === 'realistic' ? '#DEB887' : '#FF9999'} />
          </mesh>
          
          {/* Roof */}
          <mesh position={[0, 1.75, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[2, 1.5, 4]} />
            <meshStandardMaterial color={options.style === 'realistic' ? '#8B4513' : '#FF6666'} />
          </mesh>
          
          {/* Door */}
          <mesh position={[0, -0.25, 1.05]}>
            <boxGeometry args={[0.6, 1.5, 0.1]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          
          {/* Windows */}
          <mesh position={[-0.8, 0.3, 1.05]}>
            <boxGeometry args={[0.5, 0.5, 0.05]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.8, 0.3, 1.05]}>
            <boxGeometry args={[0.5, 0.5, 0.05]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
          </mesh>
        </group>
      );
    }
    
    if (lowerPrompt.includes('tree') || lowerPrompt.includes('plant') || lowerPrompt.includes('forest')) {
      return (
        <group>
          {/* Trunk */}
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* Foliage layers */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[1.2, 12, 8]} />
            <meshStandardMaterial color={options.style === 'realistic' ? '#228B22' : '#00FF88'} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[1.0, 12, 8]} />
            <meshStandardMaterial color={options.style === 'realistic' ? '#32CD32' : '#88FF00'} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.8, 12, 8]} />
            <meshStandardMaterial color={options.style === 'realistic' ? '#90EE90' : '#CCFF99'} />
          </mesh>
        </group>
      );
    }
    
    if (lowerPrompt.includes('robot') || lowerPrompt.includes('mech') || lowerPrompt.includes('android')) {
      return (
        <group>
          {/* Body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 2, 1]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
          </mesh>
          
          {/* Head */}
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Arms */}
          <mesh position={[-1.2, 0.5, 0]}>
            <boxGeometry args={[0.4, 1.5, 0.4]} />
            <meshStandardMaterial color="#A0A0A0" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[1.2, 0.5, 0]}>
            <boxGeometry args={[0.4, 1.5, 0.4]} />
            <meshStandardMaterial color="#A0A0A0" metalness={0.7} roughness={0.3} />
          </mesh>
          
          {/* Legs */}
          <mesh position={[-0.5, -1.5, 0]}>
            <boxGeometry args={[0.5, 1.5, 0.5]} />
            <meshStandardMaterial color="#808080" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0.5, -1.5, 0]}>
            <boxGeometry args={[0.5, 1.5, 0.5]} />
            <meshStandardMaterial color="#808080" metalness={0.6} roughness={0.4} />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[-0.3, 1.6, 0.5]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.3, 1.6, 0.5]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.5} />
          </mesh>
        </group>
      );
    }
    
    // Default abstract shape for other prompts
    const complexity = options.complexity === 'simple' ? 3 : options.complexity === 'medium' ? 5 : 8;
    const elements = [];
    
    for (let i = 0; i < complexity; i++) {
      const angle = (i / complexity) * Math.PI * 2;
      const radius = 0.5 + Math.sin(i) * 0.3;
      const size = 1.5;
      
      elements.push(
        <mesh 
          key={i}
          position={[
            Math.cos(angle) * size,
            Math.sin(angle * 0.5) * 0.5,
            Math.sin(angle) * size
          ]}
        >
          <sphereGeometry args={[radius, 8, 6]} />
          <meshStandardMaterial
            color={`hsl(${(i / complexity * 360 + 120) % 360}, 80%, 60%)`}
            metalness={options.style === 'realistic' ? 0.1 : 0.7}
            roughness={options.style === 'realistic' ? 0.8 : 0.3}
          />
        </mesh>
      );
    }
    
    return <group>{elements}</group>;
  };

  return (
    <group ref={meshRef}>
      {createGeometry()}
    </group>
  );
}
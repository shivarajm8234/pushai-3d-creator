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
  const meshRef = useRef<THREE.Mesh>(null);
  
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
      // Create bird-like shape
      const geometry = new THREE.Group();
      
      // Body (ellipsoid)
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 8),
        new THREE.MeshStandardMaterial({ color: options.style === 'realistic' ? '#8B4513' : '#FF6B35' })
      );
      body.scale.set(1, 1.5, 0.8);
      geometry.add(body);
      
      // Wings
      const wingGeo = new THREE.ConeGeometry(0.8, 2, 8);
      const wingMat = new THREE.MeshStandardMaterial({ 
        color: options.style === 'realistic' ? '#654321' : '#FF8C42',
        transparent: true,
        opacity: 0.8
      });
      
      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.set(-1.2, 0, 0);
      leftWing.rotation.z = Math.PI / 4;
      geometry.add(leftWing);
      
      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.set(1.2, 0, 0);
      rightWing.rotation.z = -Math.PI / 4;
      geometry.add(rightWing);
      
      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 12, 8),
        new THREE.MeshStandardMaterial({ color: options.style === 'realistic' ? '#A0522D' : '#FFB347' })
      );
      head.position.set(0, 1.8, 0.3);
      geometry.add(head);
      
      // Beak
      const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 0.4, 6),
        new THREE.MeshStandardMaterial({ color: '#FFA500' })
      );
      beak.position.set(0, 1.8, 0.7);
      beak.rotation.x = Math.PI / 2;
      geometry.add(beak);
      
      return geometry;
    }
    
    if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle') || lowerPrompt.includes('automobile')) {
      // Create car-like shape
      const geometry = new THREE.Group();
      
      // Main body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1, 1.5),
        new THREE.MeshStandardMaterial({ 
          color: options.style === 'realistic' ? '#FF0000' : '#00D9FF',
          metalness: 0.8,
          roughness: 0.2
        })
      );
      geometry.add(body);
      
      // Cabin
      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 1.2),
        new THREE.MeshStandardMaterial({ 
          color: options.style === 'realistic' ? '#CCCCCC' : '#0099CC',
          transparent: true,
          opacity: 0.7
        })
      );
      cabin.position.set(0, 1, 0);
      geometry.add(cabin);
      
      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
      const wheelMat = new THREE.MeshStandardMaterial({ color: '#333333' });
      
      const wheels = [
        [-1.2, -0.7, 0.8],
        [1.2, -0.7, 0.8],
        [-1.2, -0.7, -0.8],
        [1.2, -0.7, -0.8]
      ];
      
      wheels.forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(x, y, z);
        wheel.rotation.z = Math.PI / 2;
        geometry.add(wheel);
      });
      
      return geometry;
    }
    
    if (lowerPrompt.includes('house') || lowerPrompt.includes('building') || lowerPrompt.includes('home')) {
      // Create house-like shape
      const geometry = new THREE.Group();
      
      // Base
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 2, 2),
        new THREE.MeshStandardMaterial({ 
          color: options.style === 'realistic' ? '#DEB887' : '#FF9999'
        })
      );
      geometry.add(base);
      
      // Roof
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(2, 1.5, 4),
        new THREE.MeshStandardMaterial({ 
          color: options.style === 'realistic' ? '#8B4513' : '#FF6666'
        })
      );
      roof.position.set(0, 1.75, 0);
      roof.rotation.y = Math.PI / 4;
      geometry.add(roof);
      
      // Door
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 1.5, 0.1),
        new THREE.MeshStandardMaterial({ color: '#654321' })
      );
      door.position.set(0, -0.25, 1.05);
      geometry.add(door);
      
      // Windows
      const windowGeo = new THREE.BoxGeometry(0.5, 0.5, 0.05);
      const windowMat = new THREE.MeshStandardMaterial({ 
        color: '#87CEEB',
        transparent: true,
        opacity: 0.6
      });
      
      const leftWindow = new THREE.Mesh(windowGeo, windowMat);
      leftWindow.position.set(-0.8, 0.3, 1.05);
      geometry.add(leftWindow);
      
      const rightWindow = new THREE.Mesh(windowGeo, windowMat);
      rightWindow.position.set(0.8, 0.3, 1.05);
      geometry.add(rightWindow);
      
      return geometry;
    }
    
    if (lowerPrompt.includes('tree') || lowerPrompt.includes('plant') || lowerPrompt.includes('forest')) {
      // Create tree-like shape
      const geometry = new THREE.Group();
      
      // Trunk
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 2, 8),
        new THREE.MeshStandardMaterial({ color: '#8B4513' })
      );
      trunk.position.set(0, -1, 0);
      geometry.add(trunk);
      
      // Foliage layers
      const foliageColors = options.style === 'realistic' 
        ? ['#228B22', '#32CD32', '#90EE90'] 
        : ['#00FF88', '#88FF00', '#CCFF99'];
      
      foliageColors.forEach((color, i) => {
        const foliage = new THREE.Mesh(
          new THREE.SphereGeometry(1.2 - i * 0.2, 12, 8),
          new THREE.MeshStandardMaterial({ color })
        );
        foliage.position.set(0, 0.5 + i * 0.3, 0);
        geometry.add(foliage);
      });
      
      return geometry;
    }
    
    // Default complex shape for other prompts
    const geometry = new THREE.Group();
    
    // Create an interesting procedural shape based on prompt length and content
    const complexity = options.complexity === 'simple' ? 3 : options.complexity === 'medium' ? 5 : 8;
    const size = 1.5;
    
    for (let i = 0; i < complexity; i++) {
      const angle = (i / complexity) * Math.PI * 2;
      const radius = 0.5 + Math.sin(i) * 0.3;
      
      const shape = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 8, 6),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL((i / complexity + 0.3) % 1, 0.8, 0.6),
          metalness: options.style === 'realistic' ? 0.1 : 0.7,
          roughness: options.style === 'realistic' ? 0.8 : 0.3
        })
      );
      
      shape.position.set(
        Math.cos(angle) * size,
        Math.sin(angle * 0.5) * 0.5,
        Math.sin(angle) * size
      );
      
      geometry.add(shape);
    }
    
    return geometry;
  };

  const modelGeometry = createGeometry();

  return <primitive ref={meshRef} object={modelGeometry} />;
}
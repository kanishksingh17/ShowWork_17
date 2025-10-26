// 3D Rendering Pipeline - Uses React Three Fiber for WebGL generation
import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, Text, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { EnhancedContent } from './aiProcessor';
import { TemplateMetadata } from './templateEngine';

// Performance optimization for mobile devices
export const optimizeFor3D = {
  // Mobile device detection and LOD adjustment
  mobileOptimization: (scene: any) => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobile ? reducePoly(scene, 0.5) : scene;
  },
  
  // Lazy loading for non-critical 3D elements
  lazyLoad3DElements: (elements: any[]) => {
    return elements.map(el => ({
      ...el,
      loadOnScroll: el.priority < 2
    }));
  }
};

const reducePoly = (scene: any, factor: number) => {
  // Reduce polygon count for mobile optimization
  return scene;
};

// Animated Avatar Component
interface AnimatedAvatarProps {
  data: {
    name: string;
    avatar: string;
    position: [number, number, number];
  };
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ data }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y = data.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={data.position}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#1E40AF"
          attach="material"
          distort={0.3}
          speed={2}
        />
      </mesh>
      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {data.name}
      </Text>
    </Float>
  );
};

// Floating Text Component
interface FloatingTextProps {
  text: string;
  position: [number, number, number];
  color?: string;
}

const FloatingText: React.FC<FloatingTextProps> = ({ text, position, color = "#ffffff" }) => {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });
  
  return (
    <group ref={textRef} position={position}>
      <Text
        fontSize={0.8}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        {text}
      </Text>
    </group>
  );
};

// Project Carousel Component
interface ProjectCarouselProps {
  projects: any[];
  position: [number, number, number];
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects, position }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {projects.map((project, index) => {
        const angle = (index / projects.length) * Math.PI * 2;
        const x = Math.cos(angle) * 3;
        const z = Math.sin(angle) * 3;
        
        return (
          <Float key={project.id} speed={1} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={[x, 0, z]}>
              <boxGeometry args={[1, 1, 0.1]} />
              <meshStandardMaterial color="#3B82F6" />
            </mesh>
            <Text
              position={[x, -1.5, z]}
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {project.name}
            </Text>
          </Float>
        );
      })}
    </group>
  );
};

// Skills Visualization Component
interface SkillsVisualizationProps {
  skills: Array<{ name: string; level: number; category: string }>;
  position: [number, number, number];
}

const SkillsVisualization: React.FC<SkillsVisualizationProps> = ({ skills, position }) => {
  return (
    <group position={position}>
      {skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const height = skill.level / 100;
        
        return (
          <Float key={skill.name} speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh position={[x, height / 2, z]}>
              <cylinderGeometry args={[0.1, 0.1, height, 8]} />
              <meshStandardMaterial color="#8B5CF6" />
            </mesh>
            <Text
              position={[x, height + 0.5, z]}
              fontSize={0.2}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {skill.name}
            </Text>
          </Float>
        );
      })}
    </group>
  );
};

// Particle System Component
interface ParticleSystemProps {
  count: number;
  position: [number, number, number];
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ count, position }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }
    
    return { positions, colors };
  }, [count]);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors />
    </points>
  );
};

// Loading Spinner Component
const LoadingSpinner: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1, 0.2, 16, 100]} />
      <meshStandardMaterial color="#1E40AF" />
    </mesh>
  );
};

// Main Portfolio Scene Component
interface PortfolioSceneProps {
  template: TemplateMetadata;
  content: EnhancedContent;
}

const PortfolioScene: React.FC<PortfolioSceneProps> = ({ template, content }) => {
  const { camera } = useThree();
  
  // Set up camera based on template
  React.useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return (
    <>
      {/* Environment */}
      <Environment preset={template.environment} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Profile Section */}
      <AnimatedAvatar 
        data={{
          name: content.name,
          avatar: '👨‍💻',
          position: template.profilePos
        }}
      />
      
      {/* Floating Title */}
      <FloatingText 
        text={content.title}
        position={[0, template.profilePos[1] + 2, 0]}
        color={template.colors[0]}
      />
      
      {/* Project Carousel */}
      <ProjectCarousel 
        projects={content.projects.filter(p => p.featured)}
        position={[0, -1, 0]}
      />
      
      {/* Skills Visualization */}
      <SkillsVisualization 
        skills={content.skills.slice(0, 8)}
        position={[0, -3, 0]}
      />
      
      {/* Particle System */}
      <ParticleSystem count={1000} position={[0, 0, 0]} />
    </>
  );
};

// Main Portfolio Canvas Component
interface PortfolioCanvasProps {
  template: TemplateMetadata;
  content: EnhancedContent;
  onLoad?: () => void;
}

export const PortfolioCanvas: React.FC<PortfolioCanvasProps> = ({ 
  template, 
  content, 
  onLoad 
}) => {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Optimize for mobile
  const optimizedTemplate = useMemo(() => {
    return optimizeFor3D.mobileOptimization(template);
  }, [template]);
  
  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        shadows
        dpr={isMobile ? 1 : 2} // Reduce pixel ratio on mobile
        performance={{ min: 0.5 }} // Maintain 60fps
        onCreated={() => onLoad?.()}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <PortfolioScene template={optimizedTemplate} content={content} />
          <OrbitControls 
            enablePan={false}
            enableZoom={!isMobile}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Performance monitoring
export const trackPerformance = (canvas: HTMLCanvasElement) => {
  const stats = {
    fps: 0,
    frameTime: 0,
    memory: 0
  };
  
  let frameCount = 0;
  let lastTime = performance.now();
  
  const updateStats = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    
    frameCount++;
    if (frameCount % 60 === 0) {
      stats.fps = Math.round(1000 / deltaTime);
      stats.frameTime = deltaTime;
      
      // Alert if performance drops below 30fps
      if (stats.fps < 30) {
        console.warn('Performance warning: FPS below 30');
      }
    }
    
    lastTime = currentTime;
    requestAnimationFrame(updateStats);
  };
  
  updateStats();
  return stats;
};

// Export the main generation function
export const generatePortfolioScene = ({ template, content }: { 
  template: TemplateMetadata; 
  content: EnhancedContent 
}) => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5] }}>
      <Suspense fallback={<LoadingSpinner />}>
        <Environment preset={template.environment} />
        
        {/* Dynamic content injection */}
        <AnimatedAvatar 
          data={{
            name: content.name,
            avatar: '👨‍💻',
            position: template.profilePos
          }}
        />
        
        <FloatingText 
          text={content.title}
          position={[0, template.profilePos[1] + 2, 0]}
        />
        
        <ProjectCarousel 
          projects={content.projects.filter(p => p.featured)}
          position={[0, -1, 0]}
        />
        
        <SkillsVisualization 
          skills={content.skills.slice(0, 8)}
          position={[0, -3, 0]}
        />
      </Suspense>
    </Canvas>
  );
};

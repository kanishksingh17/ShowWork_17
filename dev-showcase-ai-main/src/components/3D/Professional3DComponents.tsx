// React Three Fiber 3D Integration - Professional Portfolio Experiences
import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Text,
  Float,
  MeshDistortMaterial,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

// Performance Optimization Hooks
export const usePerformanceOptimization = () => {
  const { gl, camera } = useThree();

  useEffect(() => {
    // Set pixel ratio based on device performance
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    gl.setPixelRatio(pixelRatio);

    // Enable shadows only on high-end devices
    if (navigator.hardwareConcurrency > 4) {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // Set performance target
    gl.setAnimationLoop((time) => {
      // Performance monitoring
      if (time % 1000 < 16) {
        // Check every second
        const info = gl.info;
        if (info.render.calls > 1000) {
          console.warn("High render calls detected:", info.render.calls);
        }
      }
    });
  }, [gl]);
};

// LOD (Level of Detail) System
export const useLOD = (distance: number) => {
  const { camera } = useThree();
  const [lodLevel, setLodLevel] = React.useState(0);

  useFrame(() => {
    const distanceToCamera = camera.position.distanceTo(
      new THREE.Vector3(0, 0, 0),
    );
    const newLodLevel = Math.floor(distanceToCamera / distance);
    setLodLevel(Math.min(newLodLevel, 2)); // 0 = high, 1 = medium, 2 = low
  });

  return lodLevel;
};

// Professional 3D Hero Component
interface ProfessionalHero3DProps {
  title: string;
  subtitle: string;
  ctaText: string;
  background?: "space" | "particles" | "geometric" | "minimal";
  performance?: "high" | "medium" | "low";
}

const ProfessionalHero3D: React.FC<ProfessionalHero3DProps> = ({
  title,
  subtitle,
  ctaText,
  background = "particles",
  performance = "medium",
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  // Performance optimization
  const particleCount = useMemo(() => {
    if (performance === "low" || isMobile) return 100;
    if (performance === "medium") return 500;
    return 1000;
  }, [performance, isMobile]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Background Elements */}
      {background === "particles" && <ParticleSystem count={particleCount} />}
      {background === "geometric" && <GeometricBackground />}
      {background === "space" && <SpaceBackground />}

      {/* Main Content */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Text
          position={[0, 2, 0]}
          fontSize={1.5}
          color="#1E40AF"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {title}
        </Text>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.8}
          color="#6B7280"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-regular.woff"
        >
          {subtitle}
        </Text>
      </Float>

      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.6}>
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[2, 0.5, 0.1]} />
          <meshStandardMaterial color="#3B82F6" />
        </mesh>
        <Text
          position={[0, -1, 0.1]}
          fontSize={0.3}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {ctaText}
        </Text>
      </Float>
    </group>
  );
};

// Particle System Component
interface ParticleSystemProps {
  count: number;
  color?: string;
  size?: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count,
  color = "#3B82F6",
  size = 0.02,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1](Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Color variation
      const r = Math.random();
      const g = Math.random();
      const b = Math.random();
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      pointsRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
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
      <pointsMaterial size={size} vertexColors />
    </points>
  );
};

// Geometric Background Component
const GeometricBackground: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }, (_, i) => (
        <Float
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={1}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
            ]}
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color={new THREE.Color().setHSL(Math.random(), 0.7, 0.5)}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Space Background Component
const SpaceBackground: React.FC = () => {
  return (
    <>
      <Environment preset="night" />
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#000011" side={THREE.BackSide} />
      </mesh>
    </>
  );
};

// Interactive Project Showcase Component
interface InteractiveProjectShowcaseProps {
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    image?: string;
  }>;
  onProjectSelect?: (project: any) => void;
}

const InteractiveProjectShowcase: React.FC<InteractiveProjectShowcaseProps> = ({
  projects,
  onProjectSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {projects.map((project, index) => {
        const angle = (index / projects.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <Float
            key={project.id}
            speed={1}
            rotationIntensity={0.5}
            floatIntensity={1}
          >
            <mesh
              position={[x, 0, z]}
              onClick={() => onProjectSelect?.(project)}
            >
              <boxGeometry args={[1, 1, 0.1]} />
              <meshStandardMaterial color="#1E40AF" />
            </mesh>
            <Text
              position={[x, -1.5, z]}
              fontSize={0.2}
              color="#FFFFFF"
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
  type?: "bars" | "spheres" | "network";
}

const SkillsVisualization: React.FC<SkillsVisualizationProps> = ({
  skills,
  type = "bars",
}) => {
  if (type === "bars") {
    return <SkillsBars skills={skills} />;
  }
  if (type === "spheres") {
    return <SkillsSpheres skills={skills} />;
  }
  return <SkillsNetwork skills={skills} />;
};

const SkillsBars: React.FC<{
  skills: Array<{ name: string; level: number }>;
}> = ({ skills }) => {
  return (
    <group>
      {skills.map((skill, index) => {
        const height = skill.level / 100;
        const x = (index - skills.length / 2) * 1.5;

        return (
          <Float
            key={skill.name}
            speed={1.5}
            rotationIntensity={0.3}
            floatIntensity={0.5}
          >
            <mesh position={[x, height / 2, 0]}>
              <cylinderGeometry args={[0.1, 0.1, height, 8]} />
              <meshStandardMaterial color="#8B5CF6" />
            </mesh>
            <Text
              position={[x, height + 0.5, 0]}
              fontSize={0.2}
              color="#FFFFFF"
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

const SkillsSpheres: React.FC<{
  skills: Array<{ name: string; level: number }>;
}> = ({ skills }) => {
  return (
    <group>
      {skills.map((skill, index) => {
        const radius = skill.level / 200;
        const angle = (index / skills.length) * Math.PI * 2;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;

        return (
          <Float
            key={skill.name}
            speed={1}
            rotationIntensity={0.5}
            floatIntensity={1}
          >
            <mesh position={[x, 0, z]}>
              <sphereGeometry args={[radius, 16, 16]} />
              <meshStandardMaterial color="#10B981" />
            </mesh>
            <Text
              position={[x, radius + 0.3, z]}
              fontSize={0.15}
              color="#FFFFFF"
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

const SkillsNetwork: React.FC<{
  skills: Array<{ name: string; level: number; category: string }>;
}> = ({ skills }) => {
  return (
    <group>
      {skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <Float
            key={skill.name}
            speed={0.5}
            rotationIntensity={0.2}
            floatIntensity={0.5}
          >
            <mesh position={[x, 0, z]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color="#F59E0B" />
            </mesh>
            <Text
              position={[x, 0.5, z]}
              fontSize={0.15}
              color="#FFFFFF"
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

// Professional 3D Canvas Component
interface Professional3DCanvasProps {
  children: React.ReactNode;
  performance?: "high" | "medium" | "low";
  background?: string;
  camera?: {
    position: [number, number, number];
    fov: number;
  };
  onLoad?: () => void;
}

const Professional3DCanvas: React.FC<Professional3DCanvasProps> = ({
  children,
  performance = "medium",
  background = "#0F172A",
  camera = { position: [0, 0, 5], fov: 75 },
  onLoad,
}) => {
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  // Performance settings
  const dpr = useMemo(() => {
    if (performance === "low" || isMobile) return 1;
    if (performance === "medium") return 1.5;
    return 2;
  }, [performance, isMobile]);

  const shadows = useMemo(() => {
    return performance !== "low" && !isMobile;
  }, [performance, isMobile]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
      <Canvas
        camera={camera}
        shadows={shadows}
        dpr={dpr}
        performance={{ min: 0.5 }}
        onCreated={() => onLoad?.()}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <PerformanceOptimization />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />

          {children}

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

// Performance Optimization Component
const PerformanceOptimization: React.FC = () => {
  usePerformanceOptimization();
  return null;
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

// Export main components
export {
  ProfessionalHero3D,
  InteractiveProjectShowcase,
  SkillsVisualization,
  Professional3DCanvas,
};

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, Float } from '@react-three/drei';

function Model({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={1} />;
}

export default function ModelViewer({ modelPath }: { modelPath: string }) {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          
          <Float 
            speed={1.5} 
            rotationIntensity={1} 
            floatIntensity={1}
            // Removed 'mass' as it doesn't exist on Float
          >
            <Stage 
              intensity={0.5} 
              environment="city" 
              shadows="contact" 
              adjustCamera={false}
              // Fixed: Using shadows="contact" instead of contactShadow
            >
              <Model modelPath={modelPath} />
            </Stage>
          </Float>
          
          <OrbitControls enableZoom={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}

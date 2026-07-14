import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import type { Mesh, Group } from "three";

function Knot({ accent }: { accent: string }) {
  const ref = useRef<Mesh>(null);
  const group = useRef<Group>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.25;
      ref.current.rotation.x += delta * 0.08;
    }
    if (group.current) {
      const tx = pointer.x * 0.35;
      const ty = -pointer.y * 0.25;
      group.current.rotation.y += (tx - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (ty - group.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={ref}>
        <torusKnotGeometry args={[1, 0.28, 160, 24]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh scale={1.9}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function Hero3DInner() {
  const [accent, setAccent] = useState("#D4A574");
  useEffect(() => {
    const read = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      if (v) setAccent(v);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.4} />
      <Knot accent={accent} />
    </Canvas>
  );
}

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

function useAccent() {
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
  return accent;
}

function usePointer() {
  const ref = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      ref.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", on);
    return () => window.removeEventListener("pointermove", on);
  }, []);
  return ref;
}

function useScrollProgress() {
  const ref = useRef(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      ref.current = h > 0 ? Math.min(1, window.scrollY / h) : 0;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return ref;
}

/**
 * Distorted icosphere with vertex-shader noise displacement.
 * Cursor bends toward pointer; scroll intensifies distortion and rotation.
 */
function DistortSphere({ accent, pointer, scroll }: { accent: string; pointer: React.MutableRefObject<{x:number;y:number;tx:number;ty:number}>; scroll: React.MutableRefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDistort: { value: 0.35 },
      uColor: { value: new THREE.Color(accent) },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useEffect(() => {
    if (mat.current) (mat.current.uniforms.uColor.value as THREE.Color).set(accent);
  }, [accent]);

  useFrame((_, delta) => {
    if (!mesh.current || !mat.current) return;
    // ease pointer
    pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.08;
    pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.08;
    const s = scroll.current;
    mat.current.uniforms.uTime.value += delta * (0.35 + s * 1.2);
    mat.current.uniforms.uDistort.value = 0.28 + s * 0.55 + Math.hypot(pointer.current.x, pointer.current.y) * 0.15;
    (mat.current.uniforms.uPointer.value as THREE.Vector2).set(pointer.current.x, pointer.current.y);

    mesh.current.rotation.y += delta * (0.15 + s * 0.6);
    mesh.current.rotation.x = pointer.current.y * 0.4 - s * 0.4;
    const scale = 1 - s * 0.15;
    mesh.current.scale.setScalar(scale);
  });

  const vertex = /* glsl */ `
    uniform float uTime;
    uniform float uDistort;
    uniform vec2 uPointer;
    varying float vNoise;
    varying vec3 vNormal;

    // 3D simplex-ish noise (cheap classic noise by Ashima)
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0);
      const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.0-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(
        i.z+vec4(0.0,i1.z,i2.z,1.0))
        +i.y+vec4(0.0,i1.y,i2.y,1.0))
        +i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy;
      vec4 y=y_*ns.x+ns.yyyy;
      vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0;
      vec4 s1=floor(b1)*2.0+1.0;
      vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
      m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    void main(){
      vec3 pos = position;
      float n = snoise(pos * 1.6 + vec3(uTime * 0.6, uTime * 0.4, 0.0) + vec3(uPointer * 1.2, 0.0));
      vNoise = n;
      vNormal = normal;
      pos += normal * n * uDistort;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragment = /* glsl */ `
    uniform vec3 uColor;
    varying float vNoise;
    varying vec3 vNormal;
    void main(){
      float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.0);
      float glow = 0.35 + vNoise * 0.5 + rim * 0.6;
      vec3 col = uColor * glow;
      gl_FragColor = vec4(col, 0.9);
    }
  `;

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.15, 48]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        wireframe
        transparent
      />
    </mesh>
  );
}

function OrbitField({ accent, pointer, scroll, count = 220 }: { accent: string; pointer: ReturnType<typeof usePointer>; scroll: ReturnType<typeof useScrollProgress>; count?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.7 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!points.current) return;
    const s = scroll.current;
    points.current.rotation.y += delta * (0.1 + s * 0.4);
    points.current.rotation.x = pointer.current.y * 0.3;
    points.current.rotation.z = pointer.current.x * 0.3;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={accent} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export default function Hero3DInner() {
  const accent = useAccent();
  const pointer = usePointer();
  const scroll = useScrollProgress();
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.5} />
      <DistortSphere accent={accent} pointer={pointer} scroll={scroll} />
      <OrbitField accent={accent} pointer={pointer} scroll={scroll} />
    </Canvas>
  );
}

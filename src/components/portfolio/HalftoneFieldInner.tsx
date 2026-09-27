import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function useThemeColors() {
  const ref = useRef({
    bg: new THREE.Color("#0A0A0A"),
    fg: new THREE.Color("#EDEDED"),
    accent: new THREE.Color("#D4A574"),
  });
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const bg = cs.getPropertyValue("--bg").trim() || "#0A0A0A";
      const fg = cs.getPropertyValue("--text").trim() || "#EDEDED";
      const accent = cs.getPropertyValue("--accent").trim() || "#D4A574";
      ref.current.bg.set(bg);
      ref.current.fg.set(fg);
      ref.current.accent.set(accent);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return ref;
}

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Ripple trail: recent pointer positions that each emit an expanding wave.
const TRAIL = 16;
const RIPPLE_LIFE = 1.8;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec4 uTrail[${TRAIL}];
  uniform vec3 uBg;
  uniform vec3 uFg;
  uniform vec3 uAccent;
  uniform float uStrength;
  uniform float uDotSize;

  // simplex noise (Ashima)
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0;
    vec3 h=abs(x)-0.5;
    vec3 ox=floor(x+0.5);
    vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }

  float fbm(vec2 p){
    float s=0.0;
    float a=0.5;
    for(int i=0;i<3;i++){
      s+=a*snoise(p);
      // Brisk large-scale drift — the wave visibly travels across the field
      p=p*2.05+vec2(uTime*0.24, -uTime*0.17);
      a*=0.52;
    }
    return s;
  }

  // Ambient tone field, sampled once per dot at its cell center.
  float tone(vec2 uv){
    vec2 p = vec2(uv.x * 0.85, uv.y * 1.55) + vec2(uTime * 0.11, uTime * 0.065);
    float n = fbm(p);
    vec2 p2 = vec2(uv.x * 2.1, uv.y * 2.6) + vec2(-uTime * 0.22, uTime * 0.16);
    n += snoise(p2) * 0.28;
    float g = smoothstep(0.0, 0.62, n);
    g = pow(g, 1.15);
    return clamp(g * uStrength, 0.0, 1.0);
  }

  // Coverage of the variable-radius halftone dot under a (possibly warped)
  // pixel. Warping the lookup — not the tone — is what makes the ripple read
  // as liquid glass: the dot grid itself bends.
  float dotAt(vec2 frag){
    vec2 cell = floor(frag / uDotSize);
    vec2 c = (cell + 0.5) * uDotSize;
    vec2 uv = (c - 0.5 * uResolution) / uResolution.y;
    float r = uDotSize * 0.48 * sqrt(tone(uv));
    float e = uDotSize * 0.14;
    return 1.0 - smoothstep(r - e, r + e, length(frag - c));
  }

  void main(){
    vec2 frag = gl_FragCoord.xy;

    // Ripple waves emitted along the pointer trail.
    vec2 disp = vec2(0.0);
    float energy = 0.0;
    for (int i = 0; i < ${TRAIL}; i++) {
      vec4 t = uTrail[i];
      if (t.z > ${RIPPLE_LIFE.toFixed(1)}) continue;
      vec2 d = frag - t.xy;
      float dl = length(d);
      float x = dl / uResolution.y - t.z * 0.42;
      float env = exp(-x * x * 260.0) * exp(-t.z * 2.4) * t.w;
      disp += (d / max(dl, 1.0)) * sin(x * 70.0) * env * uResolution.y * 0.012;
      energy += env;
    }
    energy = clamp(energy, 0.0, 1.0);

    // Chromatic split only where a wave is actually bending the field.
    float dg = dotAt(frag + disp);
    vec3 cov = vec3(dg);
    if (energy > 0.02) {
      cov.r = dotAt(frag + disp * 1.1);
      cov.b = dotAt(frag + disp * 0.9);
    }
    vec3 col = mix(uBg, uFg, cov);
    col = mix(col, uAccent, energy * dg * 0.55);

    gl_FragColor = vec4(col, 1.0);
  }
`;

type Ripple = { x: number; y: number; age: number; amp: number };

function Quad({
  strength,
  trail,
}: {
  strength: number;
  trail: React.MutableRefObject<Ripple[]>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const colors = useThemeColors();
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const classReduced = useMemo(
    () => () => typeof document !== "undefined" && document.documentElement.classList.contains("a11y-reduce"),
    []
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTrail: { value: Array.from({ length: TRAIL }, () => new THREE.Vector4(0, 0, 99, 0)) },
      uBg: { value: new THREE.Color("#0A0A0A") },
      uFg: { value: new THREE.Color("#EDEDED") },
      uAccent: { value: new THREE.Color("#D4A574") },
      uStrength: { value: strength },
      uDotSize: { value: 5.5 },
    }),
    [strength]
  );

  useFrame((_, rawDt) => {
    if (!mat.current) return;
    const dt = Math.min(rawDt, 0.05);
    const u = mat.current.uniforms;
    if (!reduced && !classReduced()) u.uTime.value += dt;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    u.uResolution.value.set(size.width * dpr, size.height * dpr);
    u.uBg.value.copy(colors.current.bg);
    u.uFg.value.copy(colors.current.fg);
    u.uAccent.value.copy(colors.current.accent);

    const vecs = u.uTrail.value as THREE.Vector4[];
    trail.current.forEach((r, i) => {
      r.age += dt;
      vecs[i].set(r.x * dpr, (size.height - r.y) * dpr, r.age, r.amp);
    });
    u.uDotSize.value = window.innerWidth < 640 ? 4.5 : 5.5;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

export default function HalftoneFieldInner({
  strength = 1,
  interactive = false,
}: {
  strength?: number;
  interactive?: boolean;
}) {
  const trail = useRef<Ripple[]>(
    Array.from({ length: TRAIL }, () => ({ x: 0, y: 0, age: 99, amp: 0 }))
  );
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("a11y-reduce");
    let next = 0;
    let last = { x: -9999, y: -9999, t: 0 };

    const emit = (x: number, y: number, amp: number) => {
      if (reduced()) return;
      trail.current[next] = { x, y, age: 0, amp };
      next = (next + 1) % TRAIL;
    };

    // Content sits above the canvas, so track the pointer on window and
    // hit-test against the field's own box.
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      const now = performance.now();
      const moved = Math.hypot(x - last.x, y - last.y);
      if (moved > 18 && now - last.t > 40) {
        emit(x, y, Math.min(1, 0.35 + moved / 160));
        last = { x, y, t: now };
      }
    };
    const onDown = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      emit(x, y, interactive ? 2.2 : 1.5);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [interactive]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      style={{ touchAction: interactive ? "none" : "auto" }}
    >
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        camera={{ position: [0, 0, 1] }}
      >
        <Quad strength={strength} trail={trail} />
      </Canvas>
    </div>
  );
}

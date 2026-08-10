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

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseDown;
  uniform float uMouseActive;
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

  // Tone field sampled at a single point (used once per dot, at its cell
  // center) — a true variable-radius halftone instead of a per-pixel
  // ordered-dither pattern. Returns coverage plus an "energy" value used to
  // tint dots toward the accent color near live interaction.
  float tone(vec2 uv, float d, vec2 toM, out float energy){
    float ambientPush = smoothstep(0.4, 0.0, d) * 0.42 * uMouseActive;
    float heldPush = smoothstep(0.95, 0.0, d) * uMouseDown * 1.9;
    vec2 dir = normalize(toM + 1e-5);
    vec2 warped = uv + dir * (ambientPush + heldPush);

    // Primary wave: wider spatial spread so motion reads across the whole
    // canvas rather than one soft blob in a corner.
    vec2 p = vec2(warped.x * 0.85, warped.y * 1.55) + vec2(uTime * 0.11, uTime * 0.065);
    float n = fbm(p);

    // Secondary, faster, finer layer adds visual complexity/energy on top
    // of the primary wave — still sampled once per dot, so it stays smooth.
    vec2 p2 = vec2(warped.x * 2.1, warped.y * 2.6) + vec2(-uTime * 0.22, uTime * 0.16);
    float n2 = snoise(p2);
    n += n2 * 0.28;

    // Punchier contrast: a tighter band makes the dot swings more graphic.
    float g = smoothstep(0.0, 0.62, n);
    g = pow(g, 1.15);

    float ring = sin(d * 20.0 - uTime * 4.2) * 0.5 + 0.5;
    float ringMask = smoothstep(0.62, 0.0, d) * uMouseActive * (0.35 + 0.9 * uMouseDown);
    g += ring * ringMask * 0.8;

    float shock = smoothstep(0.95, 0.0, d) * uMouseDown;
    g += shock * 0.6;

    energy = clamp(ringMask * ring + shock * 1.2 + ambientPush * 0.6, 0.0, 1.0);

    return clamp(g * uStrength, 0.0, 1.0);
  }

  void main(){
    vec2 frag = gl_FragCoord.xy;

    // Sample the tone field once per dot cell (at the cell's own center) so
    // every dot gets one consistent radius — a true variable-radius halftone
    // instead of a per-pixel ordered-dither pattern.
    vec2 cell = floor(frag / uDotSize);
    vec2 cellCenterPx = (cell + 0.5) * uDotSize;
    vec2 uv = (cellCenterPx - 0.5 * uResolution) / uResolution.y;
    vec2 mouseUv = (uMouse - 0.5 * uResolution) / uResolution.y;
    vec2 toM = uv - mouseUv;
    float d = length(toM);

    float energy = 0.0;
    float g = tone(uv, d, toM, energy);

    // Soft, anti-aliased circular dot whose radius tracks the tone field.
    // sqrt(g) keeps perceived coverage roughly linear with tone.
    float maxR = uDotSize * 0.48;
    float r = maxR * sqrt(g);
    float distPx = length(frag - cellCenterPx);
    float edge = uDotSize * 0.14;
    float dot = 1.0 - smoothstep(r - edge, r + edge, distPx);

    vec3 col = mix(uBg, uFg, dot);
    // Dots near live interaction glow toward the accent color.
    col = mix(col, uAccent, energy * dot * 0.6);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Quad({
  strength,
  interactive,
  mouse,
  mouseDown,
  mouseActive,
}: {
  strength: number;
  interactive: boolean;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  mouseDown: React.MutableRefObject<number>;
  mouseActive: React.MutableRefObject<number>;
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
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uMouseDown: { value: 0 },
      uMouseActive: { value: 0 },
      uBg: { value: new THREE.Color("#0A0A0A") },
      uFg: { value: new THREE.Color("#EDEDED") },
      uAccent: { value: new THREE.Color("#D4A574") },
      uStrength: { value: strength },
      uDotSize: { value: 5.5 },
    }),
    [strength]
  );

  useFrame((_, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    if (!reduced && !classReduced()) u.uTime.value += dt;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    u.uResolution.value.set(size.width * dpr, size.height * dpr);
    u.uBg.value.copy(colors.current.bg);
    u.uFg.value.copy(colors.current.fg);
    u.uAccent.value.copy(colors.current.accent);
    // ease mouseDown 0..1 (~300ms up / ~500ms down)
    const target = mouseDown.current;
    const speed = target > u.uMouseDown.value ? 0.14 : 0.08;
    u.uMouseDown.value += (target - u.uMouseDown.value) * speed;
    // ease continuous mouseActive presence
    u.uMouseActive.value += (mouseActive.current - u.uMouseActive.value) * 0.12;
    u.uMouse.value.set(mouse.current.x * dpr, (size.height - mouse.current.y) * dpr);
    u.uDotSize.value = window.innerWidth < 640 ? 4.5 : 5.5;
  });

  // silence unused warning
  void interactive;

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
  const mouse = useRef({ x: -9999, y: -9999 });
  const mouseDown = useRef(0);
  const mouseActive = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left;
      mouse.current.y = e.clientY - r.top;
      mouseActive.current = 1;
    };
    const onLeave = () => {
      mouseActive.current = 0;
      mouseDown.current = 0;
    };
    const onDown = () => { if (interactive) mouseDown.current = 1; };
    const onUp = () => { mouseDown.current = 0; };
    // listen on window for pointermove so hero cursor drives shader across children
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      style={{ touchAction: interactive ? "none" : "auto", cursor: interactive ? "grab" : "default" }}
    >
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        camera={{ position: [0, 0, 1] }}
      >
        <Quad strength={strength} interactive={interactive} mouse={mouse} mouseDown={mouseDown} mouseActive={mouseActive} />
      </Canvas>
    </div>
  );
}

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function useThemeColors() {
  const ref = useRef({ bg: new THREE.Color("#0A0A0A"), fg: new THREE.Color("#EDEDED") });
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const bg = cs.getPropertyValue("--bg").trim() || "#0A0A0A";
      const fg = cs.getPropertyValue("--text").trim() || "#EDEDED";
      ref.current.bg.set(bg);
      ref.current.fg.set(fg);
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
      p=p*2.02+vec2(uTime*0.04, -uTime*0.025);
      a*=0.5;
    }
    return s;
  }

  // 8x8 Bayer matrix
  float bayer(int x, int y){
    int m[64];
    m[0]=0; m[1]=32; m[2]=8; m[3]=40; m[4]=2; m[5]=34; m[6]=10; m[7]=42;
    m[8]=48; m[9]=16; m[10]=56; m[11]=24; m[12]=50; m[13]=18; m[14]=58; m[15]=26;
    m[16]=12; m[17]=44; m[18]=4; m[19]=36; m[20]=14; m[21]=46; m[22]=6; m[23]=38;
    m[24]=60; m[25]=28; m[26]=52; m[27]=20; m[28]=62; m[29]=30; m[30]=54; m[31]=22;
    m[32]=3; m[33]=35; m[34]=11; m[35]=43; m[36]=1; m[37]=33; m[38]=9; m[39]=41;
    m[40]=51; m[41]=19; m[42]=59; m[43]=27; m[44]=49; m[45]=17; m[46]=57; m[47]=25;
    m[48]=15; m[49]=47; m[50]=7; m[51]=39; m[52]=13; m[53]=45; m[54]=5; m[55]=37;
    m[56]=63; m[57]=31; m[58]=55; m[59]=23; m[60]=61; m[61]=29; m[62]=53; m[63]=21;
    return float(m[y*8+x])/64.0;
  }

  void main(){
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = (frag - 0.5 * uResolution) / uResolution.y;

    // Mouse in same normalized space
    vec2 mouseUv = (uMouse - 0.5 * uResolution) / uResolution.y;
    vec2 toM = uv - mouseUv;
    float d = length(toM);

    // Always-on subtle ripple near cursor + amplified push on hold
    float ambientPush = smoothstep(0.30, 0.0, d) * 0.12 * uMouseActive;
    float heldPush = smoothstep(0.50, 0.0, d) * uMouseDown * 0.55;
    vec2 dir = normalize(toM + 1e-5);
    vec2 warped = uv + dir * (ambientPush + heldPush);

    // Low-frequency wave: one or two peaks across viewport width
    vec2 p = vec2(warped.x * 0.55, warped.y * 1.15);
    float n = fbm(p);

    // Shift threshold so most of frame is BELOW zero → low density,
    // only crests rise up. Bias more with pow.
    float g = smoothstep(0.15, 0.85, n);
    g = pow(g, 1.8);

    // Wave ripple driven by continuous mouse for feedback even w/o click
    float ring = sin(d * 22.0 - uTime * 2.2) * 0.5 + 0.5;
    float ringMask = smoothstep(0.35, 0.0, d) * uMouseActive * (0.10 + 0.35 * uMouseDown);
    g += ring * ringMask * 0.35;

    g = clamp(g * uStrength, 0.0, 1.0);

    // Dot cell — quantize fragment to dot grid
    vec2 cell = floor(frag / uDotSize);
    int bx = int(mod(cell.x, 8.0));
    int by = int(mod(cell.y, 8.0));
    float t = bayer(bx, by);
    float dither = step(t, g);

    vec3 col = mix(uBg, uFg, dither);
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

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uMouseDown: { value: 0 },
      uMouseActive: { value: 0 },
      uBg: { value: new THREE.Color("#0A0A0A") },
      uFg: { value: new THREE.Color("#EDEDED") },
      uStrength: { value: strength },
      uDotSize: { value: 3.5 },
    }),
    [strength]
  );

  useFrame((_, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    if (!reduced) u.uTime.value += dt;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    u.uResolution.value.set(size.width * dpr, size.height * dpr);
    u.uBg.value.copy(colors.current.bg);
    u.uFg.value.copy(colors.current.fg);
    // ease mouseDown 0..1 (~300ms up / ~500ms down)
    const target = mouseDown.current;
    const speed = target > u.uMouseDown.value ? 0.14 : 0.08;
    u.uMouseDown.value += (target - u.uMouseDown.value) * speed;
    // ease continuous mouseActive presence
    u.uMouseActive.value += (mouseActive.current - u.uMouseActive.value) * 0.12;
    u.uMouse.value.set(mouse.current.x * dpr, (size.height - mouse.current.y) * dpr);
    u.uDotSize.value = window.innerWidth < 640 ? 3.0 : 3.5;
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

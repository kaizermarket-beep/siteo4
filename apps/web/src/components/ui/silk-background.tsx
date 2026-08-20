"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Flowing-silk hero backdrop.
//
// The look (and the pattern math below) comes from the 21st.dev
// "Silk-Background-animation" component, but that one computes the effect
// in a per-pixel JavaScript loop on a 2D canvas — roughly half a million
// iterations of sin/cos per frame plus a putImageData, on the main thread,
// every frame. Published client sites can't carry that, so the same math
// runs here as a GLSL fragment shader on the GPU via the react-three-fiber
// already used by the gallery3d hero.
//
// The silk is tinted with the template's own --site-accent, so a gold
// salon and a plum one get the same fabric in their own color.

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;

  // Cheap hash noise — breaks up the banding the pure sine pattern leaves.
  float noise(vec2 p) {
    float g = 2.71828;
    float rx = g * sin(g * p.x);
    float ry = g * sin(g * p.y);
    return fract(rx * ry * (1.0 + p.x));
  }

  void main() {
    vec2 uv = vUv * 2.0;
    float t = uTime;

    // Warp the vertical axis so the weave drifts like hanging fabric.
    float x = uv.x;
    float y = uv.y + 0.03 * sin(8.0 * x - t);

    float pattern = 0.6 + 0.4 * sin(
      5.0 * (x + y + cos(3.0 * x + 5.0 * y) + 0.02 * t)
      + sin(20.0 * (x + y - 0.1 * t))
    );

    float grain = noise(vUv * 500.0) / 15.0 * 0.8;
    float intensity = max(0.0, pattern - grain);

    vec3 col = uColor * intensity;

    // Vignette: keeps the headline legible over the brightest folds.
    float d = distance(vUv, vec2(0.5));
    col *= smoothstep(0.95, 0.25, d);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function SilkPlane({ color, animate }: { color: THREE.Color; animate: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: color } }),
    [color]
  );

  useFrame((_, delta) => {
    if (!animate || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta * 0.6;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function SilkBackground({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState(() => new THREE.Color("#7b7481"));
  const [animate, setAnimate] = useState(true);

  // --site-accent is a CSS custom property set per template, so read the
  // resolved value off the DOM rather than threading the color through props.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const accent = getComputedStyle(host).getPropertyValue("--site-accent").trim();
    if (accent) {
      try {
        // Lift very dark accents so the weave still reads as fabric.
        const c = new THREE.Color(accent);
        const hsl = { h: 0, s: 0, l: 0 };
        c.getHSL(hsl);
        c.setHSL(hsl.h, Math.min(hsl.s, 0.5), Math.max(hsl.l, 0.42));
        setColor(c);
      } catch {
        /* keep the neutral silk default */
      }
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAnimate(!media.matches);
    const onChange = () => setAnimate(!media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <div ref={hostRef} className={className}>
      <Canvas
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <SilkPlane color={color} animate={animate} />
      </Canvas>
    </div>
  );
}

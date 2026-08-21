"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A turning barber pole.
//
// Every abstract option — rays, orbs, gradients — reads as "a shader",
// which is the whole problem: nothing about them says barbershop. The pole
// is the one object that cannot be mistaken for anything else. It exists
// precisely to be recognised from the pavement, which is also what a hero
// has to do.
//
// Kept out of kitsch by treatment rather than by restraint of subject:
// desaturated cream and oxblood instead of fairground red-white-blue, the
// pole pushed off-centre and cropped, one warm light in an otherwise dark
// room.

// Diagonal bands drawn in UV space become a helix once wrapped on a
// cylinder — the stripe geometry comes free from the mapping.
function makeStripeTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ded7c9"; // aged cream, not white
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "#6b2225"; // oxblood, not pillar-box red
  ctx.lineWidth = size / 7;
  ctx.lineCap = "butt";
  // Two passes offset by the canvas size keep the diagonal continuous
  // across the seam, so the helix does not visibly break.
  for (let i = -2; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(i * size * 0.5 - size, size);
    ctx.lineTo(i * size * 0.5, 0);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 3);
  tex.anisotropy = 4;
  return tex;
}

function Pole({ accent, animate }: { accent: THREE.Color; animate: boolean }) {
  const stripes = useMemo(() => makeStripeTexture(), []);
  const texRef = useRef<THREE.CanvasTexture>(stripes);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!animate) return;
    // Scrolling the texture, not spinning the mesh: a real pole reads as an
    // endless upward travel, which spinning alone does not reproduce.
    texRef.current.offset.y -= delta * 0.09;
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
  });

  useEffect(() => () => stripes.dispose(), [stripes]);

  const chrome = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#8d8f93", metalness: 1, roughness: 0.28 }),
    []
  );

  return (
    <group ref={groupRef} rotation={[0, 0, 0.13]} position={[2.05, -0.1, 0]} scale={0.92}>
      {/* glass cylinder carrying the helix */}
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 3.1, 48, 1, true]} />
        <meshStandardMaterial map={stripes} roughness={0.35} metalness={0.05} />
      </mesh>
      {/* chrome end caps — the part that actually catches the light */}
      <mesh position={[0, 1.72, 0]} material={chrome}>
        <cylinderGeometry args={[0.5, 0.46, 0.34, 48]} />
      </mesh>
      <mesh position={[0, -1.72, 0]} material={chrome}>
        <cylinderGeometry args={[0.46, 0.5, 0.34, 48]} />
      </mesh>
      <mesh position={[0, 2.02, 0]} material={chrome}>
        <sphereGeometry args={[0.26, 32, 24]} />
      </mesh>
      <mesh position={[0, -2.02, 0]} material={chrome}>
        <sphereGeometry args={[0.26, 32, 24]} />
      </mesh>
      {/* warm bounce so the chrome has something to reflect */}
      <pointLight position={[-1.6, 0.4, 2.2]} intensity={9} distance={9} color={accent} />
    </group>
  );
}

export function BarberPole({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [accent, setAccent] = useState(() => new THREE.Color("#B45309"));
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const value = getComputedStyle(host).getPropertyValue("--site-accent").trim();
    if (value) {
      try {
        setAccent(new THREE.Color(value));
      } catch {
        /* keep the copper default */
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
        camera={{ position: [0, 0, 6.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.75]}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.35} />
        {/* key light from the upper left, the way a shop awning lamp sits */}
        <spotLight
          position={[-4, 5, 4]}
          angle={0.6}
          penumbra={0.9}
          intensity={62}
          color="#fff3e0"
        />
        <Pole accent={accent} animate={animate} />
      </Canvas>
    </div>
  );
}

"use client";

// Volumetric light-shaft background.
//
// Vendored from the 21st.dev Shader Builder recipe "God Rays", itself
// adapted from Paper Shaders (https://shaders.paper.design/god-rays),
// licensed under Apache-2.0.
//
// Changed from the published component: the palette and the uniforms that
// shape the rays are props instead of module constants, so one engine can
// dress a bright salon and a dark barbershop without two copies of the
// shader. Cursor interaction, domain warp and the 5-tap blur were dropped
// as unused here.
//
// Kept as published: the lifecycle machinery. It pauses via
// IntersectionObserver when scrolled out of view and via visibilitychange
// when the tab is hidden, caps DPR at 2 and total pixels at 2M, and
// releases the WebGL context on unmount. That is what makes it safe to put
// several of these on the metier listing page — only the hero actually on
// screen draws.

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_vignette u_finish.y
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mix(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 shade(vec2 p, float t) {
  vec2 origin = vec2(0.0, -0.58);
  vec2 q = p - origin;
  float angle = atan(q.y, q.x);
  float radius = length(q);
  float density = 5.0 + u_intensity * 18.0;
  float n = fbm(vec2(angle * density * 0.16 + u_seed, radius * 1.7 - t * 0.08));
  float rays = pow(max(0.0, sin(angle * density + n * 5.0 + t * 0.16)), 5.0);
  rays *= exp(-radius * 1.15) * (1.0 - smoothstep(0.05, 1.1, radius));
  float bloom = exp(-radius * (9.0 - u_paramA * 6.0));
  float v = clamp(rays * (0.8 + u_intensity) + bloom * (0.25 + u_paramA), 0.0, 1.0);
  return palette(v);
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);

  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }

  vec3 col = shade(p, u_time);

  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export type GodRaysProps = {
  className?: string;
  /** 2-8 sRGB triplets in 0..1: darkest ground first, brightest light last. */
  colors: [number, number, number][];
  scale?: number;
  intensity?: number;
  paramA?: number;
  contrast?: number;
  brightness?: number;
  saturation?: number;
  vignette?: number;
  grain?: number;
  seed?: number;
  rotate?: number;
  timeScale?: number;
};

const pendingContextReleases = new WeakMap<HTMLCanvasElement, number>();

export function GodRays(props: GodRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Read config through a ref so tweaking a knob never tears down the GL
  // context. Synced in an effect, not during render — the render loop only
  // ever reads it, and writing a ref while rendering is a React rule break.
  const cfg = useRef(props);
  useEffect(() => {
    cfg.current = props;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pending = pendingContextReleases.get(canvas);
    if (pending !== undefined) window.clearTimeout(pending);
    pendingContextReleases.delete(canvas);

    const glOrNull = canvas.getContext("webgl", { antialias: false });
    if (!glOrNull) return;
    // Pinned after the null checks: `render` below is a hoisted function
    // declaration, so TypeScript won't carry the narrowing into it.
    const gl = glOrNull;
    const cv = canvas;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uni = {
      colors: gl.getUniformLocation(program, "u_colors"),
      scene: gl.getUniformLocation(program, "u_scene"),
      shape: gl.getUniformLocation(program, "u_shape"),
      surface: gl.getUniformLocation(program, "u_surface"),
      finish: gl.getUniformLocation(program, "u_finish"),
      transform: gl.getUniformLocation(program, "u_transform"),
    };

    let bounds = canvas.getBoundingClientRect();
    let raf = 0;
    let visible = document.visibilityState === "visible";
    let inView = true;
    let disposed = false;
    const start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rawW = Math.max(1, Math.round(bounds.width * dpr));
      const rawH = Math.max(1, Math.round(bounds.height * dpr));
      const pixelScale = Math.min(1, Math.sqrt(2000000 / Math.max(1, rawW * rawH)));
      const width = Math.max(1, Math.round(rawW * pixelScale));
      const height = Math.max(1, Math.round(rawH * pixelScale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    function requestRender() {
      if (!disposed && visible && inView && raf === 0) raf = requestAnimationFrame(render);
    }

    const updateLayout = () => {
      bounds = canvas.getBoundingClientRect();
      resizeCanvas();
      requestRender();
    };
    window.addEventListener("resize", updateLayout);

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(canvas);

    // Why several of these can coexist: off-screen heroes stop drawing.
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) requestRender();
      else if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    intersectionObserver.observe(canvas);

    const onVisibilityChange = () => {
      visible = document.visibilityState === "visible";
      if (visible) requestRender();
      else if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function render(now: number) {
      raf = 0;
      if (disposed || !visible || !inView) return;
      const c = cfg.current;
      resizeCanvas();

      const flat = new Float32Array(24);
      for (let i = 0; i < 8; i++) {
        const col = c.colors[Math.min(i, c.colors.length - 1)];
        flat[i * 3] = col[0];
        flat[i * 3 + 1] = col[1];
        flat[i * 3 + 2] = col[2];
      }
      gl.uniform3fv(uni.colors, flat);
      gl.uniform4f(uni.shape, c.scale ?? 1.26, c.intensity ?? 0.35, c.paramA ?? 0.28, 0);
      gl.uniform4f(uni.surface, 1.824, c.contrast ?? 1.005, c.brightness ?? 0, c.saturation ?? 1);
      gl.uniform4f(uni.finish, 0, c.vignette ?? 0, 0, c.grain ?? 0.042);
      gl.uniform4f(uni.transform, c.seed ?? 1, c.rotate ?? 0, 0, 0);

      // Freeze time rather than the loop: a still, correctly-lit frame.
      const t = reduced.matches ? 0 : ((now - start) / 1000) * (c.timeScale ?? 0.575);
      gl.uniform4f(uni.scene, cv.width, cv.height, t, c.colors.length);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced.matches) requestRender();
    }

    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", updateLayout);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      const releaseTimer = window.setTimeout(() => {
        if (pendingContextReleases.get(canvas) !== releaseTimer) return;
        pendingContextReleases.delete(canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        canvas.width = 1;
        canvas.height = 1;
      }, 0);
      pendingContextReleases.set(canvas, releaseTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={props.className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}

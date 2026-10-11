import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/*
  Fixed full-screen WebGL layer that sits behind the page content.
  - Floating wireframe solids are laid out down the whole page; scrolling flies the camera past them.
  - The mouse gives a gentle parallax, scroll speed makes the shapes spin faster.
  - Red dust particles drift in 3D depth.
  - Respects prefers-reduced-motion (renders static frames only) and pauses when the tab is hidden.
*/

const RED = 0xe50914;
const TRAVEL = 46; // world units the camera travels from top to bottom of the page

export default function Scene3D() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 700;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (err) {
      return; // WebGL unavailable: the page still works without the 3D layer
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.035);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);
    camera.position.set(0, 0, 9);

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.PointLight(0xff2a36, 140, 0, 2);
    const fill = new THREE.PointLight(0xffffff, 45, 0, 2);
    scene.add(key, fill);

    // ---- floating shapes ----
    const makers = [
      () => new THREE.IcosahedronGeometry(1.1, 0),
      () => new THREE.TorusKnotGeometry(0.8, 0.26, 110, 14),
      () => new THREE.OctahedronGeometry(1.25, 0),
      () => new THREE.TorusGeometry(1, 0.09, 12, 56),
      () => new THREE.DodecahedronGeometry(1, 0),
      () => new THREE.BoxGeometry(1.4, 1.4, 1.4),
    ];
    const N = small ? 8 : 14;
    const shapes = [];
    for (let i = 0; i < N; i++) {
      const geo = makers[i % makers.length]();
      const solid = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: 0x1b0a0d, metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.9 })
      );
      const wire = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: RED, wireframe: true, transparent: true, opacity: 0.55 })
      );
      wire.scale.setScalar(1.015);
      const g = new THREE.Group();
      g.add(solid, wire);

      const sign = i % 2 ? 1 : -1;
      const base = (0.7 + Math.random() * 0.9) * (small ? 0.62 : 1);
      g.scale.setScalar(base);
      g.userData = {
        ux: sign * (0.42 + Math.random() * 0.42), // fraction of the half-width, resolved in layout()
        y: -(i / (N - 1)) * TRAVEL - 1 - Math.random() * 2,
        sx: 0.12 + Math.random() * 0.3,
        sy: 0.15 + Math.random() * 0.35,
        f: 0.4 + Math.random() * 0.5,
        ph: Math.random() * 6.28,
        dir: Math.random() < 0.5 ? -1 : 1,
      };
      g.position.set(0, g.userData.y, -4 + Math.random() * 4);
      g.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      scene.add(g);
      shapes.push(g);
    }

    // ---- dust ----
    const COUNT = small ? 350 : 800;
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = 8 - Math.random() * (TRAVEL + 16);
      arr[i * 3 + 2] = -10 + Math.random() * 16;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xff4a52,
        size: 0.06,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(dust);

    // ---- layout / sizing ----
    let maxScroll = 1;
    const measure = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const layout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
      shapes.forEach((s) => (s.position.x = s.userData.ux * halfW));
      measure();
    };

    // ---- input ----
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // ---- render ----
    const clock = new THREE.Clock();
    let raf = 0;
    let smooth = 0;
    let vel = 0;
    let lastY = window.scrollY;

    const draw = (dt, t, instant) => {
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, y / maxScroll));
      vel += (y - lastY - vel) * 0.15;
      lastY = y;
      smooth = instant ? p : smooth + (p - smooth) * 0.08;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      camera.position.y = -smooth * TRAVEL;
      camera.position.x = mouse.x * 0.8;
      camera.rotation.y = -mouse.x * 0.06;
      camera.rotation.x = -mouse.y * 0.04;

      const boost = Math.min(Math.abs(vel) * 0.004, 0.08);
      for (const s of shapes) {
        const d = s.userData;
        s.rotation.x += dt * d.sx + boost * d.dir;
        s.rotation.y += dt * d.sy + boost;
        s.position.y = d.y + Math.sin(t * d.f + d.ph) * 0.35;
      }
      dust.rotation.y = t * 0.015;

      key.position.set(camera.position.x + 4, camera.position.y + 3, 6);
      fill.position.set(camera.position.x - 4, camera.position.y + 4, 4);
      renderer.render(scene, camera);
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        clock.getDelta();
        return;
      }
      draw(Math.min(clock.getDelta(), 0.05), clock.elapsedTime, false);
    };

    layout();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(layout) : null;
    if (ro) ro.observe(document.body);
    window.addEventListener("resize", layout);

    if (reduce) {
      const still = () => draw(0, 0, true);
      still();
      window.addEventListener("scroll", still, { passive: true });
      window.addEventListener("resize", still);
      var stopStill = () => {
        window.removeEventListener("scroll", still);
        window.removeEventListener("resize", still);
      };
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      window.removeEventListener("pointermove", onMove);
      if (stopStill) stopStill();
      if (ro) ro.disconnect();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      renderer.dispose();
    };
  }, []);

  return React.createElement("canvas", { ref, className: "scene3d", "aria-hidden": "true" });
}

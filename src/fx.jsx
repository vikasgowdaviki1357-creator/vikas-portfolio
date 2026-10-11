import React, { useEffect, useLayoutEffect, useRef } from "react";

const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const set = (el, a, b) => { el.style.setProperty("--rx", a + "deg"); el.style.setProperty("--ry", b + "deg"); };

export const tilt = e => {
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
  set(el, (-(py - .5) * 14).toFixed(2), ((px - .5) * 14).toFixed(2));
  el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
  el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
};
export const untilt = e => set(e.currentTarget, 0, 0);

export const heroMove = e => {
  const el = e.currentTarget, r = el.getBoundingClientRect();
  el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - .5).toFixed(3));
  el.style.setProperty("--my", ((e.clientY - r.top) / r.height - .5).toFixed(3));
};
export const heroLeave = e => { e.currentTarget.style.setProperty("--mx", 0); e.currentTarget.style.setProperty("--my", 0); };

export function useReveal(dep) {
  useLayoutEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(x => {
      if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); }
    }), { threshold: .12 });
    document.querySelectorAll(".section-heading,.filters,.project-card,.skill-group,.about-art,.about-copy,.quick-strip>div,.cta-section>*").forEach((el, i) => {
      if (el.classList.contains("in")) return;
      el.classList.add("rv"); el.style.animationDelay = (i % 3) * 90 + "ms"; io.observe(el);
    });
    return () => io.disconnect();
  }, [dep]);
}

export function Embers() {
  const ref = useRef();
  useEffect(() => {
    if (still()) return;
    const c = ref.current, x = c.getContext("2d");
    let w, h, id;
    const ps = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random() * .8 + .2, s: Math.random() * .4 + .1 }));
    const size = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; };
    size(); addEventListener("resize", size);
    const loop = () => {
      x.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.s * p.z * .004; p.x += Math.sin(p.y * 9 + p.z * 5) * .0004;
        if (p.y < 0) { p.y = 1; p.x = Math.random(); }
        x.beginPath(); x.arc(p.x * w, p.y * h, p.z * 2.2, 0, 7);
        x.fillStyle = `rgba(255,${60 + p.z * 80 | 0},50,${p.z * .55})`; x.shadowBlur = 12; x.shadowColor = "#e50914"; x.fill();
      }
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(id); removeEventListener("resize", size); };
  }, []);
  return <canvas ref={ref} className="embers" />;
}

export function ScrollBar() {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    const upd = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    upd();
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd);
    return () => { removeEventListener("scroll", upd); removeEventListener("resize", upd); };
  }, []);
  return <div ref={ref} className="scrollbar" aria-hidden="true" />;
}

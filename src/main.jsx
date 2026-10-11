import React, { useState } from "react";
import { tilt, untilt, heroMove, heroLeave, useReveal, Embers, ScrollBar } from "./fx.jsx";
import Scene3D from "./Scene3D.jsx";
import { createRoot } from "react-dom/client";
import { Github, Linkedin, Mail, ArrowUpRight, Play, Code2, Cpu, Sparkles, X, ExternalLink } from "lucide-react";
import "./style.css";

const projects = [
  {
    title: "SwapGuard",
    type: "AI · COMPUTER VISION",
    year: "2026",
    tag: "FEATURED PROJECT",
    description: "A product-return verification concept that compares delivery and return evidence to help flag possible item swaps and counterfeit returns.",
    stack: ["React", "FastAPI", "Python", "OpenCV", "SIFT + RANSAC"],
    color: "red",
    details: "The workflow captures product images at delivery and return, compares visual features across multiple angles, and routes suspicious cases for review. The prototype explores evidence capture, verification scoring, and case management.",
    role: "Full-stack prototype · Computer vision integration"
  },
  {
    title: "TransitAI",
    type: "SMART MOBILITY · AI",
    year: "2026",
    tag: "HACKATHON MVP",
    description: "A public-transport monitoring dashboard that highlights crowded routes and helps authorities respond to capacity issues.",
    stack: ["React", "Vite", "JavaScript", "Dashboard UI"],
    color: "blue",
    details: "The MVP includes route monitoring, crowding alerts, forecast and allocation concepts, and an authority-facing dashboard. Demo logic uses a bus capacity threshold to illustrate overcrowding and trigger alerts.",
    role: "Frontend development · Dashboard and alert experience"
  },
  {
    title: "JIT Share Hub",
    type: "WEB DEVELOPMENT · MARKETPLACE",
    year: "2026",
    tag: "CAMPUS PROJECT",
    description: "A student community marketplace for sharing, discovering, and listing useful items and academic resources.",
    stack: ["React", "JavaScript", "Node.js", "Express", "MongoDB"],
    color: "gold",
    details: "Designed around student needs, with branch-aware browsing, seller profiles, product listings, login/signup flows, and resource discovery. The project is structured as a multi-page web application.",
    role: "Web development · UI and application flow"
  },
  {
    title: "RV Esports Arena",
    type: "WEB DEVELOPMENT · GAMING",
    year: "2026",
    tag: "COMMUNITY PLATFORM",
    description: "An esports website concept for organizing and showcasing gaming tournaments such as BGMI and Free Fire.",
    stack: ["HTML", "CSS", "JavaScript", "Firebase"],
    color: "purple",
    details: "A gaming-focused interface for tournament information and community engagement, built with a bold visual style and Firebase-backed features.",
    role: "Frontend development · Firebase integration"
  },
  {
    title: "SmartBus Tracker",
    type: "IOT · CONNECTED SYSTEMS",
    year: "2026",
    tag: "IOT PROJECT",
    description: "A connected bus-tracking concept using an ESP32 and Firebase to share transport data.",
    stack: ["ESP32", "Firebase", "MQTT", "IoT"],
    color: "green",
    details: "Explores the flow of sensor/device data into a cloud-backed system, with an emphasis on connected transport monitoring and real-time data exchange.",
    role: "IoT prototyping · Cloud data integration"
  },
  {
    title: "ResQNow",
    type: "WEB MAPPING · LOCAL SERVICES",
    year: "2026",
    tag: "SERVICE PLATFORM",
    description: "A smart local-service and emergency-assistance platform concept for finding nearby help.",
    stack: ["JavaScript", "Leaflet.js", "OpenStreetMap"],
    color: "orange",
    details: "The concept connects people with nearby services using an interactive map, focusing on location-aware discovery and easier access to assistance.",
    role: "Web mapping · Product concept and UI"
  }
];

const skills = [
  ["Languages", "C", "Python", "JavaScript", "HTML", "CSS"],
  ["Frontend", "React", "Vite", "Responsive UI", "CSS animations"],
  ["Backend & Data", "Node.js", "Express", "MongoDB", "Firebase", "REST APIs"],
  ["AI / IoT", "OpenCV", "Computer Vision basics", "ESP32", "MQTT"],
  ["Tools", "Git", "GitHub", "VS Code", "Netlify", "Render"]
];

function App() {
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("All");
  const [showAbout, setShowAbout] = useState(false);
  useReveal(tab);
  const filters = ["All", "AI & Computer Vision", "Web Apps", "IoT"];
  const filtered = projects.filter(p => tab === "All" ||
    (tab === "AI & Computer Vision" && /AI|COMPUTER VISION/.test(p.type)) ||
    (tab === "Web Apps" && /WEB DEVELOPMENT|WEB MAPPING/.test(p.type)) ||
    (tab === "IoT" && /IOT/.test(p.type)));

  return <><Scene3D /><ScrollBar /><div className="app">
    <header className="navbar site-navbar">
      <a className="brand" href="#home" aria-label="Vikas home">V<span>IKAS</span><i>.</i></a>
      <nav><a href="#projects">Projects</a><a href="#skills">Skills</a><a href="#about">About</a></nav>
      <a className="contact-top" href="mailto:vikasgowdaviki1357@gmail.com"><Mail size={15}/> Contact</a>
    </header>

    <main>
      <section className="hero-image-banner" id="home" aria-label="Vikas Gowda full-stack developer portfolio banner" onMouseMove={heroMove} onMouseLeave={heroLeave}>
        <div className="hero-stage">
          <img className="hero-banner-image" src="/portfolio-hero.png" alt="Vikas Gowda H R, full-stack developer, in a cinematic red and black developer workspace" />
          <a className="hero-hotspot explore-hotspot" href="#projects" aria-label="Explore my work"></a>
          <a className="hero-hotspot resume-hotspot" href="/resume.pdf" target="_blank" rel="noreferrer" aria-label="View resume"></a>
        </div>
        <Embers />
        <div className="hero-scan" aria-hidden="true"></div>
      </section>

      <section className="quick-strip">
        <div><span className="strip-icon"><Code2/></span><div><b>Web Development</b><small>Interfaces to APIs</small></div></div>
        <div><span className="strip-icon"><Cpu/></span><div><b>AI & Computer Vision</b><small>Prototype and experiment</small></div></div>
        <div><span className="strip-icon"><Sparkles/></span><div><b>Product Thinking</b><small>Build for real problems</small></div></div>
      </section>

      <section className="content-section" id="projects">
        <div className="section-heading"><div><p className="kicker">THE COLLECTION</p><h2>Projects worth <span>watching.</span></h2></div><p className="section-note">A selection of projects across AI, web development, and IoT.</p></div>
        <div className="filters">{filters.map(f => <button key={f} onClick={() => setTab(f)} className={tab === f ? "filter active" : "filter"}>{f}</button>)}</div>
        <div className="project-grid">
          {filtered.map((p, i) => <article className={`project-card ${p.color}`} key={p.title} onMouseMove={tilt} onMouseLeave={untilt} onClick={() => setActive(p)} tabIndex="0" onKeyDown={e => e.key === "Enter" && setActive(p)}>
            <div className="artwork">
              <div className="art-grid"></div><span className="art-number">0{i+1}</span>
              <div className="art-center">{p.color === "red" ? <div className="swap-symbol">S<span>G</span></div> : p.color === "blue" ? <div className="route-symbol"><i></i><i></i><i></i></div> : p.color === "gold" ? <div className="hub-symbol">HUB</div> : p.color === "purple" ? <div className="esports-symbol">E<span>SPORTS</span></div> : p.color === "green" ? <div className="iot-symbol"><Cpu size={60}/></div> : <div className="resq-symbol">R<span>!</span></div>}</div>
              <div className="art-caption">{p.tag}</div><div className="art-glow"></div>
            </div>
            <div className="project-info"><div className="project-type">{p.type} <span>{p.year}</span></div><h3>{p.title}</h3><p>{p.description}</p><div className="card-bottom"><div className="mini-tags">{p.stack.slice(0, 3).map(s => <span key={s}>{s}</span>)}</div><button aria-label={`View ${p.title} details`} className="arrow-btn" onClick={e => {e.stopPropagation(); setActive(p)}}><ArrowUpRight size={19}/></button></div></div>
          </article>)}
        </div>
      </section>

      <section className="skills-section" id="skills">
        <div className="section-heading"><div><p className="kicker">TOOLS OF THE TRADE</p><h2>My tech <span>stack.</span></h2></div><p className="section-note">Learning by building, improving with every iteration.</p></div>
        <div className="skills-grid">{skills.map(([name, ...items]) => <div className="skill-group" key={name}><h3>{name}</h3><div>{items.map(s => <span key={s}>{s}</span>)}</div></div>)}</div>
      </section>

      <section className="about-section" id="about">
        <div className="about-art" onMouseMove={tilt} onMouseLeave={untilt}><div className="about-orbit orbit-a"></div><div className="about-orbit orbit-b"></div><div className="about-initials">VG</div><img className="about-photo" src="/photo.jpg" alt="Vikas Gowda" onError={e => e.currentTarget.style.display = "none"}/><span className="about-stamp">ALWAYS<br/>LEARNING</span></div>
        <div className="about-copy"><p className="kicker">BEHIND THE BUILDS</p><h2>Curiosity is my <span>default setting.</span></h2><p>I’m Vikas Gowda, a Computer Science Engineering student at Jyothy Institute of Technology. I enjoy taking a problem from a rough idea to a working prototype—whether that means designing a clean interface, wiring up a backend, or experimenting with computer vision and IoT.</p><p>I’m currently looking for a full-stack developer internship where I can contribute across frontend and backend, learn from experienced engineers, and build software that solves meaningful problems.</p><div className="about-facts"><div><small>EDUCATION</small><b>B.E. Computer Science</b><span>Jyothy Institute of Technology</span></div><div><small>FOCUS</small><b>Software Development</b><span>Web · AI · IoT</span></div></div><a className="text-link" href="mailto:vikasgowdaviki1357@gmail.com">Let's build something <ArrowUpRight size={17}/></a></div>
      </section>

      <section className="cta-section">
        <p className="kicker">LET'S CONNECT</p><h2>Hiring a full-stack intern?</h2><p>I'm ready to contribute across the stack, learn quickly, and build useful products.</p>
        <a className="btn btn-red" href="mailto:vikasgowdaviki1357@gmail.com"><Mail size={17}/> Get in touch</a>
        <a className="btn btn-muted resume-cta" href="/resume.pdf" target="_blank" rel="noreferrer"><ExternalLink size={17}/> View Resume</a>
      </section>
    </main>

    <footer><a className="brand" href="#home">V<span>IKAS</span><i>.</i></a><p>Designed with curiosity. Built with code.</p><div className="socials"><a href="https://github.com/vikasgowdaviki1357-creator" target="_blank" rel="noreferrer" aria-label="GitHub"><Github/></a><a href="https://www.linkedin.com/in/vikasgowda-h-r-577259385" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin/></a><a href="mailto:vikasgowdaviki1357@gmail.com" aria-label="Email"><Mail/></a></div><small>© {new Date().getFullYear()} Vikas Gowda · Portfolio</small></footer>

    {active && <div className="modal-backdrop" onClick={() => setActive(null)}><div className={`project-modal ${active.color}`} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${active.title} project details`}><button className="close-modal" onClick={() => setActive(null)} aria-label="Close"><X/></button><div className="modal-art"><span className="kicker">{active.tag}</span><h2>{active.title}</h2><p>{active.type}</p></div><div className="modal-body"><p>{active.details}</p><h3>My focus</h3><p>{active.role}</p><h3>Technology</h3><div className="modal-tags">{active.stack.map(s => <span key={s}>{s}</span>)}</div><p className="modal-note">Add your GitHub repository and live demo links before sharing this portfolio with recruiters.</p></div></div></div>}
    {showAbout && <div className="modal-backdrop" onClick={() => setShowAbout(false)}><div className="about-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="About Vikas"><button className="close-modal" onClick={() => setShowAbout(false)} aria-label="Close"><X/></button><p className="kicker">ABOUT THE DEVELOPER</p><h2>Hi, I'm Vikas.</h2><p>A Computer Science Engineering student who enjoys building practical projects and exploring how software can solve real-world problems.</p><ul><li>Interested in web development and AI-powered products</li><li>Enjoys hackathons, rapid prototyping, and collaboration</li><li>Seeking full-stack developer internship opportunities</li></ul><a className="btn btn-red" href="mailto:vikasgowdaviki1357@gmail.com">Contact me <ExternalLink size={16}/></a></div></div>}
  </div></>;
}

createRoot(document.getElementById("root")).render(<App />);

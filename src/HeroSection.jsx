import React, { useEffect, useState } from 'react';
import './HeroSection.css';

const roles = [
  'AI Systems Engineer',
  'Computer Vision Developer',
  'IoT Innovator',
  'Automation Builder',
];

const HeroSection = () => {
  const [theme, setTheme] = useState('dark');
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Load the stored theme preference once and apply it to the body.
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
    setTheme(initialTheme);
    document.body.setAttribute('data-theme', initialTheme);
  }, []);

  // Persist theme changes and toggle data-theme="light" on body.
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Create a typewriter loop for the rotating role text.
  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseDuration = 1300;

    const timeout = setTimeout(() => {
      if (!isDeleting && typedText.length < currentRole.length) {
        setTypedText(currentRole.slice(0, typedText.length + 1));
      } else if (!isDeleting && typedText.length === currentRole.length) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && typedText.length > 0) {
        setTypedText(currentRole.slice(0, typedText.length - 1));
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, roleIndex]);

  return (
    <section className="hero-section">
      <div className="hero-bg-glow" aria-hidden="true" />

      <div className="hero-content fade-in">
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        <p className="hero-intro">Hello, I&apos;m</p>
        <h1 className="hero-name">Darshan T</h1>
        <h2 className="hero-tagline">Hybrid Full-Stack &amp; AI Developer</h2>

        <p className="hero-typing" aria-live="polite">
          <span>{typedText}</span>
          <span className="cursor">|</span>
        </p>

        <div className="hero-cta-group">
          <a href="#projects" className="hero-btn">View Projects</a>
          <a href="/Darshan_T_Resume.pdf" className="hero-btn" download>Download Resume</a>
          <a href="#ai-assistant" className="hero-btn hero-btn-accent">Talk to My AI</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

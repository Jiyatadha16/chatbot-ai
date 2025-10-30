import React, { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
}

interface ParticleCanvasProps {
  wpm: number;
}

// FIX: Moved isDarkTheme outside of the component to make it a pure helper function.
// This prevents it from being recreated on every render and avoids potential issues with
// stale closures or missing dependencies in `useCallback` hooks that use it.
const isDarkTheme = () => document.documentElement.classList.contains('dark');

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ wpm }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();

  const createParticle = useCallback((width: number, height: number): Particle => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: Math.random() * 0.2 - 0.1,
      vy: Math.random() * -0.5 - 0.2, // Move upwards
      opacity: Math.random() * 0.5 + 0.2,
    };
  }, []);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const particleCount = 50;
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(width, height));
    }
  }, [createParticle]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    
    const color = isDarkTheme() ? 'rgba(107, 237, 215, 1)' : 'rgba(20, 184, 166, 1)';

    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      // Speed up with WPM
      const speedMultiplier = 1 + (wpm / 100);
      p.y += p.vy * speedMultiplier;
      
      // Reset particle when it goes off screen
      if (p.y < -p.radius) {
        p.y = height + p.radius;
        p.x = Math.random() * width;
      }
      if (p.x < -p.radius) p.x = width + p.radius;
      if (p.x > width + p.radius) p.x = -p.radius;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = color.replace('1)', `${p.opacity})`);
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, [wpm]);

  useEffect(() => {
    initParticles();
    
    animationFrameId.current = requestAnimationFrame(animate);

    const handleResize = () => {
        initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [animate, initParticles]);
  
  // Re-initialize on theme change to get new colors
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "class") {
                // simple re-render of particles
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default ParticleCanvas;

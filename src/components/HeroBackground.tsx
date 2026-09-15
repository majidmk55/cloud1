import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create nodes for cloud mesh
    const nodes: Node[] = [];
    const nodeCount = 80;
    const cloudCenterX = canvas.width / 2;
    const cloudCenterY = canvas.height / 2 - 50;

    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 200 + 100;
      nodes.push({
        x: cloudCenterX + Math.cos(angle) * radius,
        y: cloudCenterY + Math.sin(angle) * radius * 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
      });
    }

    // Create particles
    const particles: Particle[] = [];
    const maxParticles = 100;

    const createParticle = () => {
      if (particles.length >= maxParticles) return;
      
      const startX = cloudCenterX + (Math.random() - 0.5) * 300;
      const startY = cloudCenterY + 100;
      
      particles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 1,
        vy: -Math.random() * 2 - 1,
        size: Math.random() * 3 + 1,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 100 + 100,
      });
    };

    // Animation loop
    let animationId: number;
    let frame = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 22, 40, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frame++;

      // Draw and update nodes
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce back if too far
        const dx = node.x - cloudCenterX;
        const dy = node.y - cloudCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 250) {
          node.vx *= -0.5;
          node.vy *= -0.5;
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const d = Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
          );
          
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.globalAlpha = (1 - d / 100) * 0.3;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }

        // Draw node
        ctx.fillStyle = '#00d4ff';
        ctx.globalAlpha = 0.6 + Math.sin(frame * 0.02 + i) * 0.3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Create new particles
      if (frame % 3 === 0) {
        createParticle();
      }

      // Draw and update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.opacity = 1 - p.life / p.maxLife;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.fillStyle = '#00d4ff';
        ctx.globalAlpha = p.opacity * 0.8;
        
        if (Math.random() > 0.5) {
          // Circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Square
          ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
        }
        
        ctx.globalAlpha = 1;
      }

      // Draw AI orb
      const orbRadius = 60 + Math.sin(frame * 0.02) * 5;
      const orbX = cloudCenterX;
      const orbY = cloudCenterY;

      // Orb glow
      const gradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius * 2);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
      gradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Orb rings
      for (let i = 0; i < 3; i++) {
        const ringRadius = orbRadius + 20 + i * 15;
        const ringOpacity = 0.3 - i * 0.1;
        
        ctx.strokeStyle = `rgba(0, 212, 255, ${ringOpacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(orbX, orbY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Orb core
      const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius);
      orbGradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
      orbGradient.addColorStop(0.7, 'rgba(0, 212, 255, 0.4)');
      orbGradient.addColorStop(1, 'rgba(0, 212, 255, 0.1)');
      
      ctx.fillStyle = orbGradient;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // AI text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Vazirmatn, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI', orbX, orbY);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #1a3a6c 50%, #0d2137 100%)' }}
    />
  );
}

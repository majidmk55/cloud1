import { useEffect, useRef } from 'react';

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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create nodes for subtle digital cloud mesh
    const nodes: Node[] = [];
    const nodeCount = 60;
    const cloudCenterX = canvas.width / 2;
    const cloudCenterY = canvas.height / 2;

    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 250 + 100;
      nodes.push({
        x: cloudCenterX + Math.cos(angle) * radius,
        y: cloudCenterY + Math.sin(angle) * radius * 0.5,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    let animationId: number;
    let frame = 0;

    const animate = () => {
      // Clear canvas with transparency to let CSS background show through
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Draw subtle nodes (dark blue, low opacity)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce back if too far
        const dx = node.x - cloudCenterX;
        const dy = node.y - cloudCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 300) {
          node.vx *= -0.5;
          node.vy *= -0.5;
        }

        // Draw connections (very subtle, dark blue)
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const d = Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
          );
          
          if (d < 120) {
            ctx.strokeStyle = `rgba(10, 22, 40, ${(1 - d / 120) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw node (dark blue, very subtle)
        ctx.fillStyle = `rgba(10, 22, 40, ${0.15 + Math.sin(frame * 0.01 + i) * 0.05})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw subtle AI orb (warm white glow)
      const orbRadius = 50 + Math.sin(frame * 0.015) * 3;
      const orbX = cloudCenterX;
      const orbY = cloudCenterY;

      // Soft warm glow
      const gradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius * 2.5);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Subtle rings
      for (let i = 0; i < 2; i++) {
        const ringRadius = orbRadius + 15 + i * 12;
        ctx.strokeStyle = `rgba(10, 22, 40, ${0.06 - i * 0.02})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(orbX, orbY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Orb core (soft white)
      const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius);
      orbGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      orbGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.08)');
      orbGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = orbGradient;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Sky gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #87CEEB 0%, #4facfe 30%, #00f2fe 70%, #87CEEB 100%)'
        }}
      />
      
      {/* Soft cloud overlay using CSS */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(255,255,255,0.8) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 30%, rgba(255,255,255,0.7) 0%, transparent 50%),
            radial-gradient(ellipse 70% 45% at 50% 60%, rgba(255,255,255,0.6) 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 30% 70%, rgba(255,255,255,0.5) 0%, transparent 50%),
            radial-gradient(ellipse 55% 40% at 70% 50%, rgba(255,255,255,0.65) 0%, transparent 50%)
          `
        }}
      />
      
      {/* White wash overlay for faded effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)'
        }}
      />
      
      {/* Canvas for subtle digital elements */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  pulse: number;
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

    // Create nodes for enlarged digital cloud mesh (50% larger)
    const nodes: Node[] = [];
    const nodeCount = 150; // Increased for larger cloud
    const cloudCenterX = canvas.width / 2;
    const cloudCenterY = canvas.height / 2 - 50;

    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 350 + 180; // 50% larger (was 300+150)
      nodes.push({
        x: cloudCenterX + Math.cos(angle) * radius,
        y: cloudCenterY + Math.sin(angle) * radius * 0.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 2.5 + 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let animationId: number;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Draw network mesh
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce back if too far
        const dx = node.x - cloudCenterX;
        const dy = node.y - cloudCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 450) { // 50% larger boundary
          node.vx *= -0.5;
          node.vy *= -0.5;
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const d = Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
          );
          
          if (d < 180) { // Increased connection distance
            const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
            gradient.addColorStop(0, `rgba(0, 212, 255, ${(1 - d / 180) * 0.5})`);
            gradient.addColorStop(1, `rgba(10, 22, 40, ${(1 - d / 180) * 0.3})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw node with pulsing glow
        const pulseSize = node.size * (1 + Math.sin(frame * 0.02 + node.pulse) * 0.3);
        const glowRadius = pulseSize * 4;
        
        const nodeGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius
        );
        nodeGradient.addColorStop(0, `rgba(0, 212, 255, ${0.9 + Math.sin(frame * 0.02 + node.pulse) * 0.1})`);
        nodeGradient.addColorStop(0.4, 'rgba(0, 212, 255, 0.4)');
        nodeGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        
        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw core node
        ctx.fillStyle = '#00d4ff';
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw AI Orb (central glowing sphere)
      const orbRadius = 90 + Math.sin(frame * 0.015) * 8; // 50% larger
      const orbX = cloudCenterX;
      const orbY = cloudCenterY;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius * 3.5);
      outerGlow.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
      outerGlow.addColorStop(0.5, 'rgba(0, 212, 255, 0.15)');
      outerGlow.addColorStop(1, 'rgba(0, 212, 255, 0)');
      
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Orb rings
      for (let i = 0; i < 4; i++) {
        const ringRadius = orbRadius + 25 + i * 20;
        const ringOpacity = 0.5 - i * 0.1;
        
        ctx.strokeStyle = `rgba(0, 212, 255, ${ringOpacity})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(orbX, orbY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Orb core with gradient
      const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius);
      orbGradient.addColorStop(0, 'rgba(0, 212, 255, 1)');
      orbGradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.6)');
      orbGradient.addColorStop(1, 'rgba(10, 22, 40, 0.4)');
      
      ctx.fillStyle = orbGradient;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner highlight
      const highlightGradient = ctx.createRadialGradient(
        orbX - orbRadius * 0.3, orbY - orbRadius * 0.3, 0,
        orbX, orbY, orbRadius * 0.7
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = highlightGradient;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius * 0.7, 0, Math.PI * 2);
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
      {/* Deep blue gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0a1628 0%, #1a3a6c 50%, #0d2137 100%)'
        }}
      />
      
      {/* Digital Cloud Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          opacity: 0.85,
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}

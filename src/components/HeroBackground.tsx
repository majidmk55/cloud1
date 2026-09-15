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

    // Create nodes for digital cloud mesh (50% larger)
    const nodes: Node[] = [];
    const nodeCount = 120;
    const cloudCenterX = canvas.width / 2;
    const cloudCenterY = canvas.height / 2 - 100; // Positioned in upper center

    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 300 + 150; // 50% larger
      nodes.push({
        x: cloudCenterX + Math.cos(angle) * radius,
        y: cloudCenterY + Math.sin(angle) * radius * 0.6,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 1,
      });
    }

    let animationId: number;
    let frame = 0;

    const animate = () => {
      // Clear canvas with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Draw network mesh (nodes and lines)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce back if too far
        const dx = node.x - cloudCenterX;
        const dy = node.y - cloudCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 375) {
          node.vx *= -0.5;
          node.vy *= -0.5;
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const d = Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
          );
          
          if (d < 150) {
            // Cyan gradient for lines
            const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
            gradient.addColorStop(0, `rgba(0, 212, 255, ${(1 - d / 150) * 0.4})`);
            gradient.addColorStop(1, `rgba(10, 22, 40, ${(1 - d / 150) * 0.2})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw node with glow effect
        const glowRadius = node.size * 3;
        const nodeGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius
        );
        nodeGradient.addColorStop(0, `rgba(0, 212, 255, ${0.8 + Math.sin(frame * 0.02 + i) * 0.2})`);
        nodeGradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.3)');
        nodeGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        
        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw core node
        ctx.fillStyle = '#00d4ff';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw AI Core (central glowing orb)
      const orbRadius = 75 + Math.sin(frame * 0.02) * 5;
      const orbX = cloudCenterX;
      const orbY = cloudCenterY;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius * 3);
      outerGlow.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
      outerGlow.addColorStop(0.5, 'rgba(0, 212, 255, 0.1)');
      outerGlow.addColorStop(1, 'rgba(0, 212, 255, 0)');
      
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Orb rings
      for (let i = 0; i < 3; i++) {
        const ringRadius = orbRadius + 20 + i * 15;
        const ringOpacity = 0.4 - i * 0.1;
        
        ctx.strokeStyle = `rgba(0, 212, 255, ${ringOpacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(orbX, orbY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Orb core with gradient
      const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius);
      orbGradient.addColorStop(0, 'rgba(0, 212, 255, 0.9)');
      orbGradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.5)');
      orbGradient.addColorStop(1, 'rgba(10, 22, 40, 0.3)');
      
      ctx.fillStyle = orbGradient;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner highlight
      const highlightGradient = ctx.createRadialGradient(
        orbX - orbRadius * 0.3, orbY - orbRadius * 0.3, 0,
        orbX, orbY, orbRadius * 0.6
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = highlightGradient;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius * 0.6, 0, Math.PI * 2);
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
          background: 'linear-gradient(to bottom, #1E90FF 0%, #4facfe 50%, #87CEEB 100%)'
        }}
      />
      
      {/* Digital Cloud Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          opacity: 0.7,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Soft cloud overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 25% 35%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 75% 30%, rgba(255,255,255,0.25) 0%, transparent 50%),
            radial-gradient(ellipse 70% 45% at 50% 65%, rgba(255,255,255,0.35) 0%, transparent 50%)
          `,
          filter: 'blur(10px)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

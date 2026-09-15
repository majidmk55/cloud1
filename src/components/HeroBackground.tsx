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

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create nodes for cloud mesh (50% larger)
    const nodes: Node[] = [];
    const nodeCount = 120; // Increased for larger cloud
    const cloudCenterX = canvas.width / 2;
    const cloudCenterY = canvas.height / 2 - 50;

    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 300 + 150; // 50% larger (was 200+100)
      nodes.push({
        x: cloudCenterX + Math.cos(angle) * radius,
        y: cloudCenterY + Math.sin(angle) * radius * 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
      });
    }

    // Particles removed for cleaner look

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

        // Bounce back if too far (increased for larger cloud)
        const dx = node.x - cloudCenterX;
        const dy = node.y - cloudCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 375) { // Increased from 250 to 375 (50% larger)
          node.vx *= -0.5;
          node.vy *= -0.5;
        }

        // Draw connections (increased distance for larger cloud)
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const d = Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
          );
          
          if (d < 150) { // Increased from 100 to 150
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.globalAlpha = (1 - d / 150) * 0.3;
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

      // Particles removed - cleaner, more minimal look

      // Draw AI orb (slightly larger to match bigger cloud)
      const orbRadius = 75 + Math.sin(frame * 0.02) * 5; // Increased from 60 to 75
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

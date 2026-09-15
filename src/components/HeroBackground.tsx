import { useEffect, useRef } from 'react';

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

    let animationId: number;
    let offset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Slow horizontal pan animation
      offset += 0.1;
      if (offset > canvas.width) offset = 0;

      // Draw faint clouds using radial gradients
      const clouds = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 200, opacity: 0.4 },
        { x: canvas.width * 0.7, y: canvas.height * 0.25, radius: 180, opacity: 0.35 },
        { x: canvas.width * 0.5, y: canvas.height * 0.6, radius: 250, opacity: 0.45 },
        { x: canvas.width * 0.15, y: canvas.height * 0.7, radius: 220, opacity: 0.4 },
        { x: canvas.width * 0.85, y: canvas.height * 0.65, radius: 190, opacity: 0.38 },
        { x: canvas.width * 0.4, y: canvas.height * 0.4, radius: 160, opacity: 0.3 },
        { x: canvas.width * 0.6, y: canvas.height * 0.8, radius: 240, opacity: 0.42 },
      ];

      clouds.forEach((cloud) => {
        // Apply horizontal pan
        const cloudX = (cloud.x + offset) % (canvas.width + cloud.radius * 2) - cloud.radius;
        
        // Cloud shadow (depth)
        const shadowGradient = ctx.createRadialGradient(
          cloudX, cloud.y, 0,
          cloudX, cloud.y, cloud.radius
        );
        shadowGradient.addColorStop(0, `rgba(179, 229, 252, ${cloud.opacity * 0.3})`);
        shadowGradient.addColorStop(0.5, `rgba(224, 247, 250, ${cloud.opacity * 0.2})`);
        shadowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.arc(cloudX, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();

        // Cloud highlight (bright)
        const highlightGradient = ctx.createRadialGradient(
          cloudX - cloud.radius * 0.2, cloud.y - cloud.radius * 0.2, 0,
          cloudX, cloud.y, cloud.radius * 0.8
        );
        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity})`);
        highlightGradient.addColorStop(0.6, `rgba(255, 255, 255, ${cloud.opacity * 0.5})`);
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(cloudX, cloud.y, cloud.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

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
      {/* Sky gradient background - exact colors from spec */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #1E90FF 0%, #4facfe 50%, #87CEEB 100%)'
        }}
      />
      
      {/* Canvas for faint clouds */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />
      
      {/* Additional CSS cloud layer for softness */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 25% 35%, rgba(255,255,255,0.5) 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 75% 30%, rgba(255,255,255,0.45) 0%, transparent 50%),
            radial-gradient(ellipse 70% 45% at 50% 65%, rgba(255,255,255,0.55) 0%, transparent 50%),
            radial-gradient(ellipse 55% 40% at 20% 75%, rgba(255,255,255,0.48) 0%, transparent 50%),
            radial-gradient(ellipse 65% 42% at 80% 70%, rgba(255,255,255,0.52) 0%, transparent 50%)
          `,
          filter: 'blur(15px)'
        }}
      />
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

interface RoboTech3DCanvasProps {
  className?: string;
  accentColor?: string;
  secondaryColor?: string;
  speed?: number;
  interactive?: boolean;
}

export const RoboTech3DCanvas: React.FC<RoboTech3DCanvasProps> = ({
  className = '',
  accentColor = '#FFCD00',
  secondaryColor = '#006AA7',
  speed = 1,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // 3D Geometry: Isometric Robotic Cube & Gyroscope Rings
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    // Outer Cube Vertices
    const cubeVertices: Point3D[] = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ];

    const cubeEdges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    // Inner Octahedron (Robotic Core)
    const coreVertices: Point3D[] = [
      { x: 0, y: -0.65, z: 0 },
      { x: 0, y: 0.65, z: 0 },
      { x: -0.65, y: 0, z: 0 },
      { x: 0.65, y: 0, z: 0 },
      { x: 0, y: 0, z: -0.65 },
      { x: 0, y: 0, z: 0.65 },
    ];

    const coreEdges: [number, number][] = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2],
    ];

    // Floating Telemetry Particles in 3D Space
    const particleCount = 28;
    const particles3D: { x: number; y: number; z: number; size: number; pulse: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.3 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      particles3D.push({
        x: radius * Math.cos(phi) * Math.cos(theta),
        y: radius * Math.sin(phi),
        z: radius * Math.cos(phi) * Math.sin(theta),
        size: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let angleX = 0.35;
    let angleY = 0.45;
    let angleZ = 0;
    let targetAngleX = 0.35;
    let targetAngleY = 0.45;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      targetAngleY = normX * 1.5;
      targetAngleX = -normY * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3D Matrix Rotation & Projection
    const project = (p: Point3D, scale: number, cx: number, cy: number) => {
      // Rotate Y
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x1 = p.x * cosY + p.z * sinY;
      const y1 = p.y;
      const z1 = -p.x * sinY + p.z * cosY;

      // Rotate X
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      // Rotate Z (slow drift)
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);
      const x3 = x2 * cosZ - y2 * sinZ;
      const y3 = x2 * sinZ + y2 * cosZ;
      const z3 = z2;

      // Perspective projection
      const distance = 4.2;
      const fov = 500;
      const factor = fov / (distance + z3);

      return {
        x: cx + x3 * scale * factor,
        y: cy + y3 * scale * factor,
        z: z3,
        scale: factor,
      };
    };

    let time = 0;

    const render = () => {
      time += 0.015 * speed;

      // Smooth angle lerping
      angleY += (targetAngleY - angleY) * 0.05 + 0.007 * speed;
      angleX += (targetAngleX - angleX) * 0.05 + 0.003 * speed;
      angleZ = Math.sin(time * 0.5) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseScale = Math.min(width, height) * 0.18;

      // Draw Orbit Gyro Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.3);
      ctx.beginPath();
      ctx.arc(0, 0, baseScale * 1.85, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 106, 167, 0.18)';
      ctx.setLineDash([8, 12]);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.rotate(-time * 0.6);
      ctx.beginPath();
      ctx.arc(0, 0, baseScale * 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 205, 0, 0.25)';
      ctx.setLineDash([4, 16]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Project particles
      particles3D.forEach((p) => {
        p.pulse += 0.04;
        const pt = project(p, baseScale, cx, cy);
        const alpha = Math.max(0.1, (pt.z + 2) / 4) * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.size * (pt.scale / 120), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 205, 0, ${alpha})`;
        ctx.fill();
      });

      // Project & Draw Outer Cube Wireframe
      const projectedCube = cubeVertices.map((v) => project(v, baseScale, cx, cy));

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `${secondaryColor}88`;
      ctx.setLineDash([]);

      cubeEdges.forEach(([start, end]) => {
        const p1 = projectedCube[start];
        const p2 = projectedCube[end];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Outer Cube Vertices / Nodes
      projectedCube.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.fill();
        ctx.strokeStyle = '#0A1930';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Project & Draw Inner Core (Octahedron)
      const projectedCore = coreVertices.map((v) => project(v, baseScale, cx, cy));

      ctx.lineWidth = 2;
      ctx.strokeStyle = `${accentColor}CC`;

      coreEdges.forEach(([start, end]) => {
        const p1 = projectedCore[start];
        const p2 = projectedCore[end];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Inner Core Center Glow
      const centerProj = project({ x: 0, y: 0, z: 0 }, baseScale, cx, cy);
      const gradient = ctx.createRadialGradient(
        centerProj.x,
        centerProj.y,
        0,
        centerProj.x,
        centerProj.y,
        baseScale * 0.8
      );
      gradient.addColorStop(0, `${accentColor}66`);
      gradient.addColorStop(0.5, `${secondaryColor}33`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerProj.x, centerProj.y, baseScale * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Center Pulse Dot
      ctx.beginPath();
      ctx.arc(centerProj.x, centerProj.y, 5 + Math.sin(time * 4) * 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [accentColor, secondaryColor, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none select-none ${className}`}
    />
  );
};

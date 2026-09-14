import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Interactive3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  scale?: number;
}

export const Interactive3DTilt: React.FC<Interactive3DTiltProps> = ({
  children,
  className = '',
  maxTilt = 10,
  glareOpacity = 0.2,
  scale = 1.02,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for natural weight and responsiveness
  const smoothX = useSpring(mouseX, { stiffness: 350, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 350, damping: 25 });

  // Convert to degrees of rotation
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Glare position percentage (0% to 100%)
  const glareX = useTransform(smoothX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      style={{ perspective: 1100 }}
      className="w-full h-full"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{ scale: isHovered ? scale : 1 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`relative w-full h-full ${className}`}
      >
        {children}

        {/* Dynamic Specular Glare Reflection */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-30 transition-opacity duration-300"
            style={{
              opacity: glareOpacity,
              background: `radial-gradient(circle 350px at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, 0.8), transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

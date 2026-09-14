import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { robotSprites, RobotPoseKey } from '../assets/robots';

interface KineticSpark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

interface JetParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  alpha: number;
}

// Hotspots: (offsetX, offsetY) from the image's top-left to place the target point at (x, y)
const POSE_CONFIG: Record<
  RobotPoseKey,
  {
    width: number;
    offsetX: number;
    offsetY: number;
    label: string;
  }
> = {
  holdingCursor: { width: 44, offsetX: 1, offsetY: 10, label: 'DEFAULT' },
  pointer: { width: 46, offsetX: 3, offsetY: 9, label: 'SELECT' },
  clicking: { width: 50, offsetX: 32, offsetY: 28, label: 'CLICK' },
  magnifier: { width: 42, offsetX: 8, offsetY: 12, label: 'INSPECT' },
  laptop: { width: 46, offsetX: 16, offsetY: 18, label: 'INPUT' },
  flying: { width: 48, offsetX: 20, offsetY: 10, label: 'TURBO' },
  running: { width: 46, offsetX: 22, offsetY: 22, label: 'SPRINT' },
  idea: { width: 44, offsetX: 12, offsetY: 10, label: 'INNOVATE' },
  cheering: { width: 46, offsetX: 23, offsetY: 10, label: 'CELEBRATE' },
  heart: { width: 44, offsetX: 18, offsetY: 18, label: 'COMMUNITY' },
  question: { width: 40, offsetX: 14, offsetY: 8, label: 'INFO' },
  waving: { width: 44, offsetX: 16, offsetY: 12, label: 'HELLO' },
  sleeping: { width: 50, offsetX: 20, offsetY: 22, label: 'RESTING' },
  loading: { width: 46, offsetX: 20, offsetY: 20, label: 'LOADING' },
  thinking: { width: 44, offsetX: 16, offsetY: 14, label: 'THINK' },
};

export const RoboCursor: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [activePose, setActivePose] = useState<RobotPoseKey>('holdingCursor');
  const [lockedPose, setLockedPose] = useState<RobotPoseKey | 'auto'>('auto');

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparks, setSparks] = useState<KineticSpark[]>([]);
  const [jetParticles, setJetParticles] = useState<JetParticle[]>([]);
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0, speed: 0 });

  const lastPosRef = useRef({ x: 0, y: 0, time: Date.now() });
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number>(0);
  const sparkIdRef = useRef(0);

  // Toggle body cursor class
  useEffect(() => {
    if (enabled && isVisible) {
      document.body.classList.add('robot-cursor-active');
    } else {
      document.body.classList.remove('robot-cursor-active');
    }
    return () => {
      document.body.classList.remove('robot-cursor-active');
    };
  }, [enabled, isVisible]);

  const toggleEnabled = () => {
    setEnabled((prev) => !prev);
  };

  const cyclePoseMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const poseOptions: (RobotPoseKey | 'auto')[] = [
      'auto',
      'holdingCursor',
      'pointer',
      'flying',
      'idea',
      'magnifier',
      'cheering',
      'heart',
    ];
    const currentIndex = poseOptions.indexOf(lockedPose);
    const nextPose = poseOptions[(currentIndex + 1) % poseOptions.length];
    setLockedPose(nextPose);
  };

  // Mouse tracking & contextual element detection
  useEffect(() => {
    if (!enabled) return;

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (lockedPose === 'auto') {
          setActivePose('sleeping');
        }
      }, 4800);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      const x = e.clientX;
      const y = e.clientY;

      setMousePos({ x, y });

      const now = Date.now();
      const dt = Math.max(1, now - lastPosRef.current.time);
      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const currentSpeed = Math.sqrt(dx * dx + dy * dy);
      const vx = (dx / dt) * 30;
      const vy = (dy / dt) * 30;
      setVelocity({ vx, vy, speed: currentSpeed });

      // Spawn jet thruster particles when moving quickly
      if (currentSpeed > 22 && Math.random() < 0.65) {
        setJetParticles((prev) => [
          ...prev.slice(-12),
          {
            id: Date.now() + Math.random(),
            x: x + 10,
            y: y + 26,
            size: Math.random() * 4 + 2.5,
            alpha: 0.9,
          },
        ]);
      }

      lastPosRef.current = { x, y, time: now };
      resetIdleTimer();

      // If user manually locked a specific robot pose, honor it
      if (lockedPose !== 'auto') {
        setActivePose(lockedPose);
        return;
      }

      // Contextual inspection
      const target = document.elementFromPoint(x, y) as HTMLElement | null;
      if (!target) {
        setActivePose('holdingCursor');
        return;
      }

      // 1. Check for Fast Movement -> Flying Rocket Jet
      if (currentSpeed > 28) {
        setActivePose('flying');
        return;
      }

      // 2. Check for Form Inputs / Editable -> Laptop Robot
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        setActivePose('laptop');
        return;
      }

      // 3. Check for Celebration / Register / Grand Finale / Trophy
      if (
        target.closest('[data-celebrate]') ||
        (target.closest('button') &&
          target.innerText?.match(/(register|sign up|book|grand finale|prize)/i))
      ) {
        setActivePose('cheering');
        return;
      }

      // 4. Check for Standard Buttons / Links / Interactive CTAs -> Pointer Robot
      if (
        target.closest('button, a, [role="button"], .cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setActivePose('pointer');
        return;
      }

      // 5. Check for 3D Cards / Canvas / Hardware Showcase -> Magnifier Robot
      if (
        target.closest('[data-3d-tilt], canvas, .perspective, [data-inspect]') ||
        target.tagName.toLowerCase() === 'canvas'
      ) {
        setActivePose('magnifier');
        return;
      }

      // 6. Check for FAQ / Rules / Question tooltips -> Question Robot
      if (target.closest('[data-faq], [data-question], .faq-item, [aria-label*="help"]')) {
        setActivePose('question');
        return;
      }

      // 7. Check for Photo Reel / Community / Love -> Heart Robot
      if (target.closest('#photos, #community, [data-heart], .photo-strip')) {
        setActivePose('heart');
        return;
      }

      // 8. Check for Innovation / Hackathon Ideas -> Lightbulb Idea Robot
      if (
        target.closest('[data-idea]') ||
        target.innerText?.match(/(hackathon|young innovators|innovate|ideas|stem)/i)
      ) {
        setActivePose('idea');
        return;
      }

      // 9. Check for Top Hero / Header -> Friendly Waving Robot
      if (target.closest('header, nav, #hero')) {
        setActivePose('waving');
        return;
      }

      // Default roaming pose: Robot holding the cursor arrow
      setActivePose('holdingCursor');
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
      resetIdleTimer();

      // Trigger clicking robot pose when clicked!
      if (lockedPose === 'auto') {
        setActivePose('clicking');
      }

      // Spawn kinetic celebration electric sparks
      const count = 9;
      const newSparks: KineticSpark[] = [];
      const colors = ['#FFCD00', '#00E5FF', '#38BDF8', '#FFFFFF', '#FFAA00', '#EC4899'];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const force = 3.5 + Math.random() * 4.5;
        newSparks.push({
          id: ++sparkIdRef.current,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2.8 + 2,
          alpha: 1,
        });
      }
      setSparks((prev) => [...prev.slice(-18), ...newSparks]);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      resetIdleTimer();
      // Smoothly return from clicking pose after brief moment
      if (lockedPose === 'auto') {
        setTimeout(() => {
          setActivePose('pointer');
        }, 120);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled, lockedPose]);

  // Animation loop for sparks & jet particles
  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      // Update sparks
      setSparks((prev) =>
        prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy,
            vx: s.vx * 0.88,
            vy: s.vy * 0.88 + 0.15,
            size: s.size * 0.93,
            alpha: s.alpha - 0.042,
          }))
          .filter((s) => s.alpha > 0.05 && s.size > 0.3)
      );

      // Fade jet particles
      setJetParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y + 1,
            size: p.size * 0.94,
            alpha: p.alpha - 0.055,
          }))
          .filter((p) => p.alpha > 0.05)
      );

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [enabled]);

  if (!enabled || !isVisible) {
    return (
      <div className="fixed bottom-3 right-3 z-50 pointer-events-auto">
        <button
          onClick={toggleEnabled}
          title="Enable Robot Cursor"
          className="group flex items-center gap-2 px-3 py-1.5 bg-[#0A1930]/90 hover:bg-[#0A1930] text-[#FFCD00] border border-[#FFCD00]/40 text-[10px] font-mono-code font-bold tracking-wider uppercase backdrop-blur-md shadow-lg transition-all"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-[#FFCD00]" />
          <span>ROBOT CURSOR: OFF</span>
        </button>
      </div>
    );
  }

  // Calculate dynamic tilt angle when moving swiftly
  const tiltAngle = Math.max(-16, Math.min(16, velocity.vx * 0.35));

  // Current pose sprite & configuration
  const currentConfig = POSE_CONFIG[activePose] || POSE_CONFIG.holdingCursor;
  const currentSprite = robotSprites[activePose] || robotSprites.holdingCursor;

  return (
    <>
      {/* ── 1. KINETIC CLICK SPARKS ── */}
      <div className="fixed inset-0 pointer-events-none z-[99998] overflow-hidden">
        {sparks.map((spark) => (
          <div
            key={spark.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              transform: `translate3d(${spark.x}px, ${spark.y}px, 0)`,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              backgroundColor: spark.color,
              opacity: spark.alpha,
              boxShadow: `0 0 6px ${spark.color}`,
            }}
          />
        ))}

        {/* Thruster exhaust trail */}
        {jetParticles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: '#00E5FF',
              opacity: p.alpha,
              boxShadow: '0 0 6px #00E5FF',
            }}
          />
        ))}
      </div>

      {/* ── 2. THE ROBOT SPRITE CURSOR ── */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[99999] select-none"
        style={{
          transform: `translate3d(${mousePos.x - currentConfig.offsetX}px, ${
            mousePos.y - currentConfig.offsetY
          }px, 0) rotate(${tiltAngle}deg)`,
          willChange: 'transform',
        }}
      >
        <div className="relative">
          {/* Subtle Pointer Sparkle at (0, 0) */}
          <div
            className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#FFCD00] shadow-[0_0_8px_#FFCD00] pointer-events-none"
            style={{
              transform: `translate3d(${currentConfig.offsetX - 3}px, ${
                currentConfig.offsetY - 3
              }px, 0)`,
            }}
          />

          {/* Click Shockwave Expansion */}
          {isMouseDown && (
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="absolute border-2 border-[#FFCD00] rounded-full pointer-events-none"
              style={{
                top: `${currentConfig.offsetY - 12}px`,
                left: `${currentConfig.offsetX - 12}px`,
                width: '24px',
                height: '24px',
              }}
            />
          )}

          {/* Holographic 3D Scanning Laser Fan (when in magnifier / inspect mode) */}
          {activePose === 'magnifier' && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.85, scaleY: 1 }}
              className="absolute top-8 -left-12 w-36 h-24 pointer-events-none"
            >
              <div
                className="w-full h-full bg-gradient-to-b from-cyan-400/25 via-cyan-400/8 to-transparent border-t-2 border-cyan-400"
                style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
              >
                <motion.div
                  animate={{ y: [0, 80, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  className="w-full h-0.5 bg-cyan-200 shadow-[0_0_8px_#00E5FF]"
                />
              </div>
            </motion.div>
          )}

          {/* THE ROBOT MASCOT SPRITE IMAGE */}
          <motion.div
            key={activePose}
            initial={{ scale: 0.9, opacity: 0.85 }}
            animate={{ scale: isMouseDown ? 0.92 : 1, opacity: 1 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.38)]"
          >
            <img
              src={currentSprite}
              alt={currentConfig.label}
              style={{
                width: `${currentConfig.width}px`,
                height: 'auto',
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </motion.div>

          {/* Micro Telemetry Pill */}
          {(activePose === 'cheering' ||
            activePose === 'magnifier' ||
            activePose === 'idea' ||
            activePose === 'sleeping') && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-3 left-8 px-1.5 py-0.2 bg-[#0A1930]/95 text-[#FFCD00] border border-[#FFCD00]/70 text-[8px] font-mono-code font-black tracking-widest uppercase shadow-md pointer-events-none whitespace-nowrap"
            >
              {currentConfig.label}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── 3. BOTTOM-RIGHT CORNER COMPANION WIDGET ── */}
      <div className="fixed bottom-3 right-3 z-50 pointer-events-auto flex items-center gap-1.5">
        {/* Robot Pose Mode Toggle */}
        <button
          onClick={cyclePoseMode}
          title="Cycle Robot Cursor Mode (Auto or Locked Pose)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0A1930]/95 hover:bg-[#0A1930] text-slate-300 hover:text-white border border-slate-700 text-[9px] font-mono-code font-bold tracking-wider uppercase backdrop-blur-md shadow-lg transition-all hover:border-[#FFCD00]/60"
        >
          <span className="text-[#FFCD00]">ROBO:</span>
          <span className="text-white font-black">
            {lockedPose === 'auto' ? `AUTO (${currentConfig.label})` : currentConfig.label}
          </span>
          <span className="text-[9px] text-slate-400">↻</span>
        </button>

        {/* Turn On/Off */}
        <button
          onClick={toggleEnabled}
          title="Toggle Robot Cursor on/off"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0A1930]/95 hover:bg-[#0A1930] text-[#FFCD00] border border-[#FFCD00]/40 text-[9px] font-mono-code font-bold tracking-wider uppercase backdrop-blur-md shadow-lg transition-all"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFCD00] shadow-[0_0_6px_#FFCD00] animate-pulse" />
          <span>ON</span>
        </button>
      </div>
    </>
  );
};

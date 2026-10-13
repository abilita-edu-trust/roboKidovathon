import React from 'react';
import { motion } from 'framer-motion';
import { useSite } from '../context/SiteContext';

/**
 * The site's "<City> Future Innovators 2026" skyline artwork. Its heading, tagline and motto
 * are painted into the image, so the real heading is kept for screen readers only.
 */
export const FutureInnovatorsBanner: React.FC<{ src: string }> = ({ src: banner }) => {
  const { cityName } = useSite();
  if (!banner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden bg-[#013066] shadow-xl ring-1 ring-[#0A1930]/10"
    >
      <h2 className="sr-only">{cityName} Future Innovators 2026: ideas today, a brighter tomorrow</h2>
      <img
        src={banner}
        alt={`${cityName} skyline at night. Future Innovators 2026: learn, build, innovate, compete. Inspiring young minds through robotics and innovation.`}
        width={1600}
        height={533}
        decoding="async"
        className="block w-full h-auto"
      />
    </motion.div>
  );
};

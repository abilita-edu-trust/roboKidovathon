// The register wizard's card icons: one line-icon set (Lucide, as on the rest of the site) instead of emoji.
import {
  Accessibility, Blocks, BookOpen, Bot, Building2, Cpu, Globe2, GraduationCap, HandHeart, HeartHandshake, Handshake, KeyRound,
  Leaf, Lightbulb, Mail, Megaphone, Presentation, Rocket, School, Target, Tent, Trophy, User, Users, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';

export const REGISTER_ICONS: Record<string, LucideIcon> = {
  Accessibility, Blocks, BookOpen, Bot, Building2, Cpu, Globe2, GraduationCap, HandHeart, HeartHandshake, Handshake, KeyRound,
  Leaf, Lightbulb, Mail, Megaphone, Presentation, Rocket, School, Target, Tent, Trophy, User, Users, Wrench, Zap,
};

/** The icon for a card's icon name (undefined for an unknown name: the card shows none). */
export const registerIcon = (name: string | undefined): LucideIcon | undefined => (name ? REGISTER_ICONS[name] : undefined);

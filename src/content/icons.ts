// Icons the Site CMS can choose for cards and steps. Keep in sync with SITE_ICON_NAMES in the
// iniac.se admin (src/lib/contentFields.ts).
import {
  Award, Baby, Bird, BookOpen, Bot, Building2, Cake, Calendar, CalendarDays, Camera, ClipboardCheck, Clock,
  Code2, Compass, Cpu, Drama, Eye, EyeOff, Flag, Flame, FlaskConical, Gamepad2, Gauge, Ghost, Gift, Globe2,
  GraduationCap, Hammer, HandHeart, Handshake, Heart, Home, Image, Info, Layers, Leaf, Lightbulb, LineChart, Link,
  Mail, MapPin, Megaphone, Mic, Music, Palette, PartyPopper, PenTool, Phone, Presentation, Puzzle, RefreshCw, Rocket,
  Scale, School, Search, Smile, Snowflake, Sparkles, Star, Sun, Target, Ticket, Timer, TreePine, Trophy, UserCheck, UserPlus,
  Users, Video, Wrench, type LucideIcon,
} from 'lucide-react';

export const SITE_ICONS: Record<string, LucideIcon> = {
  Award, Baby, Bird, BookOpen, Bot, Building2, Cake,
  Calendar, CalendarDays, Camera, ClipboardCheck, Clock, Code2, Compass, Cpu, Drama, Eye, EyeOff, Flag, Flame,
  FlaskConical, Gamepad2, Gauge, Ghost, Gift, Globe2, GraduationCap, Hammer, HandHeart, Handshake, Heart, Home,
  Image, Info, Layers, Leaf, Lightbulb, LineChart, Link, Mail, MapPin, Megaphone, Mic, Music, Palette, PartyPopper,
  PenTool, Phone, Presentation, Puzzle, RefreshCw, Rocket, Scale, School, Search, Smile, Snowflake, Sparkles, Star, Sun, Target,
  Ticket, Timer, TreePine, Trophy, UserCheck, UserPlus, Users, Video, Wrench,
};

/** The icon for a CMS icon name; unknown names show a sparkle. */
export const siteIcon = (name: string | undefined): LucideIcon => (name && SITE_ICONS[name]) || Sparkles;

/** The CMS name of an icon used in the built-in content. */
export const iconName = (icon: LucideIcon): string => {
  const found = Object.entries(SITE_ICONS).find(([, I]) => I === icon);
  if (!found) throw new Error(`Icon ${icon.displayName ?? '?'} is not in SITE_ICONS`);
  return found[0];
};

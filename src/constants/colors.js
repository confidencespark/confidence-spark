/**
 * Global Color Constants — Single Source of Truth
 *
 * Every color in the app should reference this file.
 * Organized: Brand > Mood > Gradient > Semantic > Surface > Text > Legacy mappings.
 */
export const COLORS = {
  // ── Brand ──
  primary: '#7EB6D9',
  primaryLight: '#8EC6EA',
  primaryDark: '#234B67',
  accent: '#2E6C94',
  accentDark: '#0E3753',
  accentLight: '#2B6AA8',

  // ── Backgrounds & Surfaces ──
  background: '#FFFFFF',
  backgroundLight: '#F4F6FC',
  surface: '#F8F9FA',
  surfaceAlt: '#F9FAFB',
  card: '#FFFFFF',

  // ── Text ──
  text: '#111827',
  textDark: '#2C3E50',
  textSecondary: '#7F8C8D',
  textMuted: '#8A93A1',
  textLight: '#9197A6',
  textPlaceholder: '#9CA3AF',
  textFooter: '#C0C7CE',
  textHelper: '#A6AFB7',

  // ── Borders ──
  border: '#E5E7EB',
  borderLight: '#E6E9EE',
  borderCard: '#E5E9EF',

  // ── Mood colors ──
  calm: '#CFEAD4',
  powerful: '#BFE3FF',
  playful: '#FFC9C9',

  // ── Gradient colors (brand CTA) ──
  gradientStart: '#8EC6EA',
  gradientEnd: '#234B67',
  gradientDisabledStart: '#C9D7E1',
  gradientDisabledEnd: '#C9D7E1',

  // ── Icon / accent surfaces ──
  iconBg: '#E8F2F9',
  iconBgAlt: '#EAF2F9',
  backBtnBg: 'rgba(255,255,255,0.92)',
  iconTint: '#7FB4D1',

  // ── Tab bar ──
  tabBar: '#73A9C9',
  tabActive: '#0E3753',
  tabInactive: '#FFFFFF',

  // ── Semantic ──
  white: '#FFFFFF',
  black: '#000000',
  error: '#DC2626',
  success: '#27AE60',
  warning: '#F39C12',

  // ── Overlays ──
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayBlock: 'rgba(0,0,0,0.45)',

  // ── Legacy mappings (for unistyles theme compatibility) ──
  primary_light: '#8EC6EA',
  active_light: '#ECFAF1',
  secondary: '#2D2D2D',
  tertiary: '#F4F4F2',
  background_light: '#F4F6FC',
  lightText: '#9197A6',
  active: '#019A51',
  dark: '#18171C',
};

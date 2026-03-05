/**
 * Theme helpers cho React components.
 *
 * Usage:
 *   import { C, G } from '../lib/theme';
 *   style={{ background: G.accent, color: C.foreground }}
 */
import { colors } from './colors';

/** C = Colors – dùng cho color values thuần */
export const C = colors;

/** G = Gradients – các gradient được prebuilt sẵn */
export const G = {
  /** Mocha Deep → Mocha: icon boxes, card badges */
  accent:  `linear-gradient(135deg, ${colors.accentDeep}, ${colors.accent})`,
  /** Mocha → Terracotta: CTA buttons, banner ngang */
  warm:    `linear-gradient(135deg, ${colors.accent}, ${colors.accentWarm})`,
  /** Deep Mocha → Terracotta: date badges mạnh nhất */
  full:    `linear-gradient(135deg, ${colors.accentDeep}, ${colors.accentWarm})`,
  /** Banner ngang (clipPath position tag trong Header) */
  banner:  `linear-gradient(90deg, ${colors.accentDeep}, ${colors.accent})`,
  /** Divider line ngang */
  divider: `linear-gradient(90deg, ${colors.accent} 0%, transparent 100%)`,
} as const;

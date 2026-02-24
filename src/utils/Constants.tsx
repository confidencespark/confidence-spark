/**
 * Global Constants (Utils)
 *
 * Exports frequent global values like Screen Dimensions.
 * Colors and Fonts are imported from the single source of truth.
 */
import {Dimensions} from 'react-native';
import {COLORS} from '@constants/colors';

export const screenHeight = Dimensions.get('screen').height;
export const screenWidth = Dimensions.get('screen').width;

export enum FONTS {
  heading = 'CormorantGaramond-Medium',
  heading2 = 'CormorantGaramond-Regular',
}

export const Colors = {
  primary: COLORS.primary,
  active: COLORS.accentLight,
  inactive: COLORS.textMuted,
  lightText: COLORS.text,
  background: COLORS.background,
  text: COLORS.text,
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('en-US', {month: 'short'});
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};

import {Dimensions} from 'react-native';
import {COLORS} from '@constants/colors';

/**
 * Unistyles Constants
 *
 * Defines global constants for screen dimensions, colors, and fonts used within the Unistyles theme.
 * Colors are imported from the single source of truth: @constants/colors.
 */
export const BOTTOM_TAB_HEIGHT = 90;
export const screenHeight = Dimensions.get('screen').height;
export const screenWidth = Dimensions.get('screen').width;
export const isBannerHeight = screenHeight * 0.4;

export const Colors = {
  primary: COLORS.primary,
  primary_light: COLORS.primary_light,
  text: COLORS.text,
  active_light: COLORS.active_light,
  secondary: COLORS.secondary,
  tertiary: COLORS.tertiary,
  background: COLORS.background,
  background_light: COLORS.background_light,
  border: COLORS.borderCard,
  lightText: COLORS.lightText,
  active: COLORS.active,
  dark: COLORS.dark,
};

export enum Fonts {
  Regular = 'Okra-Regular',
  Medium = 'Okra-Medium',
  Light = 'Okra-MediumLight',
  SemiBold = 'Okra-Bold',
  Bold = 'Okra-ExtraBold',
  HeadingMedium = 'CormorantGaramond-Medium',
  HeadingRegular = 'CormorantGaramond-Regular',
  HeadingSemiBold = 'CormorantGaramond-SemiBold',
  HeadingBold = 'CormorantGaramond-Bold',
}

export const lightColors = [
  'rgba(255,255,255,1)',
  'rgba(255,255,255,0.9)',
  'rgba(255,255,255,0.7)',
  'rgba(255,255,255,0.6)',
  'rgba(255,255,255,0.5)',
  'rgba(255,255,255,0.4)',
  'rgba(255,255,255,0.003)',
];

export const darkWeatherColors = [
  'rgba(54, 67, 92, 1)',
  'rgba(54, 67, 92, 0.9)',
  'rgba(54, 67, 92, 0.8)',
  'rgba(54, 67, 92, 0.2)',
  'rgba(54, 67, 92, 0.0)',
];

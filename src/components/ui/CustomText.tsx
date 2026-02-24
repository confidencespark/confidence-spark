import {Colors, Fonts} from '@unistyles/Constants';
import {Platform, StyleSheet, Text, TextStyle} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7';
type PlatformType = 'android' | 'ios';

interface CustomTextProps {
  variant?: Variant;
  fontFamily?:
    | 'Okra-Bold'
    | 'Okra-Regular'
    | 'Okra-Black'
    | 'Okra-Light'
    | 'Okra-Medium'
    | 'CormorantGaramond-Regular'
    | 'CormorantGaramond-Medium'
    | 'CormorantGaramond-SemiBold'
    | 'CormorantGaramond-Bold';
  fontSize?: number;
  color?: string;
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  numberOfLines?: number;
  onLayout?: (event: any) => void;
}

const fontSizeMap: Record<Variant, Record<PlatformType, number>> = {
  h1: {
    android: 24,
    ios: 22,
  },
  h2: {
    android: 20,
    ios: 20,
  },
  h3: {
    android: 18,
    ios: 18,
  },
  h4: {
    android: 16,
    ios: 16,
  },
  h5: {
    android: 14,
    ios: 14,
  },
  h6: {
    android: 12,
    ios: 10,
  },
  h7: {
    android: 10,
    ios: 9,
  },
};

// Heading variants default to Cormorant Garamond
const headingFontMap: Record<string, string> = {
  h1: Fonts.HeadingBold,
  h2: Fonts.HeadingSemiBold,
  h3: Fonts.HeadingMedium,
};

/**
 * Custom Typography Component
 *
 * Renders text using the App's custom fonts (Okra/Cormorant).
 * h1-h3 default to Cormorant Garamond for calm/premium headings.
 * h4-h7 default to Okra-Regular for body text.
 */
const CustomText: React.FC<CustomTextProps> = ({
  variant,
  fontFamily,
  fontSize,
  color,
  style,
  children,
  numberOfLines,
  onLayout,
  ...props
}) => {
  let computedFontSize: number =
    Platform.OS === 'android'
      ? RFValue(fontSize || 12)
      : RFValue(fontSize || 10);

  if (variant && fontSizeMap[variant]) {
    const defaultSize = fontSizeMap[variant][Platform.OS as PlatformType];
    computedFontSize = RFValue(fontSize || defaultSize);
  }

  // Default font: use Cormorant for h1-h3, Okra-Regular otherwise
  const resolvedFontFamily =
    fontFamily ||
    (variant && headingFontMap[variant]) ||
    'Okra-Regular';

  const fontFamilyStyle = {
    fontFamily: resolvedFontFamily,
  };

  return (
    <Text
      onLayout={onLayout}
      style={[
        styles.text,
        {color: color || Colors.text, fontSize: computedFontSize},
        fontFamilyStyle,
        style,
      ]}
      numberOfLines={numberOfLines !== undefined ? numberOfLines : undefined}
      {...props}>
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

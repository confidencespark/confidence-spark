// src/features/mood/ConfirmVibeScreen.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  Image,
  ImageBackground,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {DIMENSIONS} from '@constants/dimensions';
import {COLORS} from '@constants/colors';
import {navigate} from '@utils/NavigationUtils';
import {useEditMoodMutation} from '@store/api/confidenceApi';
import {getOrCreateDeviceId} from '@utils/deviceId';

const calm_bg = require('@assets/images/Confirm_calm.png');
const calm_hero = require('@assets/images/Calm_Grounded.png');
const pumped_bg = require('@assets/images/Confirm_Pumped.png');
const pumped_hero = require('@assets/images/Pumped_Powerful.png');
const playful_bg = require('@assets/images/Confirm_Playful.png');
const playful_hero = require('@assets/images/Playful_Loose.png');

const THEMES = {
  calm: {
    accent: COLORS.accent,
    bg: calm_bg,
    hero: calm_hero,
    title: 'Calm & Grounded',
  },
  power: {
    accent: COLORS.accent,
    bg: pumped_bg,
    hero: pumped_hero,
    title: 'Pumped & Powerful',
  },
  playful: {
    accent: COLORS.accent,
    bg: playful_bg,
    hero: playful_hero,
    title: 'Playful & Loose',
  },
};

/**
 * Confirm Vibe Screen
 *
 * Validates the user's chosen mood/vibe.
 *
 * Logic:
 * - Renders a themed background based on the selected mood.
 * - 'Start' confirms the mood via API (`useEditMoodMutation`).
 * - Initiates the content lookup via `LookupScreen`.
 */
export default function ConfirmVibeScreen({navigation, route}) {
  const insets = useSafeAreaInsets();
  const [editMood, {isLoading}] = useEditMoodMutation();

  const moodKey = route?.params?.mood || 'calm';
  const theme = THEMES[moodKey] || THEMES.calm;

  const onStart = async () => {
    try {
      const body = {
        device_id: await getOrCreateDeviceId(),
        mood: theme?.title,
        confidence_id: 0,
      };

      const res = await editMood(body).unwrap();

      navigate('LookupScreen');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Patterned background + tint */}
      <ImageBackground source={theme.bg} style={StyleSheet.absoluteFill}>
        <View style={StyleSheet.absoluteFill} />
      </ImageBackground>

      {/* Header: back pill */}
      <View
        style={[
          styles.header,
          {paddingTop: insets.top + DIMENSIONS.verticalScale(8)},
        ]}>
        <Pressable
          onPress={() => navigation?.goBack?.()}
          hitSlop={12}
          style={({pressed}) => [
            styles.backBtn,
            pressed && Platform.OS === 'ios' ? {opacity: 0.7} : null,
          ]}>
          <Ionicons name="chevron-back" size={22} color={theme.accent} />
        </Pressable>
      </View>

      {/* Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL,
          paddingBottom: DIMENSIONS.verticalScale(24),
          flex: 1,
          justifyContent: 'center',
        }}>
        <Image source={theme.hero} style={styles.hero} />

        {/* Title with accent */}
        <Text style={[styles.title, {color: theme.accent}]}>
          {theme.title}
        </Text>

        <Text style={styles.subtitle}>
          You're all set. Let's step into it.{'\n'}
          Hit start and own the moment.
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onStart}
          disabled={isLoading}
          style={{marginTop: DIMENSIONS.verticalScale(18)}}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={
              !isLoading
                ? [COLORS.gradientStart, COLORS.gradientEnd]
                : [COLORS.gradientDisabledStart, COLORS.gradientDisabledEnd]
            }
            style={styles.button}>
            <Text style={styles.btnText}>
              {isLoading ? 'Please wait\u2026' : 'Start'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const HERO = DIMENSIONS.moderateScale(230);
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.background},

  header: {
    paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL,
  },
  backBtn: {
    width: DIMENSIONS.moderateScale(40),
    height: DIMENSIONS.moderateScale(40),
    borderRadius: DIMENSIONS.moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  hero: {
    width: HERO,
    height: HERO,
    borderRadius: DIMENSIONS.moderateScale(14),
    marginTop: DIMENSIONS.verticalScale(16),
    marginBottom: DIMENSIONS.verticalScale(22),
    shadowColor: COLORS.black,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 6},
    elevation: 4,
  },

  title: {
    fontSize: DIMENSIONS.moderateScale(32),
    lineHeight: DIMENSIONS.moderateScale(40),
    fontWeight: '600',
    fontFamily: 'CormorantGaramond-SemiBold',
    textAlign: 'center',
    marginTop: DIMENSIONS.verticalScale(30),
    marginBottom: DIMENSIONS.verticalScale(30),
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.secondary,
    fontWeight: '500',
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    lineHeight: DIMENSIONS.FONT_SIZE_MEDIUM * 1.5,
    marginBottom: DIMENSIONS.verticalScale(30),
  },

  button: {
    height: DIMENSIONS.BUTTON_HEIGHT,
    width: Math.min(DIMENSIONS.SCREEN_WIDTH * 0.62, 300),
    borderRadius: DIMENSIONS.moderateScale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: DIMENSIONS.FONT_SIZE_XLARGE,
  },
});

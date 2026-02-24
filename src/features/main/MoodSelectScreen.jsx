// src/features/mood/MoodSelectScreen.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {DIMENSIONS} from '@constants/dimensions';
import {COLORS} from '@constants/colors';
import {navigate} from '@utils/NavigationUtils';

const calm_hero = require('@assets/images/Calm_Grounded.png');
const pumped_hero = require('@assets/images/Pumped_Powerful.png');
const playful_hero = require('@assets/images/Playful_Loose.png');

const MOODS = [
  {
    key: 'calm',
    title: 'Calm & Grounded',
    bg: COLORS.calm,
    image: calm_hero,
  },
  {
    key: 'power',
    title: 'Pumped & Powerful',
    bg: COLORS.powerful,
    image: pumped_hero,
  },
  {
    key: 'playful',
    title: 'Playful & Loose',
    bg: COLORS.playful,
    image: playful_hero,
  },
];

/**
 * Mood Selection Screen
 *
 * Allows the user to choose their desired emotional state before entering a situation.
 *
 * Options:
 * - Calm & Grounded
 * - Pumped & Powerful
 * - Playful & Loose
 *
 * Logic:
 * - Maps the selected mood to a theme (color/image).
 * - Passes the selection to `ConfirmVibeScreen`.
 */
export default function MoodSelectScreen({navigation, route}) {
  const insets = useSafeAreaInsets();
  const frozenBottom = React.useRef(insets.bottom || 0).current;

  const {situationTitle = 'Test', title} = route?.params;

  const onPick = mood => {
    navigate('ConfirmVibeScreen', {
      mood: mood.key,
      situationTitle,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header */}
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
          <Ionicons name="chevron-back" size={22} color={COLORS.accent} />
        </Pressable>

        <Text style={styles.heading}>
          How do you want to feel walking into your {title}
        </Text>
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL,
          paddingBottom: frozenBottom + DIMENSIONS.verticalScale(24),
          marginTop: DIMENSIONS.MARGIN_MEDIUM,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {MOODS.map(item => (
          <Pressable
            key={item.key}
            onPress={() => onPick(item)}
            android_ripple={{color: 'rgba(0,0,0,0.05)'}}
            style={({pressed}) => [
              styles.card,
              {backgroundColor: item.bg},
              pressed && Platform.OS === 'ios' ? {opacity: 0.9} : null,
            ]}>
            <Image source={item.image} style={styles.thumb} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_H = DIMENSIONS.verticalScale(110);
const R = DIMENSIONS.moderateScale(22);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: DIMENSIONS.MARGIN_SMALL,
  },

  header: {
    paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL,
    paddingBottom: DIMENSIONS.verticalScale(10),
  },
  backBtn: {
    width: DIMENSIONS.moderateScale(40),
    height: DIMENSIONS.moderateScale(40),
    borderRadius: DIMENSIONS.moderateScale(20),
    backgroundColor: COLORS.iconBgAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DIMENSIONS.verticalScale(10),
  },
  heading: {
    fontSize: DIMENSIONS.moderateScale(28),
    lineHeight: DIMENSIONS.moderateScale(36),
    fontWeight: '600',
    fontFamily: 'CormorantGaramond-SemiBold',
    color: COLORS.accent,
    marginTop: DIMENSIONS.MARGIN_LARGE,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: CARD_H,
    borderRadius: R,
    paddingHorizontal: DIMENSIONS.moderateScale(20),

    marginTop: DIMENSIONS.verticalScale(18),

    // subtle border to match mock
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  thumb: {
    width: DIMENSIONS.moderateScale(80),
    height: DIMENSIONS.moderateScale(80),
    borderRadius: DIMENSIONS.moderateScale(10),
    marginRight: DIMENSIONS.moderateScale(18),
  },
  cardTitle: {
    flex: 1,
    fontSize: DIMENSIONS.FONT_SIZE_XLARGE,
    fontWeight: '600',
    fontFamily: 'CormorantGaramond-SemiBold',
    color: COLORS.text,
  },
});

// src/features/situation/ConfirmSituationScreen.jsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Pressable,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {DIMENSIONS} from '@constants/dimensions';
import {COLORS} from '@constants/colors';
import {navigate} from '@utils/NavigationUtils';
import {useEditSituationMutation} from '@store/api/confidenceApi';
import {getOrCreateDeviceId} from '@utils/deviceId';
import {toFormData} from '@utils/commonFn';

/**
 * Confirm Situation Screen
 *
 * Displays the selected high-stakes situation (e.g., Interview, Pitch).
 *
 * Logic:
 * - Shows a hero image and motivational subtitle for the context.
 * - 'Proceed' confirms the situation via API (`useEditSituationMutation`).
 * - Navigates to `MoodSelectScreen` to choose the emotional target.
 */
export default function ConfirmSituationScreen({navigation, route}) {
  const insets = useSafeAreaInsets();
  const [editSituation, {isLoading}] = useEditSituationMutation();

  const {
    title = 'Interview',
    subtitle = "You\u2019re not here to impress.\nYou\u2019re here to connect.",
    image = {
      uri: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=800&auto=format&fit=crop',
    },
  } = route?.params || {};

  const onProceed = async () => {
    try {
      const body = {
        device_id: await getOrCreateDeviceId(),
        situation: route?.params?.title,
        confidence_id: 0,
      };

      const res = await editSituation(body).unwrap();

      navigate('MoodSelectScreen', {
        ...(route?.params || {}),
      });
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

      {/* Back */}
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
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.body}>
          <Image source={image} style={styles.hero} />

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.subtitle}>{subtitle}</Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onProceed}
            disabled={isLoading}
            style={{marginTop: DIMENSIONS.verticalScale(24)}}>
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
                {isLoading ? 'Please wait\u2026' : 'Proceed'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MAX_W = 380;
const HERO = DIMENSIONS.moderateScale(280);
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.background},

  header: {
    paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL,
  },
  backBtn: {
    width: DIMENSIONS.moderateScale(40),
    height: DIMENSIONS.moderateScale(40),
    borderRadius: DIMENSIONS.moderateScale(20),
    backgroundColor: COLORS.iconBgAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollBody: {
    alignItems: 'center',
    paddingBottom: DIMENSIONS.verticalScale(28),
    paddingTop: DIMENSIONS.verticalScale(28),
  },

  body: {
    width: '100%',
    maxWidth: MAX_W,
    alignItems: 'center',
    paddingTop: DIMENSIONS.verticalScale(22),
  },

  hero: {
    width: HERO,
    height: HERO,
    borderRadius: DIMENSIONS.moderateScale(12),
    marginBottom: DIMENSIONS.verticalScale(26),
  },

  title: {
    fontSize: DIMENSIONS.moderateScale(30),
    lineHeight: DIMENSIONS.moderateScale(38),
    fontWeight: '600',
    fontFamily: 'CormorantGaramond-SemiBold',
    color: COLORS.accent,
    marginBottom: DIMENSIONS.verticalScale(16),
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.secondary,
    fontWeight: '500',
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    lineHeight: DIMENSIONS.FONT_SIZE_MEDIUM * 1.55,
    marginBottom: DIMENSIONS.verticalScale(36),
  },

  button: {
    height: DIMENSIONS.BUTTON_HEIGHT,
    width: Math.min(DIMENSIONS.SCREEN_WIDTH * 0.58, 260),
    borderRadius: DIMENSIONS.moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: DIMENSIONS.FONT_SIZE_XLARGE,
  },
});

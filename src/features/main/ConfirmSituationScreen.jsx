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
    subtitle = 'You’re not here to impress.\nyou’re here to connect.',
    image = {
      uri: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=800&auto=format&fit=crop',
    },
  } = route?.params || {};
  console.log(route?.params);

  const onProceed = async () => {
    // if this lives under Main stack:
    // navigation.navigate('Main', {screen: 'MoodSelectScreen', params: {situationTitle: title}});
    // navigation.navigate('MoodSelect', {situationTitle: title});

    try {
      const body = {
        device_id: await getOrCreateDeviceId(),
        situation: route?.params?.title,
        // mood: '',
        confidence_id: 0,
      };
      // console.log('body', body);

      const res = await editSituation(body).unwrap();
      // console.log('res', res);

      navigate('Main', {
        screen: 'MoodSelectScreen',
        params: {
          ...(route?.params || {}),
        },
      });
      // else navigate('Auth', {screen: 'SignInScreen'});
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
          <Ionicons name="chevron-back" size={22} color="#2E6C94" />
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

          <Text style={styles.helper}>
            Click on proceed below to{'\n'}select the vibe
          </Text>

          {/* <Pressable onPress={onProceed} style={styles.btnWrap}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#8EC6EA', '#234B67']}
              style={styles.button}>
              <Text style={styles.btnText}>Proceed</Text>
            </LinearGradient>
          </Pressable> */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onProceed}
            disabled={isLoading}
            style={{marginTop: DIMENSIONS.verticalScale(18)}}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={
                !isLoading ? ['#8EC6EA', '#234B67'] : ['#C9D7E1', '#C9D7E1']
              }
              style={styles.button}>
              <Text style={styles.btnText}>
                {isLoading ? 'Please wait…' : 'Proceed'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MAX_W = 380; // keep column width like your mock on larger phones
const HERO = DIMENSIONS.moderateScale(280); // bigger image
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#FFFFFF'},

  header: {
    paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL,
  },
  backBtn: {
    width: DIMENSIONS.moderateScale(40),
    height: DIMENSIONS.moderateScale(40),
    borderRadius: DIMENSIONS.moderateScale(20),
    backgroundColor: '#EAF2F9',
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
    // spacing tuned to screenshot
    paddingTop: DIMENSIONS.verticalScale(22), // big top white space
  },

  hero: {
    width: HERO,
    height: HERO,
    borderRadius: DIMENSIONS.moderateScale(12),
    marginBottom: DIMENSIONS.verticalScale(22), // space before title
  },

  title: {
    fontSize: DIMENSIONS.moderateScale(28),
    lineHeight: DIMENSIONS.moderateScale(34),
    fontWeight: '800',
    color: '#2E6C94',
    marginBottom: DIMENSIONS.verticalScale(14), // space before subtitle
  },
  subtitle: {
    textAlign: 'center',
    color: '#2B2B2B',
    fontWeight: '600',
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    lineHeight: DIMENSIONS.FONT_SIZE_MEDIUM * 1.45,
    marginBottom: DIMENSIONS.verticalScale(36), // larger gap like mock
  },
  helper: {
    textAlign: 'center',
    color: '#A6AFB7', // lighter gray
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    marginBottom: DIMENSIONS.verticalScale(14),
    marginTop: DIMENSIONS.verticalScale(14),
  },

  btnWrap: {alignSelf: 'center'},
  button: {
    height: DIMENSIONS.BUTTON_HEIGHT, // compact pill
    width: Math.min(DIMENSIONS.SCREEN_WIDTH * 0.58, 260), // smaller width like mock
    borderRadius: DIMENSIONS.moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: DIMENSIONS.FONT_SIZE_XLARGE,
  },
});

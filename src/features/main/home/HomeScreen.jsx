// src/features/home/HomeScreen.jsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CurvedHeader from '@components/ui/CurvedHeader';
import {DIMENSIONS} from '@constants/dimensions';
import {navigate} from '@utils/NavigationUtils';
import {useEditSituationMutation} from '@store/api/confidenceApi';
import {getOrCreateDeviceId} from '@utils/deviceId';

const H_1 = require('@assets/images/h_1.webp');
const H_2 = require('@assets/images/h_2.webp');
const H_3 = require('@assets/images/h_3.webp');
const H_4 = require('@assets/images/h_4.webp');
const H_5 = require('@assets/images/h_5.webp');
const H_6 = require('@assets/images/h_6.webp');

const SITUATIONS = [
  {
    key: 'daily',
    title: 'Just Give Me a Daily Boost',
    sub: "You're not here to impress. You’re here to connect.",
    image: H_1,
    redirect: 'LookupScreen',
  },
  {
    key: 'interview',
    title: 'Interview',
    sub: 'You’re not here to impress. You’re here to connect.',
    image: H_2,
    redirect: 'ConfirmSituationScreen',
  },
  {
    key: 'negotiation',
    title: 'Negotiation',
    sub: 'Hold the line. Speak your worth.',
    image: H_3,
    redirect: 'ConfirmSituationScreen',
  },
  {
    key: 'performance',
    title: 'Performance',
    sub: 'Let go. Lock in. Light it up.',
    image: H_4,
    redirect: 'ConfirmSituationScreen',
  },
  {
    key: 'presentation',
    title: 'Presentation',
    sub: 'Your voice matters, make it heard.',
    image: H_5,
    redirect: 'ConfirmSituationScreen',
  },
  {
    key: 'pitch',
    title: 'Pitch',
    sub: 'You’re not asking, you’re offering',
    image: H_6,
    redirect: 'ConfirmSituationScreen',
  },
];

/**
 * Home Screen
 *
 * Displays the list of "Situations" a user can start (e.g., Interview, Pitch).
 *
 * Key Features:
 * - API Integration: Calls `editSituation` when a user selects an item to prep the backend.
 * - Loading State: Shows a full-screen loader while initializing the session.
 * - Device ID: Sends the device ID with the API request for tracking.
 */
export default function HomeScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const [editSituation, {isLoading}] = useEditSituationMutation();
  const [showFullLoader, setShowFullLoader] = useState(true);

  const frozenBottom = React.useRef(insets.bottom || 0).current;

  const onSelect = async item => {
    if (item?.key == 'daily') {
      try {
        setShowFullLoader(true);
        const body = {
          device_id: await getOrCreateDeviceId(),
          situation: 'Daily Boost',
          // mood: '',
          confidence_id: 0,
        };
        // console.log('body', body);

        const res = await editSituation(body).unwrap();
        // console.log('res', res);
      } catch (error) {
        console.log(error);
      }
      setShowFullLoader(false);
    }
    navigate('Main', {
      screen: item.redirect,
      params: {
        title: item.title,
        subtitle: item.sub,
        image: item?.image,
      },
    });
  };

  useEffect(() => {
    setTimeout(() => setShowFullLoader(false), 500);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <CurvedHeader
        edge="bottom"
        text={{
          title: "What's Your Moment?",
          desc: 'Choose the situation you’re walking into, we’ll build your custom boost from there.',
        }}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL,
          paddingBottom: frozenBottom + DIMENSIONS.verticalScale(24),
        }}
        showsVerticalScrollIndicator={false}>
        <View style={{height: DIMENSIONS.verticalScale(6)}} />

        {SITUATIONS.map(item => (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item)}
            android_ripple={{color: 'rgba(0,0,0,0.06)', borderless: false}}
            style={({pressed}) => [
              styles.card,
              pressed && Platform.OS === 'ios' ? {opacity: 0.9} : null,
            ]}>
            {/* left icon */}
            <View style={styles.iconWrap}>
              <Ionicons name="flame" size={24} color="#7FB4D1" />
            </View>

            {/* text */}
            <View style={styles.textCol}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.cardSub}>
                {item.sub}
              </Text>
            </View>

            {/* right thumbnail */}
            <Image source={item.image} style={styles.thumb} />
          </Pressable>
        ))}
      </ScrollView>

      {/* FULL-SCREEN LOADER (replaces skeletons) */}
      {showFullLoader && (
        <View style={styles.blocker} pointerEvents="auto">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.blockerText}>Loading…</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const CARD_RADIUS = DIMENSIONS.moderateScale(16);
const THUMB = DIMENSIONS.moderateScale(74);

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#FFFFFF'},

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#E6E9EE',
    paddingHorizontal: DIMENSIONS.moderateScale(14),
    paddingVertical: DIMENSIONS.verticalScale(12),
    marginBottom: DIMENSIONS.verticalScale(12),

    // light shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 1,
  },

  iconWrap: {
    width: DIMENSIONS.moderateScale(40),
    height: DIMENSIONS.moderateScale(40),
    borderRadius: DIMENSIONS.moderateScale(20),
    backgroundColor: '#E8F2F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DIMENSIONS.moderateScale(12),
  },

  textCol: {
    flex: 1,
    paddingRight: DIMENSIONS.moderateScale(10),
  },
  cardTitle: {
    fontSize: DIMENSIONS.FONT_SIZE_LARGE,
    fontWeight: '800',
    color: '#111827',
    marginBottom: DIMENSIONS.verticalScale(4),
  },
  cardSub: {
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    color: '#8A93A1',
    lineHeight: DIMENSIONS.FONT_SIZE_MEDIUM * 1.35,
  },

  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: DIMENSIONS.moderateScale(10),
    marginLeft: DIMENSIONS.moderateScale(10),
  },

  /* full-page loader */
  blocker: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockerText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: '700',
    fontSize: 16,
  },
});

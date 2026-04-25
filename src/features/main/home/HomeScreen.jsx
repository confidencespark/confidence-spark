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
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CurvedHeader from '@components/ui/CurvedHeader';
import {DIMENSIONS} from '@constants/dimensions';
import {COLORS} from '@constants/colors';
import {SITUATIONS} from '@constants/situations';
//import {navigate} from '@utils/NavigationUtils';
import {useEditSituationMutation} from '@store/api/confidenceApi';
import {getOrCreateDeviceId} from '@utils/deviceId';
import {useNavigation} from '@react-navigation/native';

/**
 * Home Screen
 *
 * Displays the list of "Situations" a user can start (e.g., Interview, Pitch).
 *
 * Key Features:
 * - API Integration: Calls `editSituation` when a user selects an item to prep the backend.
 * - Device ID: Sends the device ID with the API request for tracking.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {navigate} = useNavigation();
  const [editSituation, {isLoading}] = useEditSituationMutation();

  const frozenBottom = React.useRef(insets.bottom || 0).current;

  const onSelect = async item => {
    if (item?.key == 'daily') {
      try {
        const body = {
          device_id: await getOrCreateDeviceId(),
          situation: 'Daily Boost',
          confidence_id: 0,
        };

        const res = await editSituation(body).unwrap();
      } catch (error) {
        console.log(error);
      }
    }
    navigate(item.redirect, {
      title: item.title,
      subtitle: item.sub,
      image: item?.image,
    });
  };

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
          desc: 'Choose the situation you\u2019re walking into, we\u2019ll build your custom boost from there.',
        }}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL,
          paddingBottom: 200,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={{height: DIMENSIONS.verticalScale(10)}} />

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
              <Ionicons name="flame" size={24} color={COLORS.iconTint} />
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
    </SafeAreaView>
  );
}

const CARD_RADIUS = DIMENSIONS.moderateScale(16);
const THUMB = DIMENSIONS.moderateScale(74);

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.background},

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: COLORS.borderLight,
    paddingHorizontal: DIMENSIONS.moderateScale(16),
    paddingVertical: DIMENSIONS.verticalScale(14),
    marginBottom: DIMENSIONS.verticalScale(14),

    // light shadow
    shadowColor: COLORS.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 1,
  },

  iconWrap: {
    width: DIMENSIONS.moderateScale(40),
    height: DIMENSIONS.moderateScale(40),
    borderRadius: DIMENSIONS.moderateScale(20),
    backgroundColor: COLORS.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DIMENSIONS.moderateScale(14),
  },

  textCol: {
    flex: 1,
    paddingRight: DIMENSIONS.moderateScale(10),
  },
  cardTitle: {
    fontSize: DIMENSIONS.FONT_SIZE_LARGE,
    fontWeight: '600',
    fontFamily: 'CormorantGaramond-SemiBold',
    color: COLORS.text,
    marginBottom: DIMENSIONS.verticalScale(4),
  },
  cardSub: {
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    color: COLORS.textMuted,
    lineHeight: DIMENSIONS.FONT_SIZE_MEDIUM * 1.45,
  },

  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: DIMENSIONS.moderateScale(10),
    marginLeft: DIMENSIONS.moderateScale(10),
  },
});

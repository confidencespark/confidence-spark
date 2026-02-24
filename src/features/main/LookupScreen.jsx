import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  ImageBackground,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {DIMENSIONS} from '@constants/dimensions';
import {navigate} from '@utils/NavigationUtils';
import {getOrCreateDeviceId} from '@utils/deviceId';
import {useConfidenceLookupMutation} from '@store/api/confidenceApi';
import {preloadUrls} from '@utils/imagePreload';
import FastImage from '@d11/react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';

// local, instant
const HERO = require('@assets/images/lookupHero.webp');
const LETSGOICON = require('@assets/images/letsgoIcon.png');

/**
 * Lookup Screen (Loading/Preparation)
 *
 * Fetches and prepares the confidence kit content.
 *
 * Logic:
 * - Calls `useConfidenceLookupMutation` to get the customized steps.
 * - Preloads assets (Large images, Audio files) into cache for smooth playback.
 * - Displays a 'Let's Go' CTA once data is ready.
 * - Passes all step data to `StepFlowScreen`.
 */
export default function LookupScreen({navigation}) {
  const insets = useSafeAreaInsets();

  const [confidenceLookup, {isLoading}] = useConfidenceLookupMutation();
  const [confidenceData, setConfidenceData] = useState({});
  const [audioPath, setAudioPath] = useState('');

  // single flag for preloading (images + audio)
  const [cachedLoading, setCachedLoading] = useState(true);

  const steps = [
    {icon: 'sparkles-outline', label: 'Mantra'},
    {icon: 'body', label: 'Body Reset'},
    {icon: 'leaf-outline', label: 'Grounding Belief'},
    {icon: 'repeat-outline', label: 'Mental Reframe'},
    {icon: 'checkmark-done-circle-outline', label: 'Ending Ritual'},
    {icon: 'bulb-outline', label: 'Bonus Tip'},
  ];

  const onPrimary = () => {
    navigate('Main', {
      screen: 'StepFlowScreen',
      params: {
        situationTitle: confidenceData?._situation_sc?.[0]?.name,
        hero: {uri: ''},
        initialIndex: 0,
        audio: audioPath || confidenceData?.kit_audio,
        audioCached: !!audioPath,
        steps: [
          {
            key: 'mantra',
            title: 'Mantra',
            text: confidenceData?._mantra_sc?.[0]?.quote,
            hero: confidenceData?._mantra_sc?.[0]?.mantra_step_image?.url,
          },
          {
            key: 'body',
            title: 'Body Reset',
            text: confidenceData?._body_reset_sc?.[0]?.quote,
            hero: confidenceData?._body_reset_sc?.[0]?.bodyreset_step_images
              ?.url,
          },
          {
            key: 'belief',
            title: 'Grounding Belief',
            text: confidenceData?._grounding_belief_sc?.[0]?.quote,
            hero: confidenceData?._grounding_belief_sc?.[0]
              ?.groundingbelief_step_image?.url,
          },
          {
            key: 'reframe',
            title: 'Mental Reframe',
            text: confidenceData?._mental_reframe_sc?.[0]?.quote,
            hero: confidenceData?._mental_reframe_sc?.[0]
              ?.mentalreframe_step_image?.url,
          },
          {
            key: 'ritual',
            title: 'Ending Ritual',
            text: confidenceData?._ending_ritual_sc?.[0]?.quote,
            hero: confidenceData?._ending_ritual_sc?.[0]
              ?.endingritual_step_image?.url,
          },
          {
            key: 'bonus',
            title: 'Bonus Tip',
            text: confidenceData?._bonus_tip_sc?.[0]?.quote,
            hero: confidenceData?._bonus_tip_sc?.[0]?.bonustip_step_image?.url,
          },
        ],
        finishRoute: {name: 'HomeScreen'},
      },
    });
  };

  const getConfidenceStepData = async () => {
    try {
      const device_id = await getOrCreateDeviceId();
      const res = await confidenceLookup({device_id}).unwrap();
      console.log('res', res);

      if (res?.[0]) setConfidenceData(res[0]);
    } catch (error) {
      console.log('error in getConfidenceStepData', error);
    }
  };

  useEffect(() => {
    getConfidenceStepData();
  }, []);

  // safe mp3 filename
  const toMp3Name = u => {
    try {
      const base = decodeURIComponent((u || '').split('?')[0]);
      const name = base.split('/').pop() || `audio_${Date.now()}.mp3`;
      return name.toLowerCase().endsWith('.mp3') ? name : `${name}.mp3`;
    } catch {
      return `audio_${Date.now()}.mp3`;
    }
  };

  // preload images + audio once we have data
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!confidenceData || !confidenceData._mantra_sc) return;
      setCachedLoading(true);

      try {
        // images
        const urls = [
          confidenceData?._mantra_sc?.[0]?.mantra_step_image?.url,
          confidenceData?._body_reset_sc?.[0]?.bodyreset_step_images?.url,
          confidenceData?._grounding_belief_sc?.[0]?.groundingbelief_step_image
            ?.url,
          confidenceData?._mental_reframe_sc?.[0]?.mentalreframe_step_image
            ?.url,
          confidenceData?._ending_ritual_sc?.[0]?.endingritual_step_image?.url,
          confidenceData?._bonus_tip_sc?.[0]?.bonustip_step_image?.url,
        ].filter(Boolean);

        if (urls.length) {
          FastImage.preload(urls.map(uri => ({uri})));
          await Promise.allSettled(urls.map(u => Image.prefetch(u)));
          preloadUrls(urls);
        }

        // audio
        const url = confidenceData?.kit_audio;
        if (url) {
          const fileName = toMp3Name(url);
          const destPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}`;
          setCachedLoading(false);
          const res = await RNFetchBlob.config({
            fileCache: true,
            path: destPath,
          }).fetch('GET', url);

          const rawPath = res.path();
          const exists = await RNFetchBlob.fs.exists(rawPath);
          if (exists && !cancelled) {
            const uri = Platform.OS === 'ios' ? `file://${rawPath}` : rawPath;
            setAudioPath(uri);
          } else if (!cancelled) {
            setAudioPath(''); // fallback to remote at play-time
          }
        }
      } catch (e) {
        console.log('prefetch error', e);
      } finally {
        if (!cancelled) setCachedLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [confidenceData]);

  // derived: full-screen loading instead of skeletons
  const showFullLoader = cachedLoading;

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* HERO (local) */}
      <View
        style={[
          styles.heroWrap,
          {paddingTop: insets.top + DIMENSIONS.verticalScale(6)},
        ]}>
        <ImageBackground
          source={HERO}
          style={styles.heroImage}
          imageStyle={styles.heroRadius}>
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.15)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroTopRow}>
            <Pressable
              onPress={() => navigation?.goBack?.()}
              style={styles.backBtn}
              hitSlop={12}>
              <Ionicons name="chevron-back" size={22} color="#2E6C94" />
            </Pressable>
          </View>
        </ImageBackground>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.cardScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.heroTextBox}>
            <Text style={styles.heroTitle}>
              Here’s Your{'\n'}Confidence {'Spark\u2122'}
            </Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <Text
              style={[styles.headline, {color: '#2B6AA8', fontWeight: '800'}]}>
              {confidenceData?.kit_name ? confidenceData.kit_name : ''}
            </Text>
          </View>

          {/* CTA */}
          <Pressable
            onPress={onPrimary}
            disabled={showFullLoader}
            style={{marginTop: DIMENSIONS.verticalScale(8)}}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={
                !showFullLoader
                  ? ['#8EC6EA', '#234B67']
                  : ['#C9D7E1', '#C9D7E1']
              }
              style={styles.cta}>
              <>
                <Image source={LETSGOICON} style={styles.thumbIcon} />
                <Text style={styles.ctaText}>
                  {showFullLoader ? 'Please wait…' : 'Let’s Go!'}
                </Text>
              </>
            </LinearGradient>
          </Pressable>
        </View>
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

function StepRow({icon, label}) {
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.iconWrap}>
        <LinearGradient
          colors={['#CFE6F6', '#87B8D8']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={rowStyles.iconBg}>
          <Ionicons name={icon} size={20} color="#1F3E57" />
        </LinearGradient>
      </View>
      <Text style={rowStyles.label}>{label}</Text>
    </View>
  );
}

const THUMB = DIMENSIONS.moderateScale(40);

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#FFFFFF'},
  heroWrap: {paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL},
  heroImage: {
    height: DIMENSIONS.verticalScale(220),
    borderRadius: DIMENSIONS.moderateScale(14),
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  heroRadius: {borderRadius: DIMENSIONS.moderateScale(14)},
  heroTopRow: {padding: DIMENSIONS.moderateScale(10)},
  backBtn: {
    width: DIMENSIONS.moderateScale(40),
    height: DIMENSIONS.moderateScale(40),
    borderRadius: DIMENSIONS.moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextBox: {padding: DIMENSIONS.moderateScale(16)},
  heroTitle: {
    color: 'black',
    fontWeight: '800',
    fontSize: DIMENSIONS.moderateScale(26),
    lineHeight: DIMENSIONS.moderateScale(30),
    textAlign: 'center',
  },
  cardScroll: {
    paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL,
    paddingBottom: DIMENSIONS.verticalScale(22),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: DIMENSIONS.moderateScale(18),
    borderTopRightRadius: DIMENSIONS.moderateScale(18),
    marginTop: -DIMENSIONS.verticalScale(12),
    paddingTop: DIMENSIONS.verticalScale(16),
    paddingBottom: DIMENSIONS.verticalScale(16),
  },
  headline: {
    textAlign: 'center',
    fontSize: DIMENSIONS.moderateScale(18),
    lineHeight: DIMENSIONS.verticalScale(22),
    marginTop: DIMENSIONS.verticalScale(20),
    marginBottom: DIMENSIONS.verticalScale(20),
  },
  cta: {
    height: DIMENSIONS.BUTTON_HEIGHT,
    borderRadius: DIMENSIONS.moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    width: Math.min(DIMENSIONS.SCREEN_WIDTH * 0.82, 360),
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: DIMENSIONS.FONT_SIZE_XLARGE,
  },
  thumbIcon: {
    width: THUMB,
    height: THUMB,
    borderRadius: 5,
    marginRight: 20,
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

const ROW_H = Math.max(DIMENSIONS.verticalScale(50), 52);

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_H,
    backgroundColor: '#F7FAFC',
    borderRadius: DIMENSIONS.moderateScale(14),
    paddingHorizontal: DIMENSIONS.moderateScale(14),
  },
  iconWrap: {marginRight: DIMENSIONS.moderateScale(12)},
  iconBg: {
    width: DIMENSIONS.moderateScale(40),
    height: DIMENSIONS.moderateScale(40),
    borderRadius: DIMENSIONS.moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(31,62,87,0.15)',
  },
  label: {
    fontSize: DIMENSIONS.FONT_SIZE_XLARGE,
    color: '#1F2937',
    fontWeight: '700',
  },
});

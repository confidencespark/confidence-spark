// src/features/steps/StepFlowScreen.jsx
import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Image,
  Animated,
  ScrollView,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {DIMENSIONS} from '@constants/dimensions';
import {COLORS} from '@constants/colors';
import {resetAndNavigate} from '@utils/NavigationUtils';

// ------- assets -------
const HERO_FALLBACK = {
  uri: 'https://images.unsplash.com/photo-1520975922074-3b2c7b1e46b9?q=80&w=1600&auto=format&fit=crop',
};
const CARD_BG = require('@assets/images/stepBackground.png');

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

// min overlay time so the transition feels intentional
const MIN_LOADER_MS = 300; // set 200–400 to taste

/**
 * Step Flow Screen (The Core Experience)
 *
 * Guides the user through the 5-step confidence routine.
 *
 * Features:
 * - Dynamic Hero Images: Smooth transitions/preloading between step images.
 * - Audio Playback: Integrated player for the guided voiceover (Mantra step).
 * - Step Navigation: Next/Back logic with index tracking.
 * - Completion: Returns to Home or designated finish route on end.
 */
export default function StepFlowScreen({navigation, route}) {
  const insets = useSafeAreaInsets();

  const {
    situationTitle = 'Situation Name',
    steps = [],
    initialIndex = 0,
    hero = HERO_FALLBACK,
    audio = '',
    finishRoute = {name: 'HomeScreen'},
  } = route?.params || {};

  const [index, setIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // ---- hero/state for no-flicker swap ----
  const [displayedHero, setDisplayedHero] = useState(
    steps[initialIndex]?.hero ||
      steps[initialIndex]?.image ||
      hero?.uri ||
      hero,
  );
  const [incomingHero, setIncomingHero] = useState(null);
  const [pendingIndex, setPendingIndex] = useState(null);
  const [isBlocking, setIsBlocking] = useState(true);
  const loaderStartRef = useRef(null);

  // ---- audio setup (unchanged) ----
  const playerRef = useRef(AudioRecorderPlayer).current;
  const hasStartedRef = useRef(false);
  const pausedRef = useRef(false);
  const lastPosRef = useRef(0);
  const durationRef = useRef(0);
  const endedRef = useRef(false);
  const endTimerRef = useRef(null);

  // subtle content fade
  const contentAnim = useRef(new Animated.Value(1)).current;

  const step = steps[index] || {};
  const stepHero = displayedHero;

  /* ---------- audio helpers ---------- */
  const attachListener = useCallback(() => {
    try {
      playerRef.removePlayBackListener();
    } catch {}
    playerRef.addPlayBackListener(async e => {
      const pos = Number(e?.current_position ?? 0);
      const dur = Number(e?.duration ?? 0);
      if (!Number.isNaN(pos)) lastPosRef.current = pos;
      if (!Number.isNaN(dur) && dur > 0) {
        const wasZero = durationRef.current === 0;
        durationRef.current = dur;
        if (wasZero || isPlaying) scheduleEndGuard();
      }
      const looksEnded = dur > 0 && pos >= Math.max(0, dur - 250);
      if (looksEnded && !endedRef.current) {
        endedRef.current = true;
        await onNaturalEnd();
      }
      return;
    });
  }, [playerRef, isPlaying]);

  const clearEndTimer = () => {
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }
  };

  const onNaturalEnd = async () => {
    try {
      await playerRef.stopPlayer();
    } catch {}
    try {
      playerRef.removePlayBackListener();
    } catch {}
    hasStartedRef.current = false;
    pausedRef.current = false;
    lastPosRef.current = 0;
    durationRef.current = 0;
    endedRef.current = true;
    clearEndTimer();
    setIsPlaying(false);
  };

  const scheduleEndGuard = () => {
    clearEndTimer();
    const pos = lastPosRef.current || 0;
    const dur = durationRef.current || 0;
    if (dur > 0 && dur > pos) {
      const remaining = Math.max(0, dur - pos) + 300;
      endTimerRef.current = setTimeout(onNaturalEnd, remaining);
    }
  };

  const stopAndRelease = useCallback(async () => {
    clearEndTimer();
    try {
      await playerRef.stopPlayer();
    } catch {}
    try {
      playerRef.removePlayBackListener();
    } catch {}
    hasStartedRef.current = false;
    pausedRef.current = false;
    lastPosRef.current = 0;
    durationRef.current = 0;
    endedRef.current = false;
    setIsPlaying(false);
  }, [playerRef]);

  const pausePlayback = async () => {
    clearEndTimer();
    await playerRef.pausePlayer();
    pausedRef.current = true;
    setIsPlaying(false);
  };

  React.useEffect(() => {
    try {
      playerRef.setSubscriptionDuration(0.1);
    } catch {}
    return () => {
      clearEndTimer();
      stopAndRelease();
    };
  }, [playerRef, stopAndRelease]);

  const startFromBeginning = async url => {
    endedRef.current = false;
    clearEndTimer();
    setIsLoadingAudio(true);
    try {
      await playerRef.startPlayer(url);
      await playerRef.setVolume(1.0);
    } catch (e) {
      console.log('startPlayer error', e);
    }
    hasStartedRef.current = true;
    pausedRef.current = false;
    attachListener();
    setIsPlaying(true);
    setIsLoadingAudio(false);
    if (durationRef.current > 0) scheduleEndGuard();
  };

  const resumePlayback = async url => {
    clearEndTimer();
    setIsLoadingAudio(true);
    try {
      await playerRef.resumePlayer();
    } catch {
      await playerRef.startPlayer(url);
      attachListener();
      setTimeout(() => {
        playerRef.seekToPlayer(Math.max(0, lastPosRef.current));
      }, 120);
    }
    pausedRef.current = false;
    setIsPlaying(true);
    setIsLoadingAudio(false);
    if (durationRef.current > 0) scheduleEndGuard();
  };

  const togglePlay = async () => {
    if (!audio) return;
    if (isPlaying) return pausePlayback();
    if (hasStartedRef.current && pausedRef.current)
      return resumePlayback(audio);
    return startFromBeginning(audio);
  };

  const isLast = index >= (steps?.length || 1) - 1;

  /* ---------- step change gated by decode + min loader ---------- */
  const goToStep = nextIdx => {
    if (nextIdx === index || isBlocking) return;

    const nextHero =
      steps[nextIdx]?.hero || steps[nextIdx]?.image || hero?.uri || hero;

    loaderStartRef.current = Date.now();
    setIsBlocking(true);
    setPendingIndex(nextIdx);
    setIncomingHero(nextHero);

    // hint cache
    if (nextHero) Image.prefetch(nextHero);

    // fade out content under overlay (optional)
    contentAnim.setValue(0);
  };

  const onNext = async () => {
    if (isLast) {
      await stopAndRelease();
      if (finishRoute?.name) navigation.replace('UserBottomTab');
      else navigation.goBack();
      return;
    }
    goToStep(index + 1);
  };

  const onBack = async () => {
    if (index > 0) {
      goToStep(index - 1);
    } else {
      await stopAndRelease();
      navigation?.goBack?.();
    }
  };

  // warm cache for all heroes
  React.useEffect(() => {
    if (steps.length > 0)
      steps.forEach(s => {
        const uri = s?.hero || s?.image;
        if (uri) Image.prefetch(uri);
      });
  }, [steps]);

  const finishAfterMinDuration = fn => {
    const elapsed = Date.now() - (loaderStartRef.current || 0);
    const wait = Math.max(0, MIN_LOADER_MS - elapsed);
    setTimeout(() => {
      fn?.();
      loaderStartRef.current = null;
    }, wait);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* ---------- HERO ---------- */}
      <View style={styles.heroContainer}>
        <AnimatedImageBackground
          source={{uri: stepHero}}
          style={[styles.heroFull, {height: HERO_H}]}
          imageStyle={styles.heroImageNoRadius}
          resizeMode="cover"
          fadeDuration={0} // <-- remove Android default 300ms fade
          // onLoad={() => {
          //   setIsBlocking(true);
          // }}
          onLoadEnd={() => setIsBlocking(false)}>
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.15)']}
            style={StyleSheet.absoluteFill}
          />
        </AnimatedImageBackground>

        {/* full-size hidden preloader ensures decode at target size */}
        {incomingHero ? (
          <Image
            source={{uri: incomingHero}}
            resizeMode="cover"
            fadeDuration={0}
            style={styles.preloaderFull} // full width & HERO_H height
            onLoad={() => {
              finishAfterMinDuration(() => {
                setDisplayedHero(incomingHero);
                if (typeof pendingIndex === 'number') setIndex(pendingIndex);
                setPendingIndex(null);
                setIncomingHero(null);
                // setIsBlocking(false);
                Animated.timing(contentAnim, {
                  toValue: 1,
                  duration: 160,
                  useNativeDriver: true,
                }).start();
              });
            }}
            onError={() => {
              // advance anyway after min time; keep old hero
              finishAfterMinDuration(() => {
                if (typeof pendingIndex === 'number') setIndex(pendingIndex);
                setPendingIndex(null);
                setIncomingHero(null);
                // setIsBlocking(false);
                Animated.timing(contentAnim, {
                  toValue: 1,
                  duration: 160,
                  useNativeDriver: true,
                }).start();
              });
            }}
          />
        ) : null}

        {/* overlay UI above hero */}
        <Pressable
          onPress={onBack}
          style={[styles.backBtnAbs, {top: insets.top + 8}]}
          hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={COLORS.accent} />
        </Pressable>
        <View style={[StyleSheet.absoluteFill, styles.heroCenterAbs]}>
          <Text style={styles.heroTitle}>{situationTitle}</Text>
        </View>
      </View>

      {/* ---------- CARD ---------- */}
      <ImageBackground source={CARD_BG} style={styles.card} resizeMode="cover">
        {!isBlocking && (
          <ScrollView
            // contentContainerStyle={styles.cardScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Animated.View style={[styles.cardInner, {opacity: contentAnim}]}>
              <Text style={styles.stepIndex}>
                Step {Math.min(index + 1, steps.length || 1)}
              </Text>
              <Text style={styles.stepTitle}>{step?.title || '—'}</Text>
              <Text style={styles.stepText}>
                {step?.text || 'Text to show'}
              </Text>

              {/* play button */}
              {index == 0 &&
                (isLoadingAudio ? (
                  <Pressable style={styles.playWrap} disabled>
                    <LinearGradient
                      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={styles.playBtn}>
                      <ActivityIndicator size="large" color="#fff" />
                    </LinearGradient>
                  </Pressable>
                ) : (
                  <Pressable style={styles.playWrap} onPress={togglePlay}>
                    <LinearGradient
                      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={styles.playBtn}>
                      <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={28}
                        color="#fff"
                      />
                    </LinearGradient>
                  </Pressable>
                ))}

              {/* next button */}
              <Pressable
                onPress={onNext}
                style={{marginTop: DIMENSIONS.verticalScale(30)}}>
                <LinearGradient
                  colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.cta}>
                  <Text style={styles.ctaText}>
                    {isLast ? 'Back to Menu' : 'Next'}
                  </Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </ScrollView>
        )}
      </ImageBackground>

      {/* ---------- MIN-DURATION FULL-PAGE LOADER ---------- */}
      {isBlocking && (
        <View style={styles.blocker} pointerEvents="auto">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.blockerText}>Loading…</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

/* ---------- styles ---------- */
const HERO_H = DIMENSIONS.verticalScale(260);
const CARD_R = DIMENSIONS.moderateScale(26);

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.background},

  /* HERO */
  heroContainer: {width: SCREEN_WIDTH, height: HERO_H},
  heroFull: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroImageNoRadius: {borderRadius: 0},
  backBtnAbs: {
    position: 'absolute',
    left: DIMENSIONS.moderateScale(12),
    width: DIMENSIONS.moderateScale(40),
    height: DIMENSIONS.moderateScale(40),
    borderRadius: DIMENSIONS.moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  heroCenterAbs: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: DIMENSIONS.verticalScale(18),
  },
  heroTitle: {
    color: COLORS.white,
    fontWeight: '600',
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: DIMENSIONS.moderateScale(30),
    lineHeight: DIMENSIONS.moderateScale(36),
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 6,
    textShadowOffset: {width: 0, height: 2},
  },

  /* CARD */
  card: {flex: 1},
  cardRadius: {
    borderTopLeftRadius: CARD_R,
    borderTopRightRadius: CARD_R,
  },
  cardInner: {
    flex: 1,
    paddingTop: DIMENSIONS.verticalScale(30),
    paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL + 4,
    alignItems: 'center',
    rowGap: 14,
  },
  stepIndex: {
    color: COLORS.accentLight,
    fontWeight: '600',
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    marginBottom: DIMENSIONS.verticalScale(6),
  },
  stepTitle: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: DIMENSIONS.moderateScale(22),
    marginBottom: DIMENSIONS.verticalScale(8),
  },
  stepText: {
    color: COLORS.text,
    fontWeight: '500',
    fontSize: DIMENSIONS.moderateScale(17),
    textAlign: 'center',
    lineHeight: DIMENSIONS.moderateScale(26),
    marginBottom: DIMENSIONS.verticalScale(20),
  },
  playWrap: {marginBottom: DIMENSIONS.verticalScale(12)},
  playBtn: {
    width: DIMENSIONS.moderateScale(66),
    height: DIMENSIONS.moderateScale(66),
    borderRadius: DIMENSIONS.moderateScale(33),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  cta: {
    height: DIMENSIONS.BUTTON_HEIGHT,
    borderRadius: DIMENSIONS.moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    width: Math.min(DIMENSIONS.SCREEN_WIDTH * 0.8, 360),
    marginBottom: DIMENSIONS.verticalScale(18),
  },
  ctaText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: DIMENSIONS.FONT_SIZE_XLARGE,
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

  /* FULL-SIZE hidden preloader (forces full decode) */
  preloaderFull: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: HERO_H,
    opacity: 0.01, // tiny alpha so it still lays out/composes
  },
});

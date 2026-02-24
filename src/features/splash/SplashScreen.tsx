import {
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {FC, useEffect} from 'react';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {resetAndNavigate} from '@utils/NavigationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '@constants/colors';
import {DIMENSIONS} from '@constants/dimensions';
import {STORAGE_KEYS} from '@constants/storageKeys';

/**
 * Splash Screen
 *
 * Initial launch screen.
 *
 * Logic:
 * - Displays Logo with animation.
 * - Checks AsyncStorage for auth token.
 * - If token found → skip intro, go straight to UserBottomTab.
 * - If no token → navigate to IntroScreen.
 */
const SplashScreen: FC = () => {
  useEffect(() => {
    const checkAndNavigate = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        // Give the splash animation time to display (2s minimum)
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (token) {
          resetAndNavigate('UserBottomTab');
        } else {
          resetAndNavigate('IntroScreen');
        }
      } catch (error) {
        console.log('Splash auth check error:', error);
        // On error, default to intro
        resetAndNavigate('IntroScreen');
      }
    };

    checkAndNavigate();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require('@assets/images/splash.png')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
          style={styles.gradient}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Animated.View
                entering={FadeInDown.delay(400).duration(400)}>
                <ImageBackground
                  source={require('@assets/images/logo.png')}
                  style={{
                    width: DIMENSIONS.moderateScale(100),
                    height: DIMENSIONS.moderateScale(100),
                  }}
                />
              </Animated.View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: DIMENSIONS.moderateScale(80),
    height: DIMENSIONS.moderateScale(80),
    borderRadius: DIMENSIONS.moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;

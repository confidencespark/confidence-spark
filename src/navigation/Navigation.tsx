import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IntroScreen from '@features/intro/IntroScreen';
import SplashScreen from '@features/splash/SplashScreen';
import UserBottomTab from '@features/tabs/UserBottomTab';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '@utils/NavigationUtils';

import { setToken } from '../store/slices/authSlice';

import AuthNavigator from './AuthNavigator';
import { STORAGE_KEYS } from '@constants/storageKeys';
import { hideNavBar } from '../utils/androidNavBar';
import HomeScreen from '@features/main/home/HomeScreen';
import MoodSelectScreen from '@features/main/MoodSelectScreen';
import ConfirmSituationScreen from '@features/main/ConfirmSituationScreen';
import ConfirmVibeScreen from '@features/main/ConfirmVibeScreen';
import LookupScreen from '@features/main/LookupScreen';
import StepFlowScreen from '@features/main/StepFlowScreen';

const Stack = createNativeStackNavigator();

/**
 * Root Navigation Component
 *
 * This component is responsible for:
 * 1. Initializing the NavigationContainer
 * 2. Checking the user's authentication status (loading token from storage)
 * 3. Handling the initial splash screen logic
 * 4. Deciding whether to show Main or Auth navigators based on auth state
 *
 * Note: The Main stack has been removed — all flow screens now live inside
 * HomeStackNavigator (nested under UserBottomTab > Home tab) so that bottom
 * tabs remain visible throughout the confidence flow.
 */
const Navigation: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Checks for an existing auth token in AsyncStorage.
   * If found, it dispatches the setToken action to update the Redux store.
   */
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        dispatch(setToken(token));
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
    }
  };
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={hideNavBar}
      onStateChange={hideNavBar}
    >
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name="IntroScreen"
          component={IntroScreen}
        />

        <Stack.Screen name="Auth" component={AuthNavigator} />

        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name="UserBottomTab"
          component={UserBottomTab}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name="MoodSelectScreen"
          component={MoodSelectScreen}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name="ConfirmSituationScreen"
          component={ConfirmSituationScreen}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name="ConfirmVibeScreen"
          component={ConfirmVibeScreen}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name="LookupScreen"
          component={LookupScreen}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name="StepFlowScreen"
          component={StepFlowScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

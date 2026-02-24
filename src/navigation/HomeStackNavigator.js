import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import HomeScreen from '@features/main/home/HomeScreen';
import MoodSelectScreen from '@features/main/MoodSelectScreen';
import ConfirmSituationScreen from '@features/main/ConfirmSituationScreen';
import ConfirmVibeScreen from '@features/main/ConfirmVibeScreen';
import LookupScreen from '@features/main/LookupScreen';
import StepFlowScreen from '@features/main/StepFlowScreen';

const Stack = createNativeStackNavigator();

/**
 * Home Stack Navigator
 *
 * Nested stack inside the Home tab of UserBottomTab.
 * This keeps bottom tabs visible throughout the confidence flow:
 * HomeScreen -> ConfirmSituation/MoodSelect -> ConfirmVibe -> Lookup -> StepFlow
 */
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name="ConfirmSituationScreen"
        component={ConfirmSituationScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name="MoodSelectScreen"
        component={MoodSelectScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name="ConfirmVibeScreen"
        component={ConfirmVibeScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name="LookupScreen"
        component={LookupScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name="StepFlowScreen"
        component={StepFlowScreen}
        options={{animation: 'fade'}}
      />
    </Stack.Navigator>
  );
};

/**
 * Helper to get the active route name inside this stack.
 * Used by UserBottomTab to hide tabs on StepFlowScreen.
 */
export const getHomeActiveRoute = route => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeScreen';
  return routeName;
};

export default HomeStackNavigator;

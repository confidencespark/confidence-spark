// UserBottomTab.jsx
import Icon from '@components/global/Icon'; // must forward the `color` prop!
import { COLORS } from '@constants/colors';
import { DIMENSIONS } from '@constants/dimensions';
import { STORAGE_KEYS } from '@constants/storageKeys';
import HomeScreen from '@features/main/home/HomeScreen';
import ProfileScreen from '@features/profile/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { resetAndNavigate } from '@utils/NavigationUtils';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
/**
 * User Bottom Tab Navigator
 *
 * The main dashboard for authenticated users.
 *
 * Logic:
 * - Displays 'Home' and 'Profile' tabs.
 * - Profile Tab Interception:
 *   Verifies the auth token before allowing navigation to Profile.
 *   Redirects to the Auth flow if the user is not logged in.
 */
export default function UserBottomTab() {

  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,

        // Let RN Navigation drive colors
        tabBarActiveTintColor: COLORS.tabActive,
        tabBarInactiveTintColor: COLORS.tabInactive,

        tabBarLabelStyle: {
          fontWeight: '500',
          fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
        },
        tabBarItemStyle: {
          paddingVertical: DIMENSIONS.verticalScale(6),
        },
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          //  borderTopWidth: 0,
          height: DIMENSIONS.verticalScale(Platform.OS === 'ios' ? 70 : 70),
          paddingBottom: DIMENSIONS.verticalScale(Platform.OS === 'ios' ? 20 : 20),
          paddingTop: DIMENSIONS.verticalScale(8),
          position: 'absolute',
          bottom: DIMENSIONS.verticalScale(20),
          left: DIMENSIONS.scale(20),
          right: DIMENSIONS.scale(20),
          borderRadius: DIMENSIONS.verticalScale(40),
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.05)',
          marginHorizontal: DIMENSIONS.scale(20),
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ route }) => {
          return {
            tabBarIcon: ({ color, focused, size }) => (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                iconFamily="Ionicons"
                size={25}
                color={color}
              />
            ),
            tabBarLabel: 'Home',
          };
        }}
      />

      {/* Option B (like many apps): Logout triggers an action, no screen */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="person-sharp"
              iconFamily="Ionicons"
              size={25}
              color={color}
            />
          ),
          tabBarLabel: 'Profile',
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            // Always stop the default tab switch first
            e.preventDefault();

            // Then decide where to go
            AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
              .then(token => {
                if (token) {
                  // Focus the Profile tab (since we prevented default)
                  navigation.jumpTo('Profile'); // use jumpTo for tab navigators
                } else {
                  // Send to auth flow
                  resetAndNavigate('Auth', { screen: 'SignInScreen' });
                }
              })
              .catch(() => {
                // On any storage error, be safe and send to auth
                resetAndNavigate('Auth', { screen: 'SignInScreen' });
              });
          },
        })}
      />
    </Tab.Navigator>
  );
} 

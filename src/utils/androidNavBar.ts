/**
 * Android Navigation Bar Utilities
 *
 * Helpers to control the visibility of the Android system navigation bar (bottom buttons).
 * Useful for immersive experiences.
 */
import SystemNavigationBar from 'react-native-system-navigation-bar';

export const hideNavBar = () => SystemNavigationBar.navigationHide(); // hides ONLY bottom bar
export const showNavBar = () => SystemNavigationBar.navigationShow();

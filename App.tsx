import React, {useEffect, useState} from 'react';
import 'react-native-reanimated';
import 'react-native-gesture-handler';

import {AppState} from 'react-native'; // <-- add
import {Provider} from 'react-redux';
import Toast from 'react-native-toast-message';
import Navigation from '@navigation/Navigation';
import {store} from './src/store/store';
import {getOrCreateDeviceId} from '@utils/deviceId';
import {setDeviceId} from './src/store/slices/deviceSlice';
import {AlertProvider} from '@components/ui/AlertProvider';
import {hideNavBar} from './src/utils/androidNavBar'; // <-- add

/**
 * Root Application Component
 *
 * Responsibilities:
 * 1. Global Providers setup (Redux Store, Alerts, Toast)
 * 2. Device Identity management (Get or create unique Device ID)
 * 3. Platform specific tweaks (Hide Android bottom nav bar)
 */
function App() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // Initial Boot Logic
    (async () => {
      // Ensure we have a Device ID for API tracking
      const id = await getOrCreateDeviceId();
      store.dispatch(setDeviceId(id));

      // Hide bottom bar right after boot for immersive feel on Android
      hideNavBar(); // <-- add
      setBooted(true);
    })();
  }, []);

  useEffect(() => {
    // <-- add (handles minimize → reopen)
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') hideNavBar(); // re-apply when app becomes active
    });
    return () => sub.remove();
  }, []);

  if (!booted) return null;

  return (
    <Provider store={store}>
      <AlertProvider>
        <Navigation />
        <Toast />
      </AlertProvider>
    </Provider>
  );
}

export default App;

/**
 * Device ID Utility
 *
 * manages the unique identifier for the device.
 * Persists the ID to AsyncStorage to ensure consistency across app launches.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {STORAGE_KEYS} from '@constants/storageKeys';

// Reads cached id; if absent, gets DeviceInfo.getUniqueId(), saves, and returns it.
export async function getOrCreateDeviceId() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);

    if (existing) return existing;

    const id = await DeviceInfo.getUniqueId(); // sync

    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, String(id));
    return id;
  } catch (e) {
    // Fallback: still return a value even if storage fails
    return DeviceInfo.getUniqueId();
  }
}

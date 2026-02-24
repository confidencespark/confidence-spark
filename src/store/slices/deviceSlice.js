// src/store/slices/deviceSlice.js
import {createSlice} from '@reduxjs/toolkit';

/**
 * Device Slice
 *
 * Manages device-specific information.
 *
 * State:
 * - deviceId: Unique identifier for the device (used for analytics/personalization).
 */
const deviceSlice = createSlice({
  name: 'device',
  initialState: {deviceId: null},
  reducers: {
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },
  },
});

export const {setDeviceId} = deviceSlice.actions;
export default deviceSlice.reducer;

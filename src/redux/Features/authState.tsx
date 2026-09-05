import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginResponse, RegisterResponse } from '../Auth/AuthType';

interface AuthData {
     isLoggin: boolean;
     data: LoginResponse | RegisterResponse | null;
     isFingerEnabled: boolean;
     deviceId: string;
}

const initialState: AuthData = {
     isLoggin: false,
     data: null,
     isFingerEnabled: false,
     deviceId: '',
};

export const authState = createSlice({
     name: 'userAuth',
     initialState,
     reducers: {
          authUser: (state, action: PayloadAction<{ data: AuthData['data'] }>) => {
               state.isLoggin = true;
               state.data = action.payload.data;
          },
          logout: state => {
               state.isLoggin = false;
               state.data = null;
          },
          setFingerEnabled: (state, action: PayloadAction<{ enabled: boolean; deviceId: string }>) => {
               state.isFingerEnabled = action.payload.enabled;
               state.deviceId = action.payload.deviceId;
          },

          toggleFinger: state => {
               state.isFingerEnabled = !state.isFingerEnabled;
          },
     },
});

export const { authUser, logout, setFingerEnabled, toggleFinger } = authState.actions;

export default authState.reducer;

// utils/getDeviceInfo.ts

import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

export interface DeviceData {
     deviceId: string;
     brand: string;
     model: string;
     systemName: string;
     systemVersion: string;
     appVersion: string;
     buildNumber: string;
     isEmulator: boolean;
     platform: 'android' | 'ios';
}

export const getDeviceInfo = async (): Promise<DeviceData> => {
     const [deviceId, isEmulator] = await Promise.all([DeviceInfo.getUniqueId(), DeviceInfo.isEmulator()]);

     return {
          deviceId,
          brand: DeviceInfo.getBrand(),
          model: DeviceInfo.getModel(),
          systemName: DeviceInfo.getSystemName(),
          systemVersion: DeviceInfo.getSystemVersion(),
          appVersion: DeviceInfo.getVersion(),
          buildNumber: DeviceInfo.getBuildNumber(),
          isEmulator,
          platform: Platform.OS as 'android' | 'ios',
     };
};

// Sirf device ID chahiye toh shortcut
export const getDeviceId = async (): Promise<string> => {
     return (await DeviceInfo?.getUniqueId()) || '000';
};

export interface RegisterBioMetricRequest {
     publicKey: string;
     deviceId: string;
     Token: string;
     userId: string;
     storedDeviceID: string;
     signature: string;
     nonce: string;
}

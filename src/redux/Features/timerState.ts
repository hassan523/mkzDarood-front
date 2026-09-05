import { createSlice } from '@reduxjs/toolkit';

interface ResendOtpTimerState {
    otpTimerEnd: number | null;
    resendCount: number;
    isOtpCooldown: boolean;
    lastResendAt: number | null;
}

// Agar last resend ke baad itna time guzar jaye (10 min),
// to counter fresh maan lo (user ne rapidly hit nahi kiya)
const RESEND_RESET_THRESHOLD_MS = 10 * 60 * 1000;

const initialState: ResendOtpTimerState = {
    otpTimerEnd: null,
    resendCount: 0,
    isOtpCooldown: false,
    lastResendAt: null,
};

export const resendOtpTimerState = createSlice({
    name: 'resendOtpTimer',
    initialState,

    reducers: {
        startOtpResendTimer: state => {
            const now = Date.now();

            // Agar pehle kabhi resend hua tha aur is baar ka gap
            // threshold se zyada hai, to count ko fresh start treat karo
            if (
                state.lastResendAt !== null &&
                now - state.lastResendAt > RESEND_RESET_THRESHOLD_MS
            ) {
                state.resendCount = 0;
            }

            // Current resend number
            const currentResend = state.resendCount + 1;

            state.resendCount = currentResend;
            state.lastResendAt = now;

            let cooldownSeconds: number;

            if (currentResend === 1) {
                // First resend = 1 minute
                cooldownSeconds = 60;
            } else if (currentResend === 2) {
                // Second resend = 2 minutes
                cooldownSeconds = 120;
            } else if (currentResend === 3) {
                // Third resend = 4 minutes
                cooldownSeconds = 240;
            } else {
                // Fourth and onwards = 1 hour
                cooldownSeconds = 3600;
            }

            state.otpTimerEnd = now + cooldownSeconds * 1000;
            state.isOtpCooldown = true;
        },

        finishOtpCooldown: state => {
            state.otpTimerEnd = null;
            state.isOtpCooldown = false;
        },

        resetOtpResendTimer: state => {
            state.otpTimerEnd = null;
            state.resendCount = 0;
            state.isOtpCooldown = false;
            state.lastResendAt = null;
        },
    },
});

export const {
    startOtpResendTimer,
    finishOtpCooldown,
    resetOtpResendTimer,
} = resendOtpTimerState.actions;

export default resendOtpTimerState.reducer;
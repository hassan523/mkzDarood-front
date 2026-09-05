import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Switch, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import GradientBG from '../../../components/GradientBG/GradientBG';
import ResToast from '../../../components/ResToast/ResToast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

// ─── Uncomment these two lines ────────────────────────────────────────────────
import ReactNativeBiometrics from 'react-native-biometrics';
import { useRegisterBioMetricMutation } from '../../../redux/BioMetric/BioMetric';
import { setFingerEnabled } from '../../../redux/Features/authState';
import { useDeleteBioMetricHandler } from '../../../model/BioMetric/BioMetric';
const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
// ─────────────────────────────────────────────────────────────────────────────

// ─── Animated Fingerprint Icon ────────────────────────────────────────────────
const FingerprintIcon = ({ status }: { status: 'idle' | 'scanning' | 'success' | 'error' }) => {
     const pulseAnim = useRef(new Animated.Value(1)).current;
     const ripple1 = useRef(new Animated.Value(0)).current;
     const ripple2 = useRef(new Animated.Value(0)).current;
     const ripple3 = useRef(new Animated.Value(0)).current;
     const shakeAnim = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          if (status !== 'idle') return;
          const loop = Animated.loop(
               Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.07, duration: 1400, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
               ]),
          );
          loop.start();
          return () => loop.stop();
     }, [status]);

     useEffect(() => {
          if (status !== 'scanning') return;
          const make = (anim: Animated.Value, delay: number) =>
               Animated.loop(
                    Animated.sequence([
                         Animated.delay(delay),
                         Animated.timing(anim, { toValue: 1, duration: 1100, useNativeDriver: true }),
                         Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
                    ]),
               );
          const r1 = make(ripple1, 0);
          const r2 = make(ripple2, 360);
          const r3 = make(ripple3, 720);
          r1.start();
          r2.start();
          r3.start();
          return () => {
               r1.stop();
               r2.stop();
               r3.stop();
          };
     }, [status]);

     useEffect(() => {
          if (status !== 'error') return;
          Animated.sequence([
               Animated.timing(shakeAnim, { toValue: 9, duration: 55, useNativeDriver: true }),
               Animated.timing(shakeAnim, { toValue: -9, duration: 55, useNativeDriver: true }),
               Animated.timing(shakeAnim, { toValue: 9, duration: 55, useNativeDriver: true }),
               Animated.timing(shakeAnim, { toValue: -9, duration: 55, useNativeDriver: true }),
               Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
          ]).start();
     }, [status]);

     const iconColor = status === 'success' ? '#4ade80' : status === 'error' ? '#ff6b6b' : '#fff';
     const bgColors: [string, string] = status === 'success' ? ['#22c55e', '#16a34a'] : status === 'error' ? ['#ef4444', '#dc2626'] : [colors.gradientOne, colors.gradientTwo];

     const rippleStyle = (anim: Animated.Value, size: number) => ({
          position: 'absolute' as const,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: status === 'scanning' ? 'rgba(52,159,146,0.4)' : 'transparent',
          opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.55, 0.25, 0] }),
          transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.1] }) }],
     });

     return (
          <Animated.View style={{ transform: [{ translateX: shakeAnim }], alignItems: 'center', justifyContent: 'center' }}>
               <Animated.View style={rippleStyle(ripple3, 170)} />
               <Animated.View style={rippleStyle(ripple2, 145)} />
               <Animated.View style={rippleStyle(ripple1, 120)} />
               <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <LinearGradient colors={bgColors} style={iconStyles.circle}>
                         <FontAwesome5 name="fingerprint" size={54} color={iconColor} />
                    </LinearGradient>
               </Animated.View>
          </Animated.View>
     );
};

const iconStyles = StyleSheet.create({
     circle: {
          width: 124,
          height: 124,
          borderRadius: 62,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 14,
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.45,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 10 },
     },
});

// ─── Scan Dot ─────────────────────────────────────────────────────────────────
const ScanDot = ({ delay }: { delay: number }) => {
     const anim = useRef(new Animated.Value(0)).current;
     useEffect(() => {
          Animated.loop(
               Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, { toValue: 1, duration: 380, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 0, duration: 380, useNativeDriver: true }),
               ]),
          ).start();
     }, []);
     return (
          <Animated.View
               style={{
                    width: 7,
                    height: 7,
                    borderRadius: 3.5,
                    backgroundColor: colors.SecondaryColor,
                    opacity: anim,
                    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.3] }) }],
               }}
          />
     );
};

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, title, subtitle, iconBg, isLast, accent }: { icon: string; title: string; subtitle: string; iconBg: string; isLast?: boolean; accent?: string }) => (
     <View style={[infoStyles.row, !isLast && infoStyles.border]}>
          <View style={[infoStyles.iconBox, { backgroundColor: iconBg }]}>
               <MaterialIcons name={icon as any} size={18} color={accent || colors.PrimaryColor} />
          </View>
          <View style={{ flex: 1 }}>
               <Text style={infoStyles.title}>{title}</Text>
               <Text style={infoStyles.sub}>{subtitle}</Text>
          </View>
     </View>
);
const infoStyles = StyleSheet.create({
     row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
     border: { borderBottomWidth: 1, borderBottomColor: '#c5c5c520' },
     iconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
     title: { fontFamily: Font.font700, fontSize: 13, color: '#1a1a1a' },
     sub: { fontFamily: Font.font500 || Font.font600, fontSize: 11, color: 'rgba(77,77,77,0.6)', marginTop: 1 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const FingerprintScreen = ({ navigation }: { navigation: Navigation }) => {
     const [enabled, setEnabled] = useState(false);
     const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
     const [statusMsg, setStatusMsg] = useState('Tap below to register your fingerprint');

     const selector = useSelector((state: RootState) => state?.userData);
     const isFingerPrint = useSelector((state: RootState) => state?.userData?.isFingerEnabled);
     const Token: string | undefined = selector?.data?.accessToken ?? '';
     const RefreshToken: string | undefined = selector?.data?.refreshToken;
     const userId = selector?.data?.user?._id ?? 'user_id';
     const DeviceId = ((selector?.data?.user as any)?.refreshTokens as [{ token: string; deviceId: string; _id: string }])?.filter(item => item.token == RefreshToken)[0] ?? '';
     const id = selector?.data?.user?._id ?? '';

     const dispatch = useDispatch();
     useEffect(() => {
          setEnabled(isFingerPrint ? isFingerPrint : false);
          if (isFingerPrint == true) {
               setScanStatus('success');
               setStatusMsg('Fingerprint registered! Key pair created.');
          }
     }, [isFingerPrint]);

     const resetIdle = () => {
          setScanStatus('idle');
          setStatusMsg('Tap below to register your fingerprint');
     };

     // Handle Redux API
     const [RegisterBioMetricrApi] = useRegisterBioMetricMutation();
     const { handleDeleteBioMetric, isLoading, isSuccess, status, error } = useDeleteBioMetricHandler();

     //  Register — createKeys() ──────────────────────────────────────
     const handleRegister = async () => {
          if (scanStatus === 'scanning') return;
          setScanStatus('scanning');
          setStatusMsg('Generating key pair on device...');

          try {
               // 1. Check sensor
               const { available, biometryType } = await rnBiometrics.isSensorAvailable();
               console.log(biometryType);
               if (!available) {
                    setScanStatus('error');
                    setStatusMsg('No biometric sensor found on this device');
                    setTimeout(resetIdle, 2200);
                    return;
               }
               // 2. Create RSA-2048 key pair on device
               const { publicKey: pk } = await rnBiometrics.createKeys();

               setStatusMsg('Sending public key to server...');
               const deviceID = pk + DeviceId.deviceId + id;
               console.log(deviceID);
               // 3. TODO: Send publicKey to your backend
               const res = await RegisterBioMetricrApi({
                    deviceId: deviceID,
                    publicKey: pk,
                    Token,
                    userId: id,
               });

               if (!res.error) {
                    dispatch(
                         setFingerEnabled({
                              enabled: true,
                              deviceId: deviceID,
                         }),
                    );
                    setEnabled(true);
                    setScanStatus('success');
                    setStatusMsg('Fingerprint registered! Key pair created.');
                    ResToast({ title: 'Fingerprint enabled!', type: 'success' });
               } else {
                    setScanStatus('error');
                    setStatusMsg((res.error as any).message || 'Registration failed. Try again.');
                    handleDisable(false);
               }
          } catch (e) {
               setTimeout(resetIdle, 2200);
          }
     };

     // ── Disable ───────────────────────────────────────────────────────────────
     const handleDisable = async (isRes?: boolean) => {
          try {
               if (scanStatus === 'scanning') return;
               setScanStatus('scanning');

               const deleteBioMetric = await handleDeleteBioMetric();

               if (deleteBioMetric?.res?.data?.enabled === false) {
                    await rnBiometrics.deleteKeys();
                    dispatch(
                         setFingerEnabled({
                              enabled: false,
                              deviceId: '',
                         }),
                    );
                    setEnabled(false);
                    resetIdle();
                    if (isRes == true) {
                         ResToast({ title: 'Fingerprint login disabled', type: 'warning' });
                    } else {
                         handleRegister();
                    }
               } else {
                    ResToast({ title: 'Could not disable. Try again.', type: 'danger' });
               }
          } catch (e) {
               ResToast({ title: 'Could not disable. Try again.', type: 'danger' });
          }
     };

     const handleToggle = (val: boolean) => {
          if (!val) handleDisable();
          else handleRegister();
     };

     // ── Colors ────────────────────────────────────────────────────────────────
     const msgColor = scanStatus === 'success' ? '#22c55e' : scanStatus === 'error' ? '#ef4444' : scanStatus === 'scanning' ? colors.SecondaryColor : 'rgba(255,255,255,0.75)';

     const msgPrefix = scanStatus === 'success' ? '✓  ' : scanStatus === 'error' ? '✕  ' : '';

     return (
          <View style={{ flex: 1, backgroundColor: '#f4f0f0' }}>
               <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* ── Header ── */}
                    <GradientBG style={styles.gradientHeader} isBackgroundImage imgStyle={{ justifyContent: 'center' }}>
                         <View style={styles.topRow}>
                              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
                                   <MaterialIcons name="arrow-back" color="#fff" size={20} />
                              </TouchableOpacity>
                              <Text style={styles.screenTitle}>Fingerprint Login</Text>
                              <View style={{ width: 38 }} />
                         </View>

                         <View style={styles.heroWrap}>
                              <FingerprintIcon status={scanStatus} />
                              <View style={styles.statusWrap}>
                                   {scanStatus === 'scanning' && (
                                        <View style={styles.dotsRow}>
                                             {[0, 1, 2].map(i => (
                                                  <ScanDot key={i} delay={i * 220} />
                                             ))}
                                        </View>
                                   )}
                                   <Text style={[styles.statusMsg, { color: msgColor }]}>
                                        {msgPrefix}
                                        {statusMsg}
                                   </Text>
                              </View>
                         </View>
                    </GradientBG>

                    {/* ── Toggle Card ── */}
                    <View style={styles.card}>
                         <View style={styles.cardHeader}>
                              <Text style={styles.cardTitle}>Authentication</Text>
                         </View>
                         <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
                              <View style={[styles.toggleIcon, { backgroundColor: '#fff7e6' }]}>
                                   <FontAwesome5 name="fingerprint" size={18} color="#E58B06" />
                              </View>
                              <View style={{ flex: 1 }}>
                                   <Text style={styles.toggleLabel}>Fingerprint Login</Text>
                                   <Text style={styles.toggleSub}>{enabled ? 'Active — tap to disable' : 'Disabled — tap to enable'}</Text>
                              </View>
                              <Switch
                                   value={enabled}
                                   onValueChange={handleToggle}
                                   trackColor={{ false: '#e0e0e0', true: colors.SecondaryColor }}
                                   thumbColor={enabled ? colors.PrimaryColor : '#f4f3f4'}
                                   ios_backgroundColor="#e0e0e0"
                              />
                         </View>
                    </View>

                    {/* ── Action Buttons ── */}
                    {!enabled ? (
                         // Register button
                         <TouchableOpacity onPress={handleRegister} activeOpacity={0.85} disabled={scanStatus === 'scanning'} style={{ marginHorizontal: 16, marginTop: 6 }}>
                              <LinearGradient
                                   colors={scanStatus === 'scanning' ? ['rgba(52,159,146,0.45)', 'rgba(0,104,96,0.45)'] : [colors.gradientOne, colors.gradientTwo]}
                                   style={styles.actionBtn}
                                   start={{ x: 0, y: 0 }}
                                   end={{ x: 1, y: 0 }}
                              >
                                   <FontAwesome5 name="fingerprint" size={18} color="#fff" />
                                   <Text style={styles.actionBtnText}>{scanStatus === 'scanning' ? 'Registering...' : 'Register Fingerprint'}</Text>
                              </LinearGradient>
                         </TouchableOpacity>
                    ) : (
                         // Verify button (test karne k liye)
                         <TouchableOpacity onPress={() => handleDisable(true)} activeOpacity={0.85} disabled={scanStatus === 'scanning'} style={{ marginHorizontal: 16, marginTop: 6 }}>
                              <LinearGradient
                                   colors={scanStatus === 'scanning' ? ['rgba(52,159,146,0.45)', 'rgba(0,104,96,0.45)'] : [colors.gradientOne, colors.gradientTwo]}
                                   style={styles.actionBtn}
                                   start={{ x: 0, y: 0 }}
                                   end={{ x: 1, y: 0 }}
                              >
                                   <MaterialIcons name="verified-user" size={18} color="#fff" />
                                   <Text style={styles.actionBtnText}>{scanStatus === 'scanning' ? 'Verifying...' : 'Remove Fingerprint'}</Text>
                              </LinearGradient>
                         </TouchableOpacity>
                    )}

                    {/* ── Security Notes ── */}
                    <View style={[styles.card, { marginTop: 14 }]}>
                         <View style={styles.cardHeader}>
                              <Text style={styles.cardTitle}>Security Notes</Text>
                         </View>
                         <InfoRow icon="security" iconBg="#d1eee9" title="Private Key Never Leaves Device" subtitle="Hardware-backed secure enclave mein lock rehti hai" />
                         <InfoRow icon="lock-outline" iconBg="#d1eee9" title="Replay Attack Safe" subtitle="Har signature unique timestamp ke saath hoti hai" />
                         <InfoRow icon="block" iconBg="#fef2f2" title="Disable = Full Cleanup" subtitle="deleteKeys() se device aur server dono clean hote hain" isLast />
                    </View>
               </ScrollView>
          </View>
     );
};

export default FingerprintScreen;

const styles = StyleSheet.create({
     gradientHeader: {
          borderBottomRightRadius: 24,
          borderBottomLeftRadius: 24,
          paddingTop: 14,
          paddingBottom: 38,
     },
     topRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginBottom: 28,
     },
     backBtn: {
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     screenTitle: { fontFamily: Font.font700, fontSize: 18, color: '#fff', letterSpacing: 0.3 },

     heroWrap: { alignItems: 'center', gap: 22 },
     statusWrap: { alignItems: 'center', gap: 8, paddingHorizontal: 28 },
     dotsRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
     statusMsg: { fontFamily: Font.font600, fontSize: 13, textAlign: 'center', lineHeight: 20 },

     card: {
          marginHorizontal: 16,
          marginTop: 20,
          backgroundColor: '#fff',
          borderRadius: 18,
          overflow: 'hidden',
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
     },
     cardHeader: {
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#c5c5c530',
     },
     cardTitle: {
          fontFamily: Font.font700,
          fontSize: 13,
          color: colors.PrimaryColor,
          textTransform: 'uppercase',
          letterSpacing: 0.7,
     },

     toggleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#c5c5c520',
     },
     toggleIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
     toggleLabel: { fontFamily: Font.font700, fontSize: 14, color: '#1a1a1a' },
     toggleSub: { fontFamily: Font.font500 || Font.font600, fontSize: 11, color: 'rgba(77,77,77,0.6)', marginTop: 1 },

     actionBtn: {
          height: 52,
          borderRadius: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
     },
     actionBtnText: { fontFamily: Font.font700, fontSize: 15, color: '#fff', letterSpacing: 0.3 },
});

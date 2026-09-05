import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import GradientBG from '../../../components/GradientBG/GradientBG';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
     UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Privacy Data ─────────────────────────────────────────────────────────────
const PRIVACY_SECTIONS = [
     {
          id: '01',
          icon: 'folder-outline',
          title: 'Information We Collect',
          content: 'We collect the following information:\n\nPersonal: Full Name, Email Address, Contact Number (optional), Country, City (optional)\n\nActivity: Darood submission counts, Tasbeeh usage and counts, interaction with app features\n\nDevice: Device type and model, operating system, IP address, app usage data (analytics)',
     },
     {
          id: '02',
          icon: 'settings-outline',
          title: 'How We Use Your Information',
          content: 'We use your information to:\n\n• Provide and maintain app functionality\n• Record and display collective participation data\n• Analyze usage across regions (e.g., country-level engagement)\n• Improve app performance and user experience\n• Communicate important updates (if email is provided)\n• Detect and prevent misuse, spam, or fraudulent activity',
     },
     {
          id: '03',
          icon: 'scale-outline',
          title: 'Legal Basis for Processing (UK & EEA Users)',
          content: 'If you are located in the United Kingdom or European Economic Area (EEA), we process your data under:\n\n• Consent – when you voluntarily provide your information\n• Legitimate Interests – to improve services, analytics, and security',
     },
     {
          id: '04',
          icon: 'share-social-outline',
          title: 'Data Sharing and Disclosure',
          content: 'We do not sell, rent, or trade your personal data. We may share limited data only in the following cases:\n\n• With trusted third-party service providers (e.g., Firebase analytics)\n• When required by law, regulation, or legal process\n• To protect the rights, safety, and integrity of users and the app\n\nAll third parties are required to process data securely and lawfully.',
     },
     {
          id: '05',
          icon: 'server-outline',
          title: 'Data Storage and Retention',
          content: '• Your data is stored on secure servers with appropriate safeguards.\n• We retain personal data only for as long as necessary to provide app services.\n• Users may request deletion of their data at any time.',
     },
     {
          id: '06',
          icon: 'lock-closed-outline',
          title: 'Data Security',
          content: 'We implement appropriate technical and organizational measures, including:\n\n• Encrypted data transmission (HTTPS)\n• Secure databases and servers\n• Restricted access to personal data\n\nHowever, no method of transmission over the internet is completely secure.',
     },
     {
          id: '07',
          icon: 'shield-checkmark-outline',
          title: 'Your Rights (GDPR)',
          content: 'If you are located in the UK or EU, you have the right to:\n\n• Access your personal data\n• Request correction of inaccurate data\n• Request deletion of your data\n• Withdraw consent at any time\n• Lodge a complaint with a data protection authority\n\nTo exercise your rights, contact us at: support@mkzdarood.com',
     },
     {
          id: '08',
          icon: 'happy-outline',
          title: "Children's Privacy",
          content: 'MKZ Darood is intended for general audiences. We do not knowingly collect personal data from children under the age of 13 without parental consent.',
     },
     {
          id: '09',
          icon: 'extension-puzzle-outline',
          title: 'Third-Party Services',
          content: 'We may use third-party services (such as analytics providers) to improve app functionality. These services may collect anonymized technical data in accordance with their own privacy policies.',
     },
     {
          id: '10',
          icon: 'moon-outline',
          title: 'Religious & Informational Disclaimer',
          content: 'MKZ Darood (Markaz-e-Darood) is a spiritual application designed to encourage users to engage in sending Darood (salutations upon the Prophet ﷺ). Any display of collective counts or participation is intended for motivational and informational purposes only. We do not make any guarantees regarding spiritual rewards, outcomes, or religious benefits.',
     },
     {
          id: '11',
          icon: 'refresh-outline',
          title: 'Changes to This Privacy Policy',
          content: 'We may update this Privacy Policy from time to time. Any changes will be reflected with an updated effective date.',
     },
     {
          id: '12',
          icon: 'checkmark-circle-outline',
          title: 'Consent',
          content: 'By using this application, you acknowledge that you have read and agree to this Privacy Policy.',
     },
     {
          id: '13',
          icon: 'finger-print-outline',
          title: 'Biometric Data',
          content: 'If you enable biometric authentication (fingerprint or Face ID), your biometric data is processed and stored locally on your device only. We never transmit or store biometric data on our servers. You can disable biometric authentication at any time from the Security settings.',
     },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────
const AccordionItem = ({ item, isOpen, onToggle }: { item: (typeof PRIVACY_SECTIONS)[0]; isOpen: boolean; onToggle: () => void }) => {
     const arrowAnim = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          Animated.timing(arrowAnim, {
               toValue: isOpen ? 1 : 0,
               duration: 250,
               useNativeDriver: true,
          }).start();
     }, [isOpen]);

     const arrowRotate = arrowAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
     });

     return (
          <View style={accordionStyles.item}>
               <TouchableOpacity style={accordionStyles.header} onPress={onToggle} activeOpacity={0.75}>
                    <View style={accordionStyles.iconWrap}>
                         <Ionicons name={item.icon as any} size={18} color={colors.PrimaryColor} />
                    </View>
                    <Text style={accordionStyles.title}>{item.title}</Text>
                    <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
                         <MaterialIcons name="keyboard-arrow-down" size={22} color={isOpen ? colors.PrimaryColor : 'rgba(77,77,77,0.5)'} />
                    </Animated.View>
               </TouchableOpacity>

               {isOpen && (
                    <View style={accordionStyles.body}>
                         <Text style={accordionStyles.content}>{item.content}</Text>
                    </View>
               )}
          </View>
     );
};

const accordionStyles = StyleSheet.create({
     item: {
          backgroundColor: '#fff',
          borderRadius: 16,
          marginBottom: 10,
          overflow: 'hidden',
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.07,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 3,
     },
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 12,
     },
     iconWrap: {
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: '#d1eee9',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
     },
     title: {
          flex: 1,
          fontFamily: Font.font700,
          fontSize: 14,
          color: '#1a1a1a',
     },
     body: {
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 0,
          borderTopWidth: 1,
          borderTopColor: '#c5c5c530',
     },
     content: {
          fontFamily: Font.font500 || Font.font600,
          fontSize: 13,
          color: 'rgba(77,77,77,0.85)',
          lineHeight: 20,
          marginTop: 12,
     },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const PrivacyPolicy = ({ navigation }: { navigation: Navigation }) => {
     const [openId, setOpenId] = useState<string | null>('1');

     const toggle = (id: string) => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpenId(prev => (prev === id ? null : id));
     };

     return (
          <View style={{ flex: 1, backgroundColor: '#f4f0f0' }}>
               <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* ── Header ── */}
                    <GradientBG style={styles.gradientHeader} isBackgroundImage imgStyle={{ justifyContent: 'center' }}>
                         <View style={styles.topRow}>
                              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
                                   <MaterialIcons name="arrow-back" color="#fff" size={20} />
                              </TouchableOpacity>
                              <Text style={styles.screenTitle}>Privacy Policy</Text>
                              <View style={{ width: 38 }} />
                         </View>

                         {/* Hero */}
                         <View style={styles.heroWrap}>
                              <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.heroIconCircle}>
                                   <Ionicons name="shield-checkmark" size={36} color="#fff" />
                              </LinearGradient>
                              <Text style={styles.heroTitle}>Your Privacy Matters</Text>
                              <Text style={styles.heroSub}>We are committed to protecting your personal information</Text>
                              <View style={styles.lastUpdatedBadge}>
                                   <Text style={styles.lastUpdatedText}>Last updated: January 2025</Text>
                              </View>
                         </View>
                    </GradientBG>

                    {/* ── Accordion List ── */}
                    <View style={styles.listWrap}>
                         <Text style={styles.listLabel}>Policy Details</Text>
                         {PRIVACY_SECTIONS.map(item => (
                              <AccordionItem key={item.id} item={item} isOpen={openId === item.id} onToggle={() => toggle(item.id)} />
                         ))}
                    </View>

                    {/* ── Contact Note ── */}
                    <View style={styles.contactCard}>
                         <View style={styles.contactIconWrap}>
                              <Ionicons name="mail-outline" size={20} color={colors.PrimaryColor} />
                         </View>
                         <View style={{ flex: 1 }}>
                              <Text style={styles.contactTitle}>Questions about our policy?</Text>
                              <Text style={styles.contactSub}>Contact us at support@mkzdarood.com</Text>
                         </View>
                    </View>
               </ScrollView>
          </View>
     );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
     gradientHeader: {
          borderBottomRightRadius: 24,
          borderBottomLeftRadius: 24,
          paddingTop: 14,
          paddingBottom: 30,
     },
     topRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginBottom: 24,
     },
     backBtn: {
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     screenTitle: {
          fontFamily: Font.font700,
          fontSize: 18,
          color: '#fff',
          letterSpacing: 0.3,
     },

     // ── Hero ──
     heroWrap: { alignItems: 'center', gap: 8 },
     heroIconCircle: {
          width: 80,
          height: 80,
          borderRadius: 40,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 6,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.35)',
     },
     heroTitle: {
          fontFamily: Font.font700,
          fontSize: 20,
          color: '#fff',
          letterSpacing: 0.2,
     },
     heroSub: {
          fontFamily: Font.font500 || Font.font600,
          fontSize: 13,
          color: 'rgba(255,255,255,0.65)',
          textAlign: 'center',
          paddingHorizontal: 30,
     },
     lastUpdatedBadge: {
          marginTop: 6,
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingHorizontal: 16,
          paddingVertical: 5,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.3)',
     },
     lastUpdatedText: {
          fontFamily: Font.font600,
          fontSize: 11,
          color: '#fff',
     },

     // ── List ──
     listWrap: { paddingHorizontal: 16, marginTop: 20 },
     listLabel: {
          fontFamily: Font.font700,
          fontSize: 11,
          color: colors.PrimaryColor,
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 12,
          paddingHorizontal: 4,
     },

     // ── Contact ──
     contactCard: {
          marginHorizontal: 16,
          marginTop: 6,
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.07,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 3,
     },
     contactIconWrap: {
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: '#d1eee9',
          alignItems: 'center',
          justifyContent: 'center',
     },
     contactTitle: {
          fontFamily: Font.font700,
          fontSize: 13,
          color: '#1a1a1a',
     },
     contactSub: {
          fontFamily: Font.font500 || Font.font600,
          fontSize: 12,
          color: 'rgba(77,77,77,0.7)',
          marginTop: 2,
     },
});

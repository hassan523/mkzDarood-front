// DaroodList.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../../utils/colors/colors';
import Navigation from '../../../../utils/NavigationProps/NavigationProps';
import GradientBG from '../../../../components/GradientBG/GradientBG';
import Font from '../../../../utils/fonts/Font';
// ─── Data ─────────────────────────────────────────────────────────────────────
const DAROOD_LIST = [
     {
          id: '01',
          arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ\n\nاللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
          urdu: 'اے اللہ! رحمت نازل فرما محمد ﷺ پر اور آل محمد ﷺ پر، جیسا کہ تو نے رحمت نازل فرمائی ابراہیم ؑ پر اور آل ابراہیم ؑ پر۔ بے شک تو تعریف کا مستحق اور بزرگی والا ہے۔ اے اللہ! برکت نازل فرما محمد ﷺ پر اور آل محمد ﷺ پر، جیسا کہ تو نے برکت نازل فرمائی ابراہیم ؑ پر اور آل ابراہیم ؑ پر۔ بے شک تو تعریف کا مستحق اور بزرگی والا ہے۔',
          name: 'Darood Ibrahim',
          fazilat: 'Jo shakhs yeh darood ek baar parhe, Allah us par 10 rehmaten nazil farmata hai aur 10 gunaah maaf farmata hai.',
     },
     {
          id: '02',
          arabic: 'اللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلٰى آلِهِ وَصَحْبِهِ وَسَلِّمْ',
          urdu: 'اے اللہ! درود بھیج نبی امی محمد ﷺ پر، ان کی آل پر اور ان کے صحابہ پر، اور سلام بھی۔',
          name: 'Darood Ummi',
          fazilat: 'Yeh darood sahih hadees se sabit hai aur rozana parha jaye to bahut fazilat hai.',
     },
     {
          id: '03',
          arabic: 'اللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَأَزْوَاجِهِ وَذُرِّيَّتِهِ كَمَا صَلَّيْتَ عَلٰى آلِ إِبْرَاهِيمَ',
          urdu: 'اے اللہ! درود بھیج محمد ﷺ پر، ان کی ازواج پر اور ان کی اولاد پر، جیسے تو نے آل ابراہیم ؑ پر بھیجا۔',
          name: 'Darood Munjina',
          fazilat: 'Is darood ko parh kar dua maango — qabooliat ki umeed zyada hoti hai.',
     },
     {
          id: '04',
          arabic: 'صَلَّى اللهُ عَلَيْهِ وَعَلٰى آلِهِ وَصَحْبِهِ وَسَلَّمَ',
          urdu: 'اللہ ان پر، ان کی آل پر اور ان کے صحابہ پر درود و سلام نازل فرمائے۔',
          name: 'Darood Mukhtasar',
          fazilat: 'Mukhtasar aur asaan darood — har waqt parha ja sakta hai, bohat afzal.',
     },
     {
          id: '05',
          arabic: 'اللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ عَبْدِكَ وَرَسُولِكَ النَّبِيِّ الْأُمِّيِّ',
          urdu: 'اے اللہ! درود بھیج اپنے بندے اور رسول، نبی امی محمد ﷺ پر۔',
          name: 'Darood Abd',
          fazilat: 'Yeh darood Quran ki roshni mein hai — Allah ka apne Rasool ﷺ par salawat ka hukm.',
     },
     {
          id: '06',
          arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ، صَاحِبِ التَّاجِ وَالْمِعْرَاجِ وَالْبُرَاقِ وَالْعَلَمِ، دَافِعِ الْبَلَاءِ وَالْوَبَاءِ وَالْقَحْطِ وَالْمَرَضِ وَالْأَلَمِ، اسْمُهُ مَكْتُوبٌ مَرْفُوعٌ مَشْفُوعٌ مَنْقُوشٌ فِي اللَّوْحِ وَالْقَلَمِ، سَيِّدِ الْعَرَبِ وَالْعَجَمِ، جِسْمُهُ مُقَدَّسٌ مُعَطَّرٌ مُنَوَّرٌ فِي الْبَيْتِ وَالْحَرَمِ، شَمْسِ الضُّحَى، بَدْرِ الدُّجَى، نُورِ الْهُدَى، كَهْفِ الْوَرَى، مِصْبَاحِ الظُّلَمِ، جَمِيلِ الشِّيَمِ، شَفِيعِ الْأُمَمِ، صَاحِبِ الْجُودِ وَالْكَرَمِ، وَاللهُ عَاصِمُهُ وَجِبْرِيلُ خَادِمُهُ وَالْبُرَاقُ مَرْكَبُهُ وَالْمِعْرَاجُ سَفَرُهُ وَسِدْرَةُ الْمُنْتَهَى مَقَامُهُ وَقَابَ قَوْسَيْنِ مَطْلُوبُهُ وَالْمَطْلُوبُ مَقْصُودُهُ وَالْمَقْصُودُ مَوْجُودُهُ، سَيِّدِ الْمُرْسَلِينَ، خَاتَمِ النَّبِيِّينَ، شَفِيعِ الْمُذْنِبِينَ، أَنِيسِ الْغَرِيبِينَ، رَحْمَةٍ لِلْعَالَمِينَ، رَاحَةِ الْعَاشِقِينَ، مُرَادِ الْمُشْتَاقِينَ، شَمْسِ الْعَارِفِينَ، سِرَاجِ السَّالِكِينَ، مِصْبَاحِ الْمُقَرَّبِينَ، مُحِبِّ الْفُقَرَاءِ وَالْمَسَاكِينِ، سَيِّدِ الثَّقَلَيْنِ، نَبِيِّ الْحَرَمَيْنِ، إِمَامِ الْقِبْلَتَيْنِ، وَسِيلَتِنَا فِي الدَّارَيْنِ، صَاحِبِ قَابَ قَوْسَيْنِ، مَحْبُوبِ رَبِّ الْمَشْرِقَيْنِ وَالْمَغْرِبَيْنِ، جَدِّ الْحَسَنِ وَالْحُسَيْنِ، مَوْلَانَا وَمَوْلَى الثَّقَلَيْنِ، سَيِّدِنَا مُحَمَّدِ بْنِ عَبْدِ اللهِ، نُورٍ مِنْ نُورِ اللهِ، يَا أَيُّهَا الْمُشْتَاقُونَ بِنُورِ جَمَالِهِ، صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا',
          urdu: 'اے اللہ! درود بھیج ہمارے سردار محمد ﷺ پر، تاج اور معراج والے، براق والے، علم والے، بلاؤں اور وباؤں اور قحط اور بیماری اور تکلیف کو دور کرنے والے...',
          name: 'Darood Taj',
          fazilat: 'Darood Taj ka rozana parhnay se mushkilaat door hoti hain, rizq mein barkat aati hai aur dushmanon se hifazat milti hai.',
     },
     {
          id: '07',
          arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ، صَلَاةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ، وَتَقْضِي لَنَا بِهَا جَمِيعَ الْحَاجَاتِ، وَتُطَهِّرُنَا بِهَا مِنْ جَمِيعِ السَّيِّئَاتِ، وَتَرْفَعُنَا بِهَا عِنْدَكَ أَعْلَى الدَّرَجَاتِ، وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ، مِنْ جَمِيعِ الْخَيْرَاتِ، فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ',
          urdu: 'اے اللہ! درود بھیج ہمارے سردار محمد ﷺ پر — ایسا درود جو ہمیں تمام خوف اور آفتوں سے نجات دے، ہماری تمام حاجات پوری کرے، ہمیں تمام گناہوں سے پاک کرے، ہمیں تیرے ہاں بلند درجات تک پہنچائے، اور ہمیں زندگی اور موت کے بعد تمام بھلائیوں کی آخری حدود تک پہنچائے۔',
          name: 'Darood Tunjeena',
          fazilat: 'Yeh Darood hazaron musibaton se bachata hai. Ek baar parhnay ka sawab 600,000 darood kay barabar hai. Mushkilaat mein khaas taur par parha jata hai.',
     },
     {
          id: '08',
          arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ عَبْدِكَ وَرَسُولِكَ، وَصَلِّ عَلَى الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ وَالْمُسْلِمِينَ وَالْمُسْلِمَاتِ',
          urdu: 'اے اللہ! درود بھیج ہمارے سردار محمد ﷺ پر، جو تیرے بندے اور رسول ہیں، اور سلام بھیج تمام مومنوں پر۔',
          name: 'Darood Rizq',
          fazilat: 'Is darood ko rozana parhnay se rizq mein barkat hoti hai, tangi door hoti hai aur Allah ki rehmat nazil hoti hai.',
     },
     {
          id: '09',
          arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِهِ بِقَدْرِ حُسْنِهِ وَجَمَالِهِ',
          urdu: '.اے اللہ! ہمارے سردار حضرت محمد ﷺ اور آپ کی آل پر ایسی رحمتیں نازل فرما، آپ کے حسن و جمال کے شایانِ شان',
          name: 'Darood Jamaal',
          fazilat: 'Is durood ki fazilat yeh hai ke isay parhne se Nabi ﷺ ki muhabbat barhti hai aur Allah is parhne wale par apni rehmat aur barkat nazil farmata hai.',
     },
];

// ─── Card ─────────────────────────────────────────────────────────────────────
const DaroodCard = ({ item }: { item: (typeof DAROOD_LIST)[0] }) => (
     <View style={styles.card}>
          <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cardAccent} />
          <View style={styles.cardBody}>
               <View style={styles.cardTopRow}>
                    <Text style={styles.cardName}>{item.name}</Text>
               </View>
               <Text style={styles.arabic}>{item.arabic}</Text>

               <View style={styles.divLine} />
               <Text style={styles.urdu}>{item.urdu}</Text>
               <View style={styles.fazRow}>
                    <Text style={styles.fazLabel}>FAZILAT</Text>
                    <Text style={styles.fazText}>{item.fazilat}</Text>
               </View>
          </View>
     </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Darood = ({ navigation }: { navigation: Navigation }) => {
     return (
          <View style={styles.root}>
               <GradientBG style={styles.gradient} isBackgroundImage>
                    {/* ── Header ── */}

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                         <View style={styles.HeaderContainer}>
                              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.MenuButton}>
                                   <FontAwesome6 name="arrow-left-long" size={20} color={colors.SecondaryColor} />
                              </TouchableOpacity>
                              <Image source={require('../../../../assets/logo2.png')} style={{ width: 60 }} resizeMode="contain" />
                         </View>
                         {/* ── Page Title ── */}
                         <View style={styles.titleSection}>
                              <Text style={styles.titleAr}>درود و سلام</Text>
                              <Text style={styles.titleEn}>Darood Collection</Text>
                              <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.titleDivider} />
                         </View>

                         {/* ── Cards ── */}
                         {DAROOD_LIST.map(item => (
                              <DaroodCard key={item.id} item={item} />
                         ))}
                    </ScrollView>
               </GradientBG>
          </View>
     );
};

export default Darood;

const styles = StyleSheet.create({
     root: { flex: 1 },
     gradient: { borderRadius: 0, width: '100%', height: '100%' },
     scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

     // Header — same as provided
     HeaderContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
          paddingVertical: 40,
          height: 40,
     },
     MenuButton: {
          position: 'absolute',
          left: 16,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: 'rgba(255,255,255,0.12)',
          alignItems: 'center',
          justifyContent: 'center',
     },

     // Title section
     titleSection: { alignItems: 'center', paddingTop: 4, paddingBottom: 16 },
     titleAr: { fontFamily: Font.font600, fontSize: 18, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
     titleEn: { fontFamily: Font.font700, fontSize: 26, color: '#fff', letterSpacing: 1.2, textTransform: 'uppercase' },
     titleDivider: { width: 36, height: 3, borderRadius: 2, marginTop: 10 },

     // Card
     card: {
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: colors.lightGreen,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.12)',
          marginBottom: 14,
     },
     cardAccent: { height: 3, width: '100%' },
     cardBody: { padding: 16, gap: 10 },
     cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
     cardNum: {
          fontFamily: Font.font700,
          fontSize: 12,
          color: colors.textColor,
          letterSpacing: 1,
     },
     cardName: {
          fontFamily: Font.font700,
          fontSize: 12,
          color: colors.textColor,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
     },

     // Arabic — Font.arabic400 use kiya
     arabic: {
          fontFamily: Font.arabic400,
          fontSize: 25, // 20 → 17
          color: '#fff',
          textAlign: 'right',
          writingDirection: 'rtl',
          lineHeight: 60, // zyada space lines ke beech
          flexShrink: 1,
     },

     divLine: { height: 0.5, backgroundColor: 'rgba(255,255,255,0.15)' },

     // Urdu
     urdu: {
          fontFamily: Font.font500,
          fontSize: 14,
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'right',
          lineHeight: 26,
          writingDirection: 'rtl',
     },

     // Fazilat
     fazRow: {
          backgroundColor: 'rgba(255, 255, 255, 0.13)',
          borderRadius: 10,
          padding: 10,
          gap: 4,
     },
     fazLabel: {
          fontFamily: Font.font700,
          fontSize: 9,
          color: colors.SecondaryColor,
          letterSpacing: 1.2,
     },
     fazText: {
          fontFamily: Font.font500,
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 18,
     },
});

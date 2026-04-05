import { ActivityIndicator, FlatList, Image, ImageBackground, RefreshControl, StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { windowWidth } from '../../../utils/dimensions/dimensions';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import Button from '../../../components/Button/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import ModalLayout from '../../../layout/ModalLayout/ModalLayout';
import Field from '../../../components/Field/Field';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useGetCounterHandler, useUpdateCounterHandler } from '../../../model/Counter/Counter';
import GradientBG from '../../../components/GradientBG/GradientBG';
import RadiusButton from '../../../components/RadiusButton/RadiusButton';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';
import Skeleton from '../../../components/SkeletonComp/Skeleton';

// ─── Count-Up Hook ────────────────────────────────────────────────────────────
const useCountUp = (target: number, duration: number = 2000) => {
     const [display, setDisplay] = useState(0);
     const animValue = useRef(new Animated.Value(0)).current;
     const prevTarget = useRef<number>(0);

     useEffect(() => {
          if (!target || target === prevTarget.current) return;

          // Start from previous value, animate to new target
          animValue.setValue(prevTarget.current);

          const listener = animValue.addListener(({ value }) => {
               setDisplay(Math.floor(value));
          });

          Animated.timing(animValue, {
               toValue: target,
               duration: duration,
               easing: Easing.out(Easing.cubic), // Fast start, slow finish — feels natural
               useNativeDriver: false, // Must be false — we're animating a number
          }).start(() => {
               setDisplay(target); // Ensure exact final value
               prevTarget.current = target;
          });

          return () => animValue.removeListener(listener);
     }, [target]);

     return display;
};

// ─── Animated Counter Display ─────────────────────────────────────────────────
const AnimatedCounter = ({ value, fontSize }: { value: number; fontSize: number }) => {
     const count = useCountUp(value, 1000);

     // Pulse animation on each tick
     const pulse = useRef(new Animated.Value(1)).current;
     const prevCount = useRef(0);

     useEffect(() => {
          if (count !== prevCount.current) {
               prevCount.current = count;
               Animated.sequence([Animated.timing(pulse, { toValue: 1.04, duration: 60, useNativeDriver: true }), Animated.timing(pulse, { toValue: 1, duration: 60, useNativeDriver: true })]).start();
          }
     }, [count]);

     return <Animated.Text style={[styles.Count, { fontSize, transform: [{ scale: pulse }] }]}>{count.toLocaleString()}</Animated.Text>;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Home = ({ navigation }: { navigation: Navigation }) => {
     const message =
          'Join this blessed global movement of love and devotion. Every day, Muslims around the world recite Darood Shareef upon the Beloved Prophet Muhammad ﷺ , a source of countless blessings, peace, and spiritual elevation.\n\nThis mission invites you to send the number of Darood Shareef you recite daily to our platform. No matter how much you recite 100, 500, or 10,000, once your count is submitted, it becomes part of a growing collective total. Just like a drop merges into the ocean and becomes the ocean, your individual recitation becomes part of a united stream of blessings, and you receive reward equal to the entire total by the mercy of Allah ﷻ';
     const userMessage = `اس مبارک عالمی تحریکِ محبت و عقیدت کا حصہ بنیے۔ روزانہ دنیا بھر کے مسلمان حضور نبی کریم ﷺ پر درود شریف پڑھتے ہیں۔ محبوبِ خدا، حضرت محمد مصطفیٰ ﷺ، جو بے شمار برکتوں، سلامتی اور روحانی بلندیوں کا سرچشمہ ہیں۔\n\nیہ مشن آپ کو دعوت دیتا ہے کہ آپ روزانہ جتنا درود شریف پڑھتے ہیں، اس کی تعداد ہمارے پلیٹ فارم پر بھیجیں۔ چاہے آپ 100، 500 یا 10,000 مرتبہ درود پڑھیں، جب آپ اپنی گنتی جمع کرواتے ہیں تو وہ ایک بڑھتے ہوئے اجتماعی مجموعے کا حصہ بن جاتی ہے۔ جیسے ایک قطرہ سمندر میں شامل ہو کر خود سمندر بن جاتا ہے، ویسے ہی آپ کا انفرادی درود ایک متحد بہاؤ کا حصہ بن جاتا ہے، اور اللہ ﷻ کے فضل و کرم سے آپ کو اس پورے مجموعی درود کے برابر اجر عطا کیا جاتا ہے۔`;

     const selector = useSelector((state: RootState) => state?.userData);
     const isLogin: boolean = selector?.isLoggin;
     const Token: string | undefined = selector?.data?.accessToken;

     const [visible, setVisible] = useState(false);
     const [refreshing, setRefresing] = useState(false);
     const [isUrdu, setIsUrdu] = useState(false);
     const [isOpen, setIsOpen] = useState(false);
     const [isSubmitted, setIsSubmitted] = useState(false);
     const [seq, setSeq] = useState<number | string>('');

     const counterApi = useGetCounterHandler();
     const refetch = counterApi?.refetch;
     const GetLoading = counterApi?.isLoading;
     const isFetching = counterApi?.isFetching;
     const isError = counterApi?.isError;
     const seqValue: number = counterApi?.data?.seq ?? 0;

     const { handleUpdate, isLoading, status } = useUpdateCounterHandler();

     const onRefresh = async () => {
          try {
               setRefresing(true);
               await refetch?.();
               setRefresing(false);
          } catch {
               setRefresing(false);
          }
     };

     useEffect(() => {
          if (isError) setRefresing(false);
     }, [counterApi]);

     const handleUpdateCounter = () => {
          handleUpdate({ seq, Token, setIsOpen, setSeq, setIsSubmitted });
     };

     useEffect(() => {
          if (status === 'pending') setVisible(true);
     }, [status]);

     const countFontSize = seqValue <= 9999999999 ? 50 : 35;

     const renderItem = () => (
          <View style={styles.Container}>
               <CustomHeader navigation={navigation} />

               <GradientBG style={styles.gradient} isBackgroundImage>
                    <View style={[styles.ImageBgContainer, { height: !GetLoading ? (seqValue <= 9999999999999 ? 400 : 480) : 370 }]}>
                         <View style={styles.HeroContainer}>
                              <View style={{ overflow: 'hidden', borderRadius: 10, borderWidth: 2, borderColor: 'white' }}>
                                   <ImageBackground source={require('../../../assets/MasjidImage.png')} style={styles.heroHeading}>
                                        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', fontFamily: Font.font600 }}>
                                             اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا وَمَوْلَانا مُحَمَّدٍ وَعَلَىٰ آلِ سَيِّدِنَا وَمَوْلَانَا محمَدٍ، وَبَارِكْ وَسَلِّمْ وَصَلِّ عَلَيْه
                                        </Text>
                                        <Text style={styles.Heading}>Global Darood Count</Text>

                                        {/* ── Counter ── */}
                                        {GetLoading || isFetching ? (
                                             <Skeleton borderRadius={5} width={windowWidth - 100} height={50} />
                                        ) : isError ? (
                                             <Text style={[styles.Count, { fontSize: 30 }]}>Something Went Wrong!</Text>
                                        ) : seqValue ? (
                                             <AnimatedCounter value={seqValue} fontSize={countFontSize} />
                                        ) : null}
                                   </ImageBackground>
                              </View>

                              <View style={{ minWidth: 'auto' }}>
                                   <RadiusButton
                                        name="Submit Darood"
                                        customWidth={windowWidth - 40}
                                        textStyle={{ fontFamily: Font.font700, fontSize: 20, color: 'white' }}
                                        onPress={() => (isLogin ? setIsOpen(true) : navigation.navigate('Signup'))}
                                   />
                              </View>
                         </View>
                    </View>

                    <View style={{ backgroundColor: 'white', width: '100%', gap: 20, paddingTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                         <View style={styles.IconsContainer}>
                              <TouchableOpacity style={styles.IconBox} onPress={() => navigation.navigate('Tasbih')}>
                                   <Image source={require('../../../assets/tasbih.png')} style={{ width: 40, height: 40 }} />
                                   <Text style={styles.IconText}>Tasbih</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.IconBox} onPress={() => navigation.navigate('AsmaunNabi')}>
                                   <Image source={require('../../../assets/nabi.png')} style={{ width: 40, height: 40 }} />
                                   <Text style={styles.IconText}>Asma un Nabi</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.IconBox} onPress={() => navigation.navigate('AsmaulHusna')}>
                                   <Image source={require('../../../assets/Allah.png')} style={{ width: 40, height: 40 }} />
                                   <Text style={styles.IconText}>Asma ul Husna</Text>
                              </TouchableOpacity>
                         </View>

                         <View style={styles.DescContainer}>
                              <Text style={[styles.Heading, { color: colors.PrimaryColor }]}>A Drop in the Ocean of Mercy</Text>
                              <View>
                                   <View style={styles.DescBox}>
                                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%' }}>
                                             <Image source={require('../../../assets/peersaab.png')} style={styles.DescImage} />
                                             <View style={{ width: '60%', flexDirection: 'column', gap: 5 }}>
                                                  <Text style={{ width: '100%', fontFamily: Font.font600, fontSize: 17, color: colors.PrimaryColor, lineHeight: 25 }}>
                                                       Under the spiritual guidance of
                                                  </Text>
                                                  <Text style={{ width: '100%', fontFamily: Font.font600, fontSize: 17, color: colors.PrimaryColor, lineHeight: 25 }}>Pir Sultan Fiaz ul Hassan</Text>
                                             </View>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                             <Text style={[styles.Desc, { textAlign: isUrdu ? 'right' : 'left' }]}>{isUrdu ? userMessage : message}</Text>
                                             <Text style={[styles.Desc, { textAlign: isUrdu ? 'right' : 'left', fontWeight: '800' }]}>Message By: Sultan Fiaz Ul Hassan</Text>
                                        </View>
                                   </View>
                              </View>
                              <View style={{ width: 250 }}>
                                   <RadiusButton
                                        name={isUrdu ? 'Translate to English' : 'Translate to Urdu'}
                                        iconRight
                                        icon={<MaterialIcons name="translate" color={colors.SecondaryColor} size={25} />}
                                        onPress={() => setIsUrdu(!isUrdu)}
                                   />
                              </View>
                         </View>
                    </View>
               </GradientBG>
          </View>
     );

     return (
          <>
               {!visible && (
                    <FlatList
                         data={[1]}
                         renderItem={renderItem}
                         keyExtractor={item => item.toString()}
                         showsVerticalScrollIndicator={false}
                         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PrimaryColor]} />}
                    />
               )}

               {visible && (
                    <LoadingScreen
                         status={status}
                         onHide={() => setVisible(false)}
                         image={require('../../../assets/Allah.png')}
                         loadingTitle="Adding your darood..."
                         successTitle="Your Darood has been successfully added."
                         successSubtitle=".آپ کا درود پاک جمع ہو گیا ہے"
                         imageSize={40}
                         errorTitle="Something went wrong"
                         errorSubtitle="Please try again later"
                         hideDelay={3000}
                         backgroundColor={colors.SecondaryColor}
                         style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                    />
               )}

               <ModalLayout isOpen={isOpen} setIsOpen={setIsOpen}>
                    <View style={styles.ModalContainer}>
                         <TouchableOpacity style={styles.Cross} onPress={() => setIsOpen(false)} disabled={isLoading}>
                              <Entypo name="cross" color={colors.textColor} size={25} />
                         </TouchableOpacity>
                         <Text style={[styles.Heading, { color: colors.PrimaryColor, marginTop: 20 }]}>Submit Darood</Text>
                         <Field placeHolder="Enter Darood Count" type="number" value={seq} onChange={value => setSeq(value)} />
                         <Button name={isLoading ? 'Loading...' : 'Submit'} onPress={handleUpdateCounter} disabled={isLoading} />
                    </View>
               </ModalLayout>
          </>
     );
};

export default Home;

const styles = StyleSheet.create({
     Container: { flex: 1, gap: 25, paddingBottom: 30, backgroundColor: 'transparent' },
     ImageBgContainer: { height: 300, position: 'relative', width: windowWidth, borderRadius: 0, justifyContent: 'center', alignItems: 'center' },
     Overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.65)' },
     Image: { height: '100%', width: '100%', ...StyleSheet.absoluteFillObject, opacity: 0.4 },
     gradient: { borderRadius: 0, flex: 1, height: '100%' },
     HeroContainer: { justifyContent: 'center', alignItems: 'center', zIndex: 1000, paddingHorizontal: 20, height: '100%', width: '100%', gap: 15, paddingTop: 30 },
     heroHeading: { justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: colors.lightGreen, paddingVertical: 15, paddingHorizontal: 20 },
     Heading: { color: colors.SecondaryColor, fontFamily: Font.font600, fontSize: 17 },
     Count: { color: colors.SecondaryColor, fontFamily: Font.font700, fontSize: 50, textAlign: 'center' },
     IconsContainer: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, width: windowWidth },
     IconBox: {
          gap: 5,
          alignItems: 'center',
          justifyContent: 'center',
          width: windowWidth / 3 - 25,
          height: 100,
          paddingInline: 5,
          paddingBlock: 8,
          borderRadius: 15,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 4,
     },
     DescContainer: {
          paddingHorizontal: 20,
          gap: 15,
          paddingVertical: 20,
          position: 'relative',
          borderRadius: 15,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 4,
          marginHorizontal: 20,
     },
     DescBox: { flexDirection: 'column', gap: 15 },
     Desc: { flex: 1, fontFamily: Font.font500, color: colors.terTextColor, fontSize: 14, letterSpacing: 0.8, lineHeight: 24 },
     IconText: { fontFamily: Font.font500, color: colors.textColor, textAlign: 'center', fontSize: 13 },
     BgIcon: { position: 'absolute', right: 0, bottom: 0, borderBottomRightRadius: 15 },
     DescImage: { height: 120, width: '40%', borderRadius: 20, position: 'relative', objectFit: 'fill' },
     ModalContainer: { justifyContent: 'center', alignItems: 'center', position: 'relative', gap: 20 },
     Cross: { position: 'absolute', right: 5, top: 5 },
});

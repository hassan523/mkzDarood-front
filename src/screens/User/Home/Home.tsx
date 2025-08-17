import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
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

const Home = ({ navigation }: { navigation: Navigation }) => {
     const message =
          'Join this blessed global movement of love and devotion. Every day, Muslims around the world recite Darood Shareef upon the Beloved Prophet Muhammad ﷺ , a source of countless blessings, peace, and spiritual elevation.\n\nThis mission invites you to send the number of Darood Shareef you recite daily to our platform. No matter how much you recite 100, 500, or 10,000, once your count is submitted, it becomes part of a growing collective total. Just like a drop merges into the ocean and becomes the ocean, your individual recitation becomes part of a united stream of blessings, and you receive reward equal to the entire total by the mercy of Allah ﷻ';
     const userMessage = `اس مبارک عالمی تحریکِ محبت و عقیدت کا حصہ بنیے۔ روزانہ دنیا بھر کے مسلمان حضور نبی کریم ﷺ پر درود شریف پڑھتے ہیں۔ محبوبِ خدا، حضرت محمد مصطفیٰ ﷺ، جو بے شمار برکتوں، سلامتی اور روحانی بلندیوں کا سرچشمہ ہیں۔\n\nیہ مشن آپ کو دعوت دیتا ہے کہ آپ روزانہ جتنا درود شریف پڑھتے ہیں، اس کی تعداد ہمارے پلیٹ فارم پر بھیجیں۔ چاہے آپ 100، 500 یا 10,000 مرتبہ درود پڑھیں، جب آپ اپنی گنتی جمع کرواتے ہیں تو وہ ایک بڑھتے ہوئے اجتماعی مجموعے کا حصہ بن جاتی ہے۔ جیسے ایک قطرہ سمندر میں شامل ہو کر خود سمندر بن جاتا ہے، ویسے ہی آپ کا انفرادی درود ایک متحد بہاؤ کا حصہ بن جاتا ہے، اور اللہ ﷻ کے فضل و کرم سے آپ کو اس پورے مجموعی درود کے برابر اجر عطا کیا جاتا ہے۔`;
     const selector = useSelector((state: RootState) => state?.userData);
     const isLogin: boolean = selector?.isLoggin;
     const Token: string | undefined = selector?.data?.accessToken;

     const [refreshing, setRefresing] = useState(false);
     const [isUrdu, setIsUrdu] = useState(false);
     const [isOpen, setIsOpen] = useState(false);
     const [seq, setSeq] = useState<number | string>('');

     const counterApi = useGetCounterHandler();
     const refetch = counterApi?.refetch;
     const GetLoading = counterApi?.isLoading;

     const { handleUpdate, isLoading } = useUpdateCounterHandler();

     const onRefresh = async () => {
          setRefresing(true);
          await refetch?.();
          setRefresing(false);
     };

     const handleUpdateCounter = () => {
          handleUpdate({ seq: seq, Token: Token, setIsOpen: setIsOpen, setSeq: setSeq });
     };

     const renderItem = () => (
          <View style={styles.Container}>
               <CustomHeader navigation={navigation} />

               <GradientBG style={styles.gradient} isBackgroundImage>
                    <View
                         style={[
                              styles.ImageBgContainer,
                              {
                                   height: !GetLoading ? ((counterApi?.data as any)?.seq <= 9999999999999 ? 400 : 480) : 320,
                              },
                         ]}
                    >
                         <View style={styles.HeroContainer}>
                              <View style={styles.heroHeading}>
                                   <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>
                                        اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا وَمَوْلَانا مُحَمَّدٍ وَعَلَىٰ آلِ سَيِّدِنَا وَمَوْلَانَا محمَدٍ، وَبَارِكْ وَسَلِّمْ وَصَلِّ عَلَيْه
                                   </Text>
                                   <Text style={styles.Heading}>Global Darood Count</Text>
                                   {counterApi?.isLoading ? (
                                        <ActivityIndicator color={colors.PrimaryColor} />
                                   ) : counterApi?.isError ? (
                                        <Text style={[styles.Count, { fontSize: 30 }]}>Something Went Wrong!</Text>
                                   ) : (
                                        counterApi?.data?.seq && (
                                             <Text style={[styles.Count, { fontSize: !GetLoading ? (counterApi?.data?.seq <= 9999999999 ? 50 : 35) : 50 }]}>
                                                  {counterApi?.data?.seq.toLocaleString()}
                                             </Text>
                                        )
                                   )}
                              </View>
                              <View style={{ minWidth: 'auto' }}>
                                   <RadiusButton
                                        name="Submit Darood"
                                        customWidth={windowWidth - 40}
                                        textStyle={{ fontFamily: Font.font700, fontSize: 20, color: 'white' }}
                                        onPress={() => (isLogin ? setIsOpen(true) : navigation.navigate('Login'))}
                                   />
                              </View>
                         </View>
                    </View>
                    <View style={{ backgroundColor: 'white', width: '100%', gap: 20, paddingTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                         <View style={styles.IconsContainer}>
                              <TouchableOpacity style={styles.IconBox} onPress={() => navigation.navigate('Tasbih')}>
                                   <Image source={require('../../../assets/tasbih.png')} style={{ width: 45, height: 45 }} />
                                   <Text style={styles.IconText}>Tasbih</Text>
                              </TouchableOpacity>

                              <TouchableOpacity style={styles.IconBox} onPress={() => navigation.navigate('AsmaunNabi')}>
                                   <Image source={require('../../../assets/nabi.png')} style={{ width: 45, height: 45 }} />
                                   <Text style={styles.IconText}>Asma un Nabi</Text>
                              </TouchableOpacity>

                              <TouchableOpacity style={styles.IconBox} onPress={() => navigation.navigate('AsmaulHusna')}>
                                   <Image source={require('../../../assets/Allah.png')} style={{ width: 45, height: 45 }} />
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
                                                  <Text style={{ width: '100%', fontFamily: Font.font600, fontSize: 18, color: colors.PrimaryColor, lineHeight: 25 }}>
                                                       Under the spiritual guidance of
                                                  </Text>
                                                  <Text style={{ width: '100%', fontFamily: Font.font600, fontSize: 18, color: colors.PrimaryColor, lineHeight: 25 }}>Pir Sultan Fiaz ul Hassan</Text>
                                             </View>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                             <Text style={[styles.Desc, isUrdu ? { textAlign: 'right' } : { textAlign: 'left' }]}>{isUrdu ? userMessage : message}</Text>
                                        </View>
                                   </View>
                              </View>
                              <View style={{ width: 225 }}>
                                   <RadiusButton
                                        name="Translate to Urdu"
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
               <FlatList
                    data={[1]}
                    renderItem={renderItem}
                    keyExtractor={item => item.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PrimaryColor]} />}
               />
               <ModalLayout isOpen={isOpen} setIsOpen={setIsOpen}>
                    <View style={styles.ModalContainer}>
                         <TouchableOpacity style={styles.Cross} onPress={() => setIsOpen(false)} disabled={isLoading}>
                              <Entypo name="cross" color={colors.textColor} size={25} />
                         </TouchableOpacity>
                         <Text style={[styles.Heading, { color: colors.PrimaryColor, marginTop: 20 }]}>Submit Darood</Text>
                         <Field placeHolder="Enter Number of Recited Darood Shareef" type="number" value={seq} onChange={value => setSeq(value)} />

                         <Button name={isLoading ? 'Loading...' : 'Submit'} onPress={handleUpdateCounter} disabled={isLoading} />
                    </View>
               </ModalLayout>
          </>
     );
};

export default Home;

const styles = StyleSheet.create({
     Container: {
          flex: 1,
          gap: 25,
          paddingBottom: 30,
          backgroundColor: 'transparent',
     },
     ImageBgContainer: {
          height: 300,
          position: 'relative',
          width: windowWidth,
          borderRadius: 0,
          justifyContent: 'center',
          alignItems: 'center',
     },
     Overlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
     },
     Image: {
          height: '100%',
          width: '100%',
          ...StyleSheet.absoluteFillObject,
          opacity: 0.4,
     },
     gradient: {
          borderRadius: 0,
          flex: 1,
          height: '100%',
     },
     HeroContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          paddingHorizontal: 20,
          height: '100%',
          width: '100%',
          gap: 15,
          paddingTop: 30,
     },
     heroHeading: {
          borderRadius: 20,
          borderColor: 'white',
          borderWidth: 2,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: colors.lightGreen,
          marginTop: 10,
     },

     Heading: {
          color: colors.SecondaryColor,
          fontFamily: Font.font600,
          fontSize: 18,
     },
     Count: {
          color: colors.SecondaryColor,
          fontFamily: Font.font700,
          fontSize: 50,
          textAlign: 'center',
     },
     IconsContainer: {
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          width: windowWidth,
     },
     IconBox: {
          gap: 5,
          alignItems: 'center',
          justifyContent: 'center',
          width: windowWidth / 3 - 25,
          height: 100,
          paddingInline: 5,
          paddingBlock: 8,
          borderRadius: 20,
          backgroundColor: '#fff', // Required for shadow on iOS

          // iOS shadow
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          // Android shadow
          elevation: 4,
     },

     DescContainer: {
          paddingHorizontal: 20,
          gap: 15,
          paddingVertical: 20,
          position: 'relative',
          borderRadius: 20,
          backgroundColor: 'white',

          // iOS shadow
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          // Android shadow
          elevation: 4,
          marginHorizontal: 20,
     },
     DescBox: {
          flexDirection: 'column',
          gap: 15,
     },
     Desc: {
          flex: 1,
          fontFamily: Font.font500,
          color: colors.terTextColor,
          fontSize: 16,
          letterSpacing: 0.8,
          lineHeight: 25,
     },
     IconText: {
          fontFamily: Font.font500,
          color: colors.textColor,
          textAlign: 'center',
     },
     BgIcon: {
          position: 'absolute',
          right: 0,
          bottom: 0,
          borderBottomRightRadius: 15,
     },
     DescImage: {
          height: 120,
          width: '40%',
          borderRadius: 20,
          position: 'relative',
          objectFit: 'fill',
     },
     ModalContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          gap: 15,
     },
     Cross: {
          position: 'absolute',
          right: 5,
          top: 5,
     },
});

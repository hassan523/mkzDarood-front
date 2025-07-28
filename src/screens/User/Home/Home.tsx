import { FlatList, Image, ImageBackground, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { useGetCounterHandler } from '../../../model/Counter/Counter';

const Home = ({ navigation }: { navigation: Navigation }) => {
     const count = 265265625;
     const message =
          'Join this blessed global movement of love and devotion. Every day, Muslims around the world recite Darood Shareef upon the Beloved Prophet Muhammad ﷺ , a source of countless blessings, peace, and spiritual elevation.\n\nThis mission invites you to send the number of Darood Shareef you recite daily to our platform. No matter how much you recite 100, 500, or 10,000, once your count is submitted, it becomes part of a growing collective total.  Just like a drop merges into the ocean and becomes the ocean, your individual recitation becomes part of a united stream of blessings, and you receive reward equal to the entire total by the mercy of Allah ﷻ';

     const selector = useSelector((state: RootState) => state?.userData);
     const isLogin: boolean = selector?.isLoggin;

     const [refreshing, setRefresing] = useState(false);
     const [isOpen, setIsOpen] = useState(false);
     const [num, setNum] = useState('');

     const { counterData, isLoading, isError, refech, error } = useGetCounterHandler();

     const onRefresh = () => {
          setRefresing(true);
          setTimeout(() => {
               setRefresing(false);
          }, 2000);
     };

     const renderItem = () => (
          <View style={styles.Container}>
               <View style={styles.ImageBgContainer}>
                    <ImageBackground source={require('../../../assets/homebg.png')} style={styles.Image} resizeMode="cover">
                         <View style={styles.Overlay} />
                    </ImageBackground>
                    <View style={styles.HeroContainer}>
                         <Image source={require('../../../assets/durood.png')} />
                         <Text style={styles.Heading}>Global Darood Count</Text>
                         <Text style={[styles.Count, { fontSize: count <= 9999999999 ? 50 : 40 }]}>{count.toLocaleString()}</Text>
                         <View style={{ minWidth: 'auto' }}>
                              <Button name="Submit Darood" onPress={() => (isLogin ? setIsOpen(true) : navigation.navigate('Login'))} />
                         </View>
                    </View>
               </View>
               <View style={styles.IconsContainer}>
                    <TouchableOpacity style={styles.IconBox} onPress={() => navigation.navigate('Tasbih')}>
                         <Image source={require('../../../assets/tasbih.png')} />
                         <Text style={styles.IconText}>Tasbih</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.IconBox}>
                         <Image source={require('../../../assets/nabi.png')} />
                         <Text style={styles.IconText}>Asma un Nabi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.IconBox}>
                         <Image source={require('../../../assets/Allah.png')} />
                         <Text style={styles.IconText}>Asma ul Husna</Text>
                    </TouchableOpacity>
               </View>
               <View style={styles.DescContainer}>
                    <Text style={[styles.Heading, { color: colors.PrimaryColor }]}>A Drop in the Ocean of Mercy</Text>
                    <View>
                         <View style={styles.DescBox}>
                              <Image source={require('../../../assets/peersaab.png')} style={styles.DescImage} />
                              <View style={{ flex: 1 }}>
                                   <Text style={styles.Desc}>{message?.slice(0, Math.floor(windowWidth - 174) - 94)}</Text>
                              </View>
                         </View>
                         <Text style={[styles.Desc, { letterSpacing: 0.8 }]}>{message?.slice(Math.floor(windowWidth - 174) - 94)}</Text>
                    </View>
                    <View style={{ width: 225 }}>
                         <Button name="Translate to Urdu" iconRight icon={<MaterialIcons name="translate" color={colors.SecondaryColor} size={25} />} />
                    </View>
                    <Image source={require('../../../assets/bg3.png')} style={styles.BgIcon} />
               </View>
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
                         <TouchableOpacity style={styles.Cross} onPress={() => setIsOpen(false)}>
                              <Entypo name="cross" color={colors.textColor} size={25} />
                         </TouchableOpacity>
                         <Text style={[styles.Heading, { color: colors.PrimaryColor, marginTop: 20 }]}>Submit Durood</Text>
                         <Field placeHolder="Enter Number of Recited Darood Shareef" type="number" value={num} onChange={value => setNum(value)} />

                         <Button name="Submit" onPress={() => setIsOpen(false)} />
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
          backgroundColor: 'white',
     },
     ImageBgContainer: {
          height: 270,
          position: 'relative',
          width: windowWidth,
     },
     Overlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
     },
     Image: {
          height: '100%',
          width: '100%',
          ...StyleSheet.absoluteFillObject,
     },
     HeroContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          paddingHorizontal: 20,
          height: '100%',
          width: '100%',
          gap: 15,
     },
     Heading: {
          color: colors.SecondaryColor,
          fontFamily: Font.font600,
          fontSize: 20,
     },
     Count: {
          color: colors.SecondaryColor,
          fontFamily: Font.font600,
          fontSize: 50,
     },
     IconsContainer: {
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 9,
     },
     IconBox: {
          gap: 5,
          alignItems: 'center',
          justifyContent: 'center',
          width: 120,
          height: 110,
          paddingInline: 5,
          paddingBlock: 8,
          borderRadius: 10,
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
          paddingVertical: 10,
          position: 'relative',
          borderRadius: 10,
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
          marginHorizontal: 20,
     },
     DescBox: {
          flexDirection: 'row',
          gap: 15,
     },
     Desc: {
          flex: 1,
          fontFamily: Font.font500,
          color: colors.terTextColor,
          fontSize: 16,
          letterSpacing: 0.8,
     },
     IconText: {
          fontFamily: Font.font500,
          color: colors.textColor,
     },
     BgIcon: {
          position: 'absolute',
          right: 0,
          bottom: 0,
          borderBottomRightRadius: 15,
     },
     DescImage: {
          height: 100,
          width: 100,
          borderRadius: 10,
          position: 'relative',
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

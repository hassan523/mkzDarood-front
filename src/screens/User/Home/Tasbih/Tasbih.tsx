import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import colors from '../../../../utils/colors/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Font from '../../../../utils/fonts/Font';
import Navigation from '../../../../utils/NavigationProps/NavigationProps';
import Button from '../../../../components/Button/Button';
import ModalLayout from '../../../../layout/ModalLayout/ModalLayout';
import Field from '../../../../components/Field/Field';
import { useUpdateCounterHandler } from '../../../../model/Counter/Counter';
import { RootState } from '../../../../redux/store';
import { useSelector } from 'react-redux';

const Tasbih = ({ navigation }: { navigation: Navigation }) => {
     const selector = useSelector((state: RootState) => state?.userData);
     const Token: string | undefined = selector?.data?.accessToken;
     const isLogin: boolean = selector?.isLoggin;

     const [seq, setSeq] = useState<number | string>(0);
     const [isOpen, setIsOpen] = useState(false);

     const { handleUpdate, isLoading } = useUpdateCounterHandler();

     const handleUpdateCounter = () => {
          handleUpdate({ seq: seq, Token: Token, setIsOpen: setIsOpen, setSeq: setSeq });
     };
     return (
          <>
               <View style={styles.Container}>
                    <View style={styles.HeaderContainer}>
                         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.MenuButton}>
                              <FontAwesome6 name="arrow-left-long" size={20} color={colors.textColor} />
                         </TouchableOpacity>
                         <Text style={styles.Heading}>Tasbih</Text>
                    </View>
                    <View style={styles.CounterContainer}>
                         <View style={styles.Counter}>
                              <Text style={[styles.CounterText, { fontSize: typeof seq == 'number' && seq <= 999999 ? 50 : 40 }]}>{seq}</Text>
                         </View>
                         <View style={styles.BtnContainer}>
                              <TouchableOpacity style={styles.Btn} onPress={() => seq != 0 && setSeq(prev => (typeof prev == 'number' ? prev - 1 : ''))}>
                                   <AntDesign name="minus" size={50} color={colors.PrimaryColor} />
                              </TouchableOpacity>
                              <TouchableOpacity style={[styles.Btn, { backgroundColor: colors.PrimaryColor }]} onPress={() => setSeq(prev => (typeof prev == 'number' ? prev + 1 : ''))}>
                                   <AntDesign name="plus" size={50} color={colors.SecondaryColor} />
                              </TouchableOpacity>
                         </View>
                         {seq != 0 && <Button name="Submit" onPress={() => (isLogin ? navigation.navigate('AsmaulHusna') : setIsOpen(true))} />}
                    </View>
               </View>
               <ModalLayout isOpen={isOpen} setIsOpen={setIsOpen}>
                    <View style={styles.ModalContainer}>
                         <TouchableOpacity style={styles.Cross} onPress={() => setIsOpen(false)} disabled={isLoading}>
                              <Entypo name="cross" color={colors.textColor} size={25} />
                         </TouchableOpacity>
                         <Text style={[styles.Heading, { color: colors.PrimaryColor, marginTop: 20, textAlign: 'center' }]}>You Want to Submit this tasbih to Durood?</Text>

                         <Button name={isLoading ? 'Loading...' : 'Submit'} onPress={handleUpdateCounter} disabled={isLoading} />
                    </View>
               </ModalLayout>
          </>
     );
};

export default Tasbih;

const styles = StyleSheet.create({
     Container: {
          flex: 1,
          gap: 35,
          alignItems: 'center',
          backgroundColor: 'white',
     },
     Heading: {
          fontFamily: Font.font600,
          fontSize: 18,
          color: colors.textColor,
     },
     HeaderContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
          width: '100%',
          position: 'relative',
          marginTop: 20,
     },
     MenuButton: {
          position: 'absolute',
          left: 20,
     },
     CounterContainer: {
          gap: 20,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
          width: '100%',
     },
     Counter: {
          height: 225,
          width: 225,
          borderRadius: 1000,
          backgroundColor: colors.PrimaryColor,
          justifyContent: 'center',
          alignItems: 'center',
     },
     CounterText: {
          fontFamily: Font.font600,
          color: colors.SecondaryColor,
          fontSize: 50,
     },
     BtnContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          flexDirection: 'row',
     },
     Btn: {
          width: 110,
          height: 65,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: colors.PrimaryColor,
          borderRadius: 400,
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

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import colors from '../../../../utils/colors/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Font from '../../../../utils/fonts/Font';
import Navigation from '../../../../utils/NavigationProps/NavigationProps';

const Tasbih = ({ navigation }: { navigation: Navigation }) => {
   const [count, setCount] = useState(0);
   return (
      <View style={styles.Container}>
         <View style={styles.HeaderContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.MenuButton}>
               <FontAwesome6 name="arrow-left-long" size={20} color={colors.textColor} />
            </TouchableOpacity>
            <Text style={styles.Heading}>Tasbih</Text>
         </View>
         <View style={styles.CounterContainer}>
            <View style={styles.Counter}>
               <Text style={[styles.CounterText, { fontSize: count <= 999999 ? 50 : 40 }]}>{count}</Text>
            </View>
            <View style={styles.BtnContainer}>
               <TouchableOpacity style={styles.Btn} onPress={() => count != 0 && setCount(prev => prev - 1)}>
                  <AntDesign name="minus" size={50} color={colors.PrimaryColor} />
               </TouchableOpacity>
               <TouchableOpacity style={[styles.Btn, { backgroundColor: colors.PrimaryColor }]} onPress={() => setCount(prev => prev + 1)}>
                  <AntDesign name="plus" size={50} color={colors.SecondaryColor} />
               </TouchableOpacity>
            </View>
         </View>
      </View>
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
});

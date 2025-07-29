import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Navigation from '../../../../utils/NavigationProps/NavigationProps';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../../utils/colors/colors';
import Font from '../../../../utils/fonts/Font';

const AsmaulHusna = ({ navigation }: { navigation: Navigation }) => {
     return (
          <View style={styles.Container}>
               <View style={styles.HeaderContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.MenuButton}>
                         <FontAwesome6 name="arrow-left-long" size={20} color={colors.textColor} />
                    </TouchableOpacity>
                    <Text style={styles.Heading}>Asma ul Husna</Text>
               </View>
          </View>
     );
};

export default AsmaulHusna;

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
});

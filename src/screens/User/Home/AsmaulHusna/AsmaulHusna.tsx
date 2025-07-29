import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Navigation from '../../../../utils/NavigationProps/NavigationProps';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../../utils/colors/colors';
import Font from '../../../../utils/fonts/Font';
import data from '../../../../utils/Data/data.json';

const AsmaulHusna = ({ navigation }: { navigation: Navigation }) => {
     return (
          <View style={styles.Container}>
               <View style={styles.HeaderContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.MenuButton}>
                         <FontAwesome6 name="arrow-left-long" size={20} color={colors.textColor} />
                    </TouchableOpacity>
                    <Text style={styles.Heading}>Asma ul Husna</Text>
               </View>
               <ScrollView contentContainerStyle={styles.NameContainer} showsVerticalScrollIndicator={false}>
                    {data.names_of_Allah.map((name, index) => (
                         <View key={index} style={styles.NameBox}>
                              <Text style={styles.ArabicText}>{name.arabic}</Text>
                              <Text style={styles.NameText}>{name.transliteration}</Text>
                              <Text style={styles.NameText}>{name.meaning}</Text>
                         </View>
                    ))}
               </ScrollView>
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
     NameContainer: {
          flexDirection: 'row-reverse',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 50,
          paddingHorizontal: 10
     },
     NameBox: {
          gap: 5,
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: 5,
          paddingBlock: 8,
          borderRadius: 10,
          backgroundColor: '#fff',
          width: '45%',

          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 4,
     },
     ArabicText: {
          fontFamily: Font.font700,
          fontSize: 35,
          color: colors.PrimaryColor,
          textAlign: 'center',
     },
     NameText: {
          fontFamily: Font.font500,
          fontSize: 16,
          color: colors.textColor,
          textAlign: 'center',
     },
});

import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Navigation from '../../../../utils/NavigationProps/NavigationProps';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../../utils/colors/colors';
import Font from '../../../../utils/fonts/Font';
import data from '../../../../utils/Data/data.json';
import GradientBG from '../../../../components/GradientBG/GradientBG';
import { windowHeight, windowWidth } from '../../../../utils/dimensions/dimensions';

const AsmaulHusna = ({ navigation }: { navigation: Navigation }) => {
     const renderItem = ({ item }: { item: any }) => {
          return (
               <View style={{ width: windowWidth, flexDirection: 'row' }}>
                    <View style={styles.NameBox}>
                         <Text style={styles.ArabicText}>{item?.arabic}</Text>
                         <Text style={styles.NameText}>{item?.transliteration}</Text>
                         <Text style={styles.NameText}>{item?.meaning}</Text>
                    </View>
                    <View style={styles.NameBox}>
                         <Text style={styles.ArabicText}>{item?.arabic}</Text>
                         <Text style={styles.NameText}>{item?.transliteration}</Text>
                         <Text style={styles.NameText}>{item?.meaning}</Text>
                    </View>
               </View>
          );
     };
     return (
          <View style={styles.Container}>
               <GradientBG style={styles.gradient} isBackgroundImage>
                    <View style={{ gap: 35 }}>
                         <View style={styles.HeaderContainer}>
                              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.MenuButton}>
                                   <FontAwesome6 name="arrow-left-long" size={20} color={colors.SecondaryColor} />
                              </TouchableOpacity>
                              <Text style={styles.Heading}>Asma ul Husna</Text>
                         </View>
                         <FlatList
                              data={data.names_of_Allah}
                              renderItem={(item: any) => renderItem(item)}
                              keyExtractor={(item, index) => index.toString()}
                              showsVerticalScrollIndicator={false}
                              contentContainerStyle={styles.NameContainer}
                         />
                    </View>
               </GradientBG>
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

     gradient: {
          borderRadius: 0,
          width: '100%',
          height: '100%',
     },

     Heading: {
          fontFamily: Font.font600,
          fontSize: 24,
          color: colors.SecondaryColor,
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 200,
          paddingHorizontal: 10,
     },
     NameBox: {
          gap: 5,
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: 5,
          paddingBlock: 8,
          borderRadius: 0,
          backgroundColor: 'transparent',
          width: '50%',
          borderColor: 'white',
          borderWidth: 1,

          shadowColor: '#fff',
          shadowOffset: {
               width: 2,
               height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 40,
     },
     ArabicText: {
          fontFamily: Font.font700,
          fontSize: 35,
          color: colors.SecondaryColor,
          textAlign: 'center',
     },
     NameText: {
          fontFamily: Font.font500,
          fontSize: 16,
          color: colors.SecondaryColor,
          textAlign: 'center',
     },
});

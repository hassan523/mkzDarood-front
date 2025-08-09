import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
               <View style={styles.NameBox}>
                    <Text style={styles.ArabicText}>{item?.arabic}</Text>
                    <Text style={styles.NameText}>{item?.transliteration}</Text>
                    <Text style={styles.NameText}>{item?.meaning}</Text>
               </View>
          );
     };
     return (
          <View style={styles.Container}>
               <GradientBG style={styles.gradient} isBackgroundImage>
                    <View>
                         <FlatList
                              data={data.names_of_Allah}
                              renderItem={(item: any) => renderItem(item)}
                              keyExtractor={(item, index) => index.toString()}
                              showsVerticalScrollIndicator={false}
                              contentContainerStyle={styles.NameContainer}
                              numColumns={2}
                              columnWrapperStyle={{ flexDirection: 'row-reverse' }}
                              ListHeaderComponent={
                                   <>
                                        <View style={styles.HeaderContainer}>
                                             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.MenuButton}>
                                                  <FontAwesome6 name="arrow-left-long" size={20} color={colors.SecondaryColor} />
                                             </TouchableOpacity>
                                             <Image source={require('../../../../assets/logo2.png')} style={{ width: 100 }} resizeMode="contain" />
                                        </View>
                                        <Text style={styles.Title}>Asma ul Husna</Text>
                                   </>
                              }
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
          marginVertical: 20,
     },
     MenuButton: {
          position: 'absolute',
          left: 20,
     },
     Title: {
          textAlign: 'center',
          color: colors.SecondaryColor,
          fontSize: 25,
          fontFamily: Font.font600,
          paddingVertical: 10,
     },
     NameContainer: {
          paddingBottom: 60,
          paddingHorizontal: 10,
     },
     NameBox: {
          gap: 5,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 5,
          paddingVertical: 8,
          width: '50%',
          borderColor: 'white',
          borderWidth: 1,
          backgroundColor: 'transparent',
          shadowColor: '#fff',
          shadowOffset: { width: 2, height: 2 },
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

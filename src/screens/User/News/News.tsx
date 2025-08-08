import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import { windowWidth } from '../../../utils/dimensions/dimensions';
import GradientBG from '../../../components/GradientBG/GradientBG';

const News = () => {
     const [refreshing, setRefresing] = useState(false);

     const onRefresh = () => {
          setRefresing(true);
          setTimeout(() => {
               setRefresing(false);
          }, 2000);
     };

     const renderItem = () => (
          <View style={styles.Container}>
               <Text style={styles.NewsHeading}>News Heading</Text>
               <Text style={styles.Desc}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
               </Text>
               <Image source={require('../../../assets/news.png')} style={styles.NewsImages} />
          </View>
     );
     return (
          <View style={styles.MainContainer}>
               <GradientBG style={styles.gradient} isBackgroundImage>
                    <Text style={{ textAlign: 'center', marginTop: 20, color: colors.SecondaryColor, fontSize: 25, fontFamily: Font.font600 }}>NEWS</Text>

                    <FlatList
                         data={[1, 2, 3, 4, 5]}
                         renderItem={renderItem}
                         keyExtractor={item => item.toString()}
                         showsVerticalScrollIndicator={false}
                         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PrimaryColor]} />}
                         contentContainerStyle={{ width: '100%' }}
                    />
               </GradientBG>
          </View>
     );
};

export default News;

const styles = StyleSheet.create({
     MainContainer: {
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'red',
          justifyContent: 'center',
     },
     Container: {
          paddingHorizontal: 20,
          paddingTop: 15,
          gap: 25,
          width: '95%',
          paddingBottom: 20,
          backgroundColor: 'transparent',
          overflow: 'hidden',
          marginTop: 15,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: colors.SecondaryColor,

          shadowColor: '#fff',
          shadowOffset: {
               width: 2,
               height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 180,
     },
     gradient: {
          borderRadius: 0,
          width: '100%',
          height: '100%',
     },
     Heading: {
          color: colors.SecondaryColor,
          fontFamily: Font.font600,
          fontSize: 16,
     },
     NewsContainer: {
          position: 'relative',
          width: '100%',
          gap: 10,
          backgroundColor: '#fff', // Required for shadow on iOS
          borderBottomRightRadius: 15,
          borderBottomLeftRadius: 15,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,

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
          padding: 15,
     },
     NewsHeading: {
          color: colors.SecondaryColor,
          fontFamily: Font.font700,
          fontSize: 18,
     },
     Desc: {
          fontFamily: Font.font500,
          color: colors.SecondaryColor,
          fontSize: 16,
     },
     NewsImages: {
          width: '100%',
          borderRadius: 15,
          height: 250,
     },
     IconImage: {
          position: 'absolute',
          right: 0,
          borderTopRightRadius: 15,
     },
});

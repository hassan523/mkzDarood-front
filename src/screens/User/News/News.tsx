import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import { windowWidth } from '../../../utils/dimensions/dimensions';
import GradientBG from '../../../components/GradientBG/GradientBG';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import { useGetNews } from '../../../model/News/NewsModel';
import Video from 'react-native-video';

const News = ({ navigation }: { navigation: Navigation }) => {
     const [refreshing, setRefresing] = useState(false);
     const [expanded, setExpanded] = useState(false);
     const { data, isLoading, isError, error, refetch } = useGetNews();

     const onRefresh = async () => {
          setRefresing(true);
          await refetch?.();
          setTimeout(() => {
               setRefresing(false);
          }, 2000);
     };

     const renderItem = ({ item }: { item: any }) => {
          return (
               <View style={styles.Container}>
                    <Text style={styles.NewsHeading}>{item.title}</Text>
                    {item.content?.length > 100 ? (
                         <Text style={styles.Desc}>
                              {item.content.slice(0, expanded ? item.content.length : 400) + '...'}
                              <TouchableOpacity onPress={() => setExpanded(!expanded)} style={{ flexDirection: 'row', alignItems: 'center', zIndex: 9999999 }}>
                                   <Text style={{ fontWeight: '700', marginLeft: 5, lineHeight: 10, paddingTop: 5, color: 'white' }}>{expanded ? 'See less' : 'See more'}</Text>
                              </TouchableOpacity>
                         </Text>
                    ) : (
                         <Text style={styles.Desc}>{item.content}</Text>
                    )}
                    {item?.thumbnail && <Image source={require('../../../assets/news.png')} src={item?.thumbnail} style={styles.NewsImages} />}
                    {item?.video && (
                         <View style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: colors.SecondaryColor }}>
                              <Video source={{ uri: item?.video }} style={{ width: '100%', height: 350, borderRadius: 10 }} controls volume={1.0} />
                         </View>
                    )}
               </View>
          );
     };

     return (
          <View style={styles.MainContainer}>
               <GradientBG style={styles.gradient} isBackgroundImage>
                    <FlatList
                         data={data || []}
                         renderItem={renderItem}
                         keyExtractor={item => item?._id?.toString()}
                         showsVerticalScrollIndicator={false}
                         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PrimaryColor]} />}
                         contentContainerStyle={{ width: '100%', paddingBottom: 20 }}
                         ListHeaderComponent={
                              <>
                                   <CustomHeader navigation={navigation} />
                                   <Text style={{ textAlign: 'center', marginTop: 20, color: colors.SecondaryColor, fontSize: 25, fontFamily: Font.font600, paddingTop: 60 }}>NEWS</Text>
                              </>
                         }
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
          justifyContent: 'center',
     },
     Container: {
          paddingHorizontal: 20,
          paddingTop: 15,
          gap: 25,
          width: windowWidth - 40,
          paddingBottom: 20,
          overflow: 'hidden',
          marginTop: 15,
          borderRadius: 15,
          borderWidth: 2,
          borderColor: colors.SecondaryColor,
          backgroundColor: colors.lightGreen,
          shadowColor: '#fff',
          shadowOffset: {
               width: 2,
               height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 180,
          marginLeft: 20,
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

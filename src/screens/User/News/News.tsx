import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import { windowWidth } from '../../../utils/dimensions/dimensions';

const News = () => {
  const [refreshing, setRefresing] = useState(false);

  const onRefresh = () => {
    setRefresing(true);
    setTimeout(() => {
      setRefresing(false);
    }, 2000);
  };

  const renderItem = () => (
    <View style={styles.NewsContainer}>
      <Image
        source={require('../../../assets/bg4.png')}
        style={styles.IconImage}
      />
      <Text style={styles.NewsHeading}>News Heading</Text>
      <Text style={styles.Desc}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </Text>
      <Image
        source={require('../../../assets/news.png')}
        style={styles.NewsImages}
      />
    </View>
  );
  return (
    <FlatList
      data={[1,2,3,4,5]}
      renderItem={renderItem}
      keyExtractor={item => item.toString()}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.PrimaryColor]}
        />
      }
      contentContainerStyle={styles.Container}
      ListHeaderComponent={
        <Text style={[styles.Heading, { textAlign: 'center' }]}>News</Text>
      }
    />
  );
};

export default News;

const styles = StyleSheet.create({
  Container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    gap: 35,
    width: windowWidth,
    paddingBottom: 40
  },
  Heading: {
    color: colors.textColor,
    fontFamily: Font.font600,
    fontSize: 16,
  },
  NewsContainer: {
    position: 'relative',
    width: '100%',
    gap: 20,
    borderRadius: 15,
  },
  NewsHeading: {
    color: colors.PrimaryColor,
    fontFamily: Font.font700,
    fontSize: 18,
  },
  Desc: {
    fontFamily: Font.font500,
    color: colors.terTextColor,
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

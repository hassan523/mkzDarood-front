import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Skeleton from '../Skeleton';
import colors from '../../../Assests/Colors/Colors';
import {windowWidth} from '../../../Utils/Dimension/Dimension';

const HomeSkeleton = () => {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardText}>
        <Skeleton width={60} height={60} borderRadius={5} />
        <View style={{width: '70%', flexDirection: 'column', gap: 10}}>
          <Skeleton width={windowWidth - 250} height={15} borderRadius={5} />
          <Skeleton width={windowWidth - 280} height={10} borderRadius={5} />
        </View>
      </View>
    </View>
  );
};

export default HomeSkeleton;

const styles = StyleSheet.create({
  cardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cardText: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
});

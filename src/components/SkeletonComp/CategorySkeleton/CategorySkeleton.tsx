import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Skeleton from '../Skeleton';
import colors from '../../../Assests/Colors/Colors';
import {windowWidth} from '../../../Utils/Dimension/Dimension';

const CategorySkeleton = () => {
  return (
    <View style={{gap: 15}}>
        <View style={styles.cardWrapper}>
          <View style={styles.cardText}>
            <View style={{width: '70%', flexDirection: 'column', gap: 10}}>
              <Skeleton width={windowWidth - 350} height={15} borderRadius={5} />
              <Skeleton width={windowWidth - 280} height={10} borderRadius={5} />
            </View>
            <Skeleton width={50} height={10} borderRadius={5} />
          </View>
        </View>
    </View>
  );
};

export default CategorySkeleton;

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
    paddingBlock: 10,
    width: windowWidth - 20,
  },
});

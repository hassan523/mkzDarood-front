import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import Skeleton from '../Skeleton';
import colors from '../../../Assests/Colors/Colors';
import {windowWidth} from '../../../Utils/Dimension/Dimension';

const HistorySkeleton = () => {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardText}>
        <View style={{width: '70%', flexDirection: 'column', gap: 10}}>
          <Skeleton width={200} height={12} borderRadius={5} />
        </View>
        <View style={{flexDirection: 'row', gap: 10}}>
          <Skeleton width={90} height={80} borderRadius={5} />
          <Skeleton width={90} height={80} borderRadius={5} />
          <Skeleton width={90} height={80} borderRadius={5} />
          <Skeleton width={90} height={80} borderRadius={5} />
        </View>
      </View>
    </View>
  );
};

export default HistorySkeleton;

const styles = StyleSheet.create({
  cardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    overflow: 'hidden',
  },
  cardText: {
    flexDirection: 'column',
    gap: 20,
    alignItems: 'flex-start',
    paddingBlock: 10,
    width: windowWidth - 50,
  },
});

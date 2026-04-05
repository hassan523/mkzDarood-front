import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import { windowHeight, windowWidth } from '../../../utils/dimensions/dimensions';
import GradientBG from '../../../components/GradientBG/GradientBG';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import { useGetNews } from '../../../model/News/NewsModel';
import Video from 'react-native-video';
import { RootState } from 'src/redux/store';
import { useSelector } from 'react-redux';
import Skeleton from '../../../components/SkeletonComp/Skeleton';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// ─── Animated News Card ───────────────────────────────────────────────────────
const NewsCard = ({
     item,
     index,
     expanded,
     setExpanded,
     paused,
     setPaused,
}: {
     item: any;
     index: number;
     expanded: string | null;
     setExpanded: (id: string | null) => void;
     paused: boolean;
     setPaused: (v: boolean) => void;
}) => {
     const fadeAnim = useRef(new Animated.Value(0)).current;
     const slideAnim = useRef(new Animated.Value(30)).current;
     const isExpanded = expanded === item._id;

     useEffect(() => {
          Animated.parallel([
               Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    delay: index * 80,
                    useNativeDriver: true,
               }),
               Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    delay: index * 80,
                    useNativeDriver: true,
               }),
          ]).start();
     }, []);

     const isLong = item.content?.length > 120;
     const displayText = isLong && !isExpanded ? item.content.slice(0, 120) : item.content;

     return (
          <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
               <View style={styles.card}>
                    {/* ── Top accent bar ── */}
                    <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.accentBar} />

                    {/* ── Content ── */}
                    <View style={styles.cardBody}>
                         {/* Tag */}
                         <View style={styles.tagRow}>
                              <View style={styles.tag}>
                                   <MaterialIcons name="newspaper" size={11} color={colors.PrimaryColor} />
                                   <Text style={styles.tagText}>NEWS</Text>
                              </View>
                         </View>

                         {/* Title */}
                         <Text style={styles.cardTitle}>{item.title}</Text>

                         {/* Description */}
                         <Text style={styles.cardDesc}>
                              {displayText}
                              {isLong && !isExpanded && (
                                   <Text style={styles.seeMore} onPress={() => setExpanded(item._id)}>
                                        {'... '}
                                        <Text style={styles.seeMoreBtn}>Read more</Text>
                                   </Text>
                              )}
                         </Text>
                         {isLong && isExpanded && (
                              <TouchableOpacity onPress={() => setExpanded(null)} style={styles.seeLessBtn} activeOpacity={0.7}>
                                   <MaterialIcons name="keyboard-arrow-up" size={14} color={colors.PrimaryColor} />
                                   <Text style={styles.seeLessText}>Show less</Text>
                              </TouchableOpacity>
                         )}
                    </View>

                    {/* ── Thumbnail ── */}
                    {item?.thumbnail && (
                         <View style={styles.mediaWrapper}>
                              <FastImage
                                   source={{ uri: item.thumbnail, priority: FastImage.priority.normal, cache: FastImage.cacheControl.immutable }}
                                   style={styles.thumbnail}
                                   resizeMode={FastImage.resizeMode.contain}
                              />
                              {/* Gradient overlay on image */}
                              <LinearGradient colors={['transparent', 'rgba(0,104,96,0.55)']} style={styles.imgOverlay} />
                         </View>
                    )}

                    {/* ── Video ── */}
                    {item?.video && (
                         <TouchableOpacity activeOpacity={0.95} onPress={() => setPaused(!paused)} style={styles.mediaWrapper}>
                              <Video source={{ uri: item?.video }} style={styles.video} controls volume={1.0} paused={paused} onPlaybackStateChanged={e => setPaused(!e.isPlaying)} />
                         </TouchableOpacity>
                    )}
               </View>
          </Animated.View>
     );
};

// ─── Skeleton Loader Card ─────────────────────────────────────────────────────
const SkeletonCard = () => (
     <View style={[styles.cardWrapper]}>
          <View style={styles.card}>
               <View style={[styles.accentBar, { backgroundColor: '#e0e0e0' }]} />
               <View style={[styles.cardBody, { gap: 14 }]}>
                    <Skeleton height={10} width={60} borderRadius={100} />
                    <Skeleton height={16} width={windowWidth - 100} borderRadius={6} />
                    <View style={{ gap: 8 }}>
                         <Skeleton height={12} width={windowWidth - 90} borderRadius={100} />
                         <Skeleton height={12} width={windowWidth - 110} borderRadius={100} />
                         <Skeleton height={12} width={windowWidth - 130} borderRadius={100} />
                    </View>
               </View>
               <Skeleton height={200} width={windowWidth - 56} borderRadius={0} />
          </View>
     </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => {
     const bounceAnim = useRef(new Animated.Value(0)).current;
     useEffect(() => {
          Animated.loop(
               Animated.sequence([
                    Animated.timing(bounceAnim, { toValue: -10, duration: 700, useNativeDriver: true }),
                    Animated.timing(bounceAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
               ]),
          ).start();
     }, []);

     return (
          <View style={styles.emptyContainer}>
               <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
                    <View style={styles.emptyIconBox}>
                         <MaterialIcons name="newspaper" size={44} color="rgba(255,255,255,0.5)" />
                    </View>
               </Animated.View>
               <Text style={styles.emptyTitle}>No news found.</Text>
               <Text style={styles.emptyUrdu}>خبریں نہیں ملی</Text>
          </View>
     );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const News = ({ navigation }: { navigation: Navigation }) => {
     const [refreshing, setRefresing] = useState(false);
     const [expanded, setExpanded] = useState<string | null>(null);
     const [paused, setPaused] = useState(true);

     const selector = useSelector((state: RootState) => state?.userData);
     const Token: string | undefined = selector?.data?.accessToken;

     const { data, isLoading, refetch } = useGetNews(Token);
     const newsData = (data as any)?.news;

     const onRefresh = async () => {
          setRefresing(true);
          await refetch?.();
          setTimeout(() => setRefresing(false), 2000);
     };

     const isFocused = useIsFocused();
     useEffect(() => {
          if (!isFocused) setPaused(true);
          return () => setPaused(true);
     }, [isFocused]);

     const isEmpty = !isLoading && (!newsData || newsData.length === 0);

     return (
          <View style={styles.MainContainer}>
               <GradientBG style={styles.gradient} isBackgroundImage>
                    <FlatList
                         data={isLoading ? [1, 2, 3] : isEmpty ? [] : newsData}
                         renderItem={
                              isLoading
                                   ? () => <SkeletonCard />
                                   : ({ item, index }) => <NewsCard item={item} index={index} expanded={expanded} setExpanded={setExpanded} paused={paused} setPaused={setPaused} />
                         }
                         keyExtractor={(item, index) => (isLoading ? index.toString() : item?._id?.toString())}
                         showsVerticalScrollIndicator={false}
                         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PrimaryColor]} tintColor={colors.SecondaryColor} />}
                         contentContainerStyle={styles.listContent}
                         ListEmptyComponent={<EmptyState />}
                         ListHeaderComponent={
                              <>
                                   <CustomHeader navigation={navigation} style={{ paddingHorizontal: 0 }} />
                                   <View style={styles.headerSection}>
                                        <Text style={styles.headerTitle}>Latest News</Text>
                                        <Text style={styles.headerUrdu}>تازہ ترین خبریں</Text>
                                        <View style={styles.headerDivider} />
                                   </View>
                              </>
                         }
                    />
               </GradientBG>
          </View>
     );
};

export default News;

const CARD_WIDTH = windowWidth - 32;

const styles = StyleSheet.create({
     MainContainer: { flex: 1 },
     gradient: { borderRadius: 0, width: '100%', height: '100%' },
     listContent: { paddingBottom: 30, paddingHorizontal: 16 },

     // ── Header ──
     headerSection: { alignItems: 'center', paddingTop: 100, paddingBottom: 10 },
     headerTitle: { fontFamily: Font.font700, fontSize: 28, color: '#fff', letterSpacing: 1.5, textTransform: 'uppercase' },
     headerUrdu: { fontFamily: Font.font600, fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
     headerDivider: { width: 40, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)', marginTop: 12 },

     // ── Card ──
     cardWrapper: { marginTop: 16, width: CARD_WIDTH },
     card: {
          width: '100%',
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: colors.lightGreen,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.18)',
          shadowColor: colors.PrimaryColor,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
     },
     accentBar: { width: '100%', height: 3 },
     cardBody: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 12, gap: 10 },

     // Tag
     tagRow: { flexDirection: 'row' },
     tag: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: 'rgba(255,255,255,0.9)',
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 20,
     },
     tagText: { fontFamily: Font.font700, fontSize: 10, color: colors.PrimaryColor, letterSpacing: 1 },

     // Text
     cardTitle: { fontFamily: Font.font700, fontSize: 17, color: '#fff', lineHeight: 24 },
     cardDesc: { fontFamily: Font.font500, fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 22 },
     seeMore: { fontFamily: Font.font500, fontSize: 14, color: 'rgba(255,255,255,0.82)' },
     seeMoreBtn: { fontFamily: Font.font700, color: '#fff', textDecorationLine: 'underline' },
     seeLessBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
     seeLessText: { fontFamily: Font.font600, fontSize: 13, color: '#fff', textDecorationLine: 'underline' },

     // Media
     mediaWrapper: { width: '100%', height: 220, overflow: 'hidden', position: 'relative' },
     thumbnail: { width: '100%', height: '100%' },
     imgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
     video: { width: '100%', height: '100%' },

     // ── Empty ──
     emptyContainer: { alignItems: 'center', justifyContent: 'center', gap: 12, height: windowHeight - 300, paddingTop: 40 },
     emptyIconBox: {
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     emptyTitle: { fontFamily: Font.font600, color: '#fff', fontSize: 20 },
     emptyUrdu: { fontFamily: Font.font600, color: 'rgba(255,255,255,0.6)', fontSize: 18 },
});

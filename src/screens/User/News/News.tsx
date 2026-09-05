import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import { windowHeight, windowWidth } from '../../../utils/dimensions/dimensions';
import GradientBG from '../../../components/GradientBG/GradientBG';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import { useGetNews } from '../../../model/News/NewsModel';
import { useVideoPlayer, VideoView } from 'react-native-video';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import Skeleton from '../../../components/SkeletonComp/Skeleton';
import { useIsFocused } from '@react-navigation/native';
import FastImage from '@d11/react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// ─── Animated News Card ───────────────────────────────────────────────────────
const NewsCard = ({ item, index, onPress }: { item: any; index: number; onPress: (item: any) => void }) => {
     const fadeAnim = useRef(new Animated.Value(0)).current;
     const slideAnim = useRef(new Animated.Value(24)).current;

     useEffect(() => {
          Animated.parallel([
               Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 70, useNativeDriver: true }),
               Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: index * 70, useNativeDriver: true }),
          ]).start();
     }, []);
     const isUrdu = /[\u0600-\u06FF]/.test(item?.content);
     return (
          <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
               <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(item)} style={styles.card}>
                    {/* Top accent bar */}
                    <LinearGradient colors={[colors.gradientOne, colors.gradientTwo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.accentBar} />

                    <View style={styles.cardRow}>
                         {/* ── LEFT: Media Column ── */}
                         {item?.thumbnail.length > 0 && item?.video.length == 0 ? (
                              <View style={styles.mediaBox}>
                                   <FastImage
                                        source={{ uri: item.thumbnail?.[0], priority: FastImage.priority.normal, cache: FastImage.cacheControl.immutable }}
                                        style={styles.thumbImg}
                                        resizeMode={FastImage.resizeMode.cover}
                                   />
                              </View>
                         ) : item?.video.length > 0 ? (
                              <View style={styles.mediaBox}>
                                   <FastImage
                                        source={{ uri: item.thumbnail?.[0], priority: FastImage.priority.normal, cache: FastImage.cacheControl.immutable }}
                                        style={styles.thumbImg}
                                        resizeMode={FastImage.resizeMode.cover}
                                   />
                                   <View style={styles.playOverlay}>
                                        <View style={styles.playBtn}>
                                             <MaterialIcons name="play-arrow" size={22} color={colors.PrimaryColor} />
                                        </View>
                                        <View style={styles.videoBadge}>
                                             <Text style={styles.videoBadgeText}>VIDEO</Text>
                                        </View>
                                   </View>
                              </View>
                         ) : (
                              <View style={styles.placeholder}>
                                   <MaterialIcons name="newspaper" size={28} color="rgba(255,255,255,0.3)" />
                                   <Text style={styles.placeholderText}>No media</Text>
                              </View>
                         )}

                         {/* ── RIGHT: Content ── */}
                         <View style={styles.cardBody}>
                              <View style={[styles.tagRow, { justifyContent: item?.pinnedNews ? 'space-between' : 'flex-start' }]}>
                                   <View style={styles.tag}>
                                        <MaterialIcons name="newspaper" size={10} color={colors.PrimaryColor} />
                                        <Text style={styles.tagText}>UPDATES</Text>
                                   </View>
                                   {item?.pinnedNews && (
                                        <View style={styles.pinnedBadge}>
                                             <MaterialIcons name="push-pin" size={9} color="#fff" />
                                             <Text style={styles.pinnedText}>PINNED</Text>
                                        </View>
                                   )}
                              </View>
                              <Text style={styles.cardTitle} numberOfLines={2}>
                                   {item.title}
                              </Text>

                              <Text style={[styles.cardDesc, { textAlign: isUrdu ? 'right' : 'left' }]} numberOfLines={3}>
                                   {item?.content}
                              </Text>

                              {item?.date && <Text style={styles.dateText}>{item.date}</Text>}
                         </View>
                    </View>
               </TouchableOpacity>
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
               <Skeleton height={200} width={windowWidth - 0} borderRadius={0} />
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
                                   : ({ item, index }) => <NewsCard item={item} index={index} onPress={selected => navigation.navigate('NewsDetail', { news: selected })} />
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
                                        <Text style={styles.headerTitle}>Latest Updates</Text>
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
     headerSection: { alignItems: 'center', paddingTop: 50, paddingBottom: 10 },
     headerTitle: { fontFamily: Font.font700, fontSize: 28, color: '#fff', letterSpacing: 1.5, textTransform: 'uppercase' },
     headerUrdu: { fontFamily: Font.font600, fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
     headerDivider: { width: 40, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)', marginTop: 12 },

     // Card
     cardWrapper: { marginTop: 12 },
     card: {
          borderRadius: 14,
          overflow: 'hidden',
          backgroundColor: colors.lightGreen,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.15)',
          elevation: 6,
     },
     accentBar: { height: 3, width: '100%' },
     cardRow: { flexDirection: 'row' },
     pinnedBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
          backgroundColor: colors.PrimaryColor,
          paddingHorizontal: 7,
          paddingVertical: 3,
          borderRadius: 20,
     },
     pinnedText: {
          fontFamily: Font.font700,
          fontSize: 9,
          color: '#fff',
          letterSpacing: 0.8,
     },

     // Tag
     tagRow: { flexDirection: 'row' },
     cardBody: { flex: 1, padding: 12, gap: 6, justifyContent: 'space-between' },
     tag: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: 'rgba(255,255,255,0.92)',
          paddingHorizontal: 9,
          paddingVertical: 3,
          borderRadius: 20,
          alignSelf: 'flex-start',
     },
     tagText: { fontFamily: Font.font700, fontSize: 10, color: colors.PrimaryColor, letterSpacing: 0.8 },
     cardTitle: { fontFamily: Font.font700, fontSize: 14, color: '#fff', lineHeight: 20 },
     cardDesc: { fontFamily: Font.font500, fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 18 },
     dateText: { fontFamily: Font.font600, fontSize: 11, color: colors.SecondaryColor },
     seeMore: { fontFamily: Font.font500, fontSize: 14, color: 'rgba(255,255,255,0.82)' },
     seeMoreBtn: { fontFamily: Font.font700, color: '#fff', textDecorationLine: 'underline' },
     seeLessBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
     seeLessText: { fontFamily: Font.font600, fontSize: 13, color: '#fff', textDecorationLine: 'underline' },
     // Media
     mediaBox: { width: 110, height: 128, position: 'relative' },
     thumbImg: { width: 110, height: 128 },
     playOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     playBtn: {
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: 'rgba(255,255,255,0.92)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     videoBadge: {
          position: 'absolute',
          bottom: 6,
          left: 6,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 4,
          paddingHorizontal: 6,
          paddingVertical: 2,
     },
     videoBadgeText: { fontFamily: Font.font700, fontSize: 9, color: '#fff', letterSpacing: 0.5 },
     placeholder: {
          width: 110,
          height: 128,
          backgroundColor: 'rgba(255,255,255,0.08)',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
     },
     placeholderText: { fontFamily: Font.font600, fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5 },

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

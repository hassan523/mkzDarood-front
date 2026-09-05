// NewsDetail.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList, Linking, StatusBar, Modal } from 'react-native';
import { useVideoPlayer, VideoView } from 'react-native-video';
import FastImage from '@d11/react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import GradientBG from '../../../components/GradientBG/GradientBG';

const { width: W, height: H } = Dimensions.get('window');

// ─── Video Player ─────────────────────────────────────────────────────────────
const VideoPlayer = ({ uri }: { uri: string }) => {
     const player = useVideoPlayer(uri, p => {
          p.pause();
     });
     return <VideoView player={player} style={styles.videoPlayer} controls />;
};

// ─── Full Screen Image Viewer Modal ──────────────────────────────────────────
const ImageViewerModal = ({ images, startIndex, visible, onClose }: { images: string[]; startIndex: number; visible: boolean; onClose: () => void }) => {
     const [activeImg, setActiveImg] = useState(startIndex);
     const flatRef = useRef<FlatList>(null);

     useEffect(() => {
          if (visible) {
               setActiveImg(startIndex);
               flatRef.current?.scrollToIndex({ index: startIndex, animated: false });
          }
     }, [visible, startIndex]);

     return (
          <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
               <View style={styles.modalRoot}>
                    <StatusBar barStyle="light-content" backgroundColor="#000" />

                    {/* Close btn */}
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose} activeOpacity={0.8}>
                         <MaterialIcons name="close" size={22} color="#fff" />
                    </TouchableOpacity>

                    {/* Counter */}
                    <View style={styles.modalCounter}>
                         <Text style={styles.modalCounterText}>
                              {activeImg + 1} / {images.length}
                         </Text>
                    </View>

                    {/* Paged images */}
                    <FlatList
                         ref={flatRef}
                         data={images}
                         horizontal
                         pagingEnabled
                         showsHorizontalScrollIndicator={false}
                         keyExtractor={(_, i) => i.toString()}
                         initialScrollIndex={startIndex}
                         getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
                         onMomentumScrollEnd={e => {
                              setActiveImg(Math.round(e.nativeEvent.contentOffset.x / W));
                         }}
                         renderItem={({ item }) => (
                              <View style={styles.modalImgContainer}>
                                   <FastImage source={{ uri: item, priority: FastImage.priority.high }} style={styles.modalImg} resizeMode={FastImage.resizeMode.contain} />
                              </View>
                         )}
                    />

                    {/* Dot indicators */}
                    {images.length > 1 && (
                         <View style={styles.modalDotRow}>
                              {images.map((_, i) => (
                                   <View key={i} style={[styles.dot, i === activeImg && styles.dotActive]} />
                              ))}
                         </View>
                    )}
               </View>
          </Modal>
     );
};

// ─── Image Grid Section ───────────────────────────────────────────────────────
const ImageGridSection = ({ images }: { images: string[] }) => {
     const [modalVisible, setModalVisible] = useState(false);
     const [startIdx, setStartIdx] = useState(0);

     console.log(startIdx);

     const openViewer = (i: number) => {
          setStartIdx(i);
          setModalVisible(true);
     };

     // Show max 6 in grid, last cell shows "+N more"
     const MAX_VISIBLE = 6;
     const gridImages = images.slice(0, MAX_VISIBLE);
     const remaining = images.length - MAX_VISIBLE;

     return (
          <>
               <View style={styles.gridSection}>
                    <Text style={styles.sectionLabel}>PHOTOS</Text>
                    <View style={styles.grid}>
                         {gridImages.map((uri, i) => {
                              const isLast = i === MAX_VISIBLE - 1 && remaining > 0;
                              return (
                                   <TouchableOpacity key={i} style={styles.gridCell} onPress={() => openViewer(i)} activeOpacity={0.8}>
                                        <FastImage
                                             source={{ uri, priority: FastImage.priority.normal, cache: FastImage.cacheControl.immutable }}
                                             style={styles.gridImg}
                                             resizeMode={FastImage.resizeMode.cover}
                                        />
                                        {isLast && (
                                             <View style={styles.moreOverlay}>
                                                  <Text style={styles.moreText}>+{remaining}</Text>
                                             </View>
                                        )}
                                   </TouchableOpacity>
                              );
                         })}
                    </View>
               </View>

               <ImageViewerModal images={images} startIndex={startIdx} visible={modalVisible} onClose={() => setModalVisible(false)} />
          </>
     );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const NewsDetail = ({ navigation, route }: { navigation: Navigation; route: any }) => {
     const news = route?.params?.news;
     const thumbnails: string[] = news?.thumbnail ?? [];
     const videos: string[] = news?.video ?? [];
     const hasButton = news?.button?.text && news?.button?.link;
     const heroImg = thumbnails[0];

     const formattedDate = news?.createdAt
          ? new Date(news.createdAt).toLocaleDateString('en-PK', {
                 day: 'numeric',
                 month: 'long',
                 year: 'numeric',
            })
          : '';

     const isUrdu = /[\u0600-\u06FF]/.test(news?.content);

     return (
          <View style={styles.root}>
               <StatusBar barStyle="light-content" backgroundColor={colors.PrimaryColor} />

               <ScrollView showsVerticalScrollIndicator={false} bounces>
                    {/* ── Hero Image (single thumbnail[0]) ── */}
                    {heroImg ? (
                         <View style={styles.heroWrapper}>
                              <FastImage
                                   source={{ uri: heroImg, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable }}
                                   style={styles.heroImg}
                                   resizeMode={FastImage.resizeMode.cover}
                              />
                              <LinearGradient colors={['transparent', colors.PrimaryColor]} style={styles.heroGradient} />
                         </View>
                    ) : null}

                    <GradientBG style={[styles.gradient, heroImg ? { borderTopEndRadius: 24, borderTopStartRadius: 24, overflow: 'hidden', minHeight: H - 280 } : { minHeight: H }]} isBackgroundImage>
                         <View style={[styles.contentArea, !heroImg && { paddingTop: 80 }]}>
                              {/* tag + date */}
                              <View style={styles.metaRow}>
                                   <View style={styles.tag}>
                                        <MaterialIcons name="newspaper" size={11} color={colors.PrimaryColor} />
                                        <Text style={styles.tagText}>UPDATES</Text>
                                   </View>
                                   {formattedDate ? <Text style={styles.dateText}>{formattedDate}</Text> : null}
                              </View>

                              {/* title */}
                              <Text style={styles.title}>{news?.title}</Text>

                              {/* body */}
                              <Text style={[styles.body, { textAlign: isUrdu ? 'right' : 'left' }]}>{news?.content}</Text>

                              {/* ── Image Grid (all thumbnails, before videos) ── */}
                              {thumbnails.length > 0 && <ImageGridSection images={thumbnails} />}

                              {/* ── Videos ── */}
                              {videos.length > 0 && (
                                   <View style={styles.videoSection}>
                                        <Text style={styles.sectionLabel}>VIDEO</Text>
                                        {videos.map((uri, i) => (
                                             <View key={i} style={styles.videoWrapper}>
                                                  <VideoPlayer uri={uri} />
                                             </View>
                                        ))}
                                   </View>
                              )}

                              {/* ── CTA Button ── */}
                              {hasButton && (
                                   <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.8} onPress={() => Linking.openURL(news.button.link)}>
                                        <Text style={styles.ctaBtnText}>{news.button.text}</Text>
                                        <MaterialIcons name="open-in-new" size={16} color="#fff" />
                                   </TouchableOpacity>
                              )}
                         </View>
                    </GradientBG>

                    {/* ── Floating Back Button ── */}
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                         <MaterialIcons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
               </ScrollView>
          </View>
     );
};

export default NewsDetail;

const GRID_GAP = 3;
const GRID_CELL = (W - 36 - GRID_GAP * 2) / 3; // 3 columns, 18px side padding each

const styles = StyleSheet.create({
     root: { flex: 1, backgroundColor: colors.PrimaryColor },
     gradient: { borderRadius: 0, width: '100%' },

     // Hero
     heroWrapper: { width: W, height: 280, position: 'relative' },
     heroImg: { width: W, height: 280 },
     heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },

     // Dots (reused in modal)
     dotRow: { position: 'absolute', bottom: 14, alignSelf: 'center', flexDirection: 'row', gap: 5 },
     dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
     dotActive: { width: 18, borderRadius: 3, backgroundColor: '#fff' },

     // Content
     contentArea: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 40 },
     metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
     tag: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: 'rgba(255,255,255,0.92)',
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 20,
     },
     tagText: { fontFamily: Font.font700, fontSize: 10, color: colors.PrimaryColor, letterSpacing: 1 },
     dateText: { fontFamily: Font.font600, fontSize: 12, color: 'rgba(255,255,255,0.5)' },
     title: { fontFamily: Font.font700, fontSize: 22, color: '#fff', lineHeight: 30, marginBottom: 14 },
     body: { fontFamily: Font.font500, fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 24 },

     // Image Grid
     gridSection: { marginTop: 24 },
     grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP },
     gridCell: { width: GRID_CELL, height: GRID_CELL, borderRadius: 8, overflow: 'hidden' },
     gridImg: { width: '100%', height: '100%' },
     moreOverlay: {
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     moreText: { fontFamily: Font.font700, fontSize: 22, color: '#fff', textAlign: 'left' },

     // Full Screen Modal
     modalRoot: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
     modalCloseBtn: {
          position: 'absolute',
          top: 50,
          right: 16,
          zIndex: 10,
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     modalCounter: {
          position: 'absolute',
          top: 55,
          alignSelf: 'center',
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 4,
     },
     modalCounterText: { fontFamily: Font.font700, fontSize: 13, color: '#fff' },
     modalImgContainer: { width: W, height: H, justifyContent: 'center', alignItems: 'center' },
     modalImg: { width: W, height: H * 0.75 },
     modalDotRow: {
          position: 'absolute',
          bottom: 40,
          alignSelf: 'center',
          flexDirection: 'row',
          gap: 5,
     },

     // Video
     videoSection: { marginTop: 24 },
     sectionLabel: {
          fontFamily: Font.font700,
          fontSize: 11,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: 1.2,
          marginBottom: 10,
     },
     videoWrapper: { borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
     videoPlayer: { width: '100%', height: 210 },

     // CTA
     ctaBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 28,
          backgroundColor: colors.lightGreen,
          paddingVertical: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
     },
     ctaBtnText: { fontFamily: Font.font700, fontSize: 15, color: '#fff' },

     // Back
     backBtn: {
          position: 'absolute',
          top: 14,
          left: 16,
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: 'rgba(0,0,0,0.35)',
          alignItems: 'center',
          justifyContent: 'center',
     },
});

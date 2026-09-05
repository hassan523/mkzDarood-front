import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, FlatList, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../../utils/colors/colors';
import Font from '../../../utils/fonts/Font';
import Navigation from '../../../utils/NavigationProps/NavigationProps';
import GradientBG from '../../../components/GradientBG/GradientBG';
import Skeleton from '../../../components/SkeletonComp/Skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { windowWidth } from '../../../utils/dimensions/dimensions';
import { useDeleteHistoryHandler, useGetHistoryHandler } from '../../../model/History/History';
import { RefreshControl } from 'react-native-gesture-handler';
import DeleteAccountModal from '../../../components/DeleteModal/DeleteAccountModal';
import DeleteDaroodModal from '../../../components/DeleteModal/DeleteDaroodModal';
// import { useGetDaroodHistory } from '../../../model/Darood/DaroodModel';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DayRecord {
     _id: string;
     count: number;
     readDate: string;
     createdAt: string;
     updatedAt: string;
     isToday?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

const formatDate = (d: Date) => {
     const yyyy = d.getFullYear();
     const mm = String(d.getMonth() + 1).padStart(2, '0');
     const dd = String(d.getDate()).padStart(2, '0');
     return `${yyyy}-${mm}-${dd}`;
};

const displayDate = (readDate: string) => {
     const d = new Date(readDate);
     return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
};

const dayName = (readDate: string) => {
     const d = new Date(readDate);
     return d.toLocaleDateString('en-PK', { weekday: 'short' });
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ total, days, best, avg }: { total: number; days: number; best: number; avg: number }) => (
     <View style={summaryStyles.wrap}>
          <SumItem icon="format-list-numbered" label="Total Darood" value={total.toLocaleString()} accent={colors.PrimaryColor} />
          <View style={summaryStyles.divider} />
          <SumItem icon="calendar-today" label="Days" value={String(days)} accent="#E58B06" />
          <View style={summaryStyles.divider} />
          <SumItem icon="star-outline" label="Best Day" value={best.toLocaleString()} accent="#349F92" />
          <View style={summaryStyles.divider} />
          <SumItem icon="show-chart" label="Daily Avg" value={Math.round(avg).toLocaleString()} accent="#8B5CF6" />
     </View>
);

const SumItem = ({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string }) => (
     <View style={summaryStyles.item}>
          <View style={[summaryStyles.iconBox, { backgroundColor: accent + '18' }]}>
               <MaterialIcons name={icon as any} size={16} color={accent} />
          </View>
          <Text style={summaryStyles.value}>{value}</Text>
          <Text style={summaryStyles.label}>{label}</Text>
     </View>
);

const summaryStyles = StyleSheet.create({
     wrap: {
          flexDirection: 'row',
          backgroundColor: '#fff',
          borderRadius: 18,
          marginHorizontal: 16,
          marginTop: -24,
          paddingVertical: 16,
          paddingHorizontal: 8,
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.14,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
     },
     item: { flex: 1, alignItems: 'center', gap: 4 },
     iconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
     value: { fontFamily: Font.font700, fontSize: 15, color: '#1a1a1a' },
     label: { fontFamily: Font.font500 || Font.font600, fontSize: 10, color: 'rgba(77,77,77,0.6)', textAlign: 'center' },
     divider: { width: 1, backgroundColor: '#e5e5e5', marginVertical: 6 },
});

// ─── Day Row ──────────────────────────────────────────────────────────────────
const DayRow = ({ item, maxCount, onDelete }: { item: DayRecord; maxCount: number; onDelete: (id: string) => void }) => {
     const barAnim = useRef(new Animated.Value(0)).current;
     const slideAnim = useRef(new Animated.Value(0)).current;
     const fadeAnim = useRef(new Animated.Value(1)).current;
     const [expanded, setExpanded] = useState(false);

     const DELETE_W = 72;
     const barWidth = Math.min((item.count / maxCount) * 100, 100);

     useEffect(() => {
          Animated.timing(barAnim, {
               toValue: barWidth,
               duration: 600,
               delay: 100,
               useNativeDriver: false,
          }).start();
     }, []);

     const openSlide = () => {
          setExpanded(true);
          Animated.spring(slideAnim, { toValue: -DELETE_W, useNativeDriver: true, bounciness: 5 }).start();
     };

     const closeSlide = () => {
          Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 5 }).start(() => setExpanded(false));
     };

     const handleDelete = async () => {
          // await handleDeleteHistory({ historyId: item._id });
          // console.log(item?._id);
          // Animated.parallel([Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }), Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true })]).start(
          //      () => ,
          // );
          onDelete(item._id);
     };

     return (
          <Animated.View style={{ opacity: fadeAnim, overflow: 'hidden' }}>
               <TouchableOpacity activeOpacity={1} onPress={expanded ? closeSlide : undefined} onLongPress={openSlide} delayLongPress={250}>
                    <View>
                         {/* Delete slot behind */}
                         <View style={dayRowStyles.deleteSlot}>
                              <TouchableOpacity style={dayRowStyles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
                                   <MaterialIcons name="delete-outline" color="#fff" size={20} />
                                   <Text style={dayRowStyles.deleteTxt}>Delete</Text>
                              </TouchableOpacity>
                         </View>

                         {/* Sliding main row */}
                         <Animated.View
                              style={[dayRowStyles.wrap, item.isToday && dayRowStyles.todayWrap, { transform: [{ translateX: slideAnim }], backgroundColor: item.isToday ? '#fff' : '#fff' }]}
                         >
                              {/* Left: day + date */}
                              <View style={dayRowStyles.dateCol}>
                                   <Text style={[dayRowStyles.dayName, item.isToday && { color: colors.PrimaryColor }]}>{item.isToday ? 'Today' : dayName(item.readDate)}</Text>
                                   <Text style={dayRowStyles.dateStr}>{displayDate(item.readDate)}</Text>
                              </View>

                              {/* Middle: bar */}
                              <View style={dayRowStyles.barWrap}>
                                   <Animated.View
                                        style={[
                                             dayRowStyles.bar,
                                             {
                                                  width: barAnim.interpolate({
                                                       inputRange: [0, 100],
                                                       outputRange: ['0%', '100%'],
                                                  }),
                                                  backgroundColor: item.isToday ? colors.PrimaryColor : colors.lightGreen,
                                             },
                                        ]}
                                   />
                              </View>

                              {/* Right: count + trash toggle */}
                              <View style={dayRowStyles.countCol}>
                                   <View style={{ alignItems: 'flex-end', gap: 2 }}>
                                        <Text style={[dayRowStyles.count, item.isToday && { color: colors.PrimaryColor }]}>{item.count.toLocaleString()}</Text>
                                   </View>
                                   <TouchableOpacity
                                        onPress={expanded ? closeSlide : openSlide}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        activeOpacity={0.7}
                                        style={dayRowStyles.trashIcon}
                                   >
                                        <MaterialIcons name={expanded ? 'close' : 'delete-outline'} color={expanded ? colors.PrimaryColor : '#bbb'} size={18} />
                                   </TouchableOpacity>
                              </View>
                         </Animated.View>
                    </View>
               </TouchableOpacity>
          </Animated.View>
     );
};

const dayRowStyles = StyleSheet.create({
     wrap: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#c5c5c520',
     },
     todayWrap: {
          backgroundColor: '#fff',
     },
     dateCol: { width: 70 },
     dayName: { fontFamily: Font.font700, fontSize: 13, color: '#1a1a1a' },
     dateStr: { fontFamily: Font.font500 || Font.font600, fontSize: 10, color: 'rgba(77,77,77,0.55)', marginTop: 1 },
     barWrap: {
          flex: 1,
          height: 8,
          backgroundColor: '#e8f5f3',
          borderRadius: 4,
          overflow: 'hidden',
     },
     bar: { height: '100%', borderRadius: 4 },
     countCol: { width: 68, alignItems: 'center', flexDirection: 'row', gap: 6, justifyContent: 'flex-end' },
     count: { fontFamily: Font.font700, fontSize: 14, color: '#333' },
     todayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.PrimaryColor, marginBottom: 2 },
     trashIcon: { padding: 2 },
     deleteSlot: {
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 72,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FF4D4D',
     },
     deleteBtn: { alignItems: 'center', justifyContent: 'center', gap: 3, paddingHorizontal: 8 },
     deleteTxt: { fontFamily: Font.font700, fontSize: 10, color: '#fff', letterSpacing: 0.5 },
});

// ─── Date Picker Button ───────────────────────────────────────────────────────
const DateBtn = ({ label, value, onPress }: { label: string; value: Date; onPress: () => void }) => (
     <TouchableOpacity style={dateBtnStyles.btn} onPress={onPress} activeOpacity={0.8}>
          <MaterialIcons name="calendar-today" size={14} color={colors.PrimaryColor} />
          <View>
               <Text style={dateBtnStyles.label}>{label}</Text>
               <Text style={dateBtnStyles.value}>{value.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
          </View>
     </TouchableOpacity>
);

const dateBtnStyles = StyleSheet.create({
     btn: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#fff',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: '#e0eeec',
     },
     label: { fontFamily: Font.font500 || Font.font600, fontSize: 10, color: 'rgba(77,77,77,0.55)' },
     value: { fontFamily: Font.font700, fontSize: 13, color: '#1a1a1a' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const History = ({ navigation }: { navigation: Navigation }) => {
     const today = new Date();
     const thirtyDaysAgo = new Date();
     thirtyDaysAgo.setDate(today.getDate() - 30);

     const [fromDate, setFromDate] = useState({
          thirtyDaysAgo: thirtyDaysAgo,
          updatedThirtyDaysAgo: null as Date | null,
     });
     const [toDate, setToDate] = useState({
          today: today,
          updatedToday: null as Date | null,
     });
     const [showFromPicker, setShowFromPicker] = useState(false);
     const [showToPicker, setShowToPicker] = useState(false);
     // ── Pagination state ──
     const [page, setPage] = useState(1);
     const [loadingMore, setLoadingMore] = useState(false);
     const [refreshing, setRefresing] = useState(false);

     const selector = useSelector((state: RootState) => state?.userData);
     const Token = selector?.data?.accessToken;
     const userId = selector?.data?.user?._id ?? '';

     // Handle API
     const GetHistory = useGetHistoryHandler({
          from: fromDate.updatedThirtyDaysAgo ? (fromDate.updatedThirtyDaysAgo as any)?.toISOString()?.split('T')[0] : undefined,
          to: toDate.updatedToday ? (toDate.updatedToday as any)?.toISOString()?.split('T')[0] : toDate.today.toISOString().split('T')[0],
          limit: 4,
          page: page,
          userId,
     });
     const allRecords: DayRecord[] = GetHistory?.data?.history?.[0]?.histories ?? [];
     const meta = GetHistory?.data?.meta;
     const totalPages: number = GetHistory?.data?.meta?.totalPages || 1;
     const isLoadingData = GetHistory?.isLoading;
     const isFetchingData = GetHistory?.isFetching;
     const refetch = GetHistory?.refetch;

     // Handle API
     const { handleDeleteHistory, isLoading } = useDeleteHistoryHandler();

     const [deleteModal, setDeleteModal] = useState({
          deleteId: '',
          isDelete: false,
     });
     const [localHistory, setLocalHistory] = useState<DayRecord[]>([]);

     // ── Date reset pe page 1 ──
     useEffect(() => {
          setPage(1);
          setLocalHistory([]);
     }, [fromDate, toDate]);

     useEffect(() => {
          if (!allRecords?.length || isFetchingData) return;

          setLocalHistory(prev => {
               const combined = page === 1 ? allRecords : [...prev, ...allRecords];

               return combined.filter((item, index, self) => index === self.findIndex(t => t?._id === item?._id));
          });
     }, [allRecords, page]);

     // ── Paginated slice (local mock ke liye) ──
     const hasMore = (meta?.totalItems ?? 0) > localHistory.length;

     // ── Load more ──
     const loadMore = () => {
          if (loadingMore || isFetchingData) return;

          if (page >= totalPages) return;

          setLoadingMore(true);

          setPage(prev => prev + 1);

          setTimeout(() => {
               setLoadingMore(false);
          }, 300);
     };

     // ── Refresh ──
     const onRefresh = async () => {
          try {
               setRefresing(true);
               setPage(1);
               setLocalHistory([]);
               refetch?.();
               await refetch?.();

               setRefresing(false);
          } catch {
               setRefresing(false);
          }
     };
     const handleSaveDeleteID = (id: string) => {
          setDeleteModal(prev => ({ ...prev, deleteId: id, isDelete: true }));
     };

     const handleDeleteRecord = async () => {
          await handleDeleteHistory({ historyId: deleteModal.deleteId });
          setDeleteModal(prev => ({ ...prev, deleteId: '', isDelete: false }));

          // TODO: call delete API — deleteRecord({ Token, id });
          setLocalHistory(prev => prev.filter(r => r._id !== deleteModal.deleteId));
     };

     // ── Stats (full filtered set pe, not paginated) ──
     const total = (GetHistory?.data as any)?.filterTotal;
     const best = localHistory.length ? Math.max(...localHistory.map(r => r.count)) : 0;
     const avg = localHistory.length ? total / (meta?.totalItems ?? 0) : 0;
     const maxCount = best || 1;

     // ─── List Header ─────────────────────────────────────────────────────────
     const ListHeader = () => (
          <>
               {/* Gradient Header */}
               <GradientBG style={styles.gradientHeader} isBackgroundImage imgStyle={{ justifyContent: 'center' }}>
                    <View style={styles.topRow}>
                         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
                              <MaterialIcons name="arrow-back" color="#fff" size={20} />
                         </TouchableOpacity>
                         <Text style={styles.screenTitle}>Darood History</Text>
                         <View style={{ width: 38 }} />
                    </View>

                    <View style={styles.heroWrap}>
                         <Text style={styles.arabicText}>صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّم</Text>
                         <Text style={styles.heroSub}>Track your daily Darood journey</Text>
                    </View>

                    <View style={styles.filterRow}>
                         <DateBtn label="FROM" value={fromDate.thirtyDaysAgo} onPress={() => setShowFromPicker(true)} />
                         <MaterialIcons name="arrow-forward" color="rgba(255,255,255,0.7)" size={18} />
                         <DateBtn label="TO" value={toDate.today} onPress={() => setShowToPicker(true)} />
                         {(fromDate.updatedThirtyDaysAgo || toDate.updatedToday) && (
                              <TouchableOpacity
                                   onPress={() => {
                                        setFromDate({ updatedThirtyDaysAgo: null, thirtyDaysAgo: thirtyDaysAgo });
                                        setToDate({ updatedToday: null, today: today });
                                   }}
                                   style={{ padding: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)' }}
                                   activeOpacity={0.8}
                              >
                                   <MaterialIcons name="refresh" color="rgba(255,255,255,0.7)" size={18} />
                              </TouchableOpacity>
                         )}
                    </View>
               </GradientBG>

               {/* Summary Card */}
               {isLoadingData ? (
                    <View style={{ marginHorizontal: 16, marginTop: -24 }}>
                         <Skeleton width={windowWidth - 32} height={90} borderRadius={18} />
                    </View>
               ) : (
                    <SummaryCard total={total} days={meta?.totalItems ?? 0} best={best} avg={avg} />
               )}

               {/* List Card Top (header row only, rounded top) */}
               <View style={styles.listCardTop}>
                    <View style={styles.listHeader}>
                         <Text style={styles.listTitle}>Daily Breakdown</Text>
                         <Text style={styles.listCount}>{meta?.totalItems ?? 0} days</Text>
                    </View>
               </View>

               {/* Skeleton rows */}
               {isLoadingData &&
                    Array(6)
                         .fill(0)
                         .map((_, i) => (
                              <View key={i} style={styles.skeletonRow}>
                                   <Skeleton width={windowWidth - 64} height={40} borderRadius={8} />
                              </View>
                         ))}
          </>
     );

     // ─── List Footer ──────────────────────────────────────────────────────────
     const ListFooter = () => {
          if (localHistory.length === 0) return null;
          return (
               <View style={styles.listCardBottom}>
                    {loadingMore || isFetchingData ? (
                         <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                              <Skeleton width={120} height={20} borderRadius={8} />
                         </View>
                    ) : hasMore ? (
                         <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore} activeOpacity={0.8}>
                              <MaterialIcons name="expand-more" size={18} color={colors.PrimaryColor} />
                              <Text style={styles.loadMoreTxt}>Load More</Text>
                         </TouchableOpacity>
                    ) : (
                         <View style={styles.allLoadedRow}>
                              <View style={styles.allLoadedLine} />
                              <Text style={styles.allLoadedTxt}>All records loaded</Text>
                              <View style={styles.allLoadedLine} />
                         </View>
                    )}
               </View>
          );
     };

     // ─── Empty State ──────────────────────────────────────────────────────────
     const ListEmpty = () => {
          if (isLoadingData) return null;
          return (
               <View style={styles.listCardBottom}>
                    <View style={styles.emptyWrap}>
                         <Ionicons name="calendar-outline" size={48} color={colors.PrimaryColor + '50'} />
                         <Text style={styles.emptyTitle}>No records found</Text>
                         <Text style={styles.emptySub}>Try changing the date range</Text>
                    </View>
               </View>
          );
     };

     return (
          <View style={{ flex: 1, backgroundColor: '#f4f0f0' }}>
               <FlatList
                    data={isLoadingData ? [] : localHistory}
                    keyExtractor={item => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    ListHeaderComponent={ListHeader}
                    ListFooterComponent={ListFooter}
                    ListEmptyComponent={ListEmpty}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PrimaryColor]} />}
                    renderItem={({ item }) => (
                         <View style={styles.rowWrapper}>
                              <DayRow
                                   item={item}
                                   maxCount={maxCount}
                                   onDelete={
                                        // handleDeleteRecord
                                        (id: string) => handleSaveDeleteID(id)
                                   }
                              />
                         </View>
                    )}
               />
               <DeleteDaroodModal
                    visible={deleteModal.isDelete}
                    onClose={() => setDeleteModal({ deleteId: '', isDelete: false })}
                    onConfirm={() => {
                         // apna delete API call yahan
                         handleDeleteRecord();
                    }}
                    isLoading={isLoading}
                    requireConfirmText={true} // false karo agar confirm typing nahi chahiye
               />
               {/* Date Pickers */}
               {showFromPicker && (
                    <DateTimePicker
                         value={fromDate.thirtyDaysAgo}
                         mode="date"
                         display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                         maximumDate={toDate.today}
                         onValueChange={(_, date) => {
                              setShowFromPicker(false);
                              if (date) {
                                   setFromDate({ updatedThirtyDaysAgo: date, thirtyDaysAgo: date });
                              }
                         }}
                         themeVariant="light"
                    />
               )}
               {showToPicker && (
                    <DateTimePicker
                         value={toDate.today}
                         mode="date"
                         display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                         minimumDate={fromDate.thirtyDaysAgo}
                         maximumDate={new Date()}
                         onValueChange={(_, date) => {
                              setShowToPicker(false);
                              if (date) {
                                   setToDate({ updatedToday: date, today: date });
                              }
                         }}
                         themeVariant="light"
                    />
               )}
          </View>
     );
};

export default History;

const styles = StyleSheet.create({
     gradientHeader: {
          borderBottomRightRadius: 24,
          borderBottomLeftRadius: 24,
          paddingTop: 14,
          paddingBottom: 44,
     },
     topRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginBottom: 16,
     },
     backBtn: {
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     screenTitle: {
          fontFamily: Font.font700,
          fontSize: 18,
          color: '#fff',
          letterSpacing: 0.3,
     },
     heroWrap: { alignItems: 'center', gap: 6, marginBottom: 20 },
     arabicText: {
          fontFamily: Font.font700,
          fontSize: 18,
          color: '#fff',
          textAlign: 'center',
          letterSpacing: 1,
     },
     heroSub: {
          fontFamily: Font.font500 || Font.font600,
          fontSize: 13,
          color: 'rgba(255,255,255,0.65)',
     },
     filterRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 16,
     },

     // ── List Card (split into top / middle / bottom for seamless look) ──
     listCardTop: {
          marginHorizontal: 16,
          marginTop: 16,
          backgroundColor: '#fff',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
     },
     listHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#c5c5c530',
     },
     listTitle: {
          fontFamily: Font.font700,
          fontSize: 16,
          color: colors.PrimaryColor,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
     },
     listCount: {
          fontFamily: Font.font600,
          fontSize: 12,
          color: 'rgba(77,77,77,0.5)',
          backgroundColor: '#f0f0f0',
          paddingHorizontal: 10,
          paddingVertical: 3,
          borderRadius: 100,
     },

     // Row wrapper (middle section — no border radius)
     rowWrapper: {
          marginHorizontal: 16,
          backgroundColor: '#fff',
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.06,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
     },

     // Bottom card (footer / empty)
     listCardBottom: {
          marginHorizontal: 16,
          backgroundColor: '#fff',
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
          overflow: 'hidden',
     },

     // Load More
     loadMoreBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          paddingVertical: 14,
     },
     loadMoreTxt: {
          fontFamily: Font.font700,
          fontSize: 13,
          color: colors.PrimaryColor,
     },

     // All Loaded
     allLoadedRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 16,
          gap: 8,
     },
     allLoadedLine: { flex: 1, height: 1, backgroundColor: '#e5e5e5' },
     allLoadedTxt: {
          fontFamily: Font.font500 || Font.font600,
          fontSize: 11,
          color: 'rgba(77,77,77,0.45)',
     },

     // Skeleton row
     skeletonRow: {
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: '#fff',
          marginHorizontal: 16,
     },

     // Empty
     emptyWrap: { alignItems: 'center', paddingVertical: 40, gap: 8 },
     emptyTitle: { fontFamily: Font.font700, fontSize: 16, color: '#1a1a1a' },
     emptySub: { fontFamily: Font.font500 || Font.font600, fontSize: 13, color: 'rgba(77,77,77,0.6)' },
});

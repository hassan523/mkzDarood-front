import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Modal, TextInputProps, ViewStyle, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Font from '../../utils/fonts/Font';
import colors from '../../utils/colors/colors';

interface Prediction {
     place_id: string;
     description: string;
     types: string[];
}

interface AddressAutocompleteProps {
     value: string;
     onChangeText: (text: string) => void;
     label?: string;
     type?: 'country' | 'city';
     placeholder?: string;
     apiKey: string;
     iconName?: string;
     style?: ViewStyle;
     inputProps?: Partial<TextInputProps>;
     setCountryCode?: (code: string | null) => void;
     countryCode?: string | null;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
     value,
     type = 'city',
     setCountryCode,
     countryCode,
     onChangeText,
     placeholder = 'Select',
     apiKey,
     iconName = 'city',
     style,
     inputProps,
}) => {
     const [modalVisible, setModalVisible] = useState(false);
     const [searchText, setSearchText] = useState('');
     const [suggestions, setSuggestions] = useState<Prediction[]>([]);
     const [loading, setLoading] = useState(false);
     const searchInputRef = useRef<TextInput>(null);

     // GET COUNTRY CODE
     const getCountryCode = async (placeId: string) => {
          try {
               const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`);
               const data = await res.json();
               const country = data.result.address_components.find((c: any) => c.types.includes('country'));
               return country?.short_name.toLowerCase() ?? null;
          } catch {
               return null;
          }
     };

     // FETCH SUGGESTIONS
     const fetchPlaceSuggestions = async (input: string) => {
          if (input.length < 2) {
               setSuggestions([]);
               return;
          }

          setLoading(true);
          try {
               let url = '';
               if (type === 'country') {
                    url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(regions)&key=${apiKey}`;
               } else {
                    url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(cities)${
                         countryCode ? `&components=country:${countryCode}` : ''
                    }&key=${apiKey}`;
               }

               const response = await fetch(url);
               const data = await response.json();

               if (data.predictions) {
                    let result = data.predictions;
                    if (type === 'country') {
                         result = result.filter((item: Prediction) => item.types.includes('country'));
                    }
                    setSuggestions(result);
               }
          } catch (error) {
               console.log('Autocomplete error:', error);
          } finally {
               setLoading(false);
          }
     };

     // LOAD DEFAULT (city mode) on modal open
     const handleOpenModal = () => {
          setSearchText('');
          setSuggestions([]);
          setModalVisible(true);

          // default load for city
          if (type === 'city') {
               fetchPlaceSuggestions('pakistan');
          }

          setTimeout(() => searchInputRef.current?.focus(), 300);
     };

     // HANDLE SELECT
     const handleSelect = async (item: Prediction) => {
          onChangeText(item.description);

          if (type === 'country') {
               const code = await getCountryCode(item.place_id);
               setCountryCode?.(code);
          }

          setModalVisible(false);
          setSuggestions([]);
          setSearchText('');
     };

     const handleClose = () => {
          setModalVisible(false);
          setSuggestions([]);
          setSearchText('');
     };

     return (
          <View style={[styles.container, style]}>
               {/* TRIGGER BUTTON */}
               <TouchableOpacity style={styles.triggerButton} onPress={handleOpenModal} activeOpacity={0.7}>
                    <Text style={[styles.triggerText, !value && styles.placeholder]}>{value || placeholder}</Text>
                    <Icon name="chevron-down" size={20} color={colors.textColor + '80'} />
               </TouchableOpacity>

               {/* MODAL */}
               <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={handleClose}>
                    <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                         <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

                         <View style={styles.modalContainer}>
                              <SafeAreaView>
                                   {/* HEADER */}
                                   <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>{type === 'country' ? 'Select Country' : 'Select City'}</Text>
                                        <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                             <Icon name="close" size={22} color={colors.SecTextColor} />
                                        </TouchableOpacity>
                                   </View>

                                   {/* SEARCH BAR */}
                                   <View style={styles.searchWrapper}>
                                        <Icon name="magnify" size={20} color={colors.textColor + '80'} />
                                        <TextInput
                                             ref={searchInputRef}
                                             style={styles.searchInput}
                                             placeholder={`Search ${type === 'country' ? 'country' : 'city'}...`}
                                             placeholderTextColor={colors.textColor + '60'}
                                             value={searchText}
                                             onChangeText={text => {
                                                  setSearchText(text);
                                                  fetchPlaceSuggestions(text);
                                             }}
                                             {...inputProps}
                                        />
                                        {loading && <ActivityIndicator size="small" color={colors.SecTextColor} />}
                                        {!loading && searchText.length > 0 && (
                                             <TouchableOpacity
                                                  onPress={() => {
                                                       setSearchText('');
                                                       setSuggestions([]);
                                                  }}
                                             >
                                                  <Icon name="close-circle" size={18} color={colors.textColor + '60'} />
                                             </TouchableOpacity>
                                        )}
                                   </View>

                                   {/* LIST */}
                                   <ScrollView keyboardShouldPersistTaps="handled" style={styles.listContainer} showsVerticalScrollIndicator={false}>
                                        {suggestions.length === 0 && !loading && searchText.length >= 2 && (
                                             <View style={styles.emptyState}>
                                                  <Icon name="map-search-outline" size={36} color="#ccc" />
                                                  <Text style={styles.emptyText}>No results found</Text>
                                             </View>
                                        )}

                                        {suggestions.map(item => (
                                             <TouchableOpacity key={item.place_id} style={styles.suggestionItem} onPress={() => handleSelect(item)}>
                                                  <Icon name="map-marker-outline" size={18} color="#6B7280" />
                                                  <Text style={styles.suggestionText} numberOfLines={2}>
                                                       {item.description}
                                                  </Text>
                                             </TouchableOpacity>
                                        ))}
                                   </ScrollView>
                              </SafeAreaView>
                         </View>
                    </KeyboardAvoidingView>
               </Modal>
          </View>
     );
};

export default AddressAutocomplete;

const styles = StyleSheet.create({
     container: { width: '100%' },

     // TRIGGER
     triggerButton: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderColor: 'rgba(255,255,255,0.3)',
          borderWidth: 1,
          borderRadius: 5,
          paddingHorizontal: 12,
          paddingVertical: 13,
          backgroundColor: '#f7fafa',
     },
     triggerText: {
          flex: 1,
          color: colors.SecTextColor,
          fontFamily: Font.font500,
          fontSize: 16,
     },
     placeholder: {
          color: colors.textColor + '80',
     },

     // MODAL
     modalOverlay: {
          flex: 1,
          justifyContent: 'flex-end',
     },
     backdrop: {
          ...StyleSheet.absoluteFill,
          backgroundColor: 'rgba(0,0,0,0.4)',
     },
     modalContainer: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          maxHeight: '75%',
     },
     modalHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
     },
     modalTitle: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: colors.SecTextColor,
     },

     // SEARCH
     searchWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#f7fafa',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          paddingHorizontal: 12,
          marginBottom: 8,
     },
     searchInput: {
          flex: 1,
          height: 44,
          color: colors.SecTextColor,
          fontFamily: Font.font500,
          fontSize: 15,
     },

     // LIST
     listContainer: {
          maxHeight: 320,
     },
     suggestionItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingVertical: 14,
          paddingHorizontal: 4,
          borderBottomWidth: 1,
          borderBottomColor: '#f3f4f6',
     },
     suggestionText: {
          flex: 1,
          color: '#374151',
          fontSize: 14,
          fontFamily: Font.font500,
     },
     emptyState: {
          alignItems: 'center',
          paddingVertical: 32,
          gap: 8,
     },
     emptyText: {
          color: '#9ca3af',
          fontSize: 14,
     },
});

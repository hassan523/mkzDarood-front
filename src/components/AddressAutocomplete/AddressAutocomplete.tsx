import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, TextInputProps, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Font from '../../utils/fonts/Font';

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
     placeholder = 'Enter',
     apiKey,
     iconName = 'city',
     style,
     inputProps,
}) => {
     const [suggestions, setSuggestions] = useState<Prediction[]>([]);
     const [showSuggestions, setShowSuggestions] = useState(false);
     const [loading, setLoading] = useState(false);
     const [isTyping, setIsTyping] = useState(false);

     // 🔥 GET COUNTRY CODE
     const getCountryCode = async (placeId: string) => {
          try {
               const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`);
               const data = await res.json();

               const country = data.result.address_components.find((c: any) => c.types.includes('country'));

               return country?.short_name.toLowerCase(); // pk, in
          } catch (e) {
               return null;
          }
     };

     // 🔥 FETCH SUGGESTIONS
     const fetchPlaceSuggestions = async (input: string) => {
          if (input.length < 3) {
               setSuggestions([]);
               setShowSuggestions(false);
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

                    // 🔥 filter only countries
                    if (type === 'country') {
                         result = result.filter((item: Prediction) => item.types.includes('country'));
                    }

                    setSuggestions(result);
                    if (isTyping) setShowSuggestions(true);
               }
          } catch (error) {
               console.log('Error:', error);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (type != 'country') fetchPlaceSuggestions('pakistan');
     }, []);

     // 🔥 HANDLE SELECT
     const handleSelect = async (item: Prediction) => {
          onChangeText(item.description);

          if (type === 'country') {
               const code = await getCountryCode(item.place_id);
               setCountryCode?.(code);
          }

          setShowSuggestions(false);
          setSuggestions([]);
     };

     return (
          <View style={[styles.container, style]}>
               <View style={styles.inputWrapper}>
                    <Icon name={iconName} size={18} color="#fff" />
                    <TextInput
                         style={styles.input}
                         placeholder={placeholder}
                         placeholderTextColor="#fff"
                         value={value}
                         onChangeText={text => {
                              onChangeText(text);
                              fetchPlaceSuggestions(text);
                              setIsTyping(true);
                              setTimeout(() => setIsTyping(false), 1000);
                         }}
                         {...inputProps}
                    />
                    {loading && <ActivityIndicator size="small" color="#fff" />}
               </View>

               {showSuggestions && suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                         <ScrollView keyboardShouldPersistTaps="handled">
                              {suggestions.map(item => (
                                   <TouchableOpacity key={item.place_id} style={styles.suggestionItem} onPress={() => handleSelect(item)}>
                                        <Icon name="map-marker" size={16} color="#6B7280" />
                                        <Text style={styles.suggestionText}>{item.description}</Text>
                                   </TouchableOpacity>
                              ))}
                         </ScrollView>
                    </View>
               )}
          </View>
     );
};

export default AddressAutocomplete;

const styles = StyleSheet.create({
     container: { width: '100%' },

     inputWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          borderColor: 'rgba(255,255,255,0.3)',
          borderWidth: 1,
          borderRadius: 5,
          paddingHorizontal: 10,
          backgroundColor: 'rgba(255,255,255,0.15)',
     },

     input: {
          flex: 1,
          height: 48,
          color: '#fff',
          fontFamily: Font.font500,
          fontSize: 16,
          paddingLeft: 10,
     },

     suggestionsContainer: {
          marginTop: 5,
          backgroundColor: '#fff',
          borderRadius: 6,
          maxHeight: 250,
     },

     suggestionItem: {
          flexDirection: 'row',
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
     },

     suggestionText: {
          marginLeft: 8,
          color: '#333',
     },
});

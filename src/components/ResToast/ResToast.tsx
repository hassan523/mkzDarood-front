import { Easing, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Notifier } from 'react-native-notifier';
import colors from '../../utils/colors/colors';
import { windowWidth } from '../../utils/dimensions/dimensions';

interface ResToastProps {
     title?: string;
     res?: any;
     type?: 'warning' | 'success' | 'danger' | '';
}

const ResToast = ({ title, type, res }: ResToastProps) => {
     const toastComp = () => {
          const textColor = type === 'warning' ? '#f0ad4e' : type === 'danger' ? '#d9534f' : colors.PrimaryColor;

          return res ? (
               (res.error as any).data.details ? (
                    (res.error as any).data.details.map((detail: string, index: number) => (
                         <View key={index} style={{ justifyContent: 'center', alignItems: 'center' }}>
                              <View
                                   style={{
                                        padding: 20,
                                        backgroundColor: 'white',
                                        marginTop: 50,
                                        width: windowWidth - 20,
                                        borderRadius: 10,
                                        elevation: 5,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                   }}
                              >
                                   <Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>{detail}</Text>
                              </View>
                         </View>
                    ))
               ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                         <View
                              style={{
                                   padding: 20,
                                   backgroundColor: 'white',
                                   marginTop: 50,
                                   width: windowWidth - 20,
                                   borderRadius: 10,
                                   elevation: 5,
                                   shadowColor: '#000',
                                   shadowOffset: { width: 0, height: 2 },
                                   shadowOpacity: 0.25,
                                   shadowRadius: 3.84,
                              }}
                         >
                              <Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>{(res.error as any).data.message}</Text>
                         </View>
                    </View>
               )
          ) : (
               <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View
                         style={{
                              padding: 20,
                              backgroundColor: 'white',
                              marginTop: 50,
                              width: windowWidth - 20,
                              borderRadius: 10,
                              elevation: 5,
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.25,
                              shadowRadius: 3.84,
                         }}
                    >
                         <Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>{title}</Text>
                    </View>
               </View>
          );
     };

     return Notifier.showNotification({
          duration: 3000,
          showAnimationDuration: 800,
          showEasing: Easing.linear,
          hideOnPress: false,
          Component: toastComp,
     });
};

export default ResToast;

const styles = StyleSheet.create({});

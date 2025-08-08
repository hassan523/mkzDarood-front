import React, { useRef, useState } from 'react';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import colors from '../utils/colors/colors';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Font from '../utils/fonts/Font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/User/Home/Home';
import Profile from '../screens/User/Profile/Profile';
import News from '../screens/User/News/News';
import Tasbih from '../screens/User/Home/Tasbih/Tasbih';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Login from '../screens/Auth/LoginScreen/Login';
import Signup from '../screens/Auth/SignupScreen/Signup';
import Otp from '../screens/Auth/OtpScreen/Otp';
import NewPassword from '../screens/Auth/NewPassword/NewPassword';
import { logout } from '../redux/Features/authState';
import ModalLayout from '../layout/ModalLayout/ModalLayout';
import { useLogoutMutation } from '../redux/Auth/Auth';
import ResToast from '../components/ResToast/ResToast';
import AsmaulHusna from '../screens/User/Home/AsmaulHusna/AsmaulHusna';
import AsmaunNabi from '../screens/User/Home/AsmaunNabi/AsmaunNabi';

interface MainNavigation {
     initRoute: string;
}

const HomeStack = createStackNavigator();
const NewsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomHeader = ({ showDrawerButton = true, navigation }: { showDrawerButton?: boolean; navigation: any }) => {
     return (
          <View style={styles.headerContainer}>
               {showDrawerButton ? (
                    <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
                         <Ionicons name="menu" size={24} color={colors.SecondaryColor} />
                    </TouchableOpacity>
               ) : (
                    <View style={styles.menuButton} />
               )}
               <Image source={require('../assets/logo2.png')} style={{ width: 100, height: 40 }} resizeMode="contain" />
               <View style={styles.rightHeaderPlaceholder} />
          </View>
     );
};

function HomeStackScreen({ navigation }: { navigation: any }) {
     const selector = useSelector((state: RootState) => state?.userData);
     const isLogin: boolean = selector?.isLoggin;
     return (
          <HomeStack.Navigator
               screenOptions={{
                    header: ({ route }) => <CustomHeader navigation={navigation} showDrawerButton={route.name === 'Home'} />,
               }}
          >
               <HomeStack.Screen name="Home" component={Home} />
               <HomeStack.Screen name="Tasbih" component={Tasbih} options={{ headerShown: false }} />
               <HomeStack.Screen name="AsmaulHusna" component={AsmaulHusna} options={{ headerShown: false }} />
               <HomeStack.Screen name="AsmaunNabi" component={AsmaunNabi} options={{ headerShown: false }} />
               {!isLogin && (
                    <>
                         <HomeStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                         <HomeStack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
                         <HomeStack.Screen name="Otp" component={Otp as any} options={{ headerShown: false }} />
                         <HomeStack.Screen name="NewPassword" component={NewPassword} options={{ headerShown: false }} />
                    </>
               )}
          </HomeStack.Navigator>
     );
}

function NewsStackScreen({ navigation }: { navigation: any }) {
     return (
          <NewsStack.Navigator
               screenOptions={{
                    header: ({ route }) => <CustomHeader navigation={navigation} showDrawerButton={route.name === 'News'} />,
               }}
          >
               <NewsStack.Screen name="News" component={News} />
          </NewsStack.Navigator>
     );
}

function ProfileStackScreen({ navigation }: { navigation: any }) {
     return (
          <ProfileStack.Navigator
               screenOptions={{
                    header: ({ route }) => <CustomHeader navigation={navigation} showDrawerButton={route.name === 'Profile'} />,
               }}
          >
               <ProfileStack.Screen name="Profile" component={Profile} />
          </ProfileStack.Navigator>
     );
}

const MainNavigation = ({ initRoute }: MainNavigation) => {
     const dispatch = useDispatch();
     const selector = useSelector((state: RootState) => state?.userData);
     const isLogin: boolean = selector?.isLoggin;
     const [logoutAPI, { isLoading }] = useLogoutMutation();
     const navigationRef = useRef<any>(null);

     const handleLogout = async () => {
          try {
               const res = await logoutAPI({
                    token: (selector?.data?.user as any)?.refreshTokens[0]?.token || '',
                    deviceId: (selector?.data?.user as any)?.refreshTokens[0]?.deviceId || '',
               });

               if (!res.error) {
                    dispatch(logout());
                    return true;
               } else {
                    dispatch(logout());
                    // ResToast({
                    //      title: (res.error as any)?.data.message || 'Failed to logout please try again.',
                    //      type: 'danger',
                    // });
                    return true;
               }
          } catch (error) {
               console.error('Logout failed:', error);
               return false;
          }
     };

     const [showLogoutModal, setShowLogoutModal] = useState(false);
     const [drawerNavigation, setDrawerNavigation] = useState<any>(null);

     const handleLogoutSubmit = async () => {
          const success = await handleLogout();
          if (success) {
               drawerNavigation?.closeDrawer();
               setShowLogoutModal(false);
               setDrawerNavigation(null);
               navigationRef.current.navigate('Login');
          }
     };

     return (
          <NavigationContainer ref={navigationRef}>
               <ModalLayout isOpen={showLogoutModal} setIsOpen={setShowLogoutModal}>
                    <View style={styles.modalContent}>
                         <Text style={styles.modalTitle}>Logout Confirmation</Text>
                         <Text style={styles.modalText}>Are you sure you want to logout?</Text>

                         <View style={styles.buttonContainer}>
                              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowLogoutModal(false)}>
                                   <Text style={styles.buttonText}>Cancel</Text>
                              </TouchableOpacity>

                              <TouchableOpacity style={[styles.button, styles.logoutBtn]} onPress={handleLogoutSubmit} disabled={isLoading}>
                                   <Text style={styles.buttonText}>{isLoading ? 'Logging out...' : 'Logout'}</Text>
                              </TouchableOpacity>
                         </View>
                    </View>
               </ModalLayout>
               <Drawer.Navigator
                    drawerContent={props => (
                         <View style={styles.drawerContainer}>
                              <View style={styles.logoContainer}>
                                   <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                              </View>
                              <DrawerItemList {...props} />

                              {isLogin && (
                                   <TouchableOpacity
                                        style={styles.logoutButton}
                                        onPress={() => {
                                             setShowLogoutModal(true);
                                             setDrawerNavigation(props.navigation);
                                        }}
                                   >
                                        <View style={styles.logoutButtonContent}>
                                             <Ionicons name="log-out" color={colors.PrimaryColor} size={24} />
                                             <Text style={styles.logoutButtonText}>Logout</Text>
                                        </View>
                                   </TouchableOpacity>
                              )}
                         </View>
                    )}
                    screenOptions={{
                         headerShown: false,
                         drawerStyle: {
                              backgroundColor: colors.SecondaryColor,
                              width: 240,
                         },
                         drawerActiveBackgroundColor: colors.PrimaryColor,
                         drawerInactiveBackgroundColor: 'transparent',
                         drawerActiveTintColor: colors.SecondaryColor,
                         drawerInactiveTintColor: colors.PrimaryColor,
                         drawerLabelStyle: {
                              fontFamily: Font.font600,
                              fontSize: 16,
                              borderRadius: 0,
                         },
                         drawerItemStyle: {
                              borderRadius: 8,
                              marginHorizontal: 8,
                              marginVertical: 4,
                         },
                         drawerContentContainerStyle: {
                              paddingTop: 0,
                         },
                    }}
                    initialRouteName="HomeStackScreen"
               >
                    <Drawer.Screen
                         name="HomeStackScreen"
                         component={HomeStackScreen}
                         options={{
                              drawerLabel: 'Home',
                              drawerIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
                         }}
                    />
                    <Drawer.Screen
                         name="NewsStackScreen"
                         component={NewsStackScreen}
                         options={{
                              drawerLabel: 'News',
                              drawerIcon: ({ color, size }) => <Ionicons name="newspaper" color={color} size={size} />,
                         }}
                    />
                    {isLogin && (
                         <Drawer.Screen
                              name="ProfileStackScreen"
                              component={ProfileStackScreen}
                              options={{
                                   drawerLabel: 'Profile',
                                   drawerIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                              }}
                         />
                    )}
               </Drawer.Navigator>
          </NavigationContainer>
     );
};

const styles = StyleSheet.create({
     headerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
          height: 60,
          paddingHorizontal: 15,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
     },
     menuButton: {
          padding: 10,
          width: 44,
     },
     headerTitle: {
          color: colors.SecondaryColor,
          fontFamily: Font.font600,
          fontSize: 18,
          flex: 1,
          textAlign: 'center',
     },
     rightHeaderPlaceholder: {
          width: 44,
     },
     tab: {
          alignItems: 'center',
          width: 100,
     },
     focusedTab: {
          marginBottom: 5,
          alignItems: 'center',
          width: 100,
     },
     drawerContainer: {
          flex: 1,
     },
     logoContainer: {
          padding: 20,
     },
     logo: {
          width: '100%',
          height: 100,
     },
     logoutButton: {
          marginHorizontal: 8,
          marginVertical: 4,
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          position: 'absolute',
          bottom: 40,
     },
     logoutButtonContent: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
     },
     logoutButtonText: {
          color: colors.PrimaryColor,
          fontFamily: Font.font600,
          fontSize: 16,
     },
     modalContent: {
          padding: 20,
          width: '100%',
     },
     modalTitle: {
          fontSize: 20,
          marginBottom: 15,
          textAlign: 'center',
          color: colors.PrimaryColor,
          fontFamily: Font.font600,
     },
     modalText: {
          fontSize: 16,
          marginBottom: 25,
          textAlign: 'center',
          color: colors.textColor,
          fontFamily: Font.font500,
     },
     buttonContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
     },
     button: {
          paddingVertical: 12,
          paddingHorizontal: 25,
          borderRadius: 8,
          alignItems: 'center',
          flex: 1,
          marginHorizontal: 5,
     },
     cancelButton: {
          backgroundColor: colors.SecTextColor,
     },
     logoutBtn: {
          backgroundColor: colors.PrimaryColor,
     },
     buttonText: {
          color: colors.SecondaryColor,
          fontFamily: Font.font600,
          fontSize: 16,
     },
});

export default MainNavigation;

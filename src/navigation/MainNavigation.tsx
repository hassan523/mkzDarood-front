import React, { useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList,
} from '@react-navigation/drawer';
import colors from '../utils/colors/colors';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Font from '../utils/fonts/Font';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/User/Home/Home';
import Profile from '../screens/User/Profile/Profile';
import News from '../screens/User/News/News';
import Tasbih from '../screens/User/Home/Tasbih/Tasbih';

interface MainNavigation {
  initRoute: string;
}

const HomeStack = createStackNavigator();
const NewsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomHeader = ({
  showDrawerButton = true,
  navigation,
}: {
  showDrawerButton?: boolean;
  navigation: any;
}) => {
  return (
    <View style={styles.headerContainer}>
      {showDrawerButton ? (
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color={colors.SecondaryColor} />
        </TouchableOpacity>
      ) : (
        <View style={styles.menuButton} />
      )}
      <Text style={styles.headerTitle}>MKZ Darood</Text>
      <View style={styles.rightHeaderPlaceholder} />
    </View>
  );
};

function HomeStackScreen({ navigation }: { navigation: any }) {
  return (
    <HomeStack.Navigator
      screenOptions={{
        header: ({ route }) => (
          <CustomHeader
            navigation={navigation}
            showDrawerButton={route.name === 'Home'}
          />
        ),
      }}
    >
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen
        name="Tasbih"
        component={Tasbih}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

function NewsStackScreen({ navigation }: { navigation: any }) {
  return (
    <NewsStack.Navigator
      screenOptions={{
        header: ({ route }) => (
          <CustomHeader
            navigation={navigation}
            showDrawerButton={route.name === 'News'}
          />
        ),
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
        header: ({ route }) => (
          <CustomHeader
            navigation={navigation}
            showDrawerButton={route.name === 'Profile'}
          />
        ),
      }}
    >
      <ProfileStack.Screen name="Profile" component={Profile} />
    </ProfileStack.Navigator>
  );
}

const MainNavigation = ({ initRoute }: MainNavigation) => {
  const isLogin = true;

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => (
          <View style={styles.drawerContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <DrawerItemList {...props} />

            {isLogin && (
              <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
                <View style={styles.logoutButtonContent}>
                  <Ionicons
                    name="log-out"
                    color={colors.PrimaryColor}
                    size={24}
                  />
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
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="NewsStackScreen"
          component={NewsStackScreen}
          options={{
            drawerLabel: 'News',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="newspaper" color={color} size={size} />
            ),
          }}
        />
        {isLogin && (
          <Drawer.Screen
            name="ProfileStackScreen"
            component={ProfileStackScreen}
            options={{
              drawerLabel: 'Profile',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person" color={color} size={size} />
              ),
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
    backgroundColor: colors.PrimaryColor,
    height: 60,
    paddingHorizontal: 15,
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
    bottom: 40
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
});

export default MainNavigation;

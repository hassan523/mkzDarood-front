import React, { JSX } from 'react';
import MainNavigation from './MainNavigation';
import { NotifierWrapper } from 'react-native-notifier';
import NoInternetModal from '../components/NoInternetModal/NoInternetModal';

const RootNavigation = (): JSX.Element => {
     return (
          <NotifierWrapper>
               <MainNavigation initRoute="Home" />
               <NoInternetModal />
          </NotifierWrapper>
     );
};

export default RootNavigation;

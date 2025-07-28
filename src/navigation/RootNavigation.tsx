import React, { JSX } from 'react';
import MainNavigation from './MainNavigation';
import { NotifierWrapper } from 'react-native-notifier';

const RootNavigation = (): JSX.Element => {
     return (
          <NotifierWrapper>
               <MainNavigation initRoute="Home" />
          </NotifierWrapper>
     );
};

export default RootNavigation;

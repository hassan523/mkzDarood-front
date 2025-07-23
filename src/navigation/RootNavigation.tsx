import React, { JSX } from 'react';
import AuthNavigation from './AuhNavigation';
import MainNavigation from './MainNavigation';

const RootNavigation = (): JSX.Element => {
  // return <AuthNavigation initRoute="Login" />;
  return <MainNavigation initRoute="Home" />;
};

export default RootNavigation;

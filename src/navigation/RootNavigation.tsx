import React, { JSX } from 'react';
import MainNavigation from './MainNavigation';

const RootNavigation = (): JSX.Element => {
  return <MainNavigation initRoute="Home" />;
};

export default RootNavigation;

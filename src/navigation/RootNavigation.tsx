import React, { JSX } from 'react';
import AuthNavigation from './AuhNavigation';

const RootNavigation = (): JSX.Element => {
  return <AuthNavigation initRoute="Login" />;
};

export default RootNavigation;

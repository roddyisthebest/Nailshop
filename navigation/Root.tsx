import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Stack from './Stack';
import Tabs from './Tabs';
import Auth from './Auth';

import {useSelector} from 'react-redux';
import {initialStateProps} from '../store/slice';

const Nav = createNativeStackNavigator();

const Root = () => {
  const {isLoggedIn} = useSelector((state: initialStateProps) => ({
    isLoggedIn: state.isLoggedIn,
  }));
  return (
    <Nav.Navigator screenOptions={{presentation: 'modal', headerShown: false}}>
      {isLoggedIn ? (
        <>
          <Nav.Screen name="Tabs" component={Tabs}></Nav.Screen>
          <Nav.Screen name="Stack" component={Stack}></Nav.Screen>
        </>
      ) : (
        <Nav.Screen name="Auth" component={Auth}></Nav.Screen>
      )}
    </Nav.Navigator>
  );
};

export default Root;

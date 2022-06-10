import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Auth/Login';

const NativeStack = createNativeStackNavigator();

const Auth = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <NativeStack.Screen name="Login" component={Login} />
  </NativeStack.Navigator>
);

export default Auth;

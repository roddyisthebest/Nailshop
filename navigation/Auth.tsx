import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Auth/Login';
import SnsLogin from '../screens/Auth/SnsLogin';

const NativeStack = createNativeStackNavigator();

const Auth = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <NativeStack.Screen name="Login" component={Login} />
    <NativeStack.Screen name="SnsLogin" component={SnsLogin} />
  </NativeStack.Navigator>
);

export default Auth;

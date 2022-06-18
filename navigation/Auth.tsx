import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Auth/Login';
import SnsLogin from '../screens/Auth/SnsLogin';

const NativeStack = createNativeStackNavigator();
// Auth 해당되는 네비게이션 구조입니다. Login, SnsLogin 페이지들이 이 네비게이션에 포함됩니다.

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

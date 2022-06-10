import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Stack from './Stack';
import Tabs from './Tabs';
import Auth from './Auth';

const Nav = createNativeStackNavigator();

const Root = () => {
  const [user, setUser] = useState<boolean>(false);
  return (
    <Nav.Navigator screenOptions={{presentation: 'modal', headerShown: false}}>
      {user ? (
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

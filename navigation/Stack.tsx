import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Detail from '../screens/Stack/Detail';
import Edit from '../screens/Stack/Edit';
import MyStore from '../screens/Stack/MyStore';
import MyStyle from '../screens/Stack/MyStyle';
import Record from '../screens/Stack/Record';

const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
    }}>
    <NativeStack.Screen name="Detail" component={Detail} />
    <NativeStack.Screen name="Edit" component={Edit} />
    <NativeStack.Screen name="MyStore" component={MyStore} />
    <NativeStack.Screen name="MyStyle" component={MyStyle} />
    <NativeStack.Screen name="Record" component={Record} />
  </NativeStack.Navigator>
);

export default Stack;

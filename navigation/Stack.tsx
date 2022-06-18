import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Detail from '../screens/Stack/Detail';
import Edit from '../screens/Stack/Edit';
import MyStore from '../screens/Stack/MyStore';
import MyStyle from '../screens/Stack/MyStyle';
import MyReservation from '../screens/Stack/MyReservation';
import Search from '../screens/Stack/Search';
import {Text} from 'react-native';
const NativeStack = createNativeStackNavigator();

// stack에 해당되는 네비게이션 구조입니다. Edit,MyStore,MyStyle,MyReservation 페이지들이 이 네비게이션에 포함됩니다.

const Stack = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTitleStyle: {
        fontWeight: '700',
      },
    }}>
    <NativeStack.Screen
      name="Detail"
      component={Detail}
      options={{title: '가게 세부정보'}}
    />
    <NativeStack.Screen name="Edit" component={Edit} />
    <NativeStack.Screen name="MyStore" component={MyStore} />
    <NativeStack.Screen name="MyStyle" component={MyStyle} />
    <NativeStack.Screen name="MyReservation" component={MyReservation} />
    <NativeStack.Screen
      name="Search"
      component={Search}
      options={{headerLeft: props => null}}
    />
  </NativeStack.Navigator>
);

export default Stack;

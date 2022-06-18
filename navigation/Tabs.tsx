import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Tab/Home';
import MyInfo from '../screens/Tab/MyInfo';
import Rank from '../screens/Tab/Rank';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
// Tabs 해당되는 네비게이션 구조입니다. Home, MyInfo, Rank 페이지들이 이 네비게이션에 포함됩니다.

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontSize: 13,
        fontWeight: '600',
        display: 'none',
      },
      headerStyle: {
        borderBottomColor: '#E8E8E8',
        borderBottomWidth: 1,
      },
      headerTitleStyle: {
        fontWeight: '700',
      },
      headerShadowVisible: true,
    }}>
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon
            name={color === '#8E8E8F' ? 'home-outline' : 'home'}
            size={size}
            color={'black'}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Rank"
      component={Rank}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon
            name={color === '#8E8E8F' ? 'medal-outline' : 'medal'}
            color={'black'}
            size={size}
          />
        ),
        title: '',
      }}
    />
    <Tab.Screen
      name="MyInfo"
      component={MyInfo}
      options={{
        title: '내 정보',
        tabBarIcon: ({color, size}) => (
          <Icon
            name={
              color === '#8E8E8F' ? 'person-circle-outline' : 'person-circle'
            }
            color={'black'}
            size={size}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default Tabs;

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import Home from '../screens/Tab/Home';
import MyInfo from '../screens/Tab/MyInfo';
import Rank from '../screens/Tab/Rank';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

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
        title: '홈',
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
        title: '랭킹',
        tabBarIcon: ({color, size}) => (
          <Icon
            name={color === '#8E8E8F' ? 'medal-outline' : 'medal'}
            color={'black'}
            size={size}
          />
        ),
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

import React, {useCallback, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Stack from './Stack';
import Tabs from './Tabs';
import Auth from './Auth';

import {useDispatch, useSelector} from 'react-redux';
import {initialStateProps, login, setUserInfo} from '../store/slice';
import EncryptedStorage from 'react-native-encrypted-storage';
import {setToken} from '../api';
import {getMyInfo} from '../api/user';
import {Image, View} from 'react-native';

const Nav = createNativeStackNavigator();

export type LoggedInParamList = {
  Stacks: {
    screen: string;
    params: {idx: number};
  };
  Tabs: {
    screen: string;
    params: any;
  };
};

const Root = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  const getAccessToken = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      if (accessToken) {
        await setToken();
        const {data} = await getMyInfo();
        dispatch(setUserInfo(data.data));
        dispatch(login(true));
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        dispatch(login(false));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAccessToken();
  }, []);
  const {isLoggedIn} = useSelector((state: initialStateProps) => ({
    isLoggedIn: state.isLoggedIn,
  }));
  return loading ? (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={{
          uri: 'https://st2.depositphotos.com/1157310/11458/v/600/depositphotos_114581808-stock-illustration-nail-technician-concept.jpg',
        }}
        style={{width: 80, height: 80}}></Image>
    </View>
  ) : (
    <Nav.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      {isLoggedIn ? (
        <>
          <Nav.Screen name="Tabs" component={Tabs}></Nav.Screen>
          <Nav.Screen name="Stacks" component={Stack}></Nav.Screen>
        </>
      ) : (
        <Nav.Screen name="Auth" component={Auth}></Nav.Screen>
      )}
    </Nav.Navigator>
  );
};

export default Root;

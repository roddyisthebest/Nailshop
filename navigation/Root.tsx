import React, {useCallback, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Stack from './Stack';
import Tabs from './Tabs';
import Auth from './Auth';

import {useDispatch, useSelector} from 'react-redux';
import {initialStateProps, login, setUserInfo} from '../store/slice';
import EncryptedStorage from 'react-native-encrypted-storage';
import {setToken} from '../api';
import {getAccessByRefresh, getMyInfo} from '../api/user';
import {Alert, Image, View} from 'react-native';

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

  const getTokenAndRefresh = useCallback(async () => {
    try {
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      if (!refreshToken) {
        return;
      }
      const {
        data: {
          data: {accessToken},
        },
      } = await getAccessByRefresh(refreshToken);
      await EncryptedStorage.setItem('accessToken', accessToken);
      await setToken();
      const {data} = await getMyInfo();
      dispatch(setUserInfo(data.data));
      dispatch(login(true));
    } catch (e: any) {
      if (e.response.status === 401 && e.response.data.code === 'A0002') {
        Alert.alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [dispatch]);

  useEffect(() => {
    getTokenAndRefresh();
  }, []);
  const {isLoggedIn} = useSelector((state: initialStateProps) => ({
    isLoggedIn: state.isLoggedIn,
  }));
  return loading ? (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../assets/img/nailShopLogo.png')}
        style={{width: 150, height: 150}}></Image>
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

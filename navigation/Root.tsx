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
// 앱의 네비게이션 구조를 이 Root.tsx에서 규정합니다.
// 네비게이션은 Auth (login.tsx, SnsLogin.tsx) / Stack (Detail.tsx, Edit.tsx, MyReservation.tsx, MyStore.tsx, MyStyle.tsx, Search.tsx) / Tabs (Home.tsx, MyInfo.tsx, Rank.tsx) 로 이루어져 있습니다.

const Root = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  // 처음 앱을 실행할때 앱 내에 저장된 refreshToken이 있다면 로그인 하지 않고 바로 refreshToken을 이용하여 accessToken을 가져오는 함수입니다.
  // 당연히 refreshToken이 앱 내에 없다면 로그인 페이지로 이동시킵니다.
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

  // redux내에 있는 isLoggedIn 값에 따라 로그인이 되었는지 안되어있는지를 결정하여 네비게이션 컴포넌트를 분기하여 리턴합니다.
  const {isLoggedIn} = useSelector((state: initialStateProps) => ({
    isLoggedIn: state.isLoggedIn,
  }));
  return loading ? (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../assets/img/logo.jpeg')}
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

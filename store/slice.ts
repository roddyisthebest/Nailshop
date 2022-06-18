import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';
import {UserInfo} from '../types';

export type initialStateProps = {
  userInfo: UserInfo;
  isLoggedIn: boolean;
};

// 리덕스의 내부구조입니다.

const {actions, reducer} = createSlice({
  name: 'redux',
  initialState: {
    userInfo: {
      idx: 0,
      email: '',
      phone: '',
      oauth: '',
      createdAt: '',
    },
    isLoggedIn: false,
  },
  reducers: {
    login: (state, {payload: log}: PayloadAction<boolean>) => ({
      ...state,
      isLoggedIn: log,
    }),
    setUserInfo: (state, {payload: userInfo}: PayloadAction<UserInfo>) => ({
      ...state,
      userInfo: {
        idx: userInfo.idx,
        email: userInfo.email,
        phone: userInfo.phone,
        oauth: userInfo.oauth,
        createdAt: userInfo.createdAt,
      },
    }),
    setDigit: (state, {payload: phone}: PayloadAction<string>) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        phone: phone,
      },
    }),
    reset: () => ({
      userInfo: {
        idx: 0,
        email: '',
        phone: '',
        oauth: '',
        createdAt: '',
      },
      isLoggedIn: false,
    }),
  },
});

export const {login, setUserInfo, setDigit, reset} = actions;

export default reducer;

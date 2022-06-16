import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserInfo} from '../types';

export type initialStateProps = {
  userInfo: UserInfo;
  isLoggedIn: boolean;
};

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
  },
});

export const {login, setUserInfo, setDigit} = actions;

export default reducer;

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type initialStateProps = {
  userInfo: {
    name: string;
    jwt: string;
  };
  isLoggedIn: boolean;
};

const {actions, reducer} = createSlice({
  name: 'redux',
  initialState: {
    userInfo: {
      name: '',
    },
    isLoggedIn: false,
  },
  reducers: {
    login: (state, {payload: log}: PayloadAction<boolean>) => ({
      ...state,
      isLoggedIn: log,
    }),
  },
});

export const {login} = actions;

export default reducer;

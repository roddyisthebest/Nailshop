import axios, {AxiosResponse} from 'axios';

import EncryptedStorage from 'react-native-encrypted-storage';

export const api = axios.create({
  baseURL: `https://junggam.click/api/v1` as string,
});

export const setToken = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};


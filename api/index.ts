import axios, {AxiosResponse} from 'axios';

import EncryptedStorage from 'react-native-encrypted-storage';

// api요청을 위한 공통 api 객체를 생성하고 export합니다.
// 보다 간결하게 api요청이 가능합니다.

export const api = axios.create({
  baseURL: `https://junggam.click/api/v1` as string,
});

// api 요청을 할때 앱 내에 저장된 accessToken을 가져와서 header에 저장하는 함수입니다.

export const setToken = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

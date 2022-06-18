import {Alert} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {setToken} from '../api';
import {getAccessByRefresh, getMyInfo} from '../api/user';

// refreshToken을 통해 accessToken을 갱신하는 함수입니다.
// refreshToken 마저 만료가 되면 로그인 페이지로 넘어가게끔 구현하였습니다.
const getTokenAndRefresh = async () => {
  try {
    const refreshToken = await EncryptedStorage.getItem('refreshToken');
    if (!refreshToken) {
      return false;
    }
    const {
      data: {
        data: {accessToken},
      },
    } = await getAccessByRefresh(refreshToken);
    await EncryptedStorage.setItem('accessToken', accessToken);
    await setToken();
    const {data} = await getMyInfo();
    return true;
  } catch (e: any) {
    if (e.response.status === 401 && e.response.data.code === 'A0002') {
      Alert.alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
    } else {
      Alert.alert('에러입니다. 다시 로그인해주세요.');
    }
    return false;
  }
};
export default getTokenAndRefresh;

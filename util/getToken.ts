import {Alert} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
// import {useDispatch} from 'react-redux';
import {setToken} from '../api';
import {getAccessByRefresh, getMyInfo} from '../api/user';
import {login, setUserInfo} from '../store/slice';

const getTokenAndRefresh = async () => {
  console.log('refresh go');
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

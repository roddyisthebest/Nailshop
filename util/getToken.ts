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
    if (e.response.status === 401) {
      return false;
    }
  }
};
export default getTokenAndRefresh;

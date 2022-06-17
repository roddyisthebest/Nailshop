import EncryptedStorage from 'react-native-encrypted-storage';
import {useDispatch} from 'react-redux';
import {setToken} from '../api';
import {getAccessByRefresh, getMyInfo} from '../api/user';
import {login, setUserInfo} from '../store/slice';

const getTokenAndRefresh = async () => {
  const dispatch = useDispatch();
  try {
    const refreshToken = await EncryptedStorage.getItem('refreshToken');
    if (!refreshToken) {
      dispatch(login(false));
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
  } catch (e: any) {
    if (e.response.status === 401) {
      dispatch(login(false));
    }
  }
};
export default getTokenAndRefresh;

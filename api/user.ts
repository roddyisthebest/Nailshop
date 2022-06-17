import {AxiosResponse} from 'axios';

import {api} from './index';

const getMyInfo = (): Promise<AxiosResponse<any>> => api.get('/user');

const changePhoneNumber = (phone: string): Promise<AxiosResponse<any>> =>
  api.put('/users', {phone});

const getAccessByRefresh = (
  refreshToken: string | null,
): Promise<AxiosResponse<any>> => api.post('/authorization', {refreshToken});

export {getMyInfo, changePhoneNumber, getAccessByRefresh};

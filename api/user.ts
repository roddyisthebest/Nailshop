import {AxiosResponse} from 'axios';

import {api} from './index';

const getMyInfo = (): Promise<AxiosResponse<any>> => api.get('/user');

const changePhoneNumber = (phone: string): Promise<AxiosResponse<any>> =>
  api.put('/users', {phone});

export {getMyInfo, changePhoneNumber};

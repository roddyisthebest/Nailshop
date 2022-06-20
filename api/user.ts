import {AxiosResponse} from 'axios';

import {api} from './index';


// user와 관련된 api 함수들입니다.


const getMyInfo = (): Promise<AxiosResponse<any>> => api.get('/user');

const changePhoneNumber = (phone: string): Promise<AxiosResponse<any>> =>
  api.put('/users', {phone});

const getAccessByRefresh = (
  refreshToken: string | null,
): Promise<AxiosResponse<any>> => api.post('/authorization', {refreshToken});

const getReservationList = (page: number): Promise<AxiosResponse<any>> =>
  api.get(`/users/reservations?page=${page}&size=15`);

export {getMyInfo, changePhoneNumber, getAccessByRefresh, getReservationList};

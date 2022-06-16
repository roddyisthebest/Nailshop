import {AxiosResponse} from 'axios';

import {api} from './index';

const getShopList = (
  page: number,
  like: boolean,
): Promise<AxiosResponse<any>> =>
  api.get(`/shops?page=${page}&size=15&like=${like}`);

const getShopRanking = (page: number): Promise<AxiosResponse<any>> =>
  api.get(`/shops/ranking?page=${page}&size=15`);

const getShopByIdx = (idx: number): Promise<AxiosResponse<any>> =>
  api.get(`/shops/${idx}`);

const postLikeByIdx = (idx: number): Promise<AxiosResponse<any>> =>
  api.post(`/shops/${idx}/like`);

const deleteLikeByIdx = (idx: number): Promise<AxiosResponse<any>> =>
  api.delete(`/shops/${idx}/like`);

const postReservation = (
  idx: number,
  type: 'KAKAO' | 'PHONE' | 'MESSAGE',
): Promise<AxiosResponse<any>> => api.post(`/shops/${idx}/reservation`, {type});

export {
  getShopList,
  getShopRanking,
  getShopByIdx,
  postLikeByIdx,
  deleteLikeByIdx,
  postReservation,
};

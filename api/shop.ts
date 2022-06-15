import {AxiosResponse} from 'axios';

import {api} from './index';

const getShopList = (page: number): Promise<AxiosResponse<any>> =>
  api.get(`/shops?page=${page}&size=15&like=false`);

const getShopRanking = (page: number): Promise<AxiosResponse<any>> =>
  api.get(`/shops/ranking?page=${page}&size=15`);

const getShopByIdx = (idx: number): Promise<AxiosResponse<any>> =>
  api.get(`/shops/${idx}`);

const postLikeByIdx = (idx: number): Promise<AxiosResponse<any>> =>
  api.post(`/shops/${idx}/like`);

const deleteLikeByIdx = (idx: number): Promise<AxiosResponse<any>> =>
  api.delete(`/shops/${idx}/like`);

export {
  getShopList,
  getShopRanking,
  getShopByIdx,
  postLikeByIdx,
  deleteLikeByIdx,
};

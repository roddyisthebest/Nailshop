import {AxiosResponse} from 'axios';

import {api} from './index';

// shop과 관련된 api 함수들입니다.

const getShopList = (
  page: number,
  like: boolean,
  near: boolean,
  longitude: number,
  latitude: number,
): Promise<AxiosResponse<any>> => {
  console.log(longitude, latitude);
  if (near) {
    return api.get(
      `/shops?page=${page}&size=15&like=${like}&near=${near}&longitude=${longitude}&latitude=${latitude}`,
    );
  }
  return api.get(`/shops?page=${page}&size=15&like=${like}&near=${near}`);
};
const searchShopList = (
  page: number,
  type: string,
  keyword: string,
): Promise<AxiosResponse<any>> =>
  api.get(`/shops?page=${page}&size=15&like=false&${type}=${keyword}`);
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

const postShopLike = (idx: number): Promise<AxiosResponse<any>> =>
  api.post(`/shops/styles/${idx}/like`);

const deleteShopLike = (idx: number): Promise<AxiosResponse<any>> =>
  api.delete(`/shops/styles/${idx}/like`);

const getStyleList = (page: number): Promise<AxiosResponse<any>> =>
  api.get(`/shops/styles?page=${page}&size=10&like=false`);

export {
  getShopList,
  getShopRanking,
  getShopByIdx,
  postLikeByIdx,
  deleteLikeByIdx,
  postReservation,
  postShopLike,
  deleteShopLike,
  getStyleList,
  searchShopList,
};

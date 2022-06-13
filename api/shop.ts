import {AxiosResponse} from 'axios';

import {api} from './index';

const getShopList = (page: number): Promise<AxiosResponse<any>> =>
  api.get(`/shops?page=${page}&size=15&like=false`);

const getShopRanking = (page: number): Promise<AxiosResponse<any>> =>
  api.get(`shops/ranking?page=${page}&size=15`);
export {getShopList, getShopRanking};

import {AxiosResponse} from 'axios';

import {api} from './index';

const getMyInfo = (): Promise<AxiosResponse<any>> => api.get('/user');

export {getMyInfo};

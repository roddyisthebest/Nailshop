import {configureStore} from '@reduxjs/toolkit';
import reducer from './slice';

export default configureStore({reducer});

// 리덕스 index 페이지입니다.

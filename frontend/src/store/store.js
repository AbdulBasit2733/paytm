// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice/index';
import userReducer from './user-slice/index';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user:userReducer
  },
});

export default store;

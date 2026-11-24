import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import MainRouter from './router/MainRouter.jsx';

export default function App() {
  return (
    <Provider store={store}>
      <MainRouter />
    </Provider>
  );
}

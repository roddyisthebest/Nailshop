import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Root from './navigation/Root';

import {Provider} from 'react-redux';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </Provider>
  );
};

export default App;

import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import rootReducers from './reducers';

//development only axios helpers
import axios from 'axios';
window.axios = axios;

// const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;  

// const store = createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(thunk))  
// );

const store = createStore(rootReducers, {}, applyMiddleware(reduxThunk))

const app = (
  <Provider store={store}>  
    <App />
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

// console.log('STRIPE KEY: ', process.env.REACT_APP_STRIPE_KEY);
// console.log('Environment: ', process.env.NODE_ENV);
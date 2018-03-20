import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Reducer
function reducer(state = { pageName: null }, action) {
    switch (action.type) {
        case 'changePage':
            return { pageName: action.pageName }
        default:
            return state
    }
}

// Store
const store = createStore(reducer)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();

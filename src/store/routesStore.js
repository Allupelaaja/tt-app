import {createStore} from 'redux';
import routesReducer from '../reducers/routesReducer';

const store = createStore(routesReducer);

export default store;

import { combineReducers } from 'redux';
import monobjectReducer from './monobject-reducer.js';
import statReducer from './stat-reducer.js';

export default statReducer(monobjectReducer);


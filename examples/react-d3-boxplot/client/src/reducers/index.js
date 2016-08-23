import { combineReducers } from 'redux';
import monobjectReducer from './monobject-reducer.js';
import statReducer from './stat-reducer.js';
import appReducer from './app-reducer.js'
import monthReducer from './month-reducer.js'

let monobjects = statReducer(monobjectReducer);

export default combineReducers({
  monobjects,
  appReducer,
  monthReducer
})

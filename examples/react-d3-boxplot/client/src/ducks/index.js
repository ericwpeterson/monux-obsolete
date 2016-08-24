import { combineReducers } from 'redux';
import monobjectReducer from './monobject';
import statReducer from './stats';
import appReducer from './app';
import monthReducer from './month';

import weekReducer from './week';
import dayReducer from './day';

let monobjects = statReducer(monobjectReducer);

export default combineReducers({
    monobjects,
    appReducer,
    monthReducer,
    weekReducer,
    dayReducer
});

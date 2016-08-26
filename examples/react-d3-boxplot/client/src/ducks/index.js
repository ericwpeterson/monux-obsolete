import { combineReducers } from 'redux';

import monobjectReducer from './monobject';
import boxplotReducer from './boxplots';

let app = boxplotReducer(monobjectReducer);

export default combineReducers({
    app,
    monobjectReducer
});

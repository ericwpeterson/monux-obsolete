
import R, {map} from 'ramda';

let getItems = R.curry((dataPoint, item) => item[dataPoint]);
let pickFields = R.curry((obj, key)  => [key,
                                            [obj[key].min, obj[key].q1, obj[key].median,
                                                obj[key].q3, obj[key].max,
                                                ...obj[key].outliers
                                            ]
                                        ]);
let iterateObjectKeys = (obj) => R.map(pickFields(obj), R.keys(obj));
let filter = obj =>  obj.max && obj.min && obj.median && obj.q1 && obj.q3 && obj.outliers;
let toD3BoxPlot = (dataPoint) => R.compose(iterateObjectKeys, R.filter(filter), R.map(getItems(dataPoint)));

export default toD3BoxPlot;
import R, {map} from 'ramda';

let getItems = R.curry((dataPoint, item) => item[dataPoint]);

let pickFields = R.curry((obj, key)  =>
    [key,
        [obj[key].min, obj[key].q1, obj[key].median,
        obj[key].q3, obj[key].max,
        ...obj[key].outliers
        ]
    ]
);

let iterateObjectKeys = (obj) => R.map(pickFields(obj), R.keys(obj));
let filter = obj =>  obj.max && obj.min && obj.median && obj.q1 && obj.q3 && obj.outliers;
let toD3BoxPlot = (dataPoint) => R.compose(iterateObjectKeys, R.filter(filter), R.map(getItems(dataPoint)));

export function toD3BoxPlotMinMax(plotData) {
    let points = R.flatten(R.map((item)=> item[1], plotData));
    return {min: R.reduce(R.min, +Infinity, points), max: R.reduce(R.max, -Infinity, points)};
}

export function getYears(data) {
    let getYear = (acc,value) => {
        let year = value[0].slice(0,4);
        acc[year] = year;
        return acc;

    };
    let ret = R.reduce(getYear, {}, data);
    ret = R.keys(ret).sort();
    return ret;
}

export function filterByYear(year, items) {
    let isInYear = (item) => {
        let y = item[0].slice(0,4);
        return y === year;
    };

    var sortByFirstItem = R.sortBy(R.prop(0));
    return sortByFirstItem(R.filter(isInYear, items));
}

export function formatMonths(data) {
    let formatDate = (acc, value) => {
        if (value[0].length === 10) {
            let yearAndMonth = value[0].slice(0,7);
            let ret = [];
            ret.push(yearAndMonth);
            ret.push(value[1]);
            acc.push(ret);
        } else {
            let ret = [];
            ret.push(value[0]);
            ret.push(value[1]);
            acc.push(ret);
        }

        return acc;
    };
    let ret = R.reduce(formatDate, [], data);
    return ret;
}
export default toD3BoxPlot;


export function dataPointChange(dataPoint) {
    return {
        type: 'DATAPOINT_CHANGE',
        dataPoint: dataPoint
    };
}

export function unmountMonth(bval) {
    return {
        type: 'UNMOUNT_MONTH',
        val: bval
    };
}


export function unmountWeeks(bval) {
    return {
        type: 'UNMOUNT_WEEKS',
        val: bval
    };
}

export function monthChange(month) {
    return {
        type: 'DATAPOINT_CHANGE',
        month: month
    };
}

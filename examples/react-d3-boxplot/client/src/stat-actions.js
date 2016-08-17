
export function opStarted(stats) {
    return {
        type: 'HYDRATE_STATS',
        stats: stats
    };
}

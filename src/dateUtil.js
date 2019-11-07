import moment from 'moment';

export function moveBackOneMonth(dateFilter) {
    const currentMonth = moment(dateFilter.end).month();
    const result = {
        start: moment.utc(dateFilter.end).subtract(1, 'months').startOf("month").toDate(),
        end: moment.utc(dateFilter.end).subtract(1, 'months').endOf('month').startOf('day').toDate()
    };
    return result;
}
import moment from 'moment';

export function moveBackOneMonth(date) {
    const result = moment(date).subtract(1, 'months').toDate();
    return result;
}
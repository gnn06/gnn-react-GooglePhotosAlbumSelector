import * as DateUtil from './dateUtil.js';
import expectExport from 'expect';

describe('DateUtil', () => {

    it('filmoveBackOneMonthtered', () => {
        const result = DateUtil.moveBackOneMonth(new Date("2019-06-01T00:00:00Z"));
        expect(result).toEqual(new Date("2019-05-01T00:00:00Z"));
    });

});
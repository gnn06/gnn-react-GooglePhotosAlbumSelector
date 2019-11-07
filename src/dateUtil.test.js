import * as DateUtil from './dateUtil.js';
import expectExport from 'expect';

describe('DateUtil', () => {

    it('moveBackOneMonth, 31 to 30', () => {
        const result = DateUtil.moveBackOneMonth({end: new Date("2019-05-31T00:00:00Z"), start: new Date("2019-05-01T00:00:00Z")});
        expect(result).toEqual({end: new Date("2019-04-30T00:00:00Z"), start: new Date("2019-04-01T00:00:00Z")});
    });

    it('moveBackOneMonth, 30 to 31', () => {
        const result = DateUtil.moveBackOneMonth({end: new Date("2019-06-30T00:00:00Z"), start: new Date("2019-06-01T00:00:00Z")});
        expect(result).toEqual({end: new Date("2019-05-31T00:00:00Z"), start: new Date("2019-05-01T00:00:00Z")});
    });

});
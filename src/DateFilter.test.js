import React from 'react';
import { shallow, mount, render } from 'enzyme';
import DateFilter from './DateFilter.js';
import expectExport from 'expect';

it('DateFilter', () => {
    // GIVEN
    const dateFilter = {
        start: new Date("2019-05-01T00:00:00Z"),
        end: new Date("2019-05-31T00:00:00Z")
    };
    const handler = jest.fn();

    // WHEN
    const wrapper = mount(<DateFilter dateFilter={dateFilter} dateFilterHandle={handler}/>);
    wrapper.find("button#move-back-one-month").simulate('click');    

    // THEN
    expect(wrapper.find("input#end-date").props()).toHaveProperty('value','30/04/2019');
    expect(wrapper.find("input#start-date").props()).toHaveProperty('value','01/04/2019');
    expect(handler).toHaveBeenCalled();
    // expect(wrapper.state().endDate).toEqual( new Date("2019-04-30T00:00:00Z"));
    // expect(wrapper.state().startDate).toEqual( new Date("2019-04-01T00:00:00Z"));

});

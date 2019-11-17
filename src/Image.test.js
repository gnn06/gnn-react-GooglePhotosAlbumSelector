import React from 'react';
import { shallow, mount, render } from 'enzyme';
import expectExport from 'expect';

import Image from './Image.js';

test('dynamic css style include background-color', () => {
    const wrapper = shallow(<Image
        baseUrl={"http://domain.com/image.jpg"}
        productUrl={"http://domain.com/product"}
        id={"photoid1"}
        key={"1"}
        albums={[{id: "albumid2", title: "albumtitle2"}]}
        allAlbums={[{id:"albumid1"}, {id:"albumid2"}]}
        addAlbum={null}
        removeAlbum={null} />);
    const style = wrapper.find("div.flag div").prop('style');
    expect(style).toHaveProperty('backgroundColor');
});
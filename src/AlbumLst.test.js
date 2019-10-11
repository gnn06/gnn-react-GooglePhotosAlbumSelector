import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import GooglePhotos from './google.js';

import AlbumLst from './AlbumLst.js';

let container = null;

/*
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("renders with or without a name", () => {
    const parent = {
        state: {
            albums: [
                { id: "albumid1" }
            ]
        }
    };
    act(() => {
        render(<AlbumLst parent={parent}/>, container);
    });
});
*/

it("renders with or without a name", () => {
    const compo = new AlbumLst();
    compo.props = {
        parent: {
            state: {
                albums: [
                    {
                        id: "albumid1",
                        photos: [],
                        mediaItemsCount: 1
                    }
                ]
            },
            setState: function (albums) {
                this.state = albums;
            }
        }
    };
    compo.component = compo;
    GooglePhotos.getAlbumsDetail = function (albums, callback) {
        albums[0].photos = [{ id: "photoid1" }];
        callback(albums[0]);
    };
    compo.request_allAlbumPhotos();
    expect(compo.props.parent.state.albums).toEqual([
        {
            id: "albumid1",
            mediaItemsCount: 1,
            photos: [{ id: "photoid1" }]
        }
    ]);
});
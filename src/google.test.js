import Google  from './google.js';
import expectExport from 'expect';

it('getAllAlbumDetail two albums already retrieved', () => {
    const albums = 
    [
        {
            id:"album1",
            title:"title1", 
            photos: [{ id: "photoid1"}],
            mediaItemsCount: 1
        },
        {
            id:"album2",
            title:"title2", 
            photos: [{ id: "photoid1"}],
            mediaItemsCount: 1
        }
    ];
    const mockFn = jest.fn();
    const getAlbumDetailSaved = Google.getAlbumDetail;
    const spyGetAlbumDetail = jest.fn();
    Google.getAlbumDetail = spyGetAlbumDetail;
    
    Google.getAllAlbumDetail(albums, mockFn);

    expect(spyGetAlbumDetail).not.toHaveBeenCalled();

    Google.getAlbumDetail = getAlbumDetailSaved;
});

it('getAllAlbumDetail two albums not already retrieved', () => {
    const albums = 
    [
        { id:"album1",
          title:"title1", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album2",
          title:"title2", 
          photos: [],
          mediaItemsCount: 1
        }
    ];
    const mockFn = jest.fn();
    const getAlbumDetailSaved = Google.getAlbumDetail;
    const spyGetAlbumDetail = jest.fn();
    Google.getAlbumDetail = spyGetAlbumDetail;
    
    Google.getAllAlbumDetail(albums, mockFn);

    expect(spyGetAlbumDetail).toHaveBeenCalledTimes(1);

    Google.getAlbumDetail = getAlbumDetailSaved;
});

it('getAllAlbumDetail first of two albums already retrieved', () => {
    const getAlbumDetailSaved = Google.getAlbumDetail;

    const albums = 
    [
        {
            id:"album1",
            title:"title1", 
            photos: [{ id: "photoid1"}],
            mediaItemsCount: 1
        },
        {
            id:"album2",
            title:"title2", 
            photos: [],
            mediaItemsCount: 1
        }
    ];
    const mockFn = jest.fn();
    const spyGetAlbumDetail = jest.fn();
    Google.getAlbumDetail = spyGetAlbumDetail;
    
    Google.getAllAlbumDetail(albums, mockFn);

    expect(spyGetAlbumDetail).toHaveBeenCalledTimes(1);

    Google.getAlbumDetail = getAlbumDetailSaved;
});

it('getAllAlbumDetail no photos property', () => {
    const getAlbumDetailSaved = Google.getAlbumDetail;

    const albums = 
    [
        {
            id:"album1",
            title:"title1",
            mediaItemsCount: 1
        }
    ];
    const mockFn = jest.fn();
    const spyGetAlbumDetail = jest.fn();
    Google.getAlbumDetail = spyGetAlbumDetail;
    
    Google.getAllAlbumDetail(albums, mockFn);

    expect(spyGetAlbumDetail).toHaveBeenCalledTimes(1);

    Google.getAlbumDetail = getAlbumDetailSaved;
});

it('getAlbumDetail no second page', () => {
    const album = {};
    const mockExecute = {
        execute: function(resolve) {
            resolve({ mediaItems: [{id:"id1"}]});
        }
    };
    const mockRequest = function() {
        return mockExecute;
    }
    global.gapi = {
        client: {
            request: mockRequest
        }
    };
    const mockUICallback = jest.fn();
    
    Google.getAlbumDetail(album, mockUICallback);

    expect(mockUICallback).toHaveBeenCalledWith({"photos": ["id1"]});
});

it('getAlbumDetail reset photos', () => {
    const album = {
        photos: [
            "photoid1",
        ],
        mediaItemsCount: 2
    };
    const mockExecute = {
        execute: function(resolve) {
            resolve({ mediaItems: [{id:"photoid1"}, {id:"photoid2"}]});
        }
    };
    const mockRequest = function() {
        return mockExecute;
    }
    global.gapi = {
        client: {
            request: mockRequest
        }
    };
    const mockUICallback = jest.fn();
    
    Google.getAlbumDetail(album, mockUICallback);

    expect(album.photos).toEqual(["photoid1", "photoid2"]);
});


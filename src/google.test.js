import Google  from './google.js';
import expectExport from 'expect';
import randomInt from 'random-int';

describe('getAllAlbumDetail', () => {

    var mockCallbackUI, mockCallbackError;
    var getAlbumDetailSaved;

    beforeAll(() => {
        mockCallbackUI = jest.fn();
        mockCallbackError = jest.fn();
        getAlbumDetailSaved = Google.getAlbumDetail;
    });

    afterAll(() => {
        Google.getAlbumDetail = getAlbumDetailSaved;
    });

    test('two albums not already retrieved', () => {
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
        const spyGetAlbumDetail = jest.fn().mockResolvedValue();
        Google.getAlbumDetail = spyGetAlbumDetail;
        
        return Google.getAllAlbumDetail(albums, mockCallbackUI, mockCallbackError, [])
            .then(function(result){
                expect(spyGetAlbumDetail).toHaveBeenCalledTimes(2);
            });
    
        
    });

    test('two albums already retrieved', () => {
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
        Google.getAlbumDetail = jest.fn();
        
        return Google.getAllAlbumDetail(albums, mockCallbackUI,mockCallbackError, [])
            .then(() => {
                expect(Google.getAlbumDetail).not.toHaveBeenCalled();
            });
    });
    
    test('first of two albums already retrieved', () => {
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
        
        const spyGetAlbumDetail = jest.fn().mockResolvedValue();
        Google.getAlbumDetail = spyGetAlbumDetail;
        
        return Google.getAllAlbumDetail(albums, mockCallbackUI, mockCallbackError, [])
            .then(function(result) {
                expect(spyGetAlbumDetail).toHaveBeenCalledTimes(1);
            });
    });
    
    test('use previous albums order to not retrieve unchanged album detail', () => {
        // GIVEN
        const previousAlbums = [{id:"albumid1"}, {id:"albumid2"}, {id:"albumid3", photos:["photoid1"]}];
        const  currentAlbums = [{id:"albumid2"}, {id:"albumid1"}, {id:"albumid3"}];

        // mock GoogleQueue.getAllAlbumDetail
        Google.getAlbumDetail = jest.fn().mockResolvedValue();

        // WHEN
        return Google.getAllAlbumDetail(currentAlbums, mockCallbackUI, mockCallbackError, previousAlbums)
        .then(function(result) {
            // THEN 
            // Call getDetail only on changed albums
            // Do not call getDetail for albumid3
            expect(Google.getAlbumDetail).toHaveBeenCalledTimes(2);
            expect(Google.getAlbumDetail).toHaveBeenNthCalledWith(1, currentAlbums[1], mockCallbackUI, mockCallbackError);
            expect(Google.getAlbumDetail).toHaveBeenNthCalledWith(2, currentAlbums[0], mockCallbackUI, mockCallbackError);

            expect(mockCallbackUI).toHaveBeenCalledTimes(1);
            expect(mockCallbackUI).toHaveBeenNthCalledWith(1, previousAlbums[2]);
        })
    });

    test('no photos property', () => {
        const albums = 
        [
            {
                id:"album1",
                title:"title1",
                mediaItemsCount: 1
            }
        ];
        const spyGetAlbumDetail = jest.fn().mockResolvedValue();
        Google.getAlbumDetail = spyGetAlbumDetail;
        
        return Google.getAllAlbumDetail(albums, mockCallbackUI, mockCallbackError, [])
            .then(function(result) {
                expect(spyGetAlbumDetail).toHaveBeenCalledTimes(1);
            });
    });    
});

describe('getAlbumDetail', () => {
    
    it('getAlbumDetail no second page', () => {
        const album = {};
        global.gapi = {
            client: {
                request: jest.fn().mockResolvedValue({result: { mediaItems: [{id:"id1"}]}})
            }
        };
        const mockUICallback = jest.fn();
        const mockErrorCallback = jest.fn();
        
        return Google.getAlbumDetail(album, mockUICallback, mockErrorCallback).then(data => {
            expect(mockUICallback).toHaveBeenCalledWith({"photos": ["id1"]});
            expect(mockErrorCallback).not.toHaveBeenCalled();
        }
        );
    });

    it('getAlbumDetail with second page', () => {
        const album = {};
        global.gapi = {
            client: {
                request: jest.fn()
                .mockResolvedValueOnce({result: {
                    mediaItems: [{id:"id1"}],
                    nextPageToken: "AZE"
                }})
                .mockResolvedValueOnce({result: {
                        mediaItems: [{id:"id2"}],
                    }})
            }
        };
        const mockUICallback = jest.fn();
        const mockErrorCallback = jest.fn();
        
        return Google.getAlbumDetail(album, mockUICallback).then(data => {
            expect(mockUICallback).toHaveBeenNthCalledWith(2, {"photos": ["id1","id2"]});
            expect(mockErrorCallback).not.toHaveBeenCalled();
        }
        );
    });

    it('getAlbumDetail reset photos', () => {
        const album = {
            photos: [
                "photoid1",
            ],
            mediaItemsCount: 2
        };
        global.gapi = {
            client: {
                request: jest.fn().mockResolvedValue({result: { mediaItems: [{id:"photoid1"}, {id:"photoid2"}]}})
            }
        };
        const mockUICallback = jest.fn();
        const mockErrorCallback = jest.fn();
        
        return Google.getAlbumDetail(album, mockUICallback).then(value => {
            expect(album.photos).toEqual(["photoid1", "photoid2"]);
            expect(mockErrorCallback).not.toHaveBeenCalled();
        });

    });

    it('getAlbumDetail exception', () => {
        const album = {
            id: "albumid1",
            photos: [],
            mediaItemsCount: 2
        };
        const error = {
            code: 429,
            details: [],
            message: "quota exceeded",
            status: "RESOURCE_EXHAUSTED"
        };
        global.gapi = {
            client: {
                request: jest.fn().mockRejectedValue(
                    {
                        body:"",
                        headers: {},
                        result: {
                            error: error
                        },
                        status: 429,
                        statusText: null
                    }
                )
            }
        };
        const mockUICallback = jest.fn();
        const mockErrorCallback = jest.fn();
    
        return Google.getAlbumDetail(album, mockUICallback, mockErrorCallback).catch(function(error) {
            expect(mockUICallback).not.toHaveBeenCalled();
            expect(mockErrorCallback).toHaveBeenCalledWith(error);
        });
    });
});

test("getPhotos included end + 1 day", () => {
    // GIVEN
    const dateFilter = {
        start:  new Date("2019-05-01T00:00:00Z"),
        end:  new Date("2019-05-31T00:00:00Z")
    }
    global.gapi = {
        client: {
            request: jest.fn()
        }
    };
    // THEN
    Google.getPhotos(dateFilter);
    console.log(global.gapi.client.request.mock.calls[0][0].body.filters);
    expect(global.gapi.client.request.mock.calls[0][0].body.filters).toEqual({
        dateFilter: {
            ranges: [
            {
            startDate: {
                day: 1,
                month: 5,
                year: 2019  
            },
             endDate: {
                day: 1,
                month: 6,
                year: 2019  
            }
            }
            ]
        }});
});

test('getAlbums', () => {
    const mockCallbackUI = jest.fn();
    global.gapi = {
        client: {
            request: jest.fn()
            .mockResolvedValueOnce({result: { albums: [{id:"id1"}], nextPageToken: "next"} })
            .mockResolvedValueOnce({result: { albums: [{id:"id2"}]} })
        },
        load: jest.fn()
      };
    return Google.getAlbums(null, mockCallbackUI)
    .then(() => {
        expect(mockCallbackUI).toHaveBeenCalledTimes(2);
    });
})
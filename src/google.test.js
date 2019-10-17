import Google  from './google.js';
import expectExport from 'expect';
import randomInt from 'random-int';

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
    const spyGetAlbumDetail = jest.fn().mockResolvedValue();
    Google.getAlbumDetail = spyGetAlbumDetail;
    
    return Google.getAllAlbumDetail(albums, mockFn)
        .then(function(result){
            expect(spyGetAlbumDetail).toHaveBeenCalledTimes(2);
            Google.getAlbumDetail = getAlbumDetailSaved;
        });

    
});

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
    Google.getAlbumDetail = jest.fn();
    
    return Google.getAllAlbumDetail(albums, mockFn)
        .then(() => {
            expect(Google.getAlbumDetail).not.toHaveBeenCalled();
            Google.getAlbumDetail = getAlbumDetailSaved;
        });
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
    const spyGetAlbumDetail = jest.fn().mockResolvedValue();
    Google.getAlbumDetail = spyGetAlbumDetail;
    
    return Google.getAllAlbumDetail(albums, mockFn)
        .then(function(result) {
            expect(spyGetAlbumDetail).toHaveBeenCalledTimes(1);
            Google.getAlbumDetail = getAlbumDetailSaved;
        });

    
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
    const spyGetAlbumDetail = jest.fn().mockResolvedValue();
    Google.getAlbumDetail = spyGetAlbumDetail;
    
    return Google.getAllAlbumDetail(albums, mockFn)
        .then(function(result) {
            expect(spyGetAlbumDetail).toHaveBeenCalledTimes(1);
            Google.getAlbumDetail = getAlbumDetailSaved;
        });

    
});

it('getAllAlbumDetail check all retrieved even up to concurrency limit', () => {
    const getAlbumDetailSaved = Google.getAlbumDetail;
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
        },
        { id:"album3",
          title:"title3", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album4",
          title:"title4", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album5",
          title:"title5", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album6",
          title:"title6", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album7",
          title:"title7", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album8",
          title:"title8", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album9",
          title:"title9", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album10",
          title:"title10", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album11",
          title:"title11", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album12",
          title:"title12", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album13",
          title:"title13", 
          photos: [],
          mediaItemsCount: 1
        },
        { id:"album14",
          title:"title14", 
          photos: [],
          mediaItemsCount: 1
        }
    ];

    const mockFn = jest.fn();
    Google.getAlbumDetail = jest.fn().mockResolvedValue(43);
    
    return Google.getAllAlbumDetail(albums, mockFn)
        .then(function(result) {
            expect(Google.getAlbumDetail).toHaveBeenCalledTimes(14);
            // for (let i = 0; i < albums.length; i++) {
            //     expect(Google.getAlbumDetail).toHaveBeenNthCalledWith(albums.length-i, albums[i], mockFn);
            // }
            Google.getAlbumDetail = getAlbumDetailSaved;
        });
});

it('getAllAlbumDetail check concurrency limit', () => {
    const getAlbumDetailSaved =Google.getAlbumDetail;
    const albums = [];
    for (let i = 0; i < 50; i++) {
        albums[i] = { id:"album" + i + 1,
        title:"title" + i + 1, 
        photos: [],
        mediaItemsCount: 1
      }
    }
    const mockFn = jest.fn();
    var running = 0;
    var current = 0;
    Google.getAlbumDetail = jest.fn(() => {
        return new Promise(function(resolve, reject) {
            running++;
            current++;
            if (current > 7) {
                expect(running).toEqual(7);
            }
            setTimeout(() => {
                resolve();
                running--;
            }, randomInt(0, 500));
        });
    });
    return Google.getAllAlbumDetail(albums, mockFn)
        .then(function(result) {     
            Google.getAlbumDetail = getAlbumDetailSaved;
        });
});

it('getAlbumDetail no second page', () => {
    const album = {};
    global.gapi = {
        client: {
            request: jest.fn().mockResolvedValue({result: { mediaItems: [{id:"id1"}]}})
        }
    };
    const mockUICallback = jest.fn();
    
    return Google.getAlbumDetail(album, mockUICallback).then(data => {
        expect(mockUICallback).toHaveBeenCalledWith({"photos": ["id1"]});
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
    
    return Google.getAlbumDetail(album, mockUICallback).then(data => {
        expect(mockUICallback).toHaveBeenNthCalledWith(2, {"photos": ["id1","id2"]});
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
    
    return Google.getAlbumDetail(album, mockUICallback).then(value => {
        expect(album.photos).toEqual(["photoid1", "photoid2"]);
    });

});

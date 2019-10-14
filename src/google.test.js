import Google  from './google.js';
import expectExport from 'expect';

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
    const spyGetAlbumDetail = jest.fn();
    Google.getAlbumDetail = spyGetAlbumDetail;
    
    Google.getAllAlbumDetail(albums, mockFn);

    expect(spyGetAlbumDetail).not.toHaveBeenCalled();

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
    const spyGetAlbumDetail = jest.fn();
    Google.getAlbumDetail = spyGetAlbumDetail;
    
    return Google.getAllAlbumDetail(albums, mockFn)
        .then(function(result) {
            expect(spyGetAlbumDetail).toHaveBeenCalledTimes(1);
            Google.getAlbumDetail = getAlbumDetailSaved;
        });

    
});

it('getAllAlbumDetail limit to 10 request', () => {
    const saved_getAlbumDetail = Google.getAlbumDetail;
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
        }
    ];

    const mockFn = jest.fn();
    const spygetConcurrentAlbumDetail = jest.spyOn(Google, 'getConcurrentAlbumDetail');
    Google.getAlbumDetail = jest.fn(function (album){
        //console.log('mock of getAlbumDetail of ' + album.id);
    });
    
    return Google.getAllAlbumDetail(albums, mockFn)
        .then(function(result) {
            expect(spygetConcurrentAlbumDetail).toHaveBeenNthCalledWith(1, albums.slice(0, 10), mockFn);
            expect(spygetConcurrentAlbumDetail).toHaveBeenNthCalledWith(2, albums.slice(10, 11), mockFn);
            Google.getAlbumDetail = saved_getAlbumDetail;
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

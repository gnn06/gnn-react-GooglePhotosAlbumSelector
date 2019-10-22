import Google  from './google.js';
import expectExport from 'expect';
import randomInt from 'random-int';

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

it('getAllAlbumDetail promise queue resolved after detail', () => {
    const getAlbumDetail_saved = Google.getAlbumDetail;

    const albums = [];
    for (let i = 0; i < 50; i++) {
        albums[i] = { id:"album" + i + 1,
        title:"title" + i + 1, 
        photos: [],
        mediaItemsCount: 1
      }
    }
    
    const mockUICallback = jest.fn();
    const mockErrorCallback = jest.fn();

    var queueFinished = 0;

    Google.getAlbumDetail = jest.fn().mockImplementation(() => {
        return Promise.resolve()
        .then(function(value) {
            queueFinished++;
        });
    });

    return Google.getAlbumDetailQueue(albums, mockUICallback, mockErrorCallback)
    .then(() => {
        expect(queueFinished).toEqual(50);
        Google.getAlbumDetail = getAlbumDetail_saved;
    });
});

it('getAllAlbumDetail promise all resolved after detail', () => {
    const getAlbumDetailQueue_saved = Google.getAlbumDetailQueue;
    const getAlbumDetail_saved = Google.getAlbumDetail;

    const albums = [];
    for (let i = 0; i < 50; i++) {
        albums[i] = { id:"album" + i + 1,
        title:"title" + i + 1, 
        photos: [],
        mediaItemsCount: 1
      }
    }
    
    const mockUICallback = jest.fn();
    const mockErrorCallback = jest.fn();

    var queueFinished = 0;

    Google.getAlbumDetail = jest.fn().mockImplementation(() => {
        return Promise.resolve()
        .then(function(value) {
            queueFinished++;
        });
    });

    return Google.getAllAlbumDetail(albums, mockUICallback, mockErrorCallback)
    .then(() => {
        expect(queueFinished).toEqual(50);
        Google.getAlbumDetailQueue = getAlbumDetailQueue_saved;
        Google.getAlbumDetail = getAlbumDetail_saved;
    });
});

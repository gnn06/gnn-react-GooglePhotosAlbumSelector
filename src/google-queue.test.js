import GoogleQueue from './google-queue.js';
import expectExport from 'expect';
import randomInt from 'random-int';

it('getAllAlbumDetail check all retrieved even up to concurrency limit', () => {
    const albums = [];
    for (let i = 0; i < 14; i++) {
        albums[i] = { id:"album" + i + 1,
        title:"title" + i + 1, 
        photos: [],
        mediaItemsCount: 1
      }
    }

    const mockFn = jest.fn();
    const mockgetAlbumDetail = jest.fn().mockResolvedValue(43);
    
    return GoogleQueue.getAllAlbumDetail(albums, mockFn, mockFn, mockgetAlbumDetail)
        .then(function(result) {
            expect(mockgetAlbumDetail).toHaveBeenCalledTimes(14);
            // for (let i = 0; i < albums.length; i++) {
            //     expect(Google.getAlbumDetail).toHaveBeenNthCalledWith(albums.length-i, albums[i], mockFn);
            // }
        });
});

it('getAllAlbumDetail check concurrency limit', () => {
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
    const mockgetAlbumDetail = jest.fn(() => {
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
    return GoogleQueue.getAllAlbumDetail(albums, mockFn, mockFn, mockgetAlbumDetail)
        .then(function(result) {     
        });
});

it('getAllAlbumDetail promise queue resolved after detail', () => {
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

    var mockGetAlbumDetail = jest.fn().mockImplementation(() => {
        return Promise.resolve()
        .then(function(value) {
            queueFinished++;
        });
    });

    return GoogleQueue.getAlbumDetailQueue(albums, mockUICallback, mockErrorCallback, mockGetAlbumDetail)
    .then(() => {
        expect(queueFinished).toEqual(50);
    });
});

it('getAllAlbumDetail promise all resolved after detail', () => {
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

    const mockgetAlbumDetail = jest.fn().mockImplementation(() => {
        return Promise.resolve()
        .then(function(value) {
            queueFinished++;
        });
    });

    return GoogleQueue.getAllAlbumDetail(albums, mockUICallback, mockErrorCallback, mockgetAlbumDetail)
    .then(() => {
        expect(queueFinished).toEqual(50);
    });
});

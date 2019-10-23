import Google  from './google.js';
import expectExport from 'expect';
import randomInt from 'random-int';

describe('getAllAlbumDetail, already retrieved', () => {
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
    
    test('getAllAlbumDetail, use previous albums order to not retrieve unchanged album detail', () => {
        // Given
        const previousAlbums = [];
        const currentAlbums = [];
        // When
        return Google.getAllAlbumDetail(currentAlbums, mockFn, previousAlbums)
        .then(function(result) {
            // Then 
            // Call getDetail only on changed abums
        })
    });

    test('getAllAlbumDetail no photos property', () => {
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



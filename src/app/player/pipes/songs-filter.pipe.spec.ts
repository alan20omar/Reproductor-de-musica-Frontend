import SongModel from 'src/app/models/song';
import SongTail from 'src/app/models/songTail';
import { SongsFilterPipe } from './songs-filter.pipe';

describe('SongsFilterPipe', () => {
  let pipe: SongsFilterPipe;

  beforeEach(() => {
    pipe = new SongsFilterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the same array', () => {
    const mockData = { tailArrya: [
      { index: 0, isLoading: false, song: { title: 'test1' } as SongModel } as SongTail,
      { index: 0, isLoading: false, song: { title: 'test2' } as SongModel } as SongTail 
    ]};
    const expectedResult: SongTail[] = [
      { index: 0, isLoading: false, song: { title: 'test1' } as SongModel } as SongTail,
      { index: 0, isLoading: false, song: { title: 'test2' } as SongModel } as SongTail
    ];
    const result: SongTail[] = pipe.transform(mockData.tailArrya);
    expect(result).toEqual(expectedResult);
  });

  it('should return filtered array', () => {
    const mockData = { filter: '1', tailArrya: [
      { index: 0, isLoading: false, song: { title: 'test1' } as SongModel } as SongTail,
      { index: 0, isLoading: false, song: { title: 'test2' } as SongModel } as SongTail 
    ]};
    const expectedResult: SongTail[] = [ { index: 0, isLoading: false, song: { title: 'test1' } as SongModel } as SongTail ];
    const result: SongTail[] = pipe.transform(mockData.tailArrya, mockData.filter);
    expect(result).toEqual(expectedResult);
  });
});

import SongModel from 'src/app/models/song';
import { SongsFilterPipe } from './songs-filter.pipe';

describe('SongsFilterPipe', () => {
  let pipe: SongsFilterPipe;

  beforeEach(() => {
    pipe = new SongsFilterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the same array, transform(songsList: SongModel[], filter: string = "", sort: string = "")', () => {
    const mockData = { songList: [{title: 'test'} as SongModel , {title: 'test2'} as SongModel] };
    const expectResult: SongModel[] = [{title: 'test'} as SongModel, {title: 'test2'} as SongModel];
    const result: SongModel[] = pipe.transform(mockData.songList);
    expect(result).toEqual(expectResult);
  });

  it('should return the filtered array, transform(songsList: SongModel[], filter: string = "", sort: string = "")', () => {
    const mockData = { filter: '2', songList: [{title: 'test'} as SongModel , {title: 'test2'} as SongModel] };
    const expectResult: SongModel[] = [{title: 'test2'} as SongModel];
    const result: SongModel[] = pipe.transform(mockData.songList, mockData.filter);
    expect(result).toEqual(expectResult);
  });

  it('should return the a-z sorted array, transform(songsList: SongModel[], filter: string = "", sort: string = "")', () => {
    const mockData = { sort: 'a-z', filter: '', songList: [{title: 'test_cd'} as SongModel , {title: 'test_ab'} as SongModel] };
    const expectResult: SongModel[] = [{ title: 'test_ab' } as SongModel, { title: 'test_cd' } as SongModel];
    const result: SongModel[] = pipe.transform(mockData.songList, mockData.filter, mockData.sort);
    expect(result).toEqual(expectResult);
  });

  it('should return the z-a sorted array, transform(songsList: SongModel[], filter: string = "", sort: string = "")', () => {
    const mockData = { sort: 'z-a', filter: '', songList: [{title: 'test_ab'} as SongModel , {title: 'test_cd'} as SongModel] };
    const expectResult: SongModel[] = [{ title: 'test_cd' } as SongModel, { title: 'test_ab' } as SongModel];
    const result: SongModel[] = pipe.transform(mockData.songList, mockData.filter, mockData.sort);
    expect(result).toEqual(expectResult);
  });

  it('should return the filtered and a-z sorted array, transform(songsList: SongModel[], filter: string = "", sort: string = "")', () => {
    const mockData = { sort: 'a-z', filter: 'ab', songList: [{ title: 'test_cd' } as SongModel, { title: 'test_ab' } as SongModel, { title: 'test_ab2' } as SongModel] };
    const expectResult: SongModel[] = [{ title: 'test_ab' } as SongModel, { title: 'test_ab2' } as SongModel];
    const result: SongModel[] = pipe.transform(mockData.songList, mockData.filter, mockData.sort);
    expect(result).toEqual(expectResult);
  });

  it('should return the filtered and z-a sorted array, transform(songsList: SongModel[], filter: string = "", sort: string = "")', () => {
    const mockData = { sort: 'z-a', filter: 'ab', songList: [{ title: 'test_ab' } as SongModel, { title: 'test_cd' } as SongModel, { title: 'test_ab2' } as SongModel] };
    const expectResult: SongModel[] = [{ title: 'test_ab2' } as SongModel, { title: 'test_ab' } as SongModel];
    const result: SongModel[] = pipe.transform(mockData.songList, mockData.filter, mockData.sort);
    expect(result).toEqual(expectResult);
  });
});

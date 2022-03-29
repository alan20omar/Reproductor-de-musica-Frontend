import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MatDialogModule } from '@angular/material/dialog';

import { SongService } from './song.service';
import { ApiConfigService } from './api-config.service';
import { Observable, of } from 'rxjs';

import SongModel from '../models/song';
import SongImageModel from '../models/songImage';

describe('SongService', () => {
  let service: SongService;

  // const baseURL: string = 'http://base/url';
  let baseURL: string;
  let songs: SongModel[];
  let song: SongModel;
  // let file: Blob;
  let songImage: SongImageModel;
  let fakeApiConfigService: ApiConfigService;

  beforeEach(() => {

    fakeApiConfigService = jasmine.createSpyObj<ApiConfigService>( 'ApiConfigService', {
      API_BASE_URL: baseURL,
      getData: of(songs),
      getOneData: of(song),
      // getSong: of(file),
      // postSong: of(httpEvent),
      deleteSong: of(song),
      patchSong: of(song),
      getImageSong: of(songImage)
    });

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatDialogModule,
      ],
      providers: [
        { provide: ApiConfigService, useValue: fakeApiConfigService },
      ]
    });
    service = TestBed.inject(SongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

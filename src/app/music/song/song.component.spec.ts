import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { of } from 'rxjs';
import NextSong from 'src/app/models/nextSong';
import SongModel from 'src/app/models/song';
import { MessagesService } from 'src/app/services/messages.service';
import { SongService } from 'src/app/services/song.service';
import { SongsFilterPipe } from '../pipes/songs-filter.pipe';

import { SongComponent } from './song.component';

describe('SongComponent', () => {
  let component: SongComponent;
  let fixture: ComponentFixture<SongComponent>;

  let song: SongModel;
  let nextSong: NextSong;
  let songList: SongModel[];
  let apiURL: string;
  let file: Blob;
  let fakeSongService: SongService;
  let fakeMessagesService: MessagesService;
  let songListFiltered: SongModel[];
  let spySongsFilterPipe: jasmine.Spy;

  beforeEach(async () => {
    fakeSongService = jasmine.createSpyObj<SongService>('SongService', {
      songsList: songList,
      apiBaseUrl: apiURL,
      getFileSong: of(file),
      deleteSong: undefined,
      editSong: undefined,
      patchSong: of(song),
    }, {
      addTailSong$: of(song),
      addNextSong$: of(nextSong),
      deleteSongTail$: of(song),
      deleteAllSong$: of(undefined),
    });
    fakeMessagesService = jasmine.createSpyObj<MessagesService>( 'MessagesService', {
      bottomRightAlertSuccess: undefined,
      centerAlertError: undefined,
    });

    await TestBed.configureTestingModule({
      declarations: [ 
        SongComponent,
        SongsFilterPipe,
      ],
      imports: [
        RouterTestingModule,
        FontAwesomeTestingModule,
        MatDividerModule,
        MatButtonModule,
      ], 
      providers: [
        { provide: SongService, useValue: fakeSongService },
        { provide: MessagesService, useValue: fakeMessagesService }
      ]
    })
    .compileComponents();

    spySongsFilterPipe = spyOn(SongsFilterPipe.prototype, 'transform').and.returnValue(songListFiltered); // Espia del pipe filter
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

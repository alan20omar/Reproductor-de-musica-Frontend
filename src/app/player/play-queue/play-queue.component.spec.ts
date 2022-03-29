import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { of } from 'rxjs';
import NextSong from 'src/app/models/nextSong';
import SongModel from 'src/app/models/song';
import UserModel from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';
import { SongService } from 'src/app/services/song.service';
import { SongsFilterPipe } from '../pipes/songs-filter.pipe';

import { PlayQueueComponent } from './play-queue.component';

describe('PlayQueueComponent', () => {
  let component: PlayQueueComponent;
  let fixture: ComponentFixture<PlayQueueComponent>;

  let message: any;
  let user: UserModel;
  let fakeAuthService: AuthService;
  let song: SongModel;
  let nextSong: NextSong;
  let songList: SongModel[];
  let apiURL: string;
  // let file: Blob;
  let fakeSongService: SongService;
  let fakeMessagesService: MessagesService;

  beforeEach(async () => {
    
    fakeMessagesService = jasmine.createSpyObj<MessagesService>('MessagesService', {
      bottomRightAlertSuccess: undefined,
      centerAlert: undefined,
    });
    fakeAuthService = jasmine.createSpyObj<AuthService>('AuthService', {
      patchUser: of(message),
      getUser: of(user),
    });
    fakeSongService = jasmine.createSpyObj<SongService>('SongService', {
      songsList: songList,
      apiBaseUrl: apiURL,
      // getFileSong: of(file),
      deleteSong: undefined,
      editSong: undefined,
      patchSong: of(song),
    }, {
      addTailSong$: of(song),
      addNextSong$: of(nextSong),
      deleteSongTail$: of(song),
      deleteAllSong$: of(undefined),
    });

    await TestBed.configureTestingModule({
      declarations: [ 
        PlayQueueComponent,
        SongsFilterPipe,
      ],
      imports: [
        FontAwesomeTestingModule,
        MatDividerModule,
        MatButtonModule,
      ],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: SongService, useValue: fakeSongService },
        { provide: MessagesService, useValue: fakeMessagesService },
      ],
      schemas: [
        NO_ERRORS_SCHEMA // Centrarnos en unit test, previene los errores por no reconocer los componentes hijos
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

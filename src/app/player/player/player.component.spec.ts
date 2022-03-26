import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import NextSong from 'src/app/models/nextSong';
import SongModel from 'src/app/models/song';
import SongTail from 'src/app/models/songTail';
import UserModel from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { SongService } from 'src/app/services/song.service';
import { SongsFilterPipe } from '../pipes/songs-filter.pipe';

import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  let message: any;
  let user: UserModel;
  let fakeAuthService: AuthService;
  let song: SongModel;
  let nextSong: NextSong;
  let songList: SongModel[];
  let apiURL: string;
  // let file: Blob;
  let fakeSongService: SongService;
  let songTailFiltered: SongTail[] = [];
  let spySongsFilterPipe: jasmine.Spy;

  beforeEach(async () => {

    fakeAuthService = jasmine.createSpyObj<AuthService>( 'AuthService', {
      patchUser: of(message),
      getUser: of(user),
    });
    fakeSongService = jasmine.createSpyObj<SongService>( 'SongService', {
      songsList: songList,
      apiBaseUrl: apiURL,
      // getFileSong: of(file),
      deleteSong: undefined,
      editSong: undefined,
      patchSong: of(song),
    },{
      addTailSong$: of(song),
      addNextSong$: of(nextSong),
      deleteSongTail$: of(song),
      deleteAllSong$: of(undefined),
    });

    await TestBed.configureTestingModule({
      declarations: [ 
        PlayerComponent,
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: SongService, useValue: fakeSongService },
      ]
    })
    .compileComponents();

    spySongsFilterPipe = spyOn(SongsFilterPipe.prototype, 'transform').and.returnValue(songTailFiltered); // Espia del pipe filter
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

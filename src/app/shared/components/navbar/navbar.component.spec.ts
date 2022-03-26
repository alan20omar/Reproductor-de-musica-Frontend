import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { of } from 'rxjs';
import NextSong from 'src/app/models/nextSong';
import SongModel from 'src/app/models/song';
import UserModel from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { SongService } from 'src/app/services/song.service';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let message: any;
  let user: UserModel;
  let isLoggedIn: boolean;
  let fakeAuthService: AuthService;
  let song: SongModel;
  let nextSong: NextSong;
  let songList: SongModel[];
  let apiURL: string;
  // let file: Blob;
  let fakeSongService: SongService;

  beforeEach(async () => {
    fakeAuthService = jasmine.createSpyObj<AuthService>('AuthService', {
      logout: undefined,
      patchUser: of(message),
      getUser: of(user),
    }, {
      isLoggedIn: of(isLoggedIn),
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
        NavbarComponent
      ],
      imports: [
        RouterTestingModule,
        FontAwesomeTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: SongService, useValue: fakeSongService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

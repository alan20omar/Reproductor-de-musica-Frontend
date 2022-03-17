import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import NextSong from 'src/app/models/nextSong';
import SongModel from 'src/app/models/song';
import { SongService } from 'src/app/services/song.service';

import { EditSongComponent } from './edit-song.component';

describe('EditSongComponent', () => {
  let component: EditSongComponent;
  let fixture: ComponentFixture<EditSongComponent>;

  let song: SongModel;
  let nextSong: NextSong;
  let songList: SongModel[];
  let apiURL: string;
  let file: Blob;
  let fakeSongService: SongService;
  let fakeMatDialogRef: MatDialogRef<EditSongComponent>;
  let data: SongModel = {title: '', _id: '', artist: '', album: '', genre: '', favorite: false, trackNumber: ''};

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
    fakeMatDialogRef = jasmine.createSpyObj<MatDialogRef<EditSongComponent>>( 'MatDialogRef', {
      close: undefined,
    });

    await TestBed.configureTestingModule({
      declarations: [ 
        EditSongComponent,
      ],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatDividerModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [
        FormBuilder,
        { provide: SongService, useValue: fakeSongService },
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

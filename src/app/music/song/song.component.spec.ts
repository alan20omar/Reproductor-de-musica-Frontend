import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { Observable, of } from 'rxjs';
import NextSong from 'src/app/models/nextSong';
import SongModel from 'src/app/models/song';
import { MessagesService } from 'src/app/services/messages.service';
import { SongService } from 'src/app/services/song.service';
import { SongsFilterPipe } from '../shared/pipes/songs-filter.pipe';

import { SongComponent } from './song.component';

fdescribe('SongComponent', () => {
  let component: SongComponent;
  let fixture: ComponentFixture<SongComponent>;

  let spy_songsList: jasmine.Spy<() => SongModel[]>;
  let spy_apiBaseUrl: jasmine.Spy<() => string>;
  let mockSongService: jasmine.SpyObj<SongService>;
  let mockMessagesService: jasmine.SpyObj<MessagesService>;
  let mockSongsFilterPipe: jasmine.SpyObj<SongsFilterPipe>;

  beforeEach(async () => {
    mockSongService = jasmine.createSpyObj<SongService>('SongService', [
      'addNewSong',
      'getFileSong',
      'deleteSong',
      'editSong',
      'patchSong',
    ],[
      'apiBaseUrl',
      'songsList',
      'addTailSong$',
      'addNextSong$',
      'deleteSongTail$',
      'deleteAllSong$',
    ]);
    mockMessagesService = jasmine.createSpyObj<MessagesService>( 'MessagesService', {
      bottomRightAlertSuccess: undefined,
      centerAlert: undefined,
    });
    mockSongsFilterPipe = jasmine.createSpyObj<SongsFilterPipe>('SongsFilterPipe', ['transform']);

    await TestBed.configureTestingModule({
      declarations: [ 
        SongComponent,
        SongsFilterPipe
      ],
      imports: [
        RouterTestingModule,
        FontAwesomeTestingModule,
        MatDividerModule,
        MatButtonModule,
      ], 
      providers: [
        { provide: SongService, useValue: mockSongService },
        { provide: MessagesService, useValue: mockMessagesService },
        { provide: SongsFilterPipe, useValue: mockSongsFilterPipe }
      ]
    })
    .compileComponents();
    spy_songsList = (Object.getOwnPropertyDescriptor(mockSongService, 'songsList')?.get as jasmine.Spy<() => SongModel[]>).and.returnValue([]);
    spy_apiBaseUrl = (Object.getOwnPropertyDescriptor(mockSongService, 'apiBaseUrl')?.get as jasmine.Spy<() => string>).and.returnValue('test.URL');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
    expect(spy_songsList).toHaveBeenCalled();
    expect(component.sort).toEqual('');
    expect(component.filter).toEqual('');
  });

  fit('should throw a warning alert for empty input file, addSong(input: HTMLInputElement)', () => {
    const uploadButton: DebugElement = fixture.debugElement.query(By.css('.input-group button'));
    uploadButton.triggerEventHandler('click', {});
    expect(mockMessagesService.centerAlert).toHaveBeenCalledOnceWith('Por favor añade una canción', 'Archivo no seleccionado', 'warning');
    expect(mockSongService.addNewSong).not.toHaveBeenCalled();
  });

  fit('should add a song for each file in the input file, addSong(input: HTMLInputElement)', () => {
    const mockData = { fileList: new DataTransfer(), file1: new File([''], 'test-file.mp3'), file2: new File([''], 'test-file2.mp3') };
    mockData.fileList.items.add(mockData.file1);
    mockData.fileList.items.add(mockData.file2);
    const uploadInput: HTMLInputElement = fixture.debugElement.query(By.css('.input-group input[type="file"]')).nativeElement;
    const uploadButton: DebugElement = fixture.debugElement.query(By.css('.input-group button'));
    uploadInput.files = mockData.fileList.files;
    uploadInput.dispatchEvent(new InputEvent('change'));
    uploadButton.triggerEventHandler('click', {});
    expect(mockSongService.addNewSong).toHaveBeenCalledTimes(2);
  });

  // fit('should call the "setImagePath" songService function to asign, getImagePath(song: SongModel)', )
});

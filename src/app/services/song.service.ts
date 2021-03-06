import { ComponentRef, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { BehaviorSubject, first, Observable, Subject } from 'rxjs';

import SongModel from '../models/song';
import NextSong from '../models/nextSong';

import { ApiConfigService } from './api-config.service';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MessagesService } from './messages.service';
import { MatDialog } from '@angular/material/dialog';

import { ProgressBarComponent } from '../shared/components/progress-bar/progress-bar.component';
import { EditSongComponent } from '../shared/components/edit-song/edit-song.component';
import SongImageModel from '../models/songImage';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private _songsList: BehaviorSubject<SongModel[]> = new BehaviorSubject<SongModel[]>([]);
  get songsList$(): Observable<SongModel[]>{
    return this._songsList.asObservable();
  }
  setNextSongsList(songList: SongModel[]){
    // console.log(this._songsList.value)
    this._songsList.next(songList)
  }
  pushNewSong(newSong: SongModel): void{
    this.songsList$.pipe(first()).subscribe((songsList: SongModel[]) => {
      songsList.push(newSong);
      this._songsList.next([...songsList]);
    });
    // this._songsList.push(newSong);
    // this._songsList = [...this._songsList]; // subject.next or this
  }

  // Observable para añadir cancion a cola
  private _addTailSongSource: Subject<SongModel> = new Subject<SongModel>();
  public readonly addTailSong$: Observable<SongModel> = this._addTailSongSource.asObservable();
  // Observable para añadir una nueva lista de canciones a la cola
  private _addNewTailSongSource: Subject<SongModel[]> = new Subject<SongModel[]>();
  get addNewTailSong$(): Observable<SongModel[]> { return this._addNewTailSongSource.asObservable() };
  // Observable para quitar de la cola una canción
  private _deleteSongTailSource: Subject<SongModel> = new Subject<SongModel>();
  public readonly deleteSongTail$: Observable<SongModel> = this._deleteSongTailSource.asObservable();
  // Observable para limpiar todas las canciones en cola
  private _deleteAllSongSource: Subject<void> = new Subject<void>();
  public readonly deleteAllSong$: Observable<void> = this._deleteAllSongSource.asObservable();
  // Observable para añadir una cancion delante de la actual
  private _addNextSongSource: Subject<NextSong> = new Subject<NextSong>();
  public readonly addNextSong$: Observable<NextSong> = this._addNextSongSource.asObservable();

  constructor(
    private api: ApiConfigService,
    private messService: MessagesService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
  ) { }
  
  get apiBaseUrl(): string{
    return this.api.API_BASE_URL;
  }

  // Fetch all data songs available
  getAllAvailableSongs(): void{
    this.api.getData('songs/').subscribe((songs: SongModel[]) => {
      this.setNextSongsList(songs);
      // this.songsList = songs;
    });
  }

  // Fetch one data song by id
  getOneSong(songId: string): Observable<SongModel>{
    return this.api.getOneData(`songs/${songId}`);
  }

  // Get file song
  getFileSong(songId: string): Observable<File>{
    return this.api.getSong(`songs/${songId}/file`);
  }
  // Add new song (upload file and add to songslist)
  addNewSong(file: File, compProgressRef: ComponentRef<ProgressBarComponent>): void {
    const formData = new FormData();
    formData.append('song', file);
    const sub = this.api.postSong(`songs/`, formData).subscribe({
      next: (event: HttpEvent<SongModel>) => {
        // Cancelar solicitud
        // sub.unsubscribe()
        if (event.type == HttpEventType.UploadProgress) {
          if (event.total) {
            compProgressRef.instance.changeProgressBarValue((event.loaded / event.total) * 100);
          }
        }
        else if (event.type === HttpEventType.Response) {
          if (!event.body) {
            // alerta
            return;
          }
          const newSong: SongModel = event.body;
          // Asigna una url temporal a la cancion subida 
          newSong.filePath = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
          // Asigna una url temporal a la imagen de la canción
          // this.setImagePath(newSong);
          this.pushNewSong(newSong);
          compProgressRef.destroy();
          this.messService.bottomRightAlertSuccess(`<strong>${newSong.title}</strong> subido correctamente`);
        }
      },
      error: (error) =>{
        console.error(error);
        compProgressRef.destroy();
        this.messService.centerAlert('No se pudo subir la canción seleccionada');
      },
      complete: () => {
        sub.unsubscribe();
      }
    });
  }

  // Delete a song
  deleteSong(songId: string){
    this.api.deleteSong(`songs/${songId}`).subscribe({
      next: (deletedSong: SongModel) => {
        this.songsList$.pipe(first()).subscribe((songsList: SongModel[]) => {
          this.setNextSongsList(songsList.filter(song => song._id != deletedSong._id));
        });
        // this.songsList = this.songsList.filter(song => song._id != deletedSong._id);
        this.deleteTailSong(deletedSong);
        this.messService.bottomRightAlertSuccess(`<span style="color: red"><strong>${deletedSong.title}</strong></span> eliminado correctamente`);
      },
      error: (error) =>{
        console.error(error);
        this.messService.centerAlert('No se pudo borrar la canción seleccionada');
      }
    });
  }

  // Edit a song
  editSong(song: SongModel){
    this.getOneSong(song._id).subscribe((songBase: SongModel) => {
      this.setImagePath(songBase);
      const dialogRef = this.dialog.open(EditSongComponent, {
        width: '80%',
        maxWidth: '700px',
        data: songBase,
      });
      dialogRef.afterClosed().subscribe((updatedSong: SongModel) => {
        if (updatedSong) {
          Object.assign(song, updatedSong);
          this.messService.bottomRightAlertSuccess(`<strong>${song.title}</strong> editado correctamente`);
          this._songsList.next([...this._songsList.value]); // Actualiza la lista
        }
      });
    });
  }

  // Toggle song favorite
  toggleFavorite(song: SongModel) {
    const formData = new FormData();
    formData.append('favorite', String(!song.favorite));
    this.patchSong(song._id, formData).subscribe({
      next: (patchSong: SongModel) => {
        song.favorite = patchSong.favorite;
        this._songsList.next([...this._songsList.value]); // Actualiza la lista
        this.messService.bottomRightAlertSuccess(`<strong>${song.title}</strong> editado correctamente`);
      },
      error: (error) => {
        console.error(error);
        alert(`Ocurrio un error. No se pudo actualizar la canción seleccionada`);
      }
    });
  }

  // Patch a song
  patchSong(songId: string, form: FormData): Observable<SongModel>{
    return this.api.patchSong(`songs/${songId}`, form);
  }

  // Cambiar valor del subject (ultima canción añadida a la cola)
  addTailSong(song: SongModel) {
    this._addTailSongSource.next(song);
  }

  // Cambiar valor del subject (ultima lista añadida a la cola)
  addNewTailSong(songList: SongModel[]) {
    this._addNewTailSongSource.next(songList);
  }

  // Cambiar valor del subject (quitar una cancion de la cola)
  deleteTailSong(song: SongModel) {
    this._deleteSongTailSource.next(song);
  }

  // Cambiar valor del subject (quitar todas las canciones de la cola)
  deleteAllTailSong() {
    this._deleteAllSongSource.next();
  }

  // Cambiar valor del subject (añadir cancion despues de la actual)
  addNextTailSong(song: SongModel, playNext:boolean){
    this._addNextSongSource.next({song: song, playNext: playNext});
  }

  // Establecer una url temporal a la imagen de la cancion
  setImagePath(song: SongModel){
    this.getImagePathObserver(song).subscribe((s: SongImageModel) => {
      if (s.image) {
        song.imagePath = this.generateSafeURL(s.image.imageBuffer.data);
      } else {
        song.imagePath = `${this.apiBaseUrl}/default.png`;
      }
    });
  }

  // Observer get a song image
  getImagePathObserver(song: SongModel): Observable<SongImageModel>{
    return this.api.getImageSong(`songs/${song._id}/image`);
  }

  // Genera una url temporal a una imagen en bytes 
  generateSafeURL(bufferImage: any) {
    let binary = '';
    let bytes = new Uint8Array(bufferImage);
    let len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + window.btoa(binary));
  }
}
